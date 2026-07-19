import type { Metadata } from 'next';
import { Suspense } from 'react';
import { categories, equipmentCatalog } from '@/lib/catalog';
import { CatalogBrowser } from '@/components/blocks/CatalogBrowser';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Каталог спецтехники',
  description:
    'Каталог спецтехники Delta Prime: экскаваторы, погрузчики, краны и самосвалы. Поиск, фильтр и сортировка по цене.',
  path: '/catalog',
});

export default function CatalogPage() {
  return (
    <div className="mx-auto max-w-page px-4 pt-28 pb-16 sm:px-6 sm:pt-32 lg:px-8">
      <header className="border-border mb-8 flex flex-col gap-2 border-b pb-6">
        <span className="text-brand inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
          <span className="bg-accent-500 inline-block h-3 w-1 rounded-full" aria-hidden />
          Каталог
        </span>
        <h1 className="text-text text-3xl font-extrabold tracking-tight sm:text-4xl">
          Вся спецтехника
        </h1>
        <p className="text-text-muted max-w-2xl">
          Выберите категорию — слева появятся параметры под конкретную технику. Фильтруйте по
          наличию, цене и бренду, ищите по названию.
        </p>
      </header>

      <Suspense fallback={null}>
        <CatalogBrowser equipment={equipmentCatalog} categories={categories} />
      </Suspense>
    </div>
  );
}
