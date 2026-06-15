export interface Project {
  id: string;
  category: 'branding' | 'posters' | 'social';
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  clientEn: string;
  clientAr: string;
  imageUrl: string;
  galleryImages?: string[];
  tagsEn: string[];
  tagsAr: string[];
  specsEn: string[];
  specsAr: string[];
  order?: number;
}

export interface ProcessPhase {
  number: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  detailsEn: string[];
  detailsAr: string[];
}

export interface Translation {
  langCode: 'en' | 'ar';
  navProjects: string;
  navProcess: string;
  navTrust: string;
  navPlatforms: string;
  navContact: string;
  heroSubtitle: string;
  heroTitleRow1: string;
  heroTitleRow2: string;
  heroDesc: string;
  heroCTA: string;
  heroSecondaryCTA: string;
  viewAll: string;
  catAll: string;
  catBranding: string;
  catPosters: string;
  catSocial: string;
  projectSpecs: string;
  clientLabel: string;
  fieldLabel: string;
  viewProject: string;
  processTitle: string;
  processSubtitle: string;
  contactTitle: string;
  contactSubtitle: string;
  contactName: string;
  contactEmail: string;
  contactCompany: string;
  contactMessage: string;
  contactSubmit: string;
  contactSuccess: string;
  contactFailure: string;
  magneticCTALogo: string;
}
