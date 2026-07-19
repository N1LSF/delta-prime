import type { RentalUnit } from '@/types';

const priceFormatter = new Intl.NumberFormat('ru-RU');

/** Форматирует сумму в рублёвую запись с разрядами: 32500 → "32 500". */
export function formatPrice(amount: number): string {
  return priceFormatter.format(amount);
}

const RENTAL_UNIT_LABELS: Record<RentalUnit, string> = {
  shift: 'смена',
  hour: 'час',
  day: 'сутки',
};

/** Возвращает русскую подпись единицы аренды: 'shift' → 'смена'. */
export function rentalUnitLabel(unit: RentalUnit): string {
  return RENTAL_UNIT_LABELS[unit];
}
