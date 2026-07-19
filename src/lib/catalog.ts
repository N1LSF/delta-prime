import type { Equipment, EquipmentCategory } from '@/types';
import categoriesData from '@/data/catalog/categories.json';
import equipmentData from '@/data/catalog/equipment.json';

// JSON-импорты типизируются широко (unit: string), приводим к доменному типу.
export const categories = categoriesData as EquipmentCategory[];

export const equipmentCatalog = equipmentData as Equipment[];

/** Список техники для блока «Популярное». */
export const featuredEquipment: Equipment[] = equipmentCatalog.filter((item) => item.featured);

/**
 * Путь к фото техники. У единицы без фото поле `image` не задано → undefined → icon-плейсхолдер
 * (иначе next/image отдал бы битую картинку). Добавить фото: положить public/images/catalog/<slug>.jpg
 * и прописать этот путь в `image` карточки.
 */
export function getEquipmentImage(equipment: Equipment): string | undefined {
  return equipment.image;
}

/** Возвращает название категории по slug (или сам slug, если не найдено). */
export function getCategoryTitle(slug: string): string {
  return categories.find((category) => category.slug === slug)?.title ?? slug;
}

/** Находит единицу техники по slug. */
export function getEquipmentBySlug(slug: string): Equipment | undefined {
  return equipmentCatalog.find((item) => item.slug === slug);
}

/** Похожая техника той же категории (исключая текущую). */
export function getRelatedEquipment(slug: string, categorySlug: string, limit = 3): Equipment[] {
  return equipmentCatalog
    .filter((item) => item.slug !== slug && item.categorySlug === categorySlug)
    .slice(0, limit);
}
