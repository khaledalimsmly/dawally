export interface InvestorDocument {
  id: string;
  name: string;
  description: string;
  filePath: string;
  category: 'pitch' | 'business' | 'financials' | 'profile';
  icon: string;
}

export const investorDocuments: InvestorDocument[] = [
  {
    id: 'pitch-deck',
    name: 'Pitch Deck',
    description: 'DAWALLY Investment Opportunity Overview',
    filePath: '/docs/pitch-deck.pdf',
    category: 'pitch',
    icon: 'presentation'
  },
  {
    id: 'business-plan',
    name: 'Business Plan',
    description: 'Comprehensive business strategy and market analysis',
    filePath: '/docs/business-plan.pdf',
    category: 'business',
    icon: 'file-text'
  },
  {
    id: 'financial-projections',
    name: 'Financial Projections',
    description: '5-year revenue and growth forecasts',
    filePath: '/docs/financial-projections.pdf',
    category: 'financials',
    icon: 'trending-up'
  },
  {
    id: 'audited-financials',
    name: 'Audited Financials',
    description: 'Certified financial statements and audit reports',
    filePath: '/docs/audited-financials.pdf',
    category: 'financials',
    icon: 'file-check'
  },
  {
    id: 'company-profile',
    name: 'Company Profile',
    description: 'Team, history, and organizational structure',
    filePath: '/docs/company-profile.pdf',
    category: 'profile',
    icon: 'building'
  }
];

export const documentCategories = {
  pitch: 'Pitch Deck',
  business: 'Business Documents',
  financials: 'Financials',
  profile: 'Company Profile'
};
