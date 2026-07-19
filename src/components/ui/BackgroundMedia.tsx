'use client';

import { useEffect, useState } from 'react';
import { Film } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface BackgroundMediaProps {
  /** Картинка-постер/фолбэк (показывается всегда, если задана). */
  poster?: string;
  /** Видео MP4 (H.264). */
  videoSrc?: string;
  /** Видео WebM (опц., отдаётся первым как более лёгкое). */
  videoSrcWebm?: string;
  /** Затемняющий/осветляющий слой поверх медиа. По умолчанию включён. */
  overlay?: boolean;
  /** Доп. классы оверлея (например, своя сила/направление градиента). */
  overlayClassName?: string;
  /** Классы корневого слоя. */
  className?: string;
  /** Текст видимой подсказки-заглушки. Показывается, пока постер не загрузился
   *  (т.е. файла ещё нет), и исчезает, как только медиа появляется. */
  placeholder?: string;
}

/**
 * Переиспользуемый фоновый слой для секций: градиент-фолбэк → постер → видео → оверлей.
 *
 * Деградация по слоям:
 *  - всегда виден CSS-градиент (.bg-media-fallback), поэтому даже без ассетов секция
 *    выглядит осознанно, без «битой картинки»;
 *  - если задан `poster` — рисуется поверх градиента;
 *  - видео подключается только после монтирования, если не включён prefers-reduced-motion
 *    и ширина ≥ 768px;
 *  - если задан `placeholder` и постер ещё не загрузился — поверх показывается видимая
 *    подсказка (куда класть файл). Исчезает, когда файл появится.
 *
 * Слой абсолютный (inset-0) — родитель должен быть relative с overflow-hidden.
 */
export function BackgroundMedia({
  poster,
  videoSrc,
  videoSrcWebm,
  overlay = true,
  overlayClassName,
  className,
  placeholder,
}: BackgroundMediaProps) {
  const [enableVideo, setEnableVideo] = useState(false);
  // null — ещё не знаем; true — постер загрузился; false — постера нет/404.
  const [posterOk, setPosterOk] = useState<boolean | null>(poster ? null : false);

  useEffect(() => {
    if (!videoSrc && !videoSrcWebm) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wideEnough = window.matchMedia('(min-width: 768px)').matches;
    setEnableVideo(!reduceMotion && wideEnough);
  }, [videoSrc, videoSrcWebm]);

  const showPlaceholder = Boolean(placeholder) && posterOk === false;

  return (
    <div
      className={cn('bg-media-fallback absolute inset-0 -z-10 overflow-hidden', className)}
      aria-hidden
    >
      {poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          className="absolute inset-0 size-full object-cover"
          onLoad={() => setPosterOk(true)}
          onError={() => setPosterOk(false)}
        />
      ) : null}

      {enableVideo ? (
        <video
          className="absolute inset-0 size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
        >
          {videoSrcWebm ? <source src={videoSrcWebm} type="video/webm" /> : null}
          {videoSrc ? <source src={videoSrc} type="video/mp4" /> : null}
        </video>
      ) : null}

      {overlay ? (
        <div className={cn('hero-overlay absolute inset-0', overlayClassName)} />
      ) : null}

      {showPlaceholder ? (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="border-border text-text-muted bg-surface/70 flex max-w-sm flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-5 text-center text-sm backdrop-blur-sm">
            <Film className="text-brand size-6" aria-hidden />
            <span>{placeholder}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
