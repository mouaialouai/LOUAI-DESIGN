import { Project, ProcessPhase, Translation } from './types';
import brandIdentityImg from './assets/images/louaimouaia_brand_identity_1781292469136.jpg';
import institutionalPosterImg from './assets/images/louaimouaia_institutional_poster_1781292485220.jpg';
import socialMediaArtImg from './assets/images/louaimouaia_social_media_art_1781292499793.jpg';

export const TRANSLATIONS: Record<'en' | 'ar', Translation> = {
  en: {
    langCode: 'en',
    navProjects: 'Portfolio',
    navProcess: 'Design Philosophy',
    navTrust: 'Client Trust',
    navPlatforms: 'Work Platforms',
    navContact: "Let's Connect",
    heroSubtitle: 'Visual Identity Design & Premium Digital Content for Entities & Professionals',
    heroTitleRow1: 'CRAFTING UNCOMPROMISED',
    heroTitleRow2: 'VISUAL MASTERPIECES',
    heroDesc: 'For ambitious agencies and brands seeking innovation and artistic distinction. Louai Mouaia delivers integrated visual solutions and innovative social media designs, tailored to grant your project a powerful presence and enduring appeal.',
    heroCTA: 'Start Your Project Now',
    heroSecondaryCTA: 'Browse Portfolio',
    viewAll: 'All Works',
    catAll: 'All Works',
    catBranding: 'Branding & Logos',
    catPosters: 'Posters & Print',
    catSocial: 'Social Campaigns & Ads',
    projectSpecs: 'Technical Specifications',
    clientLabel: 'Institutional Client',
    fieldLabel: 'Design Discipline',
    viewProject: 'View Case Study',
    processTitle: 'Visual Identity Journey',
    processSubtitle: 'Deliberate phases of design that transform raw conceptual briefs into custom visual systems.',
    contactTitle: 'Crafting Visual Identity & Content',
    contactSubtitle: 'Transforming ideas into professional designs and innovative visual identities that elevate your brand and ensure its distinction across social media platforms.',
    contactName: 'Full Name / Organization',
    contactEmail: 'Official Email Coordinate',
    contactCompany: 'Project or Company Name',
    contactMessage: 'Project Description & Requirements',
    contactSubmit: 'Submit Project Details',
    contactSuccess: 'Strategic parameters successfully transmitted. Louai Mouaia will connect shortly.',
    contactFailure: 'Submission error. Please ensure parameters remain accurate.',
    magneticCTALogo: 'L.MOUAIA'
  },
  ar: {
    langCode: 'ar',
    navProjects: 'معرض الأعمال',
    navProcess: 'فلسفة التصميم',
    navTrust: 'توثيق الثقة',
    navPlatforms: 'منصات العمل',
    navContact: 'لنبدأ العمل معاً',
    heroSubtitle: 'تصميم الهويات البصرية وصناعة المحتوى الرقمي المتميز للمؤسسات والمحترفين',
    heroTitleRow1: 'ابتكار هويات بصرية',
    heroTitleRow2: 'تترك أثراً مستداماً',
    heroDesc: 'للوكالات والعلامات التجارية الطموحة التي تبحث عن التميز والابتكار الفني. يقدم لؤي موايعية حلولاً بصرية متكاملة وتصاميم سوشيال ميديا مبتكرة، صُممت خصيصاً لتمنح مشروعك حضوراً قوياً وجاذبية تدوم طويلاً.',
    heroCTA: 'ابدأ مشروعك الآن',
    heroSecondaryCTA: 'تصفح معرض الأعمال',
    viewAll: 'كل الأعمال',
    catAll: 'الكل',
    catBranding: 'الهويات البصرية والشعارات',
    catPosters: 'تصاميم الملصقات والـ Posters',
    catSocial: 'حملات السوشيال ميديا والإعلانات',
    projectSpecs: 'المواصفات الفنية والهندسية',
    clientLabel: 'الجهة الشريكة والمؤسسة',
    fieldLabel: 'مجال التصميم الدقيق',
    viewProject: 'عرض دراسة الحالة البصرية',
    processTitle: 'رحلة ابتكار الهوية البصرية',
    processSubtitle: 'خطوات مدروسة تبدأ من الفكرة وتكتمل بالتميز البصري الحصري.',
    contactTitle: 'صناعة الهوية والمحتوى البصري',
    contactSubtitle: 'تحويل الأفكار إلى تصاميم احترافية وهويات بصرية مبتكرة تبرز قوة علامتك التجارية وتضمن تميزها على منصات التواصل الاجتماعي.',
    contactName: 'الاسم الكريم / اسم الجهة',
    contactEmail: 'البريد الإلكتروني الرسمي للتواصل',
    contactCompany: 'اسم مشروعك أو شركتك',
    contactMessage: 'وصف المشروع والمتمتطلبات',
    contactSubmit: 'إرسال تفاصيل المشروع',
    contactSuccess: 'تم إرسال بارامترات الطلب بنجاح. سيتواصل معكم لؤي موايعية فوراً.',
    contactFailure: 'حدث خطأ أثناء الإرسال. يرجى مراجعة الخصائص والمحاولة ثانية.',
    magneticCTALogo: 'ل. موايعية'
  }
};

