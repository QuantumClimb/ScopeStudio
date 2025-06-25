export interface PageData {
  title: string;
  description: string;
  heroTitle?: string;
  heroSubheading?: string;
  heroImageUrl?: string;
  bodyContent?: string;
  bodyImageUrl?: string;
}

export interface SitePageData extends PageData {
  id: string;
  name: string;
}

export interface SiteData {
  pages: SitePageData[];
}

export interface UserData {
  email: string;
  plan: 'free' | 'pro';
  isAuthenticated: boolean;
}
