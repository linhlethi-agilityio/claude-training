import type { MetadataRoute } from 'next';

// Constants
import { ROUTES, SITE_URL } from '@/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const publicRoutes = [ROUTES.SIGN_IN, ROUTES.SIGN_UP];

  return publicRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
  }));
}
