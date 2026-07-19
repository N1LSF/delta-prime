import type { Equipment, EquipmentSpec } from '@/types';

/**
 * Контекстные фасеты каталога: фильтры под конкретную категорию, выведенные
 * автоматически из характеристик техники (`Equipment.specs`).
 *
 * Характеристики хранятся свободным текстом, но внутри одной категории ярлыки
 * (`label`) консистентны, поэтому из них можно собрать осмысленные фильтры:
 *  - числовые значения → фасет-диапазон («от/до»);
 *  - небольшой набор текстовых значений → фасет-набор (чекбоксы);
 *  - «шумные» ярлыки (почти у каждого своё значение, напр. составные габариты) — пропускаем.
 */

/** Числовой интервал значения спека (точка → lo === hi). */
export interface SpecInterval {
  lo: number;
  hi: number;
}

export type SpecFacet =
  | { kind: 'range'; label: string; unit?: string; min: number; max: number }
  | { kind: 'set'; label: string; unit?: string; values: string[] };

export type SpecFilter =
  | { kind: 'range'; min: number | null; max: number | null }
  | { kind: 'set'; values: Set<string> };

const RANGE_FACET_MIN_RATIO = 0.6; // доля числовых значений, чтобы считать фасет диапазоном
const SET_FACET_MAX_VALUES = 6; // максимум уникальных значений для дискретного фасета

/**
 * Парсит строковое значение характеристики в числовой интервал.
 * Понимает: «33», «0,81», «0.81–1.17», «до 600», «от 150». Возвращает null,
 * если это не число (напр. «гусеничный», «6×6», составные габариты «8720×2540×3100»).
 */
export function parseSpecNumber(raw: string): SpecInterval | null {
  const value = raw.trim().toLowerCase().replace(/,/g, '.');
  // Составные значения (габариты, формулы) — не числовой фасет.
  if (/[x×]/.test(value)) return null;

  const numbers = value.match(/\d+(?:\.\d+)?/g);
  if (!numbers || numbers.length === 0) return null;

  const parsed = numbers.map(Number).filter((n) => Number.isFinite(n));
  if (parsed.length === 0) return null;

  const lo = Math.min(...parsed);
  const hi = Math.max(...parsed);

  // «до N» → [0, N]; явный диапазон/список → [min, max]; одиночное → точка.
  if (/^до\b/.test(value)) return { lo: 0, hi };
  return { lo, hi };
}

function getSpecValue(item: Equipment, label: string): string | undefined {
  const spec = item.specs.find((s: EquipmentSpec) => s.label === label);
  const value = spec?.value?.trim();
  return value ? value : undefined;
}

/** Строит список контекстных фасетов из набора техники (обычно одной категории). */
export function deriveSpecFacets(items: Equipment[]): SpecFacet[] {
  // Сохраняем порядок первого появления ярлыка.
  const order: string[] = [];
  const byLabel = new Map<string, { values: string[]; unit?: string }>();

  for (const item of items) {
    for (const spec of item.specs) {
      const value = spec.value?.trim();
      if (!value) continue;
      let entry = byLabel.get(spec.label);
      if (!entry) {
        entry = { values: [], unit: spec.unit?.trim() || undefined };
        byLabel.set(spec.label, entry);
        order.push(spec.label);
      }
      entry.values.push(value);
    }
  }

  const facets: SpecFacet[] = [];

  for (const label of order) {
    const entry = byLabel.get(label)!;
    // Ярлык должен встречаться хотя бы у двух единиц, иначе фильтровать нечего.
    if (entry.values.length < 2) continue;

    const intervals = entry.values.map(parseSpecNumber);
    const numericCount = intervals.filter((i): i is SpecInterval => i !== null).length;

    if (numericCount / entry.values.length >= RANGE_FACET_MIN_RATIO) {
      let min = Infinity;
      let max = -Infinity;
      for (const interval of intervals) {
        if (!interval) continue;
        if (interval.lo < min) min = interval.lo;
        if (interval.hi > max) max = interval.hi;
      }
      if (max > min) {
        facets.push({ kind: 'range', label, unit: entry.unit, min, max });
      }
      continue;
    }

    const distinct = Array.from(new Set(entry.values));
    if (distinct.length >= 2 && distinct.length <= SET_FACET_MAX_VALUES) {
      facets.push({
        kind: 'set',
        label,
        unit: entry.unit,
        values: distinct.sort((a, b) => a.localeCompare(b, 'ru')),
      });
    }
    // Иначе ярлык «шумный» — пропускаем.
  }

  return facets;
}

/** Проверяет, проходит ли единица техники активные контекстные фильтры. */
export function matchesSpecFilters(
  item: Equipment,
  specFilters: Map<string, SpecFilter>,
): boolean {
  for (const [label, filter] of specFilters) {
    const raw = getSpecValue(item, label);

    if (filter.kind === 'set') {
      if (filter.values.size === 0) continue;
      if (!raw || !filter.values.has(raw)) return false;
      continue;
    }

    // range
    if (filter.min === null && filter.max === null) continue;
    if (!raw) return false;
    const interval = parseSpecNumber(raw);
    if (!interval) return false;
    if (filter.min !== null && interval.hi < filter.min) return false;
    if (filter.max !== null && interval.lo > filter.max) return false;
  }
  return true;
}
