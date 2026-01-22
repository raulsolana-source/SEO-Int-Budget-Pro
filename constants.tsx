
import React from 'react';
import { TierInfo } from './types';

export const TIERS: TierInfo[] = [
  {
    name: 'International Starter',
    target: '1–2 languages, low complexity',
    setupRange: [1300, 1700],
    monthlyRange: [850, 1150],
    features: [
      '1 monthly call',
      'On-page/interlinking up to 10 URLs/mo',
      'No copywriting included',
      'Basic tech + hreflang',
      'Standard monthly reporting'
    ],
    linkbuildingRange: [200, 400]
  },
  {
    name: 'International Growth',
    target: '2–3 languages, the standard choice',
    setupRange: [1800, 2400],
    monthlyRange: [1350, 1750],
    features: [
      '1–2 monthly calls',
      'On-page up to 20 URLs/mo',
      '2 articles/mo or 1 landing/mo',
      'Continuous technical SEO + hreflang',
      'AI SEO (AIO, entities, Q&A)',
      'Quick wins UX/CRO'
    ],
    linkbuildingRange: [300, 500]
  },
  {
    name: 'International Enterprise',
    target: '3+ languages / high complexity',
    setupRange: [2900, 4500],
    monthlyRange: [2200, 3800],
    features: [
      '2–4 monthly calls',
      'On-page up to 35 URLs/mo',
      '4 articles/mo or 2 landings/mo',
      'Advanced technical + Int. Governance',
      'Intensive Digital PR',
      'Advanced AI Overviews tracking'
    ],
    linkbuildingRange: [800, 2000]
  }
];
