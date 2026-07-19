import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Truck } from 'lucide-react';
import type { Equipment } from '@/types';
import { getEquipmentImage } from '@/lib/catalog';
import { formatPrice, rentalUnitLabel } from '@/lib/format';
import { Badge } from '@/components/ui/Badge';
import { buttonClasses } from '@/components/ui/buttonStyles';

export interface EquipmentCardProps {
  equipment: Equipment;
  categoryTitle: string;
}

const AVAILABILITY_LABELS: Record<Equipment['availability'], string> = {
  in_stock: 'В наличии',
  with_operator: 'С экипажем',
  on_request: 'Под заказ',
};

export function EquipmentCard({ equipment, categoryTitle }: EquipmentCardProps) {
  const { slug, name, price, availability } = equipment;
  const href = `/catalog/${slug}`;
  const image = getEquipmentImage(equipment);

  return (
    <article className="group border-border bg-surface hover:border-brand flex flex-col overflow-hidden rounded-md border transition-[color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-elev-2">
      {/* Фото техники или icon-плейсхолдер (ссылка) */}
      <Link
        href={href}
        aria-label={name}
        className="border-border bg-surface-2 text-brand relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b"
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Truck
            className="size-10 transition-transform duration-300 group-hover:scale-105"
            aria-hidden
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <Badge icon={ShieldCheck}>{categoryTitle}</Badge>
          <span className="text-success inline-flex items-center gap-1 text-[11px] font-semibold">
            <ShieldCheck className="size-3" aria-hidden />
            {AVAILABILITY_LABELS[availability]}
          </span>
        </div>

        <h3 className="text-text text-base leading-snug font-semibold">
          <Link href={href} className="hover:text-brand transition-colors">
            {name}
          </Link>
        </h3>

        <div className="mt-auto flex flex-col gap-0.5">
          {price.amount > 0 ? (
            <>
              <div className="flex items-baseline gap-1.5">
                {price.from ? (
                  <span className="text-text-muted text-xs font-medium">от</span>
                ) : null}
                <span className="text-brand text-[26px] leading-none font-extrabold tracking-tight tabular-nums">
                  {formatPrice(price.amount)}
                </span>
                <span className="text-text-muted text-xs font-medium">
                  ₽ / {rentalUnitLabel(price.unit)}
                </span>
              </div>
              {price.hourly ? (
                <span className="text-text-muted text-xs">
                  {price.from ? 'от ' : ''}
                  {formatPrice(price.hourly)} ₽ / {rentalUnitLabel('hour')}
                </span>
              ) : null}
            </>
          ) : (
            <span className="text-brand text-lg leading-none font-bold">Цена по запросу</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`${href}#booking`}
            className={buttonClasses({ variant: 'primary', size: 'sm' })}
          >
            <ShieldCheck className="size-4 shrink-0" aria-hidden />
            Бронь
          </Link>
          <Link href={href} className={buttonClasses({ variant: 'secondary', size: 'sm' })}>
            Подробнее
          </Link>
        </div>
      </div>
    </article>
  );
}
