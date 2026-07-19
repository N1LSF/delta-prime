import { type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** HTML-тег обёртки (по умолчанию div). */
  as?: ElementType;
}

/**
 * Ограничитель ширины контента: full-width (max-w-page) + горизонтальные гаттеры.
 * Стоит внутри каждой секции, чтобы фоновые «ленты» были на всю ширину экрана,
 * а контент тянулся на весь экран с мягким пределом на ультравайдах.
 */
export function Container({ children, className, as: Tag = 'div' }: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </Tag>
  );
}
