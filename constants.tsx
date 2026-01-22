
import React from 'react';
import { TierInfo } from './types';

export const TIERS: TierInfo[] = [
  {
    name: 'Starter Internacional',
    target: 'Proyecto pequeño / baja complejidad',
    setupRange: [1500, 1900],
    monthlyRange: [650, 1200],
    features: [
      '1–2 idiomas',
      'Plan de contenidos básico',
      '1–2 piezas/mes o 10-15 optimizaciones',
      'Tech + hreflang básico',
      'Reporting mensual estándar'
    ],
    linkbuildingRange: [200, 400]
  },
  {
    name: 'Growth Internacional',
    target: 'Proyecto medio / "Lo más vendible"',
    setupRange: [1800, 2400],
    monthlyRange: [1350, 1750],
    features: [
      '2–3 idiomas',
      '2 artículos/mes (replicables)',
      'Hasta 1 landing comercial/mes',
      'SEO IA (AIO, entidades, Q&A)',
      'On-page multidioma continuo',
      'Quick wins UX/CRO'
    ],
    linkbuildingRange: [300, 500]
  },
  {
    name: 'Enterprise Internacional',
    target: 'Alta complejidad / Multi-mercado',
    setupRange: [2500, 4500],
    monthlyRange: [2000, 4000],
    features: [
      '3+ idiomas/países',
      'Audit + benchmark multi-mercado',
      '4+ contenidos/mes o mix landings',
      'Gobernanza internacional (Guidelines)',
      'PR digital intensivo',
      'AI Overviews tracking'
    ],
    linkbuildingRange: [800, 2000]
  }
];
