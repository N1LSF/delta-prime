/**
 * Типы данных каталога спецтехники Delta Prime.
 * Структура выведена из блока «Карточка техники» в design-system.html:
 * изображение, badge-категория, статус наличия, название, цена ₽/смена, характеристики.
 */

/** Статус доступности единицы техники (pill в карточке). */
export type AvailabilityStatus =
  | 'in_stock' // «В наличии»
  | 'with_operator' // «С экипажем»
  | 'on_request'; // «Под заказ»

/** Единица измерения тарифа аренды. */
export type RentalUnit = 'shift' | 'hour' | 'day'; // смена / час / сутки

/** Категория техники (чипы-фильтры: Экскаваторы, Погрузчики, Краны, Самосвалы). */
export interface EquipmentCategory {
  /** Стабильный идентификатор. */
  id: string;
  /** URL-slug для SSG-маршрутов, напр. 'excavators'. */
  slug: string;
  /** Отображаемое название, напр. 'Экскаваторы'. */
  title: string;
  /** Имя иконки lucide, напр. 'truck'. */
  icon: string;
}

/** Одна техническая характеристика (строка в спецификации). */
export interface EquipmentSpec {
  /** Название параметра, напр. 'Глубина копания'. */
  label: string;
  /** Значение, напр. '7.6'. */
  value: string;
  /** Единица измерения, напр. 'м'. Опционально. */
  unit?: string;
}

/** Тариф аренды. */
export interface EquipmentPrice {
  /** Сумма в рублях за основную единицу (смену). 0 → «Цена по запросу». */
  amount: number;
  /** Валюта (на старте только рубли). */
  currency: 'RUB';
  /** За что считается основная цена, напр. 'shift' → '₽ / смена'. */
  unit: RentalUnit;
  /** Цена за 1 час в рублях (вторичный тариф). Опционально. */
  hourly?: number;
  /** Цена указана «от …» (диапазон). */
  from?: boolean;
}

/** Единица спецтехники — основная сущность каталога. */
export interface Equipment {
  /** Стабильный идентификатор. */
  id: string;
  /** URL-slug для страницы техники (SSG), напр. 'excavator-hitachi-zx330'. */
  slug: string;
  /** Полное название, напр. 'Экскаватор Hitachi ZX330'. */
  name: string;
  /** Производитель, напр. 'Hitachi'. */
  brand?: string;
  /** Модель, напр. 'ZX330'. */
  model?: string;
  /** Связь с категорией через EquipmentCategory.slug. */
  categorySlug: string;
  /** Тариф аренды. */
  price: EquipmentPrice;
  /** Статус наличия. */
  availability: AvailabilityStatus;
  /** Путь к основному изображению, напр. '/images/catalog/excavator-hitachi-zx330.jpg'. */
  image: string;
  /** Дополнительные изображения галереи. */
  gallery?: string[];
  /** Технические характеристики. */
  specs: EquipmentSpec[];
  /** Короткое описание для страницы/SEO. */
  description?: string;
  /** Флаг «рекомендуем» — для вывода на главной. */
  featured?: boolean;
}
