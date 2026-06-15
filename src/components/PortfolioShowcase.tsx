import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './LanguageContext';
import { PROJECTS } from '../data';
import { Project } from '../types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';
import heroImage from '../assets/images/regenerated_image_1781296623314.webp';
import { 
  X, Layers, Briefcase, Eye, ArrowUpRight, Cpu, 
  Settings, Plus, Trash2, Edit3, RotateCcw, Image as ImageIcon, 
  Check, AlertTriangle, ChevronRight, ChevronLeft, HelpCircle, Upload
} from 'lucide-react';

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        // Downscale to max 1000px width/height for elegant on-screen display whilst maintaining extremely quick load times
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          
          let quality = 0.7;
          let dataUrl = canvas.toDataURL('image/jpeg', quality);
          
          // Iteratively downscale quality and/or dimensions if size exceeds 90KB (~120,000 characters)
          let iterations = 0;
          while (dataUrl.length > 120000 && iterations < 5) {
            quality -= 0.12;
            if (quality <= 0.25) {
              // Scale down dimensions to make sure file payload is extremely light
              width = Math.floor(width * 0.75);
              height = Math.floor(height * 0.75);
              const nextCanvas = document.createElement('canvas');
              nextCanvas.width = width;
              nextCanvas.height = height;
              const nextCtx = nextCanvas.getContext('2d');
              if (nextCtx) {
                nextCtx.drawImage(canvas, 0, 0, width, height);
                canvas = nextCanvas;
                ctx = nextCtx;
              }
              quality = 0.6; // reset quality for smaller resolution
            }
            dataUrl = canvas.toDataURL('image/jpeg', quality);
            iterations++;
          }
          resolve(dataUrl);
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

const compressBase64ToMaxSize = async (base64Str: string, maxLength: number): Promise<string> => {
  if (!base64Str || !base64Str.startsWith('data:image/')) return base64Str;
  if (base64Str.length <= maxLength) return base64Str; // Already fits!

  try {
    return await new Promise<string>((resolve) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(base64Str);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        
        let quality = 0.7;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        let iterations = 0;
        
        while (dataUrl.length > maxLength && iterations < 8) {
          quality -= 0.15;
          if (quality <= 0.20) {
            width = Math.floor(width * 0.7);
            height = Math.floor(height * 0.7);
            const nextCanvas = document.createElement('canvas');
            nextCanvas.width = width;
            nextCanvas.height = height;
            const nextCtx = nextCanvas.getContext('2d');
            if (nextCtx) {
              nextCtx.drawImage(canvas, 0, 0, width, height);
              canvas = nextCanvas;
              ctx = nextCtx;
            }
            quality = 0.6; // Reset quality for smaller dimensions
          }
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          iterations++;
        }

        // Absolute foolproof guard: if it is still larger than the target max length, force-scaling into a compact thumbnail format
        if (dataUrl.length > maxLength) {
          const finalCanvas = document.createElement('canvas');
          const finalCtx = finalCanvas.getContext('2d');
          if (finalCtx) {
            const maxDim = 400;
            let finalW = width;
            let finalH = height;
            if (finalW > finalH) {
              if (finalW > maxDim) {
                finalH = Math.floor(finalH * (maxDim / finalW));
                finalW = maxDim;
              }
            } else {
              if (finalH > maxDim) {
                finalW = Math.floor(finalW * (maxDim / finalH));
                finalH = maxDim;
              }
            }
            finalCanvas.width = finalW;
            finalCanvas.height = finalH;
            finalCtx.drawImage(canvas, 0, 0, finalW, finalH);
            const forcedDataUrl = finalCanvas.toDataURL('image/jpeg', 0.4);
            if (forcedDataUrl.length < dataUrl.length) {
              dataUrl = forcedDataUrl;
            }
          }
        }

        resolve(dataUrl);
      };
      img.onerror = () => resolve(base64Str);
      img.src = base64Str;
    });
  } catch (err) {
    console.error('Error compressing base64 to target length:', err);
    return base64Str;
  }
};

const compressBase64IfNeeded = async (base64Str: string): Promise<string> => {
  return compressBase64ToMaxSize(base64Str, 120000);
};

const IMAGE_PRESETS = [
  {
    nameEn: 'Elite Brand Identity System',
    nameAr: 'نظام هوية مؤسساتية كبرى',
    url: 'https://images.unsplash.com/photo-1541462608141-2f58c6e40265?auto=format&fit=crop&w=1200&q=80'
  },
  {
    nameEn: 'Raw Tectonic Poster Grid',
    nameAr: 'ملصق حداثي تكتوني أسود',
    url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80'
  },
  {
    nameEn: 'Architectural Exhibition Hall',
    nameAr: 'قاعة عرض متحفية حجرية',
    url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    nameEn: 'Luxury Metallic Stationery',
    nameAr: 'مطبوعات ورقية بختم الذهب',
    url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80'
  },
  {
    nameEn: 'Gold Foil Monochrome Typography',
    nameAr: 'طبوغرافيا أحادية على صخور الفحم',
    url: 'https://images.unsplash.com/photo-1502239608882-93b729c6af43?auto=format&fit=crop&w=1200&q=80'
  }
];

