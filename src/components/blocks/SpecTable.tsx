import type { EquipmentSpec } from '@/types';

export interface SpecTableProps {
  specs: EquipmentSpec[];
}

export function SpecTable({ specs }: SpecTableProps) {
  if (specs.length === 0) return null;

  return (
    <dl className="border-border divide-border divide-y overflow-hidden rounded-md border">
      {specs.map((spec) => (
        <div
          key={spec.label}
          className="bg-surface odd:bg-surface-2 flex items-center justify-between gap-4 px-4 py-2.5"
        >
          <dt className="text-text-subtle text-xs font-medium tracking-wide uppercase">
            {spec.label}
          </dt>
          <dd className="text-ink text-sm font-bold tabular-nums">
            {spec.value}
            {spec.unit ? (
              <span className="text-text-muted ml-1 font-medium">{spec.unit}</span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
