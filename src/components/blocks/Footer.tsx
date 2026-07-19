import Image from 'next/image';
import Link from 'next/link';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { services } from '@/data/services';
import { OFFICES, PRIMARY_EMAIL, PRIMARY_PHONE, SOCIAL_LINKS, WORKING_HOURS } from '@/data/contacts';

const COMPANY_LINKS = [
  { label: 'Главная', href: '/' },
  { label: 'О компании', href: '/about' },
  { label: 'Каталог', href: '/catalog' },
];

export function Footer() {
  return (
    <footer className="bg-surface mt-auto">
      <div className="hazard-stripe h-1.5" aria-hidden />
      <div className="mx-auto grid max-w-content grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {/* Бренд */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="text-brand flex items-center gap-2 font-extrabold tracking-tight"
          >
            <Image
              src="/images/logo.svg"
              alt=""
              width={56}
              height={56}
              className="size-14"
              unoptimized
              aria-hidden
            />
            Delta Prime
          </Link>
          <p className="text-text-muted max-w-xs text-sm">
            Аренда спецтехники в Санкт-Петербурге и Ленинградской области: доставка на объект,
            негабаритная логистика и сервис под ключ.
          </p>
          <a
            href={PRIMARY_PHONE.href}
            className="text-text inline-flex items-center gap-2 text-sm font-semibold"
          >
            <Phone className="size-4" aria-hidden />
            {PRIMARY_PHONE.value}
          </a>
          <span className="text-text-muted inline-flex items-center gap-2 text-sm">
            <Clock className="size-4" aria-hidden />
            {WORKING_HOURS}
          </span>
          <a
            href={`mailto:${PRIMARY_EMAIL.value}`}
            className="text-text-muted hover:text-text inline-flex items-center gap-2 text-sm font-semibold transition-colors"
          >
            <Mail className="size-4" aria-hidden />
            {PRIMARY_EMAIL.value}
          </a>
          <div className="mt-1 flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="transition-opacity hover:opacity-80"
              >
                <Image src={social.icon} alt="" width={24} height={24} className="size-6" unoptimized aria-hidden />
              </a>
            ))}
          </div>
        </div>

        {/* О компании */}
        <nav className="flex flex-col gap-3">
          <h3 className="text-text-subtle text-xs font-semibold tracking-wide uppercase">
            О компании
          </h3>
          <ul className="flex flex-col gap-2">
            {COMPANY_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-text-muted hover:text-text text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Заказчикам */}
        <nav className="flex flex-col gap-3">
          <h3 className="text-text-subtle text-xs font-semibold tracking-wide uppercase">
            Заказчикам
          </h3>
          <ul className="flex flex-col gap-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={service.href}
                  className="text-text-muted hover:text-text text-sm transition-colors"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Офисы */}
        <div className="flex flex-col gap-3">
          <h3 className="text-text-subtle text-xs font-semibold tracking-wide uppercase">Офисы</h3>
          <ul className="flex flex-col gap-3">
            {OFFICES.map((office) => (
              <li
                key={office.city}
                className="text-text-muted inline-flex items-start gap-2 text-sm"
              >
                <MapPin className="text-brand mt-0.5 size-4 shrink-0" aria-hidden />
                <span>
                  <span className="text-text font-semibold">{office.city}</span>
                  <br />
                  {office.address}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-border border-t">
        <div className="text-text-subtle mx-auto flex max-w-content flex-col gap-2 px-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>© 2021–2026 Delta Prime · ИНН 7806588687 · ОГРН 1217800105819</span>
          <Link href="/about" className="hover:text-text transition-colors">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  );
}