export const PROJECTS: Project[] = [
  {
    id: 'proj-1',
    category: 'branding',
    titleEn: 'Al-Qudra Institutional Brand System',
    titleAr: 'منظومة الهوية البصرية لمؤسسة القدرة',
    descEn: 'A comprehensive structural design identity for a premium investment chamber, prioritizing architectural geometry and timeless dark-beige palettes.',
    descAr: 'هوية بصرية متكاملة وصارمة لغرفة استثمارية متميزة، تركز على المنظور المعماري الهندسي ودرجات البيج والرمادي الداكن الملوكي.',
    clientEn: 'Al-Qudra Capital Group',
    clientAr: 'مجموعة القدرة الاستثمارية الكبرى',
    imageUrl: brandIdentityImg,
    tagsEn: ['Brand Guidelines', 'Institutional Monogram', 'Stationery Systems', 'Corporate Collateral'],
    tagsAr: ['إرشادات الهوية البصرية', 'الشعار المونوغرامي', 'القرطاسية الرسمية', 'المطبوعات الفاخرة'],
    specsEn: [
      'Asymmetric Grid Formulation',
      'Specialized Dual Arabic/English Typography System',
      'Contrast Ratio 8.5:1 (Corporate Grade)',
      'Vector Precision Scalability'
    ],
    specsAr: [
      'تخطيط شبكي غير متماثل متقن',
      'نظام طبوغرافي ثنائي عربي/إنجليزي خاص',
      'نسبة تباين ألوان فائقة 8.5:1',
      'دقة متناهية قابلة للتكبير اللانهائي'
    ]
  },
  {
    id: 'proj-2',
    category: 'posters',
    titleEn: 'Exhibition of Contemporary Calligraphy Poster',
    titleAr: 'بوستر معرض الخط العربي السنوي المعاصر',
    descEn: 'A striking showcase poster utilizing premium dynamic lettering layout, vibrant cultural elements, and highly polished corporate frames.',
    descAr: 'ملصق إعلاني متميز لمعرض الخط السنوي، يدمج التكوين الطباعي المتدفق بالتصميم الحداثي الكرومي والنوافذ البصرية النقية.',
    clientEn: 'Global Arabic Arts Academy',
    clientAr: 'الأكاديمية العالمية للفنون العربية',
    imageUrl: institutionalPosterImg,
    tagsEn: ['Cultural Poster Design', 'Arabic Typography Focus', 'Exhibition Curated Asset', 'Institutional Poster Grid'],
    tagsAr: ['تصميم ملصق ثقافي راقٍ', 'طبوغرافيا الخط العربي المطور', 'أصول المعارض الفنية', 'شبكة الملصقات القياسية'],
    specsEn: [
      'Offset Screen printing specifications',
      'Ultra-dense type tracking system',
      'Metallic chrome hot foil design elements',
      'Structured 700x1000mm standard ratio'
    ],
    specsAr: [
      'مواصفات طباعة الشاشة الفاخرة',
      'تتبع طبوغرافي عالي الكثافة ومتزن',
      'عناصر رقاقات معدنية فضية كرومية حارة',
      'الأبعاد القياسية المعتمدة 700×1000 مم'
    ]
  },
  {
    id: 'proj-3',
    category: 'social',
    titleEn: 'Al-Nukhba Luxury Social Campaign Grid',
    titleAr: 'فريد الإعلاني الرقمي الفاخر للنخبة العقارية',
    descEn: 'A collection of visual social structures created for high-ticket property developments, optimizing visual rhythm and layout conversion rates.',
    descAr: 'حملة إعلانية ومحتوى بصري مخصص للعقارات الراقية، ترتكز على توازن متسق ونسبة تركيز عالية لجذب المستثمرين ذوي الميزانيات الكبرى.',
    clientEn: 'Al-Nukhba Real Estate Development',
    clientAr: 'النخبة العالمية للتطوير العقاري الفاخر',
    imageUrl: socialMediaArtImg,
    tagsEn: ['Digital Content System', 'Social Grid Architecture', 'Motion Accent Kits', 'Luxury Conversion Design'],
    tagsAr: ['سلسلة محتوى رقمي متسق', 'شبكية التصاميم للميديا', 'عناصر موشن مخصصة', 'تصاميم جذب الفائدة العقارية'],
    specsEn: [
      'Optimized digital pixel precision',
      'High contrast readability for mobile views',
      'Modular layouts for rapid asset distribution',
      'Adaptive color schemes for Instagram grid aesthetics'
    ],
    specsAr: [
      'دقة بكسل فائقة الجودة للموبايل والشاشات',
      'تباين ألوان عالي لسهولة القراءة باللمح السريع',
      'تخطيطات برمجية موديولية لسرعة النشر والتعديل',
      'تنسيق ألوان ديناميكي متناغم لشبكة إنستغرام'
    ]
  },
  {
    id: 'proj-4',
    category: 'branding',
    titleEn: 'The Sovereign Institutional Guidelines',
    titleAr: 'دليل العلامة والمطبوعات السيادية',
    descEn: 'An exhaustive identity architecture containing corporate rules, geometric grid construction, and strict alignment protocols.',
    descAr: 'دليل معماري وهندسي فائق الدقة يحتوي على شروط العلامة السيادية، والخطوط الرياضية، وبروتوكولات التشكيل البصري.',
    clientEn: 'The Sovereign Council Institute',
    clientAr: 'معهد ودائرة الشؤون السيادية والتنظيمية',
    imageUrl: 'https://images.unsplash.com/photo-1541462608141-2f58c6e40265?auto=format&fit=crop&w=1200&q=80',
    tagsEn: ['Brand Guidelines', 'Gold Foil Prints', 'Corporate Identity Manual', 'Institutional Rules'],
    tagsAr: ['دليل علامة كامل', 'ختم ورق الذهب البارز', 'كتيب الهوية المؤسسي', 'القوانين البصرية الصارمة'],
    specsEn: [
      '240-page comprehensive guidelines layout',
      'Custom luxury vector icons kit',
      'Premium paper stock calibration',
      'Golden spiral grid logos'
    ],
    specsAr: [
      'دليل مطبوع فاخر يقع في 240 صفحة فنية',
      'مجموعة أيقونات فيكتور ذهبية حصرية',
      'معايرة خامات الورق الفاخر للطباعة الصامتة',
      'التناسب الشبكي المأخوذ من الدائرة الذهبية رياضياً'
    ]
  },
  {
    id: 'proj-5',
    category: 'posters',
    titleEn: 'Industrial Bauhaus Design Exposition Poster',
    titleAr: 'بوستر معرض التصميم الهندسي باوهاوس',
    descEn: 'A high-concept tribute poster integrating pure corporate grid theory, minimalist typographic elements, and a structured dark aesthetic.',
    descAr: 'ملصق احتفالي ذو طابع فكري غني، يجمع بين نظرية المعمار البنائي باوهاوس، والرموز الطبوغرافية البسيطة والتباين الداكن الفاخر.',
    clientEn: 'National Design Museum',
    clientAr: 'المتحف الوطني للتصميم المعماري الحداثي',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
    tagsEn: ['Bauhaus Geometry', 'Tectonic Type Design', 'Limited Edition Serigraph', 'Industrial Poster Art'],
    tagsAr: ['هندسة باوهاوس', 'توزيع طبوعرافي تكتوني متقن', 'طباعة حريرية طبعة محدودة', 'ملصق بوعي صناعي فاخر'],
    specsEn: [
      'Two-color offset press settings',
      'Uncoated archival paper specs',
      'Raw metallic silver and matte black palette',
      'Industrial structural layouts'
    ],
    specsAr: [
      'خصائص طباعة الأوفست ذات اللونين الأساسيين',
      'مواصفات ورق أرشيفي طبيعي غير مطلي فاخر',
      'درجات ميتاليك فضية طافية مع سواد فحمي معتم',
      'أنظمة التشكيل الشبكي الرأسي المباشر'
    ]
  },
  {
    id: 'proj-6',
    category: 'social',
    titleEn: 'Institutional Summit Communications Deck',
    titleAr: 'الحزمة التعريفية والترويجية للمؤتمر القيادي',
    descEn: 'High-end visual communication deck and social posters crafted to amplify the presence of global corporate leaders and decision makers.',
    descAr: 'حزمة وملصقات السوشيال ميديا للمؤتمر القيادي السنوي، تهدف إلى إبراز وجوه القياديين وصناع القرار في تخطيط مهيب وفخم.',
    clientEn: 'Global Leadership Chamber',
    clientAr: 'الغرفة العالمية للاتصال وصناع القرار',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    tagsEn: ['Leader Profile Posters', 'Corporate Event Identity', 'Global Launch Posters', 'Strategic Graphics'],
    tagsAr: ['ملصقات ملامح القياديين', 'هوية المعارض الكبرى', 'بوسترات الإطلاق الإستراتيجي', 'رسومات الإبهار القيادي'],
    specsEn: [
      'Digital asset system for multi-screen projection',
      'Meticulous retouching and high-impact color filters',
      'Multilingual presentation layout',
      'Instant loading layout specifications'
    ],
    specsAr: [
      'نظام أصول للعرض الرقمي التفاعلي بالقمة',
      'رتوش فائقة مخصصة وفلاتر تباين الألوان العميقة',
      'مخطط عرض ثنائي التوزيع ذكي باللغتين',
      'مواصفات التحميل السريع الفوري والمقاسات الشاملة'
    ]
  }
];

