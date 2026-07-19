'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Phone, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { PHONES, SOCIAL_LINKS } from '@/data/contacts';

const NAV_LINKS = [
  { label: 'Главная', href: '/' },
  { label: 'Каталог', href: '/catalog' },
  { label: 'О компании', href: '/about' },
];

/**
 * Один телефон в шапке, сменяется на следующий раз в 5 сек (плавный кроссфейд).
 * Пауза при наведении/фокусе — чтобы номер можно было прочитать и скопировать.
 * prefers-reduced-motion → статично показывает основной номер.
 */
function PhoneRotator({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % PHONES.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

  const phone = PHONES[index] ?? PHONES[0]!;

  return (
    <div
      className={cn('relative min-w-[168px] items-center justify-end', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.a
          key={phone.href}
          href={phone.href}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="text-text hover:text-brand inline-flex items-center gap-2 text-sm font-semibold tracking-tight tabular-nums transition-colors"
        >
          <Phone className="size-4 shrink-0" aria-hidden />
          {phone.value}
        </motion.a>
      </AnimatePresence>
    </div>
  );
}

/** Брендовые иконки-ссылки (MAX, Telegram). */
function SocialIcons({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {SOCIAL_LINKS.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className="transition-opacity hover:opacity-80"
        >
          <Image src={social.icon} alt="" width={20} height={20} className="size-5" unoptimized aria-hidden />
        </a>
      ))}
    </div>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Закрываем меню при смене маршрута.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-x-0 top-4 z-50 px-4"
    >
      <nav className="border-border bg-surface/70 mx-auto w-full max-w-content rounded-2xl border backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 px-4 py-2">
          {/* Логотип */}
          <Link
            href="/"
            className="text-brand flex items-center gap-2 font-extrabold tracking-tight"
            aria-label="Delta Prime — на главную"
          >
            <Image
              src="/images/logo.svg"
              alt=""
              width={40}
              height={40}
              className="size-10"
              priority
              unoptimized
              aria-hidden
            />
            Delta Prime
          </Link>

          {/* Десктоп-ссылки */}
          <ul className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isActive(pathname, link.href)
                      ? 'text-brand'
                      : 'text-text-muted hover:text-text',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Контакты + CTA + бургер */}
          <div className="flex items-center gap-2 sm:gap-3">
            <PhoneRotator className="hidden lg:flex" />
            <SocialIcons className="hidden sm:flex" />
            <Link
              href="/catalog"
              className={cn(
                buttonClasses({ variant: 'primary', size: 'sm' }),
                'hidden sm:inline-flex',
              )}
            >
              Каталог
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={open}
              className="border-border text-text inline-flex size-9 items-center justify-center rounded-md border md:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="overflow-hidden md:hidden"
            >
              <ul className="border-border flex flex-col gap-1 border-t px-4 py-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive(pathname, link.href)
                          ? 'bg-brand/10 text-brand'
                          : 'text-text-muted hover:bg-surface-2 hover:text-text',
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                {PHONES.map((phone) => (
                  <li key={phone.href} className="mt-1">
                    <a
                      href={phone.href}
                      className="text-text flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold tabular-nums"
                    >
                      {phone.value}
                    </a>
                  </li>
                ))}
                <li className="mt-2 px-3">
                  <SocialIcons />
                </li>
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
