import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Подпись над полем. */
  label?: string;
  /** Ведущая иконка внутри поля. */
  icon?: LucideIcon;
  /** Сообщение об ошибке (включает error-стиль). */
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, icon: Icon, error, id, className, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hasError = Boolean(error);

  return (
    <div className="grid gap-1">
      {label ? (
        <label htmlFor={inputId} className="text-text text-xs font-semibold">
          {label}
        </label>
      ) : null}

      <div className="relative">
        {Icon ? (
          <span className="text-text-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
            <Icon className="size-4" aria-hidden />
          </span>
        ) : null}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={hasError || undefined}
          className={cn(
            'border-border bg-surface text-text h-10 w-full rounded-md border text-sm',
            'transition-[border-color,box-shadow] outline-none',
            'placeholder:text-text-subtle hover:border-text-subtle',
            'focus:border-brand focus:ring-ring focus:ring-4',
            'disabled:bg-surface-2 disabled:text-text-subtle disabled:cursor-not-allowed',
            Icon ? 'pl-9' : 'px-3',
            Icon && 'pr-3',
            hasError && 'border-error focus:border-error focus:ring-error/20',
            className,
          )}
          {...props}
        />
      </div>

      {error ? <p className="text-error text-xs">{error}</p> : null}
    </div>
  );
});
