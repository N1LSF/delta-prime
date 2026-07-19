import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Объединяет классы через clsx и разрешает конфликты Tailwind через twMerge.
 * Использование: cn('px-2', condition && 'px-4') → 'px-4'.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
