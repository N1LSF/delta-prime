'use client';

import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { buttonClasses, type ButtonSize, type ButtonVariant } from '@/components/ui/buttonStyles';

export type { ButtonVariant, ButtonSize };

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Растянуть на всю ширину контейнера. */
  fullWidth?: boolean;
  /**
   * Содержимое кнопки. Иконки передавайте элементом (напр. <Search className="size-4" />),
   * а не компонентом-функцией — так проп безопасно пересекает границу server→client.
   */
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  const isGhost = variant === 'ghost';

  return (
    <motion.button
      whileHover={isGhost ? undefined : { y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    >
      {children}
      {isGhost ? (
        <ArrowRight
          className="size-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
          aria-hidden
        />
      ) : null}
    </motion.button>
  );
}
