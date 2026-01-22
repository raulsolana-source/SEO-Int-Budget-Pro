
export enum Complexity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum SiteType {
  BLOG_SaaS = 'Blog / SaaS / Lead Gen',
  ECOMMERCE = 'Ecommerce (Medium)',
  ENTERPRISE = 'Enterprise / Marketplace'
}

export interface BudgetConfig {
  languages: number;
  complexity: Complexity;
  siteType: SiteType;
  technicalDebt: Complexity;
  contentVolume: Complexity;
}

export interface TierInfo {
  name: string;
  target: string;
  setupRange: [number, number];
  monthlyRange: [number, number];
  features: string[];
  linkbuildingRange: [number, number];
}
