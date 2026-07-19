import type { MetadataRoute } from 'next';
import { equipmentCatalog } from '@/lib/catalog';
import { absoluteUrl } from '@/lib/seo';

// Пререндерится в /sitemap.xml при build: статические маршруты + все карточки техники.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/catalog'), changeFrequency: 'daily', priority: 0.9 },
    { url: absoluteUrl('/about'), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const equipmentRoutes: MetadataRoute.Sitemap = equipmentCatalog.map((item) => ({
    url: absoluteUrl(`/catalog/${item.slug}`),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...equipmentRoutes];
}
