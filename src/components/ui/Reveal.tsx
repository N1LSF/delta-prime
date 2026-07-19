'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface RevealProps {
  children: ReactNode;
  /** Задержка появления, сек — для стаггера элементов. */
  delay?: number;
  /** Классы обёртки (можно передавать grid/flex — анимируется весь контейнер). */
  className?: string;
}

/**
 * Появление контента при попадании во вьюпорт: лёгкий fade + slide-up.
 * Срабатывает один раз. Паттерн согласован с useInView в B2BTrust.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}
