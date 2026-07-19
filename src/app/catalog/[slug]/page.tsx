import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight, ShieldCheck, Truck } from 'lucide-react';
import type { Equipment } from '@/types';
import {
  equipmentCatalog,
  getCategoryTitle,
  getEquipmentBySlug,
  getEquipmentImage,
  getRelatedEquipment,
} from '@/lib/catalog';
import { formatPrice, rentalUnitLabel } from '@/lib/format';
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, SITE_URL } from '@/lib/seo';
import { Badge } from '@/components/ui/Badge';
import { SpecTable } from '@/components/blocks/SpecTable';
import { BookingPanel } from '@/components/blocks/BookingPanel';
import { EquipmentCard } from '@/components/blocks/EquipmentCard';
import { JsonLd } from '@/components/seo/JsonLd';

const AVAILABILITY_LABELS: Record<Equipment['availability'], string> = {
  in_stock: 'В наличии',
  with_operator: 'С экипажем',
  on_request: 'Под заказ',
};

// SSG: пререндерим страницу для каждой единицы техники.
export function generateStaticParams() {
  return equipmentCatalog.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const equipment = getEquipmentBySlug(slug);
  if (!equipment) return { title: 'Техника не найдена' };

  const pricePart =
    equipment.price.amount > 0
      ? `от ${formatPrice(equipment.price.amount)} ₽ за смену`
      : 'цена по запросу';

  const image = getEquipmentImage(equipment);

  return pageMetadata({
    title: equipment.name,
    description: equipment.description ?? `Аренда «${equipment.name}» — ${pricePart}.`,
    path: `/catalog/${equipment.slug}`,
    images: image ? [{ url: image, alt: equipment.name }] : undefined,
  });
}

export default async function EquipmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const equipment = getEquipmentBySlug(slug);
  if (!equipment) notFound();

  const categoryTitle = getCategoryTitle(equipment.categorySlug);
  const related = getRelatedEquipment(equipment.slug, equipment.categorySlug);
  const image = getEquipmentImage(equipment);

  // ——— Structured data (JSON-LD) ———
  const availabilitySchema =
    equipment.availability === 'on_request'
      ? 'https://schema.org/PreOrder'
      : 'https://schema.org/InStock';

  const productLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: equipment.name,
    category: categoryTitle,
    url: absoluteUrl(`/catalog/${equipment.slug}`),
    ...(equipment.description ? { description: equipment.description } : {}),
    ...(image ? { image: absoluteUrl(image) } : {}),
    ...(equipment.brand ? { brand: { '@type': 'Brand', name: equipment.brand } } : {}),
    ...(equipment.model ? { model: equipment.model } : {}),
    // Прокат: цену за смену раскрываем как Offer только когда она известна.
    ...(equipment.price.amount > 0
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'RUB',
            price: equipment.price.amount,
            availability: availabilitySchema,
            url: absoluteUrl(`/catalog/${equipment.slug}`),
            seller: { '@id': `${SITE_URL}/#organization` },
          },
        }
      : {}),
  };

  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'Главная', path: '/' },
    { name: 'Каталог', path: '/catalog' },
    { name: equipment.name, path: `/catalog/${equipment.slug}` },
  ]);

  // Колонки «Похожей техники» подстраиваем под число карточек, чтобы ряд
  // заполнялся ровно (2 карточки → 2 колонки, а не дырка в трёхколоночной сетке).
  const relatedGridClass =
    related.length >= 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2';

  return (
    <div className="mx-auto max-w-content px-4 pt-28 pb-16 sm:px-6 sm:pt-32 lg:px-8">
      <JsonLd data={productLd} />
      <JsonLd data={breadcrumbLd} />

      {/* Хлебные крошки */}
      <nav aria-label="Хлебные крошки" className="mb-8 flex flex-wrap items-center gap-1 text-sm">
        <Link href="/" className="text-text-muted hover:text-text transition-colors">
          Главная
        </Link>
        <ChevronRight className="text-text-subtle size-4" aria-hidden />
        <Link href="/catalog" className="text-text-muted hover:text-text transition-colors">
          Каталог
        </Link>
        <ChevronRight className="text-text-subtle size-4" aria-hidden />
        <span className="text-text">{equipment.name}</span>
      </nav>

      {/* Основной блок */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        {/* Левая колонка: фото + характеристики */}
        <div className="flex flex-col gap-8">
          {/* Фото */}
          <div className="border-border bg-surface-2 text-brand relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border">
            {image ? (
              <Image
                src={image}
                alt={equipment.name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <Truck className="size-20" aria-hidden />
            )}
          </div>

          {/* Характеристики */}
          <div className="flex flex-col gap-3">
            <h2 className="text-text text-lg font-bold">Характеристики</h2>
            <SpecTable specs={equipment.specs} />
          </div>
        </div>

        {/* Информация */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge icon={ShieldCheck}>{categoryTitle}</Badge>
            <span className="text-success inline-flex items-center gap-1 text-xs font-semibold">
              <ShieldCheck className="size-3.5" aria-hidden />
              {AVAILABILITY_LABELS[equipment.availability]}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-text text-3xl font-extrabold tracking-tight sm:text-4xl">
              {equipment.name}
            </h1>
            {equipment.brand ? (
              <p className="text-text-muted text-sm">
                {equipment.brand}
                {equipment.model ? ` · ${equipment.model}` : ''}
              </p>
            ) : null}
          </div>

          {equipment.description ? (
            <p className="text-text-muted">{equipment.description}</p>
          ) : null}

          <div className="border-border flex flex-col gap-1 border-y py-4">
            {equipment.price.amount > 0 ? (
              <>
                <div className="flex items-baseline gap-2">
                  {equipment.price.from ? (
                    <span className="text-text-muted text-sm font-medium">от</span>
                  ) : null}
                  <span className="text-brand text-4xl font-extrabold tracking-tight tabular-nums">
                    {formatPrice(equipment.price.amount)}
                  </span>
                  <span className="text-text-muted text-sm font-medium">
                    ₽ / {rentalUnitLabel(equipment.price.unit)}
                  </span>
                </div>
                {equipment.price.hourly ? (
                  <span className="text-text-muted text-sm">
                    {equipment.price.from ? 'от ' : ''}
                    {formatPrice(equipment.price.hourly)} ₽ / {rentalUnitLabel('hour')}
                  </span>
                ) : null}
              </>
            ) : (
              <span className="text-brand text-2xl font-bold">Цена по запросу</span>
            )}
          </div>

          <BookingPanel equipmentName={equipment.name} />
        </div>
      </div>

      {/* Похожее */}
      {related.length > 0 ? (
        <section className="pt-16">
          <h2 className="text-text mb-6 text-2xl font-bold tracking-tight">Похожая техника</h2>
          <div className={`grid grid-cols-1 gap-6 ${relatedGridClass}`}>
            {related.map((item) => (
              <EquipmentCard
                key={item.id}
                equipment={item}
                categoryTitle={getCategoryTitle(item.categorySlug)}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
