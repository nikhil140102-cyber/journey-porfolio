import type { MetadataRoute } from 'next';
import { projects, site } from '@/lib/content';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, priority: 1 },
    ...projects.map((p) => ({ url: `${site.url}/work/${p.slug}`, priority: 0.7 })),
  ];
}
