export default {
  name: 'Consultant Analytics',
  person: 'Alexandre Cottret',
  domain: 'https://www.consultant-analytics.fr',
  email: 'cottret.alexandre@hotmail.fr',
  calendar: 'https://calendly.com/alexandre-cottret/diagnostic-tracking-30-min',
  linkedin: 'https://www.linkedin.com/in/alexandre-cottret-designer-web/',
  portfolio: 'https://www.trend-design.fr/',
  // ID de mesure GA4 de la propriété « Consultant analytics » (559859758), chargé seulement après consentement.
  measurementId: process.env.GA4_MEASUREMENT_ID || 'G-EMHNVQB9NN',
  // Leave null until the owner has confirmed pricing, tax treatment and scope.
  prices: { audit: null, setup: null, dashboard: null },
  indexable: process.env.SITE_INDEXABLE === 'true',
};
