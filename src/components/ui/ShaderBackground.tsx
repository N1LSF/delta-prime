'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/cn';

// Шейдер — WebGL-канвас, грузим только на клиенте (без SSR).
const Dithering = dynamic(
  () => import('@paper-design/shaders-react').then((m) => m.Dithering),
  { ssr: false },
);

export interface ShaderBackgroundProps {
  /** Доп. классы корневого слоя. */
  className?: string;
  /** Светлый scrim поверх фона для читабельности текста. По умолчанию включён. */
  overlay?: boolean;
  overlayClassName?: string;
}

/**
 * Анимированный фон «чертёж/контуры»: статичная blueprint-сетка (CSS) + плывущие
 * контуры (шейдер Dithering, форма wave). Деградация как у BackgroundMedia:
 *  - всегда виден градиент-фолбэк + сетка (в т.ч. на SSR/мобиле/reduced-motion);
 *  - шейдер монтируется только на десктопе (≥768px) и без prefers-reduced-motion;
 *  - библиотека сама ставит анимацию на паузу, когда вкладка скрыта.
 *
 * Слой абсолютный (inset-0, -z-10) — родитель должен быть relative + overflow-hidden.
 */
export function ShaderBackground({ className, overlay = true, overlayClassName }: ShaderBackgroundProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wideEnough = window.matchMedia('(min-width: 768px)').matches;
    setEnabled(!reduceMotion && wideEnough);
  }, []);

  return (
    <div
      className={cn('bg-media-fallback absolute inset-0 -z-10 overflow-hidden', className)}
      aria-hidden
    >
      {/* Техническая сетка (чертёж) */}
      <div className="bg-blueprint absolute inset-0" />

      {/* Плывущие контуры (шейдер) поверх сетки */}
      {enabled ? (
        <Dithering
          className="absolute inset-0 opacity-40"
          style={{ width: '100%', height: '100%' }}
          colorBack="rgba(0, 0, 0, 0)"
          colorFront="#1a6470"
          shape="wave"
          type="4x4"
          size={2}
          speed={0.6}
        />
      ) : null}

      {/* Светлый scrim для читабельности текста */}
      {overlay ? <div className={cn('hero-overlay absolute inset-0', overlayClassName)} /> : null}
    </div>
  );
}
