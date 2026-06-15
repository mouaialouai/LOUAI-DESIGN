import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './LanguageContext';
import { Star, MessageSquareCode, ShieldCheck, Heart, ChevronDown, ChevronUp } from 'lucide-react';

interface Testimonial {
  id: string;
  clientNameAr: string;
  clientNameEn: string;
  roleAr: string;
  roleEn: string;
  textAr: string;
  textEn: string;
  rating: number;
  avatarUrl: string;
  date: string;
  platform: string;
}

const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 'test-1',
    clientNameAr: 'أبو فهد العتيبي',
    clientNameEn: 'Abu Fahad Al-Otaibi',
    roleAr: 'مؤسس شركة ريادة العقارية',
    roleEn: 'Founder, Reyada Real Estate',
    textAr: 'عمل رائع ومتقن، احترافية عالية جداً في التزام مواعيد التسليم والأفكار المطروحة. أنصح الجميع بالتعامل مع لؤي لامتيازه بلمسة فنية فريدة وقدرة ممتازة على الابتكار الهندسي والبصري للهويات.',
    textEn: 'Exquisite and mastered work, extremely high professionalism in deadlines and creative ideas. I highly recommend Louai for his unique artistic touch and excellent ability in geometric brand engineering.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    date: '2026-05',
    platform: 'Khamsat Premium'
  },
  {
    id: 'test-2',
    clientNameAr: 'م. سارة الحربي',
    clientNameEn: 'Eng. Sarah Al-Harbi',
    roleAr: 'مديرة قسم التصميم والاتصال',
    roleEn: 'Design & Communications Lead',
    textAr: 'للمرة الثانية أتعامل مع الأستاذ لؤي، ذوق راقي جداً وصبر شديد على التعديلات وتفهم دقيق للمتطلبات البصرية. تصاميم الهوية خرجت بنظام فاخر تفخر به المؤسسة ويتجاوز توقعات مجلس الإدارة بحق.',
    textEn: 'My second collaboration with Mr. Louai. Exceptional taste, immense patience with refinements, and clear understanding of visual goals. The brand identity system turned out highly premium.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    date: '2026-04',
    platform: 'Khamsat Premium'
  },
  {
    id: 'test-3',
    clientNameAr: 'د. خالد عبد العزيز',
    clientNameEn: 'Dr. Khaled Abdelaziz',
    roleAr: 'المشرف العام لمركز النخبة الطبي',
    roleEn: 'General Supervisor, Elite Medical Center',
    textAr: 'مصمم متمكن ومبدع، ذو خلق راقٍ جداً وسرعة في الإنجاز مع دقة خارقة في إيجاد أنظمة بصرية للملصقات والمطبوعات. قدم دراسات دقيقة متكاملة للهوية حازت على ثقة جميع الشركاء والمستثمرين.',
    textEn: 'A master designer and innovator with polite communication, rapid execution, and supreme precision in institutional poster networks. Resolved all visual parameters to absolute perfection.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    date: '2026-03',
    platform: 'Khamsat Premium'
  },
  {
    id: 'test-4',
    clientNameAr: 'أ. طارق الشمري',
    clientNameEn: 'Tariq Al-Shammari',
    roleAr: 'رئيس مجلس إدارة شركة سديم الرقمية',
    roleEn: 'Chairman, Sadeem Digital',
    textAr: 'سرعة استثنائية في الاستيعاب والتطبيق البصري. قدم أفكار وشعارات خارجة عن المألوف تجمع بين البساطة الحديثة وعمق الفخامة البنيوية. مصمم احترافي وخبير بالأنظمة المستدامة، يستحق كامل التقدير.',
    textEn: 'Exceptional speed in perception and visual execution. Engineered concepts that merge modern simplicity with core luxury principles. A highly professional partner who excels in durable design.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    date: '2026-02',
    platform: 'Khamsat Premium'
  },
  {
    id: 'test-5',
    clientNameAr: 'أ. مساعد الدوسري',
    clientNameEn: 'Musaed Al-Dossari',
    roleAr: 'المشرف على مشاريع الهيئة الاتحادية',
    roleEn: 'Federal Authority Project Lead',
    textAr: 'مستشار ومصمم ممتاز، يفهم متطلبات الهويات العالمية الهندسية المتكاملة ويسلم أعمالاً دقيقة ومدروسة بالكامل. التعامل معه مكسب حقيقي لأي علامة تجارية تبحث عن الأناقة والفخامة والاستدامة.',
    textEn: 'An excellent consultant and designer who understands corporate brand identity frameworks and delivers fully engineered, precise works. A true asset for any brand aiming for high prestige.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    date: '2026-02',
    platform: 'Khamsat Premium'
  },
  {
    id: 'test-6',
    clientNameAr: 'م. عمر بن عبد العزيز',
    clientNameEn: 'Eng. Omar Bin Abdulaziz',
    roleAr: 'الرئيس التنفيذي للتطوير البصري والنمذجة',
    roleEn: 'CEO of Visual Development & Modelling',
    textAr: 'تفرد عجيب بالهوية البصرية والذكاء الهندسي المتقن للهوية التجارية. جربنا أكثر من مصمم ولكن لم نجد أحدا يدمج البساطة الكونية الفاخرة مع الأداء المتين للشعار بمثل هذه السهولة والشغف.',
    textEn: 'Incredibly unique visual identity mastery and engineered brand intelligence. We tried multiple designers, but found none with such cosmic simplicity combined with computational design value.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop&crop=face',
    date: '2026-01',
    platform: 'Khamsat Premium'
  },
  {
    id: 'test-7',
    clientNameAr: 'أ. فهد الشيباني',
    clientNameEn: 'Fahad Al-Shaibani',
    roleAr: 'مدير العمليات الفنية لمجموعة المجد',
    roleEn: 'Technical Operations Director, Almajd Group',
    textAr: 'التزام كامل بنسب الشبكة الذهبية والنسب البصرية الدقيقة للشعارات والمطبوعات الفاخرة. عمل متكامل ومحكم وذوق عالي جداً لا غبار عليه. أنصح وبشدة للشركات الباحثة عن التميز غير الاعتيادي.',
    textEn: 'Complete and elegant dedication to golden grid ratios and precise visual layouts of premium brand marks. Exceptionally robust presentation and masterclass communication skills.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    date: '2025-12',
    platform: 'Khamsat Premium'
  },
  {
    id: 'test-8',
    clientNameAr: 'أ. روعة الماضي',
    clientNameEn: 'Rowa Al-Madi',
    roleAr: 'مستشارة العلامات والتسويق الرقمي الدولي',
    roleEn: 'International Brand & Digital Marketing Advisor',
    textAr: 'تنسيق لوني بديع وخطوط فنية هندسية تخدم جوهر المشروع الفلسفي والعملي تماماً. تم تسليم العمل في وقت قياسي ومرونة غير محدودة في استقبال الملاحظات وتعديلها بجودة متناهية.',
    textEn: 'Exquisite color palette formulation and geometric layout vectors fully serving the heart of our commercial goals. Rapid production loops, supreme precision, and outstanding support.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    date: '2025-11',
    platform: 'Khamsat Premium'
  },
  {
    id: 'test-9',
    clientNameAr: 'أ. عبد الله الهاشمي',
    clientNameEn: 'Abdullah Al-Hashemi',
    roleAr: 'الرئيس التنفيذي لوكالة الهاشمي الرقمية',
    roleEn: 'CEO, Al-Hashemi Digital Agency',
    textAr: 'شخص غاية في التعاون، ذكي، وسريع البديهة يفهم التفاصيل الدقيقة للتصميم الحديث والمستدام. هذا هو التعامل الثالث ولن يكون الأخير بإذن الله لدقته الكبيرة وإتقانه الفاخر.',
    textEn: 'Highly cooperative, intelligent, and quick-witted. He perfectly understands the subtle nuances of premium, sustainable design. This is our third project together and certainly not the last.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1511551203524-9a24350a5e83?w=150&h=150&fit=crop&crop=face',
    date: '2025-10',
    platform: 'Khamsat Premium'
  },
  {
    id: 'test-10',
    clientNameAr: 'م. لمى الجودر',
    clientNameEn: 'Eng. Lama Al-Jowder',
    roleAr: 'مديرة العلامة التجارية لمجموعة لمار الدولية',
    roleEn: 'Brand Manager, Lamar International',
    textAr: 'مستوى مذهل من الاحترافية، أفكار الهندسة البصرية المطبقة في الهوية تجاوزت تطلعاتنا بكثير. دراسة الألوان واختيار الخطوط مبني على أسس علمية ومدروسة تعكس فخامة العلامة التجارية.',
    textEn: 'Stunning level of professionalism. The visual engineering concepts implemented exceeded our expectations. The color science and typographic guidelines are based on deep design systems.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face',
    date: '2025-09',
    platform: 'Khamsat Premium'
  },
  {
    id: 'test-11',
    clientNameAr: 'أ. عادل عبد اللطيف',
    clientNameEn: 'Adel Abdel Latif',
    roleAr: 'المدير الإبداعي لشبكة المدى ميديا',
    roleEn: 'Creative Director, Al-Mada Media Network',
    textAr: 'أنصح كل من يبحث عن هوية تجارية ممتازة وفريدة من نوعها ومصممة بأعلى معايير الإتقان أن يتعاون مع الأستاذ لؤي. ذو ذوق فني كوني راقٍ وتواصل سريع ومحترف جداً.',
    textEn: 'I recommend everyone seeking a premium, unique brand identity executed with absolute craftsmanship to partner with Mr. Louai. Excellent cosmic taste and rapid, highly skilled feedback loops.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    date: '2025-08',
    platform: 'Khamsat Premium'
  },
  {
    id: 'test-12',
    clientNameAr: 'د. لؤي آل فخري',
    clientNameEn: 'Dr. Louai Al-Fakhri',
    roleAr: 'مؤسس ورئيس مسرعة نماء سيليكون',
    roleEn: 'Founder & President, Nama Silicon Inc.',
    textAr: 'تصميم فخم، مبتكر ويميز الشركة عن كل المنافسين في السوق الدولي. لؤي مهندس بصري بمعنى الكلمة، يحلل رغبات العميل ببراعة ويسلم كعادتة تحفاً إبداعية غير تقليدية بالمرة.',
    textEn: 'Prestige, innovative designs that successfully distinguish our firm globally. Louai is a true visual architect who masterfully analyzes corporate targets and delivers unmatched masterpieces.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face',
    date: '2025-07',
    platform: 'Khamsat Verified'
  },
  {
    id: 'test-13',
    clientNameAr: 'أ. ياسمين الصانع',
    clientNameEn: 'Yasmin Al-Sane',
    roleAr: 'مديرة المنتجات في حاضنة أعمال تك',
    roleEn: 'Product Manager, Tech Business Incubator',
    textAr: 'التجربة كانت أكثر من رائعة، مهارات لؤي في الرسم الهندسي والتجذير البصري للعلامة فريدة للغاية ومواكبة لأحدث صيحات المدارس العالمية كالمدرسة السويسرية والتقليلية الفاخرة.',
    textEn: 'An outstanding experience. Louais talents in geometric grid layouts and high-end core branding are unique and fully aligned with top global premium and minimalist design movements.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    date: '2025-06',
    platform: 'Khamsat Verified'
  },
  {
    id: 'test-14',
    clientNameAr: 'أ. محمد الهذلي',
    clientNameEn: 'Mohammed Al-Hodhli',
    roleAr: 'مالك دار رؤية للإنتاج والتوزيع الفني',
    roleEn: 'Owner, Roiah Art Production',
    textAr: 'لم يخيب الأستاذ لؤي توقعاتي أبداً، ذوقه راقي وتصميماته مفعمة بالفخامة والتميز. الهوية والأنظمة البصرية التي صممها لنا كانت سبباً رئيسياً لنجاح انطلاقتنا التجارية بالسوق.',
    textEn: 'Mr. Louai never disappoints. His designs are brimming with pure premium aesthetics. The visual identity guidelines he designed were a cornerstone for our successful commercial launch.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&h=150&fit=crop&crop=face',
    date: '2025-05',
    platform: 'Khamsat Verified'
  }
];

