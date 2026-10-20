export default {
  name: 'Consultant Analytics',
  person: 'Alexandre Cottret',
  domain: 'https://consultant-analytics.fr',
  email: 'cottret.alexandre@hotmail.fr',
  calendar: 'https://calendly.com/alexandre-cottret/votre-projet-web',
  linkedin: 'https://www.linkedin.com/in/alexandre-cottret-designer-web/',
  portfolio: 'https://www.trend-design.fr/',
  // Leave null until the owner has confirmed pricing, tax treatment and scope.
  prices: { audit: null, setup: null, dashboard: null },
  indexable: process.env.SITE_INDEXABLE === 'true',
};
