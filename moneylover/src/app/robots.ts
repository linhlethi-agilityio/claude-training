import type { MetadataRoute } from 'next';

// Constants
import { ROUTES, SITE_URL } from '@/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [ROUTES.SIGN_IN, ROUTES.SIGN_UP],
      disallow: [ROUTES.DASHBOARD, ROUTES.TRANSACTIONS, ROUTES.CATEGORIES, ROUTES.ONBOARDING],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