export default function ClientTestimonials() {
  const { language } = useLanguage();
  const [visibleCount, setVisibleCount] = useState(4);

  const visibleTestimonials = TESTIMONIALS_DATA.slice(0, visibleCount);
  const hasMore = visibleCount < TESTIMONIALS_DATA.length;

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 4, TESTIMONIALS_DATA.length));
  };

  const collapse = () => {
    setVisibleCount(4);
    // Smooth scroll back to testimonials header when collapsing
    const section = document.getElementById('testimonials-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/5 relative z-20"
      id="testimonials-section"
    >
      {/* Subtle Background Accent Grid Lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(156,131,96,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(156,131,96,0.01)_1px,transparent_1px)] bg-[size:42px_42px] pointer-events-none opacity-40" />

      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <MessageSquareCode size={12} className="text-brand-accent" />
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-brand-accent font-semibold">
            CLIENT VERBAL REPORTS // شهادات وإثباتات القيمة
          </span>
        </div>
        
        <h2 className={`text-3xl md:text-5xl font-extrabold text-white uppercase mb-6 ${
          language === 'ar' ? 'font-arabic leading-snug' : 'font-display'
        }`}>
          {language === 'en' ? 'TRUST CERTIFICATES // KHAMSAT' : 'توثيق الثقة والتقييمات // خمسات'}
        </h2>
        
        <p className={`text-sm sm:text-base text-brand-beige/70 leading-relaxed ${
          language === 'ar' ? 'font-arabic' : ''
        }`}>
          {language === 'en' 
            ? 'Real verbal evaluation transcripts from elite corporate clients and premium partners on Khamsat.'
            : 'شهادات وتقييمات موثقة ومباشرة لشركاء النجاح ورواد الأعمال من المعاملات المكتملة على منصة خمسات.'}
        </p>
      </div>

      {/* Organized Side-by-Side Card Grid (matching the requested design format) */}
      <motion.div 
        layout="position"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto relative z-10 mb-14" 
        id="testimonials-grid-layout"
      >
        <AnimatePresence mode="popLayout">
          {visibleTestimonials.map((testimonial, idx) => (
            <motion.div
              layout
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0.94, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="bg-[#0c0c0e] hover:bg-[#111114] border border-white/5 hover:border-brand-accent/20 rounded-[24px] p-6 sm:p-10 flex flex-col justify-between relative group transition-all duration-300 shadow-2xl overflow-hidden h-full"
            >
              {/* Ambient Background Glow Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Micro Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div>
                {/* Header: Name & Rating on Left, Avatar on Right */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  
                  {/* Left Area: Name & Stars */}
                  <div className="flex flex-col items-start text-left">
                    <h3 className={`text-sm sm:text-base font-bold text-white tracking-wide group-hover:text-brand-accent transition-colors duration-300 ${
                      language === 'ar' ? 'font-arabic text-right w-full' : 'font-sans text-left'
                    }`}>
                      {language === 'ar' ? testimonial.clientNameAr : testimonial.clientNameEn}
                    </h3>
                    
                    {/* Gold Stars */}
                    <div className="flex items-center gap-1 mt-1.5 justify-start w-full">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          className="fill-[#e2b05c] text-[#e2b05c]" 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Right Area: Portrait Avatar container */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white/5 group-hover:border-brand-accent/40 bg-brand-dark/40 transition-all duration-300">
                      <img 
                        src={testimonial.avatarUrl} 
                        alt={language === 'ar' ? testimonial.clientNameAr : testimonial.clientNameEn}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center scale-[1.01] group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    {/* Mini Shield Verified badge */}
                    <div className="absolute -bottom-1 -right-1 bg-[#10b981] border border-brand-dark rounded-full p-0.5" title="Verified Client">
                      <ShieldCheck size={8} className="text-white" />
                    </div>
                  </div>

                </div>

                {/* Review Text Body - Beautiful Cairo/Sans Centered/Justified Layout */}
                <p className={`text-xs sm:text-sm text-brand-beige/85 leading-relaxed text-center font-light relative z-10 px-1 sm:px-2 select-text ${
                  language === 'ar' ? 'font-arabic text-right leading-loose' : 'font-sans text-left'
                }`}>
                  {language === 'ar' ? testimonial.textAr : testimonial.textEn}
                </p>
              </div>

              {/* Footer Specifications Info metadata */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5 text-[9px] font-mono tracking-wider text-brand-muted uppercase">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent/50 group-hover:bg-[#e2b05c] transition-colors" />
                  {language === 'ar' ? testimonial.roleAr : testimonial.roleEn}
                </span>
                <span className="text-brand-accent/60 font-semibold group-hover:text-brand-accent transition-colors">
                  {testimonial.platform}
                </span>
              </div>

              {/* Decorative Corner accent markers */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-40 transition-opacity duration-300 text-brand-accent/30 pointer-events-none">
                <Heart size={8} className="fill-brand-accent/10" />
              </div>

            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Premium Load More/Collapse Button Container */}
      <motion.div 
        layout="position"
        className="flex justify-center items-center relative z-10 mb-8"
      >
        <button
          onClick={hasMore ? loadMore : collapse}
          className="group relative px-6 py-3 bg-[#0c0c0e]/95 border border-white/10 text-brand-accent hover:text-white hover:border-brand-accent hover:shadow-[0_0_20px_rgba(156,131,96,0.15)] transition-all duration-300 rounded-sm cursor-pointer select-none text-xs font-mono uppercase tracking-[0.18em] flex items-center gap-3 backdrop-blur-md"
          data-cursor-expand="true"
        >
          {/* Subtle gold line bar across on hover */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-brand-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <span className={language === 'ar' ? 'font-arabic text-sm tracking-normal' : ''}>
            {hasMore 
              ? (language === 'en' ? 'Load More Credentials' : 'تصفح المزيد من التقييمات')
              : (language === 'en' ? 'Show Fewer Certificates' : 'إخفاء التقييمات الإضافية')
            }
          </span>
          {!hasMore ? (
            <ChevronUp size={13} className="text-brand-accent group-hover:text-white transition-colors duration-300" />
          ) : (
            <ChevronDown size={13} className="text-brand-accent group-hover:text-white transition-colors duration-300" />
          )}
        </button>
      </motion.div>

      {/* Decorative verification footnote */}
      <div className="text-center mt-12 relative z-10 select-none">
        <span className="text-[9px] font-mono text-brand-muted uppercase tracking-[0.2em] inline-flex items-center gap-2">
          <span>PORTAL VERIFIED BY KHAMSAT SERVICE PROTOCOLS</span>
          <span className="w-1 h-1 rounded-full bg-brand-accent" />
          <span>100% SATISFACTION CONTINUOUS RATIO</span>
        </span>
      </div>

    </section>
  );
}
