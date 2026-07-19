import { type HTMLAttributes } from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Иконка слева от текста. */
  icon?: LucideIcon;
}

export function Badge({ icon: Icon, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'border-brand/20 bg-brand/10 inline-flex h-[22px] items-center gap-1 rounded-sm border px-2',
        'text-brand text-[11px] font-semibold tracking-wide uppercase',
        className,
      )}
      {...props}
    >
      {Icon ? <Icon className="size-3" aria-hidden /> : null}
      {children}
    </span>
  );
}
