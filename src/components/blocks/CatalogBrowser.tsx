'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, PackageOpen, Search, SlidersHorizontal, X } from 'lucide-react';
import type { AvailabilityStatus, Equipment, EquipmentCategory } from '@/types';
import { cn } from '@/lib/cn';
import { formatPrice } from '@/lib/format';
import {
  deriveSpecFacets,
  matchesSpecFilters,
  type SpecFilter,
} from '@/lib/catalogFacets';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EquipmentCard } from '@/components/blocks/EquipmentCard';

type SortKey = 'popular' | 'price-asc' | 'price-desc';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'popular', label: 'По популярности' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'price-desc', label: 'Сначала дороже' },
];

const AVAILABILITY_OPTIONS: { value: AvailabilityStatus; label: string }[] = [
  { value: 'in_stock', label: 'В наличии' },
  { value: 'with_operator', label: 'С экипажем' },
  { value: 'on_request', label: 'Под заказ' },
];

export interface CatalogBrowserProps {
  equipment: Equipment[];
  categories: EquipmentCategory[];
}

function parseInput(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const n = Number(trimmed.replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

export function CatalogBrowser({ equipment, categories }: CatalogBrowserProps) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');
  const [category, setCategory] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Set<AvailabilityStatus>>(new Set());
  const [brands, setBrands] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [specFilters, setSpecFilters] = useState<Map<string, SpecFilter>>(new Map());
  const [sort, setSort] = useState<SortKey>('popular');
  const [mobileOpen, setMobileOpen] = useState(false);

  const categoryTitleBySlug = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of categories) map.set(c.slug, c.title);
    return map;
  }, [categories]);

  // ——— Предикаты фильтров ———
  const priceBounds = useMemo(
    () => ({ min: parseInput(priceMin), max: parseInput(priceMax) }),
    [priceMin, priceMax],
  );

  const predicates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return {
      query: (i: Equipment) =>
        normalizedQuery === '' ||
        i.name.toLowerCase().includes(normalizedQuery) ||
        (i.brand?.toLowerCase().includes(normalizedQuery) ?? false) ||
        (categoryTitleBySlug.get(i.categorySlug)?.toLowerCase().includes(normalizedQuery) ?? false),
      category: (i: Equipment) => category === null || i.categorySlug === category,
      availability: (i: Equipment) => availability.size === 0 || availability.has(i.availability),
      brand: (i: Equipment) => brands.size === 0 || (i.brand !== undefined && brands.has(i.brand)),
      price: (i: Equipment) => {
        if (priceBounds.min === null && priceBounds.max === null) return true;
        if (i.price.amount <= 0) return false; // «по запросу» — без цены
        if (priceBounds.min !== null && i.price.amount < priceBounds.min) return false;
        if (priceBounds.max !== null && i.price.amount > priceBounds.max) return false;
        return true;
      },
      specs: (i: Equipment) => matchesSpecFilters(i, specFilters),
    };
  }, [query, category, availability, brands, priceBounds, specFilters, categoryTitleBySlug]);

  // Фильтрация с возможностью пропустить одну ось (для счётчиков фасетов).
  const applyFilters = useMemo(() => {
    return (skip?: keyof typeof predicates) =>
      equipment.filter((i) => {
        if (skip !== 'query' && !predicates.query(i)) return false;
        if (skip !== 'category' && !predicates.category(i)) return false;
        if (skip !== 'availability' && !predicates.availability(i)) return false;
        if (skip !== 'brand' && !predicates.brand(i)) return false;
        if (skip !== 'price' && !predicates.price(i)) return false;
        if (skip !== 'specs' && !predicates.specs(i)) return false;
        return true;
      });
  }, [equipment, predicates]);

  const results = useMemo(() => {
    const list = applyFilters();
    const sorted = [...list];
    if (sort === 'price-asc' || sort === 'price-desc') {
      sorted.sort((a, b) => {
        // «по запросу» (amount 0) всегда в конце.
        const av = a.price.amount > 0 ? a.price.amount : Infinity;
        const bv = b.price.amount > 0 ? b.price.amount : Infinity;
        return sort === 'price-asc' ? av - bv : bv - av;
      });
    }
    return sorted;
  }, [applyFilters, sort]);

  // ——— Счётчики фасетов (с учётом прочих активных фильтров) ———
  const categoryCounts = useMemo(() => {
    const base = applyFilters('category');
    const map = new Map<string, number>();
    for (const i of base) map.set(i.categorySlug, (map.get(i.categorySlug) ?? 0) + 1);
    return map;
  }, [applyFilters]);

  const availabilityCounts = useMemo(() => {
    const base = applyFilters('availability');
    const map = new Map<AvailabilityStatus, number>();
    for (const i of base) map.set(i.availability, (map.get(i.availability) ?? 0) + 1);
    return map;
  }, [applyFilters]);

  const brandOptions = useMemo(() => {
    const base = applyFilters('brand');
    const map = new Map<string, number>();
    for (const i of base) {
      if (!i.brand) continue;
      map.set(i.brand, (map.get(i.brand) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }, [applyFilters]);

  // ——— Контекстные фасеты выбранной категории ———
  const specFacets = useMemo(() => {
    if (category === null) return [];
    return deriveSpecFacets(equipment.filter((i) => i.categorySlug === category));
  }, [equipment, category]);

  const specCountBase = useMemo(() => applyFilters('specs'), [applyFilters]);

  const totalCount = applyFilters('category').length; // «Все категории» = всё, что проходит прочие фильтры

  const activeCount =
    (category !== null ? 1 : 0) +
    availability.size +
    brands.size +
    (priceBounds.min !== null || priceBounds.max !== null ? 1 : 0) +
    specFilters.size;

  // ——— Действия ———
  function selectCategory(slug: string | null) {
    setCategory(slug);
    setSpecFilters(new Map()); // параметры зависят от категории — сбрасываем
  }

  function toggleAvailability(value: AvailabilityStatus) {
    setAvailability((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  function toggleBrand(value: string) {
    setBrands((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  function toggleSpecValue(label: string, value: string) {
    setSpecFilters((prev) => {
      const next = new Map(prev);
      const current = next.get(label);
      const values = new Set(current?.kind === 'set' ? current.values : []);
      if (values.has(value)) values.delete(value);
      else values.add(value);
      if (values.size === 0) next.delete(label);
      else next.set(label, { kind: 'set', values });
      return next;
    });
  }

  function setSpecRange(label: string, which: 'min' | 'max', raw: string) {
    setSpecFilters((prev) => {
      const next = new Map(prev);
      const current = next.get(label);
      const base =
        current?.kind === 'range' ? current : { kind: 'range' as const, min: null, max: null };
      const updated = { ...base, [which]: parseInput(raw) };
      if (updated.min === null && updated.max === null) next.delete(label);
      else next.set(label, updated);
      return next;
    });
  }

  function resetFilters() {
    setCategory(null);
    setAvailability(new Set());
    setBrands(new Set());
    setPriceMin('');
    setPriceMax('');
    setSpecFilters(new Map());
  }

  // ——— Сайдбар (рендерится для десктопа и для мобильной панели) ———
  const filters = (
    <div className="flex flex-col gap-1">
      <FilterGroup title="Категории" defaultOpen>
        <ul className="flex flex-col">
          <RadioRow
            label="Все категории"
            checked={category === null}
            count={totalCount}
            onChange={() => selectCategory(null)}
          />
          {categories.map((c) => (
            <RadioRow
              key={c.slug}
              label={c.title}
              checked={category === c.slug}
              count={categoryCounts.get(c.slug) ?? 0}
              onChange={() => selectCategory(c.slug)}
            />
          ))}
        </ul>
      </FilterGroup>

      {specFacets.length > 0 ? (
        <FilterGroup title="Параметры" defaultOpen>
          <div className="flex flex-col gap-4">
            {specFacets.map((facet) => {
              if (facet.kind === 'range') {
                const current = specFilters.get(facet.label);
                const range = current?.kind === 'range' ? current : null;
                return (
                  <div key={facet.label} className="flex flex-col gap-1.5">
                    <span className="text-text text-xs font-semibold">
                      {facet.label}
                      {facet.unit ? (
                        <span className="text-text-subtle font-normal">, {facet.unit}</span>
                      ) : null}
                    </span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        inputMode="decimal"
                        aria-label={`${facet.label} от`}
                        placeholder={`от ${formatPrice(Math.floor(facet.min))}`}
                        value={range?.min ?? ''}
                        onChange={(e) => setSpecRange(facet.label, 'min', e.target.value)}
                      />
                      <Input
                        type="number"
                        inputMode="decimal"
                        aria-label={`${facet.label} до`}
                        placeholder={`до ${formatPrice(Math.ceil(facet.max))}`}
                        value={range?.max ?? ''}
                        onChange={(e) => setSpecRange(facet.label, 'max', e.target.value)}
                      />
                    </div>
                  </div>
                );
              }
              const current = specFilters.get(facet.label);
              const selected = current?.kind === 'set' ? current.values : new Set<string>();
              return (
                <div key={facet.label} className="flex flex-col gap-1">
                  <span className="text-text mb-1 text-xs font-semibold">{facet.label}</span>
                  <ul className="flex flex-col">
                    {facet.values.map((value) => {
                      const count = specCountBase.filter(
                        (i) =>
                          i.categorySlug === category &&
                          i.specs.some((s) => s.label === facet.label && s.value.trim() === value),
                      ).length;
                      return (
                        <CheckRow
                          key={value}
                          label={value}
                          checked={selected.has(value)}
                          count={count}
                          onChange={() => toggleSpecValue(facet.label, value)}
                        />
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </FilterGroup>
      ) : category === null ? (
        <p className="text-text-subtle border-border border-t px-1 py-3 text-xs">
          Выберите категорию, чтобы уточнить параметры техники.
        </p>
      ) : null}

      <FilterGroup title="Цена за смену, ₽" defaultOpen>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            inputMode="numeric"
            aria-label="Цена от"
            placeholder="от"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
          />
          <Input
            type="number"
            inputMode="numeric"
            aria-label="Цена до"
            placeholder="до"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
          />
        </div>
      </FilterGroup>

      <FilterGroup title="Наличие" defaultOpen>
        <ul className="flex flex-col">
          {AVAILABILITY_OPTIONS.map((opt) => (
            <CheckRow
              key={opt.value}
              label={opt.label}
              checked={availability.has(opt.value)}
              count={availabilityCounts.get(opt.value) ?? 0}
              onChange={() => toggleAvailability(opt.value)}
            />
          ))}
        </ul>
      </FilterGroup>

      {brandOptions.length > 1 ? (
        <FilterGroup title="Бренд" defaultOpen={false}>
          <CollapsibleList limit={8}>
            {brandOptions.map((b) => (
              <CheckRow
                key={b.name}
                label={b.name}
                checked={brands.has(b.name)}
                count={b.count}
                onChange={() => toggleBrand(b.name)}
              />
            ))}
          </CollapsibleList>
        </FilterGroup>
      ) : null}

      {activeCount > 0 ? (
        <button
          type="button"
          onClick={resetFilters}
          className="text-brand hover:text-brand-700 mt-3 inline-flex items-center gap-1.5 self-start text-sm font-semibold transition-colors"
        >
          <X className="size-4" aria-hidden />
          Сбросить фильтры ({activeCount})
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
      {/* Десктоп-сайдбар */}
      <aside className="hidden lg:block lg:w-64 lg:shrink-0">
        <div className="sticky top-24">{filters}</div>
      </aside>

      {/* Правая колонка */}
      <div className="min-w-0 flex-1">
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="sm:max-w-sm sm:flex-1">
              <Input
                icon={Search}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по названию или бренду…"
                aria-label="Поиск техники"
              />
            </div>

            {/* Кнопка фильтров (мобайл) */}
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <SlidersHorizontal className="size-4 shrink-0" aria-hidden />
              Фильтры{activeCount > 0 ? ` (${activeCount})` : ''}
            </Button>

            <div className="relative sm:ml-auto sm:w-56">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Сортировка"
                className="border-border bg-surface text-text hover:border-text-subtle focus:border-brand focus:ring-ring h-10 w-full appearance-none rounded-md border pr-9 pl-3 text-sm transition-[border-color,box-shadow] outline-none focus:ring-4"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="text-text-muted pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
                aria-hidden
              />
            </div>
          </div>

          <p className="text-text-muted text-sm">
            Найдено: <span className="text-text font-semibold tabular-nums">{results.length}</span>
          </p>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((item) => (
              <EquipmentCard
                key={item.id}
                equipment={item}
                categoryTitle={categoryTitleBySlug.get(item.categorySlug) ?? item.categorySlug}
              />
            ))}
          </div>
        ) : (
          <div className="border-border bg-surface flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-16 text-center">
            <PackageOpen className="text-text-subtle size-10" aria-hidden />
            <p className="text-text text-base font-semibold">Ничего не найдено</p>
            <p className="text-text-muted max-w-sm text-sm">
              Попробуйте изменить запрос или сбросить часть фильтров.
            </p>
            {activeCount > 0 ? (
              <Button variant="secondary" size="sm" onClick={resetFilters}>
                Сбросить фильтры
              </Button>
            ) : null}
          </div>
        )}
      </div>

      {/* Мобильная панель фильтров */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="bg-bg absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col">
            <div className="border-border flex items-center justify-between border-b px-4 py-3">
              <span className="text-text font-bold">Фильтры</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Закрыть фильтры"
                className="border-border text-text inline-flex size-9 items-center justify-center rounded-md border"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">{filters}</div>
            <div className="border-border border-t p-4">
              <Button variant="primary" size="md" fullWidth onClick={() => setMobileOpen(false)}>
                Показать {results.length}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ——————————————————— Презентационные части ———————————————————

function FilterGroup({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-border border-b py-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="text-text flex w-full items-center justify-between gap-2 text-sm font-semibold"
      >
        {title}
        <ChevronDown
          className={cn('text-text-muted size-4 transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </button>
      {open ? <div className="pt-3">{children}</div> : null}
    </div>
  );
}

function CheckRow({
  label,
  checked,
  count,
  onChange,
}: {
  label: string;
  checked: boolean;
  count?: number;
  onChange: () => void;
}) {
  return (
    <li>
      <label className="group flex cursor-pointer items-center gap-2 py-1.5 text-sm">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="border-border text-brand focus:ring-ring size-4 shrink-0 rounded-sm border accent-[var(--brand)]"
        />
        <span className="text-text-muted group-hover:text-text min-w-0 flex-1 truncate transition-colors">
          {label}
        </span>
        {count !== undefined ? (
          <span className="text-text-subtle text-xs tabular-nums">{count}</span>
        ) : null}
      </label>
    </li>
  );
}

function RadioRow({
  label,
  checked,
  count,
  onChange,
}: {
  label: string;
  checked: boolean;
  count?: number;
  onChange: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onChange}
        aria-pressed={checked}
        className={cn(
          'flex w-full items-center gap-2 py-1.5 text-left text-sm transition-colors',
          checked ? 'text-brand font-semibold' : 'text-text-muted hover:text-text',
        )}
      >
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {count !== undefined ? <span className="text-text-subtle text-xs tabular-nums">{count}</span> : null}
      </button>
    </li>
  );
}

function CollapsibleList({ children, limit }: { children: ReactNode[]; limit: number }) {
  const [expanded, setExpanded] = useState(false);
  const items = Array.isArray(children) ? children : [children];
  const visible = expanded ? items : items.slice(0, limit);
  return (
    <div className="flex flex-col">
      <ul className="flex flex-col">{visible}</ul>
      {items.length > limit ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-brand hover:text-brand-700 mt-1 self-start text-xs font-semibold transition-colors"
        >
          {expanded ? 'Свернуть' : `Показать все (${items.length})`}
        </button>
      ) : null}
    </div>
  );
}
