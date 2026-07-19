import { type ButtonHTMLAttributes } from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: LucideIcon;
}

export function Chip({ active, icon: Icon, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'inline-flex h-8 items-center gap-2 rounded-full border px-3 text-xs font-medium whitespace-nowrap transition-colors',
        active
          ? 'border-brand bg-brand/10 text-brand'
          : 'border-border bg-surface text-text-muted hover:border-text-subtle hover:text-text',
        className,
      )}
      {...props}
    >
      {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
      {children}
    </button>
  );
}