export const PROCESS_PHASES: ProcessPhase[] = [
  {
    number: '01',
    titleEn: '01 Vision Study & Strategic Analysis',
    titleAr: '01 دراسة الرؤية والتحليل الاستراتيجي',
    descEn: 'We dive deep into your brand credentials, analyzing your target demographics and industry competitors to secure a unique baseline roadmap before design.',
    descAr: 'نغوص في تفاصيل علامتك التجارية، ونحلل الجمهور المستهدف والمنافسين لنرسم رؤية بصرية واضحة تضمن تميزك في السوق قبل البدء بالتصميم.',
    detailsEn: [
      'Competitive market posture analysis.',
      'Aesthetic voice & statement mapping.',
      'Target-audience color resonance.',
      'Initial project art-direction blueprint.'
    ],
    detailsAr: [
      'تحليل الهوية التنافسية في السوق.',
      'تحديد نبرة الصوت والرسالة البصرية.',
      'دراسة الألوان الجاذبة للمستهدفين.',
      'صياغة التوجه الفني الأولي للمشروع.'
    ]
  },
  {
    number: '02',
    titleEn: '02 Structural Blueprint & Grid Layout',
    titleAr: '02 بناء الهيكل والتخطيط البصري',
    descEn: 'We establish the creative foundation by drafting balanced geometric grids that secure flawless scaling of logos, wordmarks, and typography across all dimensions.',
    descAr: 'نضع حجر الأساس للتصاميم عبر بناء شبكة هندسية متوازنة تضمن التناسب المثالي للشعارات، النصوص، والأيقونات في المساحات الرقمية والمطبوعة.',
    detailsEn: [
      'Ultra-precise branding grid formulation.',
      'Geometric scale & alignment matching.',
      'Visual hierarchy ordering.',
      'Bilingual English-Arabic symmetry checks.'
    ],
    detailsAr: [
      'تصميم شبكة الهوية بدقة متناهية.',
      'ضبط التناسب البصري للأحجام والخطوط.',
      'ترتيب الهرم البصري لقراءة مريحة.',
      'تنسيق التوازن بين اللغتين العربية والإنجليزية.'
    ]
  },
  {
    number: '03',
    titleEn: '03 Art Presentation & Color Palette',
    titleAr: '03 الإخراج الفني وتناسق الألوان',
    descEn: 'We breathe life into design deliverables by assigning luxury color schemas, regulating shadows, custom glows, and deep ambient contrasts to forge remarkable compositions.',
    descAr: 'ندبّ الحياة في التصاميم عبر اختيار لوحات ألوان فاخرة ومتناسقة تثير العاطفة، مع ضبط الإضاءة، الظلال، والتباين لإنتاج قطع فنية مذهلة ومؤثرة.',
    detailsEn: [
      'Curating dynamic tailored palettes.',
      'Soft gradient & shadow crafting.',
      'Contrast testing for peak visual impact.',
      'Digital mockups of premium prints and materials.'
    ],
    detailsAr: [
      'ابتكار لوحة الألوان الخاصة بالعلامة.',
      'ضبط تأثيرات الظلال والإضاءة الناعمة.',
      'اختبار قوة التباين لضمان وقع بصري مميز.',
      'محاكاة المطبوعات والخامات الفاخرة بشكل رقمي.'
    ]
  },
  {
    number: '04',
    titleEn: '04 Deployment & Deliverables Handover',
    titleAr: '04 إطلاق الهوية وتسليم ملفات العمل',
    descEn: 'We handover your complete identity assets fully optimized across file formats, together with a unified brand guidelines book that guarantees structural consistency over time.',
    descAr: 'نسلمك الهوية البصرية وتصاميمك بكامل امتداداتها وجاهزيتها العالية، مدعومة بدليل إرشادي شامل يضمن الحفاظ على جودة وتناسق تصاميمك في كل الأوقات.',
    detailsEn: [
      'Comprehensive brand guidelines manual.',
      'Exhaustive vector source assets bundling.',
      'Precise print & digital scale alignments.',
      'Technical support & direction for rollouts.'
    ],
    detailsAr: [
      'تسليم دليل إرشادي شامل للعلامة التجاريّة.',
      'تنظيم ملفات المصدر بمختلف الامتدادات.',
      'ضبط مقاسات الطباعة والنشر الرقمي بدقة.',
      'تقديم دعم وتوجيه فني لتطبيق الهوية بالشكل الصحيح.'
    ]
  }
];