interface ProjectCardProps {
  project: Project;
  idx: number;
  totalLength: number;
  language: 'en' | 'ar';
  studioMode: boolean;
  onOpenEdit: (p: Project, e: React.MouseEvent) => void;
  onDeleteProject: (id: string, e: React.MouseEvent) => void;
  onSelectProject: (p: Project) => void;
  onSetActiveModalImage: (url: string) => void;
  onMoveUp: (id: string, e: React.MouseEvent) => void;
  onMoveDown: (id: string, e: React.MouseEvent) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  idx,
  totalLength,
  language,
  studioMode,
  onOpenEdit,
  onDeleteProject,
  onSelectProject,
  onSetActiveModalImage,
  onMoveUp,
  onMoveDown
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0, isHovered: false });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates: range from -0.5 to 0.5
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;

    // Beautiful subtle 3D rotating tilt
    const tiltX = normY * -10; // degrees
    const tiltY = normX * 10;  // degrees

    setCoords({ x, y, isHovered: true });
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setCoords(prev => ({ ...prev, isHovered: false }));
    setTilt({ x: 0, y: 0 });
  };

  // Parallax layer shift: shift image opposite to the tilt for maximum eye-safe 3D depth
  const px = coords.isHovered ? (coords.x / (containerRef.current?.getBoundingClientRect().width || 1) - 0.5) * -12 : 0;
  const py = coords.isHovered ? (coords.y / (containerRef.current?.getBoundingClientRect().height || 1) - 0.5) * -12 : 0;

  return (
    <motion.div
      layout
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transformStyle: 'preserve-3d',
        transform: coords.isHovered 
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.015, 1.015, 1.015)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: coords.isHovered ? 'transform 0.05s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="group bg-brand-surface/60 border border-white/5 overflow-hidden flex flex-col justify-between hover:border-transparent transition-all duration-500 relative cursor-pointer w-full"
      onClick={() => {
        onSelectProject(project);
        onSetActiveModalImage(project.imageUrl);
      }}
      data-cursor-expand="true"
      data-cursor-text={studioMode ? 'STUDIO' : (language === 'en' ? 'VIEW' : 'عرض')}
      id={`project-card-${project.id}`}
    >
      {/* Dynamic 1px Metallic border shimmer tracking the cursor */}
      <div 
        className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: coords.isHovered
            ? `radial-gradient(180px circle at ${coords.x}px ${coords.y}px, #9c8360 0%, rgba(156, 131, 96, 0.15) 60%, transparent 100%)`
            : 'none',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px'
        }}
      />

      {/* Internal Glass Reflection Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 50%, rgba(156,131,96,0.04) 100%)'
        }}
      />

      {/* Dynamic spotlight reflection following the pointer */}
      <div 
        className="absolute inset-0 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: coords.isHovered 
            ? `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, rgba(156, 131, 96, 0.12) 0%, transparent 80%)` 
            : 'none'
        }}
      />

      {/* Outer subtle drop shadow glow */}
      <div 
        className="absolute -inset-px pointer-events-none rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
        style={{
          boxShadow: '0 15px 35px -5px rgba(156, 131, 96, 0.15)'
        }}
      />
      
      {/* Image panel & interactive cover overlay */}
      <div className="relative w-full aspect-square overflow-hidden bg-brand-dark/20">
        
        {/* Studio overlay on card */}
        {studioMode && (
          <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => onOpenEdit(project, e)}
              className="p-2.5 bg-brand-dark/95 border border-white/10 text-brand-accent hover:text-brand-dark hover:bg-brand-accent transition-all duration-300 flex items-center justify-center rounded-none"
              title={language === 'en' ? 'Edit Case Specs' : 'تعديل هذا المشروع'}
            >
              <Edit3 size={12} />
            </button>
            <button
              onClick={(e) => onDeleteProject(project.id, e)}
              className="p-2.5 bg-brand-dark/95 border border-white/10 text-red-400 hover:text-white hover:bg-red-500 transition-all duration-300 flex items-center justify-center rounded-none"
              title={language === 'en' ? 'Delete Design' : 'حذف وإقصاء'}
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}

        {/* Subtle noise and scanlines */}
        <div className="absolute inset-0 noise-overlay pointer-events-none z-10" />
        
        <img
          src={project.imageUrl}
          alt={language === 'en' ? project.titleEn : project.titleAr}
          referrerPolicy="no-referrer"
          style={{
            transform: coords.isHovered 
              ? `scale(1.08) translate3d(${px}px, ${py}px, 0px)` 
              : 'scale(1.01) translate3d(0, 0, 0)',
            transition: coords.isHovered ? 'transform 0.05s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="absolute inset-0 w-full h-full object-cover object-center grayscale brightness-95 group-hover:grayscale-0"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-85" />
        
        {/* Category ribbon */}
        <div className="absolute top-4 left-4 p-1.5 bg-brand-dark/95 backdrop-blur-md border border-white/5 text-[9px] font-mono tracking-widest text-brand-accent uppercase z-20">
          {project.category}
        </div>
      </div>

      {/* Info block */}
      <div className="flex-grow p-5 relative bg-brand-surface border-t border-white/5 flex flex-col justify-between min-h-[130px]">
        <div>
          <span className="text-[10px] font-mono text-brand-muted tracking-wider block mb-0.5">
            {language === 'en' ? project.clientEn : project.clientAr}
          </span>
          <h3 className={`text-base sm:text-lg font-bold text-white group-hover:text-brand-accent transition-colors duration-300 line-clamp-1 ${
            language === 'ar' ? 'font-arabic text-right' : 'font-display'
          }`}>
            {language === 'en' ? project.titleEn : project.titleAr}
          </h3>
        </div>

        <div className="flex justify-between items-center pt-1.5 border-t border-white/5">
          {studioMode ? (
            <div className="flex items-center gap-1.5 z-30" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                disabled={idx === 0}
                onClick={(e) => onMoveUp(project.id, e)}
                className="p-1 bg-brand-dark border border-white/10 hover:border-brand-accent text-brand-beige hover:text-brand-accent disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-brand-beige transition-colors duration-200 cursor-pointer"
                title={language === 'en' ? 'Move Left / Up' : 'نقل لليمين أو للأعلى'}
              >
                {language === 'ar' ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
              </button>
              <span className="text-[10px] font-mono text-brand-accent tracking-wide font-bold bg-brand-dark/80 px-2 py-0.5 border border-white/5">
                {idx + 1}
              </span>
              <button
                type="button"
                disabled={idx === totalLength - 1}
                onClick={(e) => onMoveDown(project.id, e)}
                className="p-1 bg-brand-dark border border-white/10 hover:border-brand-accent text-brand-beige hover:text-brand-accent disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-brand-beige transition-colors duration-200 cursor-pointer"
                title={language === 'en' ? 'Move Right / Down' : 'نقل لليسار أو للأسفل'}
              >
                {language === 'ar' ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
              </button>
            </div>
          ) : (
            <span className="text-[9px] font-mono text-brand-muted uppercase tracking-widest flex items-center gap-1.5">
              {`CASE PROTOCOL // 0${idx + 1}`}
            </span>
          )}
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-brand-accent group-hover:border-brand-accent group-hover:text-brand-dark transition-all duration-300">
            {studioMode ? <Edit3 size={13} /> : <ArrowUpRight size={14} />}
          </div>
        </div>
      </div>

    </motion.div>
  );
}

export default function PortfolioShowcase() {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'all' | 'branding' | 'posters' | 'social'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);
  
  // Studio/Edit Mode States
  const [studioMode, setStudioMode] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Dynamic cloud database synchronize feedback state
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'synced' | 'error' | 'idle'>('idle');
  const [syncErrorMessage, setSyncErrorMessage] = useState<string>('');
  const [activeToast, setActiveToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Auto-clear active toast notifications
  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);
  
  // Form input field states
  const [formCategory, setFormCategory] = useState<'branding' | 'posters' | 'social'>('branding');
  const [formTitleEn, setFormTitleEn] = useState<string>('');
  const [formTitleAr, setFormTitleAr] = useState<string>('');
  const [formDescEn, setFormDescEn] = useState<string>('');
  const [formDescAr, setFormDescAr] = useState<string>('');
  const [formClientEn, setFormClientEn] = useState<string>('');
  const [formClientAr, setFormClientAr] = useState<string>('');
  const [formImageUrl, setFormImageUrl] = useState<string>('');
  const [formGalleryImages, setFormGalleryImages] = useState<string[]>([]);
  const [isGalleryCompressing, setIsGalleryCompressing] = useState<boolean>(false);
  const [galleryUploadError, setGalleryUploadError] = useState<string>('');
  
  // Custom dialog targets for non-blocking iframe confirm
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState<boolean>(false);
  
  // Image Upload / Mode States
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  
  // Tags/Specs builders
  const [tempTagEn, setTempTagEn] = useState<string>('');
  const [tempTagAr, setTempTagAr] = useState<string>('');
  const [formTagsEn, setFormTagsEn] = useState<string[]>([]);
  const [formTagsAr, setFormTagsAr] = useState<string[]>([]);
  
  const [tempSpecEn, setTempSpecEn] = useState<string>('');
  const [tempSpecAr, setTempSpecAr] = useState<string>('');
  const [formSpecsEn, setFormSpecsEn] = useState<string[]>([]);
  const [formSpecsAr, setFormSpecsAr] = useState<string[]>([]);

  // Load projects from Cloud Firestore with localStorage fallback on mount
  useEffect(() => {
    const mapLegacyImage = (url: string | undefined): string => {
      if (!url) return '';
      
      // Map legacy absolute/relative path strings to their appropriate bundled files or presets
      if (url.includes('louaimouaia_brand_identity_1781292469136') || url.includes('brand_identity')) {
        return PROJECTS.find(p => p.id === 'proj-1')?.imageUrl || url;
      }
      if (url.includes('louaimouaia_institutional_poster_1781292485220') || url.includes('institutional_poster')) {
        return PROJECTS.find(p => p.id === 'proj-2')?.imageUrl || url;
      }
      if (url.includes('louaimouaia_social_media_art_1781292499793') || url.includes('social_media_art')) {
        return PROJECTS.find(p => p.id === 'proj-3')?.imageUrl || url;
      }
      if (url.includes('regenerated_image') || url.includes('abstract_hero')) {
        return heroImage || url;
      }
      // If the URL is a relative /src/assets reference that Vercel cannot resolve, fallback to a elegant graphic design Unsplash preset
      if (url.startsWith('/src/assets/') || url.startsWith('src/assets/')) {
        return 'https://images.unsplash.com/photo-1541462608141-2f58c6e40265?auto=format&fit=crop&w=1200&q=80';
      }
      return url;
    };

    const loadProjects = async () => {
      // 1. Determine if the local items are the default PROJECTS list or custom (deep check)
      let isLocalDefault = true;
      let localItems: Project[] = [];
      try {
        const saved = localStorage.getItem('louai_custom_projects');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            localItems = parsed.map((item: any) => ({
              ...item,
              imageUrl: mapLegacyImage(item.imageUrl),
              galleryImages: (item.galleryImages || []).map((imgUrl: string) => mapLegacyImage(imgUrl))
            }));
          }
        }
      } catch (e) {
        console.warn('Error reading local storage:', e);
      }

      const isSameAsHardcodedDefault = (local: Project[]): boolean => {
        if (!local || local.length !== PROJECTS.length) return false;
        for (let i = 0; i < local.length; i++) {
          const l = local[i];
          const d = PROJECTS[i];
          if (l.id !== d.id) return false;
          if (l.category !== d.category) return false;
          if (l.titleEn !== d.titleEn) return false;
          if (l.titleAr !== d.titleAr) return false;
          if (l.descEn !== d.descEn) return false;
          if (l.descAr !== d.descAr) return false;
          if (l.clientEn !== d.clientEn) return false;
          if (l.clientAr !== d.clientAr) return false;
          if (l.imageUrl !== d.imageUrl) return false;
          if (JSON.stringify(l.tagsEn || []) !== JSON.stringify(d.tagsEn || [])) return false;
          if (JSON.stringify(l.tagsAr || []) !== JSON.stringify(d.tagsAr || [])) return false;
          if (JSON.stringify(l.specsEn || []) !== JSON.stringify(d.specsEn || [])) return false;
          if (JSON.stringify(l.specsAr || []) !== JSON.stringify(d.specsAr || [])) return false;
          if (JSON.stringify(l.galleryImages || []) !== JSON.stringify(d.galleryImages || [])) return false;
        }
        return true;
      };

      if (localItems && localItems.length > 0) {
        isLocalDefault = isSameAsHardcodedDefault(localItems);
      } else {
        localItems = PROJECTS;
        isLocalDefault = true;
      }

      try {
        // We always try to fetch from the cloud database to remain reactive on refresh other than caching,
        // unless there is a complete connection outage
        let querySnapshot;
        try {
          querySnapshot = await getDocs(collection(db, 'projects'));
        } catch (err: any) {
          console.warn('Firestore load error. Standardizing fallbacks safely:', err.message || err);
          throw err;
        }

        const items: Project[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const mappedImageUrl = mapLegacyImage(data.imageUrl);
          const mappedGallery = (data.galleryImages || []).map((imgUrl: string) => mapLegacyImage(imgUrl));
          items.push({
            id: docSnap.id,
            category: data.category as any,
            titleEn: data.titleEn || '',
            titleAr: data.titleAr || '',
            descEn: data.descEn || '',
            descAr: data.descAr || '',
            clientEn: data.clientEn || '',
            clientAr: data.clientAr || '',
            imageUrl: mappedImageUrl,
            galleryImages: mappedGallery,
            tagsEn: data.tagsEn || [],
            tagsAr: data.tagsAr || [],
            specsEn: data.specsEn || [],
            specsAr: data.specsAr || [],
            order: typeof data.order === 'number' ? data.order : 0
          });
        });

        if (items.length > 0) {
          items.sort((a, b) => (a.order || 0) - (b.order || 0));
          
          if (isLocalDefault) {
            // Fresh session / new device: apply Cloud state
            setProjectsList(items);
            try {
              localStorage.setItem('louai_custom_projects', JSON.stringify(items));
            } catch (quotaErr) {
              console.warn('LocalStorage save failed:', quotaErr);
            }
          } else {
            // User had custom local edits: preserve local work and trigger background sync-up
            setProjectsList(localItems);
            saveProjects(localItems);
          }
        } else {
          if (isLocalDefault) {
            // Database empty and no user changes: seed with defaults
            const batch = writeBatch(db);
            const defaults = PROJECTS.map((proj, idx) => ({ ...proj, order: idx }));
            defaults.forEach(item => {
              const docRef = doc(db, 'projects', item.id);
              batch.set(docRef, item);
            });
            try {
              await batch.commit();
            } catch (batchErr) {
              console.warn('Muted seeding error:', batchErr);
            }
            setProjectsList(defaults);
            try {
              localStorage.setItem('louai_custom_projects', JSON.stringify(defaults));
            } catch (quotaErr) {
              console.warn('LocalStorage save failed:', quotaErr);
            }
          } else {
            // Empty DB but custom local items: seed DB with custom items
            setProjectsList(localItems);
            saveProjects(localItems);
          }
        }
      } catch (err) {
        if (localItems && localItems.length > 0) {
          setProjectsList(localItems);
        } else {
          setProjectsList(PROJECTS);
        }
      }
    };

    loadProjects();
  }, []);

  // Save projects helper
  const saveProjects = async (newList: Project[]) => {
    // Helper function to compare project data (excluding the order field)
    const didProjectDataChange = (a: Project, b: Project): boolean => {
      if (a.category !== b.category) return true;
      if (a.titleEn !== b.titleEn) return true;
      if (a.titleAr !== b.titleAr) return true;
      if (a.descEn !== b.descEn) return true;
      if (a.descAr !== b.descAr) return true;
      if (a.clientEn !== b.clientEn) return true;
      if (a.clientAr !== b.clientAr) return true;
      if (a.imageUrl !== b.imageUrl) return true;
      
      // Compare tags
      if ((a.tagsEn || []).length !== (b.tagsEn || []).length) return true;
      if ((a.tagsEn || []).some((v, i) => v !== b.tagsEn?.[i])) return true;
      
      if ((a.tagsAr || []).length !== (b.tagsAr || []).length) return true;
      if ((a.tagsAr || []).some((v, i) => v !== b.tagsAr?.[i])) return true;
      
      // Compare specs
      if ((a.specsEn || []).length !== (b.specsEn || []).length) return true;
      if ((a.specsEn || []).some((v, i) => v !== b.specsEn?.[i])) return true;
      
      if ((a.specsAr || []).length !== (b.specsAr || []).length) return true;
      if ((a.specsAr || []).some((v, i) => v !== b.specsAr?.[i])) return true;
      
      // Compare galleryImages
      if ((a.galleryImages || []).length !== (b.galleryImages || []).length) return true;
      if ((a.galleryImages || []).some((v, i) => v !== b.galleryImages?.[i])) return true;
      
      return false;
    };

    // 1. Proactively compress any super large base64 strings in the list to avoid quota and payload limits
    const optimizedList: Project[] = [];
    for (const proj of newList) {
      const optimizedImageUrl = await compressBase64ToMaxSize(proj.imageUrl, 120000);
      
      const optimizedGallery: string[] = [];
      const unfilteredGallery = proj.galleryImages || [];
      // Generously cap gallery images at 8 items to ensure flawless performance and zero document overflow
      const limitedGallery = unfilteredGallery.slice(0, 8);
      const N = limitedGallery.length;
      
      if (N > 0) {
        // Shared total budget of 360,000 chars for all gallery images
        const perImageBudget = Math.max(40000, Math.floor(360000 / N));
        for (const gallImg of limitedGallery) {
          optimizedGallery.push(await compressBase64ToMaxSize(gallImg, perImageBudget));
        }
      }
      
      optimizedList.push({
        ...proj,
        imageUrl: optimizedImageUrl,
        galleryImages: optimizedGallery
      });
    }

    // 2. Snappy update for local client UX
    setProjectsList(optimizedList);
    try {
      localStorage.setItem('louai_custom_projects', JSON.stringify(optimizedList));
    } catch (quotaErr: any) {
      console.warn('Failed to save projects to localStorage (quota exceeded or disabled):', quotaErr.message);
    }

    // 3. Transmit changes to Firestore in parallel batches (optimized)
    try {
      setSyncStatus('syncing');
      setSyncErrorMessage('');

      // Fetch currently existing projects in Firestore to match deleted ones
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const dbDocIds: string[] = [];
      querySnapshot.forEach(docSnap => {
        dbDocIds.push(docSnap.id);
      });

      const activeIds = optimizedList.map(p => p.id);
      const idsToDelete = dbDocIds.filter(id => !activeIds.includes(id));

      const batch = writeBatch(db);
      let writesCount = 0;

      // Delete any project no longer in the active list
      for (const deletedId of idsToDelete) {
        const docRef = doc(db, 'projects', deletedId);
        batch.delete(docRef);
        writesCount++;
      }

      optimizedList.forEach((proj, idx) => {
        const docRef = doc(db, 'projects', proj.id);
        const oldProj = projectsList.find(p => p.id === proj.id);

        if (!oldProj) {
          // Brand new project: write everything
          batch.set(docRef, {
            id: proj.id,
            category: proj.category,
            titleEn: proj.titleEn,
            titleAr: proj.titleAr,
            descEn: proj.descEn,
            descAr: proj.descAr,
            clientEn: proj.clientEn,
            clientAr: proj.clientAr,
            imageUrl: proj.imageUrl,
            galleryImages: proj.galleryImages || [],
            tagsEn: proj.tagsEn || [],
            tagsAr: proj.tagsAr || [],
            specsEn: proj.specsEn || [],
            specsAr: proj.specsAr || [],
            order: idx
          }, { merge: true });
          writesCount++;
        } else {
          const hasDataChanged = didProjectDataChange(oldProj, proj);
          const hasOrderChanged = (oldProj.order !== idx);

          if (hasDataChanged) {
            // Data changed: write everything
            batch.set(docRef, {
              id: proj.id,
              category: proj.category,
              titleEn: proj.titleEn,
              titleAr: proj.titleAr,
              descEn: proj.descEn,
              descAr: proj.descAr,
              clientEn: proj.clientEn,
              clientAr: proj.clientAr,
              imageUrl: proj.imageUrl,
              galleryImages: proj.galleryImages || [],
              tagsEn: proj.tagsEn || [],
              tagsAr: proj.tagsAr || [],
              specsEn: proj.specsEn || [],
              specsAr: proj.specsAr || [],
              order: idx
            }, { merge: true });
            writesCount++;
          } else if (hasOrderChanged) {
            // ONLY order changed: just write order
            batch.set(docRef, {
              order: idx
            }, { merge: true });
            writesCount++;
          }
        }
      });
      
      if (writesCount > 0) {
        try {
          await batch.commit();
        } catch (writeErr: any) {
          const errMsg = writeErr?.message || String(writeErr);
          const isSizeLimit = errMsg.includes('too large') || errMsg.includes('limit') || errMsg.includes('maximum size');
          console.warn('Firestore write failure captured:', errMsg);

          setSyncStatus('error');
          setSyncErrorMessage(writeErr.message || 'Cloud database write error');
          
          let alertMsgAr = 'عذراً، فشلت المزامنة السحابية. تم حفظ عملك بأمان في المتصفح محلياً!';
          let alertMsgEn = 'Could not sync to cloud. Work saved safely in local storage!';
          
          if (isSizeLimit) {
            alertMsgAr = 'فشلت المزامنة لأن حجم الصور المرفقة كبير جداً بالنسبة لقاعدة البيانات! يرجى ضغط الصور أو تقليل دقتها.';
            alertMsgEn = 'Sync failed because image size is too large for the database payload. Please compress or select a smaller image.';
          }

          setActiveToast({
            type: 'error',
            message: language === 'en' ? alertMsgEn : alertMsgAr
          });
          return;
        }
      }

      // Find deleted ones and clean them up from firestore
      const currentIds = new Set(optimizedList.map(p => p.id));
      const deletedIds = projectsList.filter(p => !currentIds.has(p.id)).map(p => p.id);
      
      for (const delId of deletedIds) {
        try {
          await deleteDoc(doc(db, 'projects', delId));
        } catch (delErr: any) {
          console.warn(`Muted Firestore delete error for ${delId}:`, delErr);
        }
      }

      setSyncStatus('synced');
      setActiveToast({
        type: 'success',
        message: language === 'en' 
          ? 'Portfolio successfully synchronized with cloud database!' 
          : 'تم تحديث ومزامنة المعرض الفني بنجاح!'
      });
    } catch (err: any) {
      console.warn('Error saving projects to Firestore:', err);
      setSyncStatus('error');
      setSyncErrorMessage(err?.message || String(err));
    }
  };

  // Switch to preset image helper
  const handleSelectPresetImage = (url: string) => {
    setFormImageUrl(url);
  };

  // Open Edit Form pre-filled
  const handleOpenEdit = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering Case Study main modal
    setEditingProject(project);
    setFormCategory(project.category);
    setFormTitleEn(project.titleEn);
    setFormTitleAr(project.titleAr);
    setFormDescEn(project.descEn);
    setFormDescAr(project.descAr);
    setFormClientEn(project.clientEn);
    setFormClientAr(project.clientAr);
    setFormImageUrl(project.imageUrl);
    setFormGalleryImages(project.galleryImages || []);
    setGalleryUploadError('');
    setFormTagsEn(project.tagsEn || []);
    setFormTagsAr(project.tagsAr || []);
    setFormSpecsEn(project.specsEn || []);
    setFormSpecsAr(project.specsAr || []);
    
    // Set dynamic custom input mode based on asset signature
    if (project.imageUrl && (project.imageUrl.startsWith('data:') || !project.imageUrl.startsWith('http'))) {
      setImageInputMode('upload');
    } else {
      setImageInputMode('url');
    }
    setUploadError('');
    setIsCompressing(false);
    
    // Reset inputs
    setTempTagEn('');
    setTempTagAr('');
    setTempSpecEn('');
    setTempSpecAr('');
    
    setShowFormModal(true);
  };

  // Open empty Create Form
  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormCategory('branding');
    setFormTitleEn('');
    setFormTitleAr('');
    setFormDescEn('');
    setFormDescAr('');
    setFormClientEn('');
    setFormClientAr('');
    setFormImageUrl(IMAGE_PRESETS[0].url); // default
    setFormGalleryImages([]);
    setGalleryUploadError('');
    setImageInputMode('upload');
    setUploadError('');
    setIsCompressing(false);
    setFormTagsEn(['Identity Framework', 'Corporate Deck']);
    setFormTagsAr(['إطار الهوية البصرية', 'الحقيبة التعريفية']);
    setFormSpecsEn(['Golden Ratio Grid Alignment', 'High-Impact Typography Ratio']);
    setFormSpecsAr(['محاذاة شبكة التناسب الذهبي', 'نسبة طبوغرافية فائقة التأثير']);
    
    // Reset inputs
    setTempTagEn('');
    setTempTagAr('');
    setTempSpecEn('');
    setTempSpecAr('');
    
    setShowFormModal(true);
  };

  // Handle local image file load & compression
  const handleImageFile = async (file: File) => {
    if (!file) return;
    
    // Validate image format
    if (!file.type.startsWith('image/')) {
      const errMsg = language === 'en' 
        ? 'Please select a valid image file format (PNG, JPG, WebP)' 
        : 'يرجى اختيار ملف صوري صالح للعمل (PNG، JPG، WebP)';
      setUploadError(errMsg);
      return;
    }

    setIsCompressing(true);
    setUploadError('');
    
    try {
      const compressedBase64 = await compressImage(file);
      setFormImageUrl(compressedBase64);
    } catch (err) {
      console.error('Core file processing error:', err);
      const errMsg = language === 'en'
        ? 'Failed to build design assets. Try a smaller file.'
        : 'فشلت معالجة وبناء الصورة. يرجى تجربة ملف آخر بحجم أصغر.';
      setUploadError(errMsg);
    } finally {
      setIsCompressing(false);
    }
  };

  // Handle local supplementary images file load & compression
  const handleGalleryFiles = async (files: FileList) => {
    if (!files || files.length === 0) return;
    setIsGalleryCompressing(true);
    setGalleryUploadError('');
    
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) {
      const errMsg = language === 'en'
        ? 'Please select valid image files (PNG, JPG, WebP)'
        : 'يرجى اختيار ملفات صورية صالحة للعمل (PNG، JPG، WebP)';
      setGalleryUploadError(errMsg);
      setIsGalleryCompressing(false);
      return;
    }

    const compressedResults: string[] = [];
    for (let i = 0; i < validFiles.length; i++) {
      try {
        const compressedBase64 = await compressImage(validFiles[i]);
        compressedResults.push(compressedBase64);
      } catch (err) {
        console.error('Error compressing gallery item:', err);
      }
    }

    setFormGalleryImages(prev => [...prev, ...compressedResults]);
    setIsGalleryCompressing(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  // Submit project handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedProject: Project = {
      id: editingProject ? editingProject.id : `proj-${Date.now()}`,
      category: formCategory,
      titleEn: formTitleEn || 'Untitled Art Piece',
      titleAr: formTitleAr || 'تحفة فنية غير معنونة',
      descEn: formDescEn || 'Institutional design layout prioritizing pure typographic scaling.',
      descAr: formDescAr || 'هيكل وتخطيط تصميمي متكامل يركز على تباين وأحجام الكتابة والشبكة البنائية.',
      clientEn: formClientEn || 'Louai Custom Client',
      clientAr: formClientAr || 'عميل لؤي المخصص',
      imageUrl: formImageUrl || IMAGE_PRESETS[0].url,
      galleryImages: formGalleryImages,
      tagsEn: formTagsEn,
      tagsAr: formTagsAr,
      specsEn: formSpecsEn,
      specsAr: formSpecsAr
    };

    let updated: Project[];
    if (editingProject) {
      // Update existing item
      updated = projectsList.map(p => p.id === editingProject.id ? formattedProject : p);
    } else {
      // Insert new item at the top
      updated = [formattedProject, ...projectsList];
    }

    saveProjects(updated);
    setShowFormModal(false);
    setEditingProject(null);
  };

  // Delete project handler
  const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering open modal
    setDeleteTargetId(projectId);
  };

  // Restore defaults
  const handleRestoreDefaults = () => {
    setShowRestoreConfirm(true);
  };

  const handleForceCloudSync = async () => {
    localStorage.removeItem('firestore_offline_mode');
    setSyncStatus('syncing');
    setActiveToast({
      type: 'info',
      message: language === 'en' 
        ? 'Forcing database rebuild and syncing current project set...' 
        : 'جاري إعادة بناء المعرض السحابي ومزامنة جميع الأعمال والملفات البصرية...'
    });
    
    try {
      await saveProjects(projectsList);
      setActiveToast({
        type: 'success',
        message: language === 'en'
          ? '🎉 Cloud sync complete! All deleted projects are cleared and images successfully updated.'
          : '🎉 تم تأكيد المزامنة وإعادة بناء المعرض السحابي بنجاح! تم مسح المشاريع المحذوفة وضبط الصور.'
      });
    } catch (err: any) {
      console.error('Failed to force cloud sync:', err);
      setSyncStatus('error');
      setSyncErrorMessage(err?.message || String(err));
    }
  };

  // Helper arrays for dynamically updating items
  const addTagEn = () => { if (tempTagEn.trim()) { setFormTagsEn([...formTagsEn, tempTagEn.trim()]); setTempTagEn(''); } };
  const removeTagEn = (index: number) => { setFormTagsEn(formTagsEn.filter((_, i) => i !== index)); };
  
  const addTagAr = () => { if (tempTagAr.trim()) { setFormTagsAr([...formTagsAr, tempTagAr.trim()]); setTempTagAr(''); } };
  const removeTagAr = (index: number) => { setFormTagsAr(formTagsAr.filter((_, i) => i !== index)); };

  const addSpecEn = () => { if (tempSpecEn.trim()) { setFormSpecsEn([...formSpecsEn, tempSpecEn.trim()]); setTempSpecEn(''); } };
  const removeSpecEn = (index: number) => { setFormSpecsEn(formSpecsEn.filter((_, i) => i !== index)); };

  const addSpecAr = () => { if (tempSpecAr.trim()) { setFormSpecsAr([...formSpecsAr, tempSpecAr.trim()]); setTempSpecAr(''); } };
  const removeSpecAr = (index: number) => { setFormSpecsAr(formSpecsAr.filter((_, i) => i !== index)); };

  // Filter list
  const filteredProjects = activeCategory === 'all' 
    ? projectsList 
    : projectsList.filter(p => p.category === activeCategory);

  const handleMoveProject = (projectId: string, direction: 'up' | 'down') => {
    // Find current index in the FILTERED list
    const filteredIndex = filteredProjects.findIndex(p => p.id === projectId);
    if (filteredIndex === -1) return;
    
    // Find target index in the FILTERED list
    const targetFilteredIndex = direction === 'up' ? filteredIndex - 1 : filteredIndex + 1;
    if (targetFilteredIndex < 0 || targetFilteredIndex >= filteredProjects.length) return;
    
    const targetProject = filteredProjects[targetFilteredIndex];
    
    // Find indexes of both items in the GLOBAL projectsList
    const globalIndex1 = projectsList.findIndex(p => p.id === projectId);
    const globalIndex2 = projectsList.findIndex(p => p.id === targetProject.id);
    
    if (globalIndex1 === -1 || globalIndex2 === -1) return;
    
    // Swap global positions
    const updated = [...projectsList];
    const temp = updated[globalIndex1];
    updated[globalIndex1] = updated[globalIndex2];
    updated[globalIndex2] = temp;
    
    saveProjects(updated);
  };

  const handleToggleStudioMode = () => {
    if (studioMode) {
      setStudioMode(false);
    } else {
      const isAuth = localStorage.getItem('louai_studio_authenticated') === 'true';
      if (isAuth) {
        setStudioMode(true);
      } else {
        setShowPasswordModal(true);
        setPasswordInput('');
      }
    }
  };

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passwordInput.trim().toLowerCase();
    if (cleanPass === 'louai2026' || cleanPass === 'louai@2026') {
      localStorage.setItem('louai_studio_authenticated', 'true');
      setStudioMode(true);
      setShowPasswordModal(false);
      setPasswordInput('');
      setActiveToast({
        type: 'success',
        message: language === 'en' 
          ? 'Studio administration access granted!' 
          : 'تم منح صلاحيات الإشراف والتحكم بنجاح!'
      });
    } else {
      setActiveToast({
        type: 'error',
        message: language === 'en' 
          ? 'Invalid password. Access denied.' 
          : 'الرقم السري غير صحيح. تم رفض صلاحية الوصول.'
      });
    }
  };

  const handleCancelPasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordInput('');
  };

  const categories = [
    { id: 'all' as const, label: t.catAll },
    { id: 'branding' as const, label: t.catBranding },
    { id: 'posters' as const, label: t.catPosters },
    { id: 'social' as const, label: t.catSocial }
  ];

  return (
    <section 
      className="py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/5 relative z-20"
      id="portfolio-section"
    >
      
      {/* Dynamic top control strip for Studio Customizer */}
      <div className="mb-10 p-4 border border-brand-accent/20 bg-brand-surface/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
          <div className="text-left rtl:text-right">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand-beige">
              LOUAI STUDIO INTEGRATION v2.0
            </span>
            <p className={`text-xs text-brand-muted mt-0.5 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {language === 'en' 
                ? 'Manage, edit existing structures, or upload your stellar designs here'
                : 'تحكم وصمم! عدل الخصائص والمشاريع أو أضف أعمالك وصورك الإبداعية ببساطة'}
            </p>
          </div>
        </div>

        {/* Sync Status Badge */}
        {syncStatus !== 'idle' && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-dark/95 border border-white/5 text-[10px] font-mono tracking-wider">
            {syncStatus === 'syncing' && (
              <>
                <Cpu size={12} className="text-brand-accent animate-spin" />
                <span className="text-brand-accent">{language === 'en' ? 'SYNCING...' : 'جاري الحفظ والمزامنة...'}</span>
              </>
            )}
            {syncStatus === 'synced' && (
              <>
                <Check size={12} className="text-emerald-400 font-bold" />
                <span className="text-emerald-400 font-bold">{language === 'en' ? 'CLOUD INTEGRATED' : 'متصل ومزامن سحابياً'}</span>
              </>
            )}
            {syncStatus === 'error' && (
              <>
                <AlertTriangle size={12} className="text-amber-400 animate-pulse" />
                <span className="text-amber-400" title={syncErrorMessage}>
                  {language === 'en' ? 'LOCAL SAVE (CLOUD OFFLINE)' : 'حفظ محلي (فشلت المزامنة)'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('firestore_offline_mode');
                    setSyncStatus('idle');
                    saveProjects(projectsList);
                  }}
                  className="px-1.5 py-0.5 ml-1 text-[9px] font-mono bg-brand-accent/20 hover:bg-brand-accent/40 border border-brand-accent/30 text-white transition-all active:scale-95"
                >
                  {language === 'en' ? 'RETRY SYNC' : 'إعادة محاولة المزامنة'}
                </button>
              </>
            )}
          </div>
        )}

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-3 cursor-pointer select-none" id="studio-mode-toggle-label">
            <span className={`font-mono text-[10px] tracking-widest text-brand-beige uppercase ${language === 'ar' ? 'font-arabic text-xs' : ''}`}>
              {language === 'en' ? 'STUDIO CONTROL PANEL' : 'لوحة تحكم الأستوديو'}
            </span>
            <div className="relative">
              <input 
                type="checkbox" 
                checked={studioMode}
                onChange={handleToggleStudioMode}
                className="sr-only"
                id="studio-mode-checkbox"
              />
              <div className={`w-12 h-6 transition-colors duration-300 rounded-none border border-white/20 flex items-center p-0.5 ${studioMode ? 'bg-brand-accent' : 'bg-brand-dark'}`}>
                <div className={`w-4.5 h-4.5 bg-white transition-transform duration-300 ${studioMode ? 'translate-x-6' : 'translate-x-0 bg-brand-beige/50'}`} />
              </div>
            </div>
          </label>
        </div>
      </div>

      {studioMode && (
        <>
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 border border-brand-accent bg-brand-surface/80 flex flex-col md:flex-row gap-4 items-center justify-between"
            id="studio-actions-console"
          >
          <div className="text-left rtl:text-right">
            <h4 className={`text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2 ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
              <Settings size={16} className="text-brand-accent animate-spin" />
              <span>{language === 'en' ? 'EXECUTIVE DESIGN CONSOLE ACTIVE' : 'محرك تصميم البورتفوليو لؤي نشط'}</span>
            </h4>
            <p className={`text-xs text-brand-beige/75 mt-1 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {language === 'en' 
                ? 'You can now modify, delete, or construct brand layers dynamically. Rebuild at will.'
                : 'بإمكانك الآن تعديل أو حذف أي من الكروت البصرية أو صياغة كرت فني جديد من الصفر.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-5 py-3 bg-brand-accent text-brand-dark hover:bg-white text-[11px] font-mono font-bold uppercase tracking-widest transition-all duration-300"
              data-cursor-expand="true"
              id="studio-add-project-btn"
            >
              <Plus size={14} />
              <span>{language === 'en' ? 'ADD CUSTOM DESIGN' : 'إضافة تصميم مخصص'}</span>
            </button>

            <button
              onClick={handleRestoreDefaults}
              className="flex items-center gap-2 px-4 py-3 border border-white/20 hover:border-red-500 hover:text-red-500 text-[11px] font-mono tracking-widest uppercase bg-brand-dark transition-all duration-300"
              data-cursor-expand="true"
              id="studio-reset-defaults-btn"
            >
              <RotateCcw size={14} />
              <span>{language === 'en' ? 'RESTORE DEFAULTS' : 'استعادة الافتراضي'}</span>
            </button>

            <button
              onClick={() => {
                localStorage.removeItem('louai_studio_authenticated');
                setStudioMode(false);
                setActiveToast({
                  type: 'info',
                  message: language === 'en' 
                    ? 'Studio access locked successfully.' 
                    : 'تم قفل لوحة التحكم وتسجيل الخروج بنجاح.'
                });
              }}
              className="flex items-center gap-2 px-4 py-3 border border-white/20 hover:border-amber-500 hover:text-amber-500 text-[11px] font-mono tracking-widest uppercase bg-brand-dark transition-all duration-300"
              data-cursor-expand="true"
              id="studio-lock-btn"
              title={language === 'en' ? 'Lock Console' : 'قفل لوحة التحكم للخروج'}
            >
              <Cpu size={14} />
              <span>{language === 'en' ? 'LOCK' : 'قفل الوصول'}</span>
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 p-5 border border-brand-accent/20 bg-brand-surface/30 flex flex-col md:flex-row gap-5 items-center justify-between"
          id="studio-sync-console"
        >
          <div className="text-left rtl:text-right">
            <h5 className={`text-xs font-bold text-brand-beige tracking-widest uppercase flex items-center gap-2 ${language === 'ar' ? 'font-arabic' : 'font-mono'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{language === 'en' ? 'DATABASE SYNCHRONIZATION OVERWRITE' : 'مزامنة السحابة الإجبارية وإصلاح الصور'}</span>
            </h5>
            <p className={`text-[11px] text-brand-muted mt-1 leading-relaxed ${language === 'ar' ? 'font-arabic text-xs' : ''}`}>
              {language === 'en' 
                ? 'Deletions or changes made here must be explicitly pushed if target devices (like mobile phones) appear out of sync. This forces a clean state-override on the cloud database.'
                : 'إذا حذفت مشاريع على هذا الجهاز ولكنها لا زالت تظهر في هاتفك أو عند الآخرين، يرجى الضغط على زر المزامنة الإجبارية بالأسفل لمسح كل الملفات العالقة وتوحيد الصورة العامة بشكل فوري.'}
            </p>
          </div>
          <button
            onClick={handleForceCloudSync}
            className="flex items-center gap-2 px-4 py-2 border border-brand-accent/45 bg-brand-accent/10 text-brand-accent hover:bg-brand-accent hover:text-brand-dark text-[10px] font-mono tracking-wider uppercase transition-all duration-300 w-full md:w-auto justify-center shrink-0"
            data-cursor-expand="true"
            id="studio-force-sync-btn"
          >
            <Cpu size={12} className="animate-pulse" />
            <span>{language === 'en' ? 'FORCE CLOUD SYNC' : 'تأكيد المزامنة الإجبارية'}</span>
          </button>
        </motion.div>
      </>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-brand-muted">
              LOUAI MOUAIA // {studioMode ? 'CUSTOM COMPOSITIONS' : 'CORE WORKS'}
            </span>
          </div>
          <h3 className="hidden">مختارات من أعمالنا</h3>
          <h2 className={`text-3xl md:text-5xl font-extrabold text-white uppercase ${
            language === 'ar' ? 'font-arabic leading-snug' : 'font-display'
          }`}>
            {language === 'en' ? 'Selected Creative Pieces' : 'مختارات من أعمالنا'}
          </h2>
        </div>

        {/* Dynamic Category Switcher */}
        <div className="flex flex-wrap gap-2 pt-4 lg:pt-0" id="portfolio-categories-container">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 text-xs sm:text-xs font-mono font-medium tracking-wider uppercase rounded-none transition-all duration-300 relative border ${
                activeCategory === cat.id 
                  ? 'bg-brand-accent text-brand-dark border-brand-accent font-bold' 
                  : 'bg-brand-surface text-brand-beige/60 border-white/5 hover:text-white hover:border-white/20'
              }`}
              data-cursor-expand="true"
              data-cursor-text={cat.id.toUpperCase()}
              id={`portfolio-cat-${cat.id}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {projectsList.length === 0 ? (
        <div className="py-24 text-center border border-white/5 bg-brand-surface/30">
          <AlertTriangle size={36} className="mx-auto text-brand-accent mb-4 animate-bounce" />
          <h4 className={`text-lg font-bold text-white uppercase ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
            {language === 'en' ? 'NO CORES FORMULATED' : 'لا توجد أي تصاميم حالياً'}
          </h4>
          <p className="text-xs text-brand-beige/50 max-w-md mx-auto mt-2">
            {language === 'en' 
              ? 'Please add dynamic design blocks using the custom Studio Switch above or restore our stellar presets.'
              : 'يرجى تفعيل مفتاح إدارة المعرض بالأعلى وإضافة تصميمك، أو استعادة التصاميم المسبقة الأصلية.'}
          </p>
          <div className="mt-8">
            <button
              onClick={handleRestoreDefaults}
              className="px-6 py-3 bg-brand-accent text-brand-dark hover:bg-white text-xs font-mono font-bold uppercase tracking-widest transition-all"
            >
              {language === 'en' ? 'RESTORE PRESET MASTERPIECES' : 'إعادة تهيئة الأعمال المسبقة'}
            </button>
          </div>
        </div>
      ) : (
        /* Structured Luxury Square 1:1 Grid */
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          id="project-items-grid"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                idx={idx}
                totalLength={filteredProjects.length}
                language={language}
                studioMode={studioMode}
                onOpenEdit={handleOpenEdit}
                onDeleteProject={handleDeleteProject}
                onSelectProject={setSelectedProject}
                onSetActiveModalImage={setActiveModalImage}
                onMoveUp={(id, e) => {
                  e.stopPropagation();
                  handleMoveProject(id, 'up');
                }}
                onMoveDown={(id, e) => {
                  e.stopPropagation();
                  handleMoveProject(id, 'down');
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Interactive Form Modal for Adding/Editing Projects */}
      <AnimatePresence>
        {showFormModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            id="studio-form-modal-container"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-brand-gray border border-brand-accent/40 w-full max-w-4xl rounded-none relative overflow-hidden shadow-2xl p-6 sm:p-8 max-h-[95vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Form Title & Close Button */}
              <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-6">
                <div>
                  <h3 className={`text-xl sm:text-2xl font-bold text-white uppercase ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
                    {editingProject 
                      ? (language === 'en' ? 'EDIT DESIGN MANIFEST' : 'تعديل مواصفات التصميم') 
                      : (language === 'en' ? 'REGISTER NEW DESIGN MATRIX' : 'تسجيل منظومة تصميم جديدة')}
                  </h3>
                  <p className="text-[10px] font-mono text-brand-accent uppercase mt-1 tracking-widest">
                    SYSTEM CONTROL CODE: L.MOUAIA-PROJ-GEN
                  </p>
                </div>
                <button
                  onClick={() => { setShowFormModal(false); setEditingProject(null); }}
                  className="p-2 text-brand-beige/50 hover:text-white border border-white/5 hover:border-brand-accent transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* 1. Category Selector */}
                <div>
                  <label className="block text-[10px] font-mono text-brand-accent uppercase tracking-widest mb-2">
                    {language === 'en' ? 'DESIGN DISCIPLINE CATEGORY' : 'مجال التصميم والفرع'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['branding', 'posters', 'social'] as const).map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setFormCategory(cat)}
                        className={`py-3 text-[11px] font-mono transition-all border uppercase ${
                          formCategory === cat 
                            ? 'bg-brand-accent text-brand-dark border-brand-accent font-bold' 
                            : 'bg-brand-dark text-brand-beige/60 border-white/5 hover:border-white/20'
                        }`}
                      >
                        {cat === 'branding' ? t.catBranding : cat === 'posters' ? t.catPosters : t.catSocial}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Dual Language Headers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* English Fields */}
                  <div className="space-y-4 p-4 border border-white/5 bg-brand-dark/40">
                    <span className="font-mono text-[9px] text-brand-muted uppercase block tracking-wider border-b border-white/5 pb-1 mb-2">
                      🇺🇸 ENGLISH DETAILS (CLIENT FACING)
                    </span>
                    
                    <div>
                      <label className="block text-[10px] font-mono text-brand-beige uppercase mb-1">
                        Project Title (EN)
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitleEn}
                        onChange={(e) => setFormTitleEn(e.target.value)}
                        placeholder="e.g. Sovereign Brand System"
                        className="w-full px-3 py-2 bg-brand-dark border border-white/10 text-white text-xs focus:border-brand-accent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-brand-beige uppercase mb-1">
                        Client Entity Name (EN)
                      </label>
                      <input
                        type="text"
                        required
                        value={formClientEn}
                        onChange={(e) => setFormClientEn(e.target.value)}
                        placeholder="e.g. Al-Qudra Capital"
                        className="w-full px-3 py-2 bg-brand-dark border border-white/10 text-white text-xs focus:border-brand-accent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-brand-beige uppercase mb-1">
                        Brief Strategic Case Study (EN)
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={formDescEn}
                        onChange={(e) => setFormDescEn(e.target.value)}
                        placeholder="Strategic narrative..."
                        className="w-full px-3 py-2 bg-brand-dark border border-white/10 text-white text-xs focus:border-brand-accent outline-none"
                      />
                    </div>
                  </div>

                  {/* Arabic Fields */}
                  <div className="space-y-4 p-4 border border-white/5 bg-brand-dark/40 text-right">
                    <span className="font-mono text-[9px] text-brand-muted uppercase block tracking-wider border-b border-white/5 pb-1 mb-2 text-right">
                      🇸🇦 التفاصيل الفنية بالعربية (العرض المباشر)
                    </span>
                    
                    <div>
                      <label className="block text-[10px] font-mono text-brand-beige uppercase mb-1 text-right">
                        عنوان المشروع (بالعربية)
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitleAr}
                        onChange={(e) => setFormTitleAr(e.target.value)}
                        placeholder="مثال: منظومة الهوية الفنية للجهات الكبرى"
                        className="w-full px-3 py-2 bg-brand-dark border border-white/10 text-white text-xs focus:border-brand-accent outline-none text-right font-arabic"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-brand-beige uppercase mb-1 text-right">
                        اسم الجهة الشريكة (بالعربية)
                      </label>
                      <input
                        type="text"
                        required
                        value={formClientAr}
                        onChange={(e) => setFormClientAr(e.target.value)}
                        placeholder="مثال: مجموعة القدرة القابضة"
                        className="w-full px-3 py-2 bg-brand-dark border border-white/10 text-white text-xs focus:border-brand-accent outline-none text-right font-arabic"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-brand-beige uppercase mb-1 text-right">
                        تحليل وموجز الحالة البصرية (بالعربية)
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={formDescAr}
                        onChange={(e) => setFormDescAr(e.target.value)}
                        placeholder="سرد استراتيجي لمخرجات وقيم التصميم المتقن..."
                        className="w-full px-3 py-2 bg-brand-dark border border-white/10 text-white text-xs focus:border-brand-accent outline-none text-right font-arabic"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. High-Quality Image / Preset Selection */}
                <div className="p-4 border border-white/5 bg-brand-dark/40">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-[10px] font-mono text-brand-accent uppercase tracking-widest">
                      {language === 'en' ? 'DESIGN ASSET (IMAGE SOURCE)' : 'أصل ومصدر الصورة البصرية'}
                    </label>
                    <div className="flex border border-white/10 p-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setImageInputMode('upload');
                        }}
                        className={`px-3 py-1 text-[9px] font-mono uppercase tracking-wider transition-all ${
                          imageInputMode === 'upload' 
                            ? 'bg-brand-accent text-brand-dark font-bold' 
                            : 'text-brand-beige/50 hover:text-white'
                        }`}
                      >
                        {language === 'en' ? 'LOCAL UPLOAD' : 'تحميل صورة محلياً'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImageInputMode('url');
                        }}
                        className={`px-3 py-1 text-[9px] font-mono uppercase tracking-wider transition-all ${
                          imageInputMode === 'url' 
                            ? 'bg-brand-accent text-brand-dark font-bold' 
                            : 'text-brand-beige/50 hover:text-white'
                        }`}
                      >
                        {language === 'en' ? 'IMAGE URL' : 'رابط الصورة'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {imageInputMode === 'upload' ? (
                      <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border border-dashed p-6 text-center flex flex-col items-center justify-center gap-3 transition-colors duration-300 relative ${
                          isDragging 
                            ? 'border-brand-accent bg-brand-accent/5' 
                            : formImageUrl && formImageUrl.startsWith('data:') 
                              ? 'border-brand-accent/30 bg-brand-surface/30'
                              : 'border-white/10 bg-brand-dark/20 hover:border-white/20'
                        }`}
                      >
                        <input 
                          type="file" 
                          id="portfolio-image-upload" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageFile(file);
                          }}
                          className="sr-only"
                        />
                        
                        {isCompressing ? (
                          <div className="space-y-2 flex flex-col items-center">
                            <div className="w-6 h-6 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
                            <span className="text-[10px] font-mono text-brand-accent uppercase tracking-widest">
                              {language === 'en' ? 'PROCESSING GRAPHICS...' : 'جاري معالجة وتهيئة الملف البصري...'}
                            </span>
                          </div>
                        ) : formImageUrl && formImageUrl.startsWith('data:') ? (
                          <div className="w-full flex flex-col md:flex-row items-center gap-4">
                            <div className="w-24 h-18 border border-white/15 overflow-hidden flex-shrink-0 bg-black">
                              <img 
                                src={formImageUrl} 
                                alt="Uploaded preview" 
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="text-left rtl:text-right flex-grow">
                              <span className="text-[10px] font-mono text-brand-accent uppercase tracking-widest block font-bold">
                                {language === 'en' ? 'IMAGE EMBEDDED SUCCESSFULLY' : 'تم دمج الصورة في النظام بنجاح'}
                              </span>
                              <p className={`text-[10px] text-brand-beige/60 mt-1 max-w-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
                                {language === 'en' 
                                  ? 'Image scale compressed to fit localized client-side execution cache safely.'
                                  : 'تم ضغط أبعاد وجودة الصورة لتناسب مساحة الحفظ المباشر المتوفرة بالمتصفح بأمان.'}
                              </p>
                              <label 
                                htmlFor="portfolio-image-upload" 
                                className="mt-2 inline-block px-3 py-1 border border-white/15 hover:border-brand-accent hover:text-brand-accent text-[9px] font-mono uppercase tracking-wider cursor-pointer transition-colors"
                              >
                                {language === 'en' ? 'REPLACE IMAGE' : 'استبدال الصورة'}
                              </label>
                            </div>
                          </div>
                        ) : (
                          <label 
                            htmlFor="portfolio-image-upload" 
                            className="cursor-pointer flex flex-col items-center gap-2 group w-full py-4"
                          >
                            <div className="w-10 h-10 border border-white/10 group-hover:border-brand-accent group-hover:text-brand-accent transition-colors flex items-center justify-center text-brand-beige/40">
                              <Upload size={16} />
                            </div>
                            <div>
                              <span className={`text-[11px] text-brand-beige group-hover:text-brand-accent transition-colors font-bold block ${language === 'ar' ? 'font-arabic' : ''}`}>
                                {language === 'en' ? 'Click to browse files or drop image here' : 'قم بسحب وإفلات صورتك هنا أو انقر للتصفح'}
                              </span>
                              <span className="text-[9px] font-mono text-brand-muted uppercase tracking-wider block mt-1">
                                PNG, JPG, WEBP (AUTO COMPRESSED)
                              </span>
                            </div>
                          </label>
                        )}
                        
                        {uploadError && (
                          <div className="absolute bottom-2 left-2 right-2 p-2 bg-red-950/80 border border-red-500/30 flex items-center gap-2 text-[10px] text-red-300">
                            <AlertTriangle size={12} className="flex-shrink-0" />
                            <span className={language === 'ar' ? 'font-arabic' : ''}>{uploadError}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[10px] font-mono text-brand-beige uppercase mb-1 font-bold">
                          Custom Image URL
                        </label>
                        <div className="flex gap-2">
                          <div className="p-2 bg-brand-surface border border-white/10 flex items-center justify-center text-brand-beige/50">
                            <ImageIcon size={16} />
                          </div>
                          <input
                            type="url"
                            required={imageInputMode === 'url'}
                            value={formImageUrl && !formImageUrl.startsWith('data:') ? formImageUrl : ''}
                            onChange={(e) => setFormImageUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/your-custom-link"
                            className="w-full px-3 py-2 bg-brand-dark border border-white/10 text-white text-xs focus:border-brand-accent outline-none font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {/* Image Preset Gallery Pick */}
                    <div>
                      <span className="block text-[10px] font-mono text-brand-muted uppercase mb-2">
                        {language === 'en' ? 'Or pick an elite visual preset (click to apply):' : 'أو اختر أحد التنسيقات الفنية الجاهزة مجاناً (انقر للتطبيق):'}
                      </span>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2" id="preset-gallery-containers">
                        {IMAGE_PRESETS.map((preset, pIdx) => {
                          const isSelected = formImageUrl === preset.url;
                          return (
                            <div
                              key={pIdx}
                              onClick={() => handleSelectPresetImage(preset.url)}
                              className={`cursor-pointer group relative aspect-[4/3] overflow-hidden border transition-all ${
                                isSelected ? 'border-brand-accent scale-[0.98]' : 'border-white/5 hover:border-white/30'
                              }`}
                            >
                              <img 
                                src={preset.url} 
                                alt="Preset" 
                                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all"
                              />
                              <div className="absolute inset-0 bg-black/60 flex items-end p-1">
                                <span className={`text-[8px] font-mono text-brand-beige block truncate w-full ${language === 'ar' ? 'font-arabic text-right' : ''}`}>
                                  {language === 'en' ? preset.nameEn : preset.nameAr}
                                </span>
                              </div>
                              {isSelected && (
                                <div className="absolute top-1 right-1 bg-brand-accent text-brand-dark p-0.5 rounded-none z-20">
                                  <Check size={8} strokeWidth={4} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3.1 Custom Multi-image Gallery Section */}
                <div className="p-4 border border-white/5 bg-brand-dark/40">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-mono text-brand-accent uppercase tracking-widest font-bold">
                      {language === 'en' ? 'ADDITIONAL DESIGNS / SUB-IMAGES' : 'إضافة صور وتصاميم فرعية أخرى للعمل'}
                    </label>
                    <span className="text-[9px] font-mono text-brand-muted uppercase">
                      {formGalleryImages.length} {language === 'en' ? 'IMAGES TOTAL' : 'تصميم مرفق'}
                    </span>
                  </div>

                  <p className={`text-[10px] text-brand-beige/60 mb-3 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>
                    {language === 'en'
                      ? 'Upload multiple screenshots or specific detailed slides of this work to display them in a carousel view.'
                      : 'تسمح لك هذه الميزة برفع عدة صور فرعية وتصاميم تابعة لنفس المشروع ليتصفحها العميل بشكل منظم ومتحرك.'}
                  </p>

                  <div className="space-y-4">
                    <div className="border border-dashed border-white/10 p-4 bg-brand-dark/20 text-center">
                      <input
                        type="file"
                        id="portfolio-gallery-upload"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            handleGalleryFiles(files);
                          }
                        }}
                        className="sr-only"
                      />
                      
                      {isGalleryCompressing ? (
                        <div className="space-y-2 flex flex-col items-center py-2">
                          <div className="w-5 h-5 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
                          <span className="text-[9px] font-mono text-brand-accent uppercase tracking-wider">
                            {language === 'en' ? 'COMPRESSING SUB-IMAGES...' : 'جاري ضغط ومعالجة الصور الفرعية...'}
                          </span>
                        </div>
                      ) : (
                        <label
                          htmlFor="portfolio-gallery-upload"
                          className="cursor-pointer flex flex-col items-center gap-1 group py-2"
                        >
                          <div className="w-8 h-8 border border-white/10 group-hover:border-brand-accent group-hover:text-brand-accent transition-colors flex items-center justify-center text-brand-beige/30">
                            <Upload size={14} />
                          </div>
                          <div>
                            <span className={`text-[10px] text-brand-beige group-hover:text-brand-accent transition-colors block ${language === 'ar' ? 'font-arabic' : ''}`}>
                              {language === 'en' ? 'Upload multiple design files' : 'اضغط لاختيار عدة ملفات صورية معاً'}
                            </span>
                          </div>
                        </label>
                      )}
                    </div>

                    {/* Previews Grid with Delete Icon */}
                    {formGalleryImages.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 border border-white/5 p-2 bg-black/40">
                        {formGalleryImages.map((imgBase64, gIdx) => (
                          <div key={gIdx} className="relative aspect-square border border-white/10 group overflow-hidden bg-black flex items-center justify-center">
                            <img
                              src={imgBase64}
                              alt={`Gallery sub-image ${gIdx}`}
                              className="w-full h-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFormGalleryImages(prev => prev.filter((_, idx) => idx !== gIdx));
                              }}
                              className="absolute inset-0 bg-red-950/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200"
                              title={language === 'en' ? 'Delete this' : 'إزالة هذا التصميم'}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Specifications Builders (SpecsEn / SpecsAr) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-white/5 bg-brand-dark/40">
                  
                  {/* English Specs Builder */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono text-brand-accent uppercase tracking-widest mb-1">
                      Technical Specs (English)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tempSpecEn}
                        onChange={(e) => setTempSpecEn(e.target.value)}
                        placeholder="Add spec, e.g. Contrast ratio 8.5:1"
                        className="w-full px-3 py-1.5 bg-brand-dark border border-white/10 text-white text-xs outline-none focus:border-brand-accent"
                      />
                      <button
                        type="button"
                        onClick={addSpecEn}
                        className="px-3 bg-brand-accent text-brand-dark text-xs uppercase font-mono font-bold"
                      >
                        Add
                      </button>
                    </div>
                    <ul className="space-y-1.5 max-h-24 overflow-y-auto pt-1">
                      {formSpecsEn.map((spec, sIdx) => (
                        <li key={sIdx} className="flex justify-between items-center bg-brand-surface py-1.5 px-2.5 border border-white/5 text-[11px] text-brand-beige/80">
                          <span className="truncate">{spec}</span>
                          <button type="button" onClick={() => removeSpecEn(sIdx)} className="text-red-400 hover:text-white transition-colors p-0.5">
                            <X size={10} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Arabic Specs Builder */}
                  <div className="space-y-2 text-right">
                    <label className="block text-[10px] font-mono text-brand-accent uppercase tracking-widest mb-1 text-right">
                      المواصفات الفنية والهندسية (بالعربية)
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={addSpecAr}
                        className="px-3 bg-brand-accent text-brand-dark text-xs uppercase font-mono font-bold"
                      >
                        أضف
                      </button>
                      <input
                        type="text"
                        value={tempSpecAr}
                        onChange={(e) => setTempSpecAr(e.target.value)}
                        placeholder="مثال: دقة متناهية قابلة للتكبير اللانهائي"
                        className="w-full px-3 py-1.5 bg-brand-dark border border-white/10 text-white text-xs outline-none focus:border-brand-accent text-right font-arabic"
                      />
                    </div>
                    <ul className="space-y-1.5 max-h-24 overflow-y-auto pt-1">
                      {formSpecsAr.map((spec, sIdx) => (
                        <li key={sIdx} className="flex justify-between items-center bg-brand-surface py-1.5 px-2.5 border border-white/5 text-[11px] text-brand-beige/80 flex-row-reverse text-right font-arabic">
                          <span className="truncate">{spec}</span>
                          <button type="button" onClick={() => removeSpecAr(sIdx)} className="text-red-400 hover:text-white transition-colors p-0.5">
                            <X size={10} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 5. Scope Tags Builders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-white/5 bg-brand-dark/40">
                  
                  {/* English Tags */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono text-brand-accent uppercase tracking-widest mb-1">
                      Strategic Tags (English)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tempTagEn}
                        onChange={(e) => setTempTagEn(e.target.value)}
                        placeholder="Add tag, e.g. Typography focus"
                        className="w-full px-3 py-1.5 bg-brand-dark border border-white/10 text-white text-xs outline-none focus:border-brand-accent"
                      />
                      <button
                        type="button"
                        onClick={addTagEn}
                        className="px-3 bg-brand-accent text-brand-dark text-xs uppercase font-mono font-bold"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pt-1">
                      {formTagsEn.map((tag, tIdx) => (
                        <span key={tIdx} className="inline-flex items-center gap-1.5 bg-brand-surface py-1 px-2 border border-white/5 text-[9px] font-mono text-brand-beige/85">
                          <span>{tag}</span>
                          <button type="button" onClick={() => removeTagEn(tIdx)} className="text-red-400 hover:text-white">
                            <X size={8} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arabic Tags */}
                  <div className="space-y-2 text-right">
                    <label className="block text-[10px] font-mono text-brand-accent uppercase tracking-widest mb-1 text-right">
                      وسوم التصميم والنشر (بالعربية)
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={addTagAr}
                        className="px-3 bg-brand-accent text-brand-dark text-xs uppercase font-mono font-bold"
                      >
                        أضف
                      </button>
                      <input
                        type="text"
                        value={tempTagAr}
                        onChange={(e) => setTempTagAr(e.target.value)}
                        placeholder="مثال: دليل علامة كامل"
                        className="w-full px-3 py-1.5 bg-brand-dark border border-white/10 text-white text-xs outline-none focus:border-brand-accent text-right font-arabic"
                      />
                    </div>
                    <div className="flex flex-wrap flex-row-reverse gap-1.5 max-h-20 overflow-y-auto pt-1 text-right">
                      {formTagsAr.map((tag, tIdx) => (
                        <span key={tIdx} className="inline-flex items-center gap-1.5 bg-brand-surface py-1 px-2 border border-white/5 text-[9px] text-brand-beige/85 flex-row-reverse font-arabic">
                          <span>{tag}</span>
                          <button type="button" onClick={() => removeTagAr(tIdx)} className="text-red-400 hover:text-white">
                            <X size={8} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Form Action Controls */}
                <div className="flex justify-end gap-3 pt-6 border-t border-white/10 mt-6">
                  <button
                    type="button"
                    onClick={() => { setShowFormModal(false); setEditingProject(null); }}
                    className="px-5 py-3 border border-white/20 hover:border-white text-xs font-mono tracking-widest text-brand-beige uppercase"
                  >
                    {language === 'en' ? 'ABORT PROTOCOL' : 'إلغاء وتراجع'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-brand-accent text-brand-dark hover:bg-white text-xs font-mono font-bold tracking-widest uppercase"
                  >
                    {editingProject 
                      ? (language === 'en' ? 'COMMIT MODIFICATIONS' : 'حفظ التعديلات الفنية') 
                      : (language === 'en' ? 'DEPLOY CASE STUDY' : 'نشر العمل بالمعرض')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Case Study Details Modal Panel */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={() => setSelectedProject(null)}
            id="project-case-study-modal"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-brand-dark border border-white/10 w-full max-w-5xl rounded-none relative overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] lg:max-h-[85vh]"
            >
              
              {/* Close Button Trigger */}
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-brand-surface border border-white/5 flex items-center justify-center text-brand-beige/70 hover:text-white hover:bg-brand-accent hover:border-brand-accent transition-all duration-300"
                data-cursor-expand="true"
                data-cursor-text={language === 'en' ? 'CLOSE' : 'إغلاق'}
                id="modal-close-trigger"
              >
                <X size={20} />
              </button>

              {(() => {
                const allProjectImages = [
                  selectedProject.imageUrl,
                  ...(selectedProject.galleryImages || [])
                ];
                const activeUrl = activeModalImage || selectedProject.imageUrl;
                const currentIndex = allProjectImages.indexOf(activeUrl);
                const resolvedIndex = currentIndex >= 0 ? currentIndex : 0;

                const handlePrevImage = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  const prevIdx = (resolvedIndex - 1 + allProjectImages.length) % allProjectImages.length;
                  setActiveModalImage(allProjectImages[prevIdx]);
                };
                const handleNextImage = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  const nextIdx = (resolvedIndex + 1) % allProjectImages.length;
                  setActiveModalImage(allProjectImages[nextIdx]);
                };

                return (
                  <div className="lg:col-span-7 bg-brand-dark/95 relative flex flex-col justify-between h-[45vh] lg:h-auto min-h-[350px] lg:max-h-full overflow-hidden border-b lg:border-b-0 border-white/5">
                    
                    {/* Main image container */}
                    <div className="relative flex-grow flex items-center justify-center overflow-hidden bg-brand-surface/10 group min-h-[300px] lg:min-h-[500px]">
                      
                      {/* Atmospheric background blur to blend black spaces */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center blur-2xl opacity-25 scale-110 pointer-events-none"
                        style={{ backgroundImage: `url(${activeUrl})` }}
                      />
                      
                      <img 
                        src={activeUrl} 
                        alt={language === 'en' ? selectedProject.titleEn : selectedProject.titleAr}
                        referrerPolicy="no-referrer"
                        className="relative z-10 w-full h-full object-contain max-h-[35vh] lg:max-h-[55vh] transition-all duration-300 p-4 lg:p-6 drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
                      />

                      {/* Left / Right chevron arrows if multiple images exist */}
                      {allProjectImages.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-brand-surface/80 hover:bg-brand-accent hover:text-brand-dark text-white border border-white/10 flex items-center justify-center transition-all"
                            id="prev-slide-btn"
                            title={language === 'en' ? 'Previous Design' : 'التصميم السابق'}
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button
                            onClick={handleNextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-brand-surface/80 hover:bg-brand-accent hover:text-brand-dark text-white border border-white/10 flex items-center justify-center transition-all"
                            id="next-slide-btn"
                            title={language === 'en' ? 'Next Design' : 'التصميم التالي'}
                          >
                            <ChevronRight size={16} />
                          </button>
                        </>
                      )}

                      {/* Slide count indicator */}
                      {allProjectImages.length > 1 && (
                        <div className="absolute top-4 left-4 p-1.5 bg-brand-dark/90 backdrop-blur-md border border-white/10 text-[9px] font-mono text-brand-beige select-none z-20">
                          {resolvedIndex + 1} / {allProjectImages.length}
                        </div>
                      )}
                    </div>

                    {/* Grid & Thumbnail view bar for systematic browsing */}
                    {allProjectImages.length > 1 && (
                      <div className="bg-brand-dark/60 border-t border-white/5 p-3 flex gap-2 overflow-x-auto justify-start md:justify-center scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {allProjectImages.map((img, tIdx) => {
                          const isActive = img === activeUrl;
                          return (
                            <button
                              key={tIdx}
                              onClick={() => setActiveModalImage(img)}
                              className={`w-12 h-12 flex-shrink-0 border transition-all ${
                                isActive ? 'border-brand-accent scale-95 opacity-100' : 'border-white/10 opacity-40 hover:opacity-100'
                              }`}
                            >
                              <img
                                src={img}
                                alt={`Thumbnail ${tIdx}`}
                                className="w-full h-full object-contain bg-black"
                              />
                            </button>
                          );
                        })}
                      </div>
                    )}
                    
                    {/* Meta details ribbon */}
                    <div className="p-3 bg-brand-dark border-t border-white/5 flex justify-between items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Cpu size={14} className="text-brand-accent animate-pulse" />
                        <span className="text-[9px] font-mono tracking-widest text-brand-accent uppercase">
                          GALLERY SYSTEM ENGAGED
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-brand-muted">
                        {allProjectImages.length > 1 
                          ? (language === 'en' ? `MULTI-DESIGN PROTOCOL // 0${resolvedIndex + 1}` : `بروتوكول تصاميم متعددة // 0${resolvedIndex + 1}`)
                          : 'SINGLE SOURCE DESIGN'}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Detail Info panel side */}
              <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between overflow-y-auto max-h-[50vh] lg:max-h-[85vh] border-t lg:border-t-0 lg:border-l rtl:lg:border-l-0 rtl:lg:border-r border-white/5">
                <div className="space-y-8">
                  
                  {/* Category & Headers */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-brand-accent/10 border border-brand-accent/20 text-[9px] font-mono text-brand-accent uppercase tracking-widest">
                        {selectedProject.category}
                      </span>
                    </div>
                    <h3 className={`text-2xl sm:text-3xl font-extrabold text-white leading-tight uppercase ${
                      language === 'ar' ? 'font-arabic text-right' : 'font-display'
                    }`}>
                      {language === 'en' ? selectedProject.titleEn : selectedProject.titleAr}
                    </h3>
                  </div>

                  {/* Pitch description */}
                  <p className={`text-sm text-brand-beige/70 leading-relaxed ${
                    language === 'ar' ? 'font-arabic text-right' : ''
                  }`}>
                    {language === 'en' ? selectedProject.descEn : selectedProject.descAr}
                  </p>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-left rtl:text-right">
                        <span className="text-[9px] font-mono text-brand-muted uppercase block">
                          {t.clientLabel}
                        </span>
                        <span className={`text-xs font-semibold text-white block mt-0.5 ${
                          language === 'ar' ? 'font-arabic' : ''
                        }`}>
                          {language === 'en' ? selectedProject.clientEn : selectedProject.clientAr}
                        </span>
                      </div>
                      
                      <div className="text-left rtl:text-right">
                        <span className="text-[9px] font-mono text-brand-muted uppercase block">
                          {t.fieldLabel}
                        </span>
                        <span className={`text-xs font-semibold text-brand-accent block mt-0.5 ${
                          language === 'ar' ? 'font-arabic' : ''
                        }`}>
                          {selectedProject.category === 'branding' ? t.catBranding : selectedProject.category === 'posters' ? t.catPosters : t.catSocial}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Technical Specs List */}
                  <div className="space-y-3 pt-6 border-t border-white/5 text-left rtl:text-right">
                    <h4 className={`text-[10px] font-mono text-brand-accent uppercase tracking-widest flex items-center gap-2 justify-start rtl:justify-end ${
                      language === 'ar' ? 'font-arabic text-xs' : ''
                    }`}>
                      <Layers size={13} />
                      <span>{t.projectSpecs}</span>
                    </h4>
                    <ul className="space-y-2">
                      {(language === 'en' ? selectedProject.specsEn : selectedProject.specsAr || []).map((spec, sIdx) => (
                        <li 
                          key={sIdx}
                          className="flex items-start gap-2.5 text-xs text-brand-beige/50 rtl:flex-row-reverse rtl:text-right"
                        >
                          <span className="text-brand-accent font-semibold mt-0.5 font-mono">•</span>
                          <span className={`${language === 'ar' ? 'font-arabic' : ''}`}>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Scope Tags */}
                  <div className="flex flex-wrap gap-2 pt-4 justify-start rtl:justify-end">
                    {(language === 'en' ? selectedProject.tagsEn : selectedProject.tagsAr || []).map((tag, tIdx) => (
                      <span 
                        key={tIdx}
                        className={`px-2.5 py-1 text-[10px] font-mono bg-brand-surface border border-white/5 text-brand-beige/60 ${
                          language === 'ar' ? 'font-arabic' : ''
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                </div>

                <div className="pt-8">
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="w-full py-3.5 bg-brand-surface border border-white/10 hover:bg-brand-accent hover:border-brand-accent hover:text-brand-dark text-xs font-mono font-bold uppercase tracking-widest transition-all duration-300"
                    id="modal-close-bottom"
                  >
                    {language === 'en' ? 'DISMISS SPECIFICATION' : 'إغلاق المواصفات الفنية'}
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Non-Blocking Confirms */}
      <AnimatePresence>
        {deleteTargetId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-brand-surface border border-red-500/30 p-6 max-w-sm w-full text-center space-y-4 shadow-2xl"
            >
              <AlertTriangle className="mx-auto text-red-500 animate-pulse" size={32} />
              <div>
                <h4 className={`text-base font-bold text-white uppercase ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
                  {language === 'en' ? 'Confirm Deletion' : 'تأكيد الحذف النهائي'}
                </h4>
                <p className={`text-xs text-brand-beige/70 mt-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {language === 'en' 
                    ? 'Are you sure you want to permanently delete this portfolio design case?'
                    : 'هل أنت متأكد من رغبتك في حذف هذا العمل والتصميم بشكل نهائي من معرض فنك؟'}
                </p>
              </div>
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => setDeleteTargetId(null)}
                  className={`px-4 py-2 border border-white/10 hover:border-white text-[10px] font-mono tracking-widest uppercase transition-all ${language === 'ar' ? 'font-arabic' : ''}`}
                >
                  {language === 'en' ? 'Abort' : 'إلغاء وتراجع'}
                </button>
                <button
                  onClick={() => {
                    const updated = projectsList.filter(p => p.id !== deleteTargetId);
                    saveProjects(updated);
                    setDeleteTargetId(null);
                  }}
                  className={`px-4 py-2 bg-red-600 text-white hover:bg-red-500 hover:text-white text-[10px] font-mono tracking-widest uppercase transition-all ${language === 'ar' ? 'font-arabic' : ''}`}
                >
                  {language === 'en' ? 'Delete Permanently' : 'حذف نهائي مؤكد'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRestoreConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-brand-surface border border-brand-accent/30 p-6 max-w-sm w-full text-center space-y-4 shadow-2xl"
            >
              <RotateCcw className="mx-auto text-brand-accent animate-spin" size={32} style={{ animationDuration: '3s' }} />
              <div>
                <h4 className={`text-base font-bold text-white uppercase ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
                  {language === 'en' ? 'Restore Preset Designs' : 'إعادة تعيين الأعمال الافتراضية'}
                </h4>
                <p className={`text-xs text-brand-beige/70 mt-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {language === 'en' 
                    ? "Warning: This will clear your custom designs and restore Louai Mouaia's original masterpieces. Proceed?"
                    : 'تنبيه: سيؤدي هذا الإجراء إلى إعادة تعيين المعرض للمصنع واستعادة أعمال لؤي موايعية الافتراضية الأصلية. هل تود الاستمرار؟'}
                </p>
              </div>
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => setShowRestoreConfirm(false)}
                  className={`px-4 py-2 border border-white/10 hover:border-white text-[10px] font-mono tracking-widest uppercase transition-all ${language === 'ar' ? 'font-arabic' : ''}`}
                >
                  {language === 'en' ? 'Cancel' : 'إلغاء'}
                </button>
                <button
                  onClick={() => {
                    saveProjects(PROJECTS);
                    setStudioMode(false);
                    setShowRestoreConfirm(false);
                  }}
                  className={`px-4 py-2 bg-brand-accent text-brand-dark hover:bg-white text-[10px] font-mono tracking-widest uppercase font-bold transition-all ${language === 'ar' ? 'font-arabic' : ''}`}
                >
                  {language === 'en' ? 'Restore Presets' : 'تأكيد الاستعادة'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-brand-surface border border-brand-accent/40 p-6 max-w-sm w-full space-y-5 shadow-2xl relative"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full border border-brand-accent/20 flex items-center justify-center mx-auto bg-brand-dark/50">
                  <Settings className="text-brand-accent animate-spin" size={24} style={{ animationDuration: '6s' }} />
                </div>
                <h4 className={`text-base font-bold text-white uppercase tracking-wider ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
                  {language === 'en' ? 'Console Authentication' : 'صلاحية الدخول للوحة التحكم'}
                </h4>
                <p className={`text-xs text-brand-beige/70 leading-relaxed ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
                  {language === 'en' 
                    ? 'Please enter the Studio passcode to activate the dynamic specification constructor.'
                    : 'يرجى إدخال الرقم السري لـ الأستوديو لتفعيل التحكم وبناء المشاريع.'}
                </p>
              </div>

              <form onSubmit={handleVerifyPassword} className="space-y-4">
                <input
                  type="password"
                  placeholder={language === 'en' ? "PASSCODE" : "الرمز السري الخاص بك"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 bg-brand-dark border border-white/10 focus:border-brand-accent/60 text-white placeholder-white/30 text-center font-mono text-sm tracking-widest outline-none transition-all duration-300 rounded-none"
                  autoFocus
                />
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCancelPasswordModal}
                    className={`flex-1 py-2.5 border border-white/10 hover:border-white text-[10px] font-mono tracking-widest uppercase transition-all rounded-none ${language === 'ar' ? 'font-arabic' : ''}`}
                  >
                    {language === 'en' ? 'Abort' : 'إلغاء التفعيل'}
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-2.5 bg-brand-accent text-brand-dark hover:bg-white text-[10px] font-mono tracking-widest uppercase font-bold transition-all rounded-none ${language === 'ar' ? 'font-arabic' : ''}`}
                  >
                    {language === 'en' ? 'Verify' : 'تأكيد الدخول'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Toast Notification System */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[200] max-w-sm w-full bg-brand-dark/95 backdrop-blur-md border border-brand-accent/30 p-4 shadow-2xl flex items-start gap-3"
          >
            <div className="mt-0.5">
              {activeToast.type === 'success' ? (
                <Check size={16} className="text-emerald-400" />
              ) : activeToast.type === 'error' ? (
                <AlertTriangle size={16} className="text-amber-400" />
              ) : (
                <Cpu size={16} className="text-brand-accent animate-spin" style={{ animationDuration: '3s' }} />
              )}
            </div>
            <div className="flex-grow">
              <p className={`text-xs text-brand-beige leading-relaxed ${language === 'ar' ? 'font-arabic text-right' : ''}`}>
                {activeToast.message}
              </p>
            </div>
            <button
              onClick={() => setActiveToast(null)}
              className="text-brand-muted hover:text-white transition-colors p-0.5"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
