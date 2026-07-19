'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { BookingForm } from '@/components/blocks/BookingForm';

export interface BookingPanelProps {
  equipmentName: string;
}

/**
 * Кнопка «Забронировать» и форма заявки — одно место в карточке товара.
 * По умолчанию форма скрыта (виден CTA). По клику интерфейс на месте
 * сменяется формой; «Назад» возвращает CTA. Так форма не занимает место
 * и не «улетает» отдельной секцией вниз.
 */
export function BookingPanel({ equipmentName }: BookingPanelProps) {
  const [open, setOpen] = useState(false);

  const transition = { duration: 0.2, ease: 'easeOut' } as const;
  const motionProps = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8 },
    transition,
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {open ? (
        <motion.div key="form" {...motionProps} className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-text-muted hover:text-text inline-flex items-center gap-1.5 self-start text-sm font-medium transition-colors"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Назад
          </button>
          <BookingForm equipmentName={equipmentName} />
        </motion.div>
      ) : (
        <motion.div key="cta" {...motionProps} className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setOpen(true)}
            className="sm:flex-1"
          >
            <ShieldCheck className="size-4 shrink-0" aria-hidden />
            Забронировать
          </Button>
          <Link
            href="/catalog"
            className={buttonClasses({ variant: 'secondary', size: 'lg', className: 'sm:flex-1' })}
          >
            Назад в каталог
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
