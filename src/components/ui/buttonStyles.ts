import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-md font-bold uppercase tracking-wide leading-none whitespace-nowrap transition-[color,background-color,box-shadow,transform] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50';

export const buttonSizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[12px]',
  md: 'h-10 px-4 text-[13px]',
  lg: 'h-12 px-5 text-sm',
};

export const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-accent-500 text-on-accent shadow-elev-1 hover:bg-accent-600 hover:shadow-elev-2',
  secondary: 'border-2 border-brand bg-surface text-brand hover:bg-surface-2',
  ghost: 'group bg-transparent px-2 text-brand hover:text-brand-700',
};

export interface ButtonClassOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

/**
 * Композиция классов кнопки. Можно использовать в серверных компонентах
 * для стилизации next/link под кнопку: <Link className={buttonClasses({ variant: 'primary' })} />.
 */
export function buttonClasses({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
}: ButtonClassOptions = {}): string {
  return cn(
    buttonBase,
    buttonSizes[size],
    buttonVariants[variant],
    fullWidth && 'w-full',
    className,
  );
}
