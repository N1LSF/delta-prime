import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // SSG-архитектура: статические маршруты App Router пререндерятся при `next build`.
  // Для полностью статического экспорта (без Node-сервера) на этапе деплоя можно включить:
  //   output: 'export',
  // и тогда добавить images.unoptimized: true. Сейчас оставляем гибкость (ISR / route handlers).
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
