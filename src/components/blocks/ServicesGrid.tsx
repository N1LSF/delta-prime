import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { services } from '@/data/services';

/**
 * Сетка услуг (flex-wrap с центровкой неполного ряда — 4 в ряд на lg, остаток
 * по центру). Если у услуги задано `image` — показываем фото (next/image),
 * иначе — icon-плейсхолдер (surface-2 + иконка).
 * Структура повторяет EquipmentCard, чтобы блоки выглядели единообразно.
 */
export function ServicesGrid() {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {services.map(({ slug, title, description, icon: Icon, href, image }) => (
        <Link
          key={slug}
          href={href}
          className="group border-border bg-surface hover:border-brand flex basis-full flex-col overflow-hidden rounded-lg border transition-colors sm:basis-[calc(50%-0.75rem)] lg:basis-[calc(25%-1.125rem)]"
        >
          {/* Фото или icon-плейсхолдер */}
          <div className="border-border bg-surface-2 text-brand relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <Icon
                className="size-10 transition-transform duration-300 group-hover:scale-105"
                aria-hidden
              />
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2 p-4">
            <h3 className="text-text flex items-start justify-between gap-2 text-base font-bold tracking-tight">
              {title}
              <ArrowUpRight
                className="text-text-subtle group-hover:text-brand size-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </h3>
            <p className="text-text-muted text-sm">{description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
