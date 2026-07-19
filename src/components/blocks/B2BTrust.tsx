'use client';

import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion';

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const STATS: Stat[] = [
  { value: 10000, suffix: '+', label: 'перевезли тонн' },
  { value: 3000, suffix: '+', label: 'выкопали км' },
  { value: 20, suffix: '+', label: 'единиц техники' },
  { value: 5, suffix: '+', label: 'лет на рынке' },
];

const counterFormatter = new Intl.NumberFormat('ru-RU');

function Counter({ to, active }: { to: number; active: boolean }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => counterFormatter.format(Math.round(latest)));

  useEffect(() => {
    if (!active) return;
    const controls = animate(count, to, { duration: 1.4, ease: 'easeOut' });
    return () => controls.stop();
  }, [active, to, count]);

  return <motion.span>{rounded}</motion.span>;
}

export function B2BTrust() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div
      ref={ref}
      className="border-border bg-border grid grid-cols-2 gap-px overflow-hidden rounded-lg border md:grid-cols-4"
    >
      {STATS.map((stat) => (
        <div key={stat.label} className="bg-surface flex flex-col gap-1 p-6">
          <p className="text-brand text-[40px] leading-none font-extrabold tracking-tight tabular-nums">
            <Counter to={stat.value} active={inView} />
            {stat.suffix}
          </p>
          <span className="text-text-muted text-sm font-medium">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
