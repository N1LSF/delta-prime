// Единый источник SEO-настроек: базовый URL, названия, дефолтные мета-строки,
// хелпер абсолютных ссылок и билдеры JSON-LD. Тянет NAP из data/contacts.ts,
// чтобы контакты не дублировались.

import type { Metadata } from 'next';
import { MESSENGERS, OFFICES, PHONES, PRIMARY_EMAIL, PRIMARY_PHONE } from '@/data/contacts';

/** Канонический продакшн-домен (без завершающего слэша). */
export const SITE_URL = 'https://deltapri.me';

export const SITE_NAME = 'Delta Prime';

/** Заголовок главной / дефолтный OG-title. */
export const SITE_TITLE = 'Delta Prime — аренда спецтехники в Санкт-Петербурге';

export const SITE_DESCRIPTION =
  'Аренда спецтехники в Санкт-Петербурге и Ленинградской области: экскаваторы, погрузчики, автокраны, самосвалы и дорожная техника. Собственный парк, аттестованные машинисты, подача на объект от часа.';

export const SITE_LOCALE = 'ru_RU';

export const DEFAULT_KEYWORDS = [
  'аренда спецтехники',
  'спецтехника в аренду',
  'аренда экскаватора',
  'аренда погрузчика',
  'аренда самосвала',
  'аренда автокрана',
  'спецтехника Санкт-Петербург',
  'аренда техники СПб',
  'Delta Prime',
];

/** Юрлицо и регистрационные данные (из подвала сайта). */
export const ORGANIZATION = {
  legalName: 'ООО «ДЕЛЬТАПРАЙМ»',
  inn: '7806588687',
  ogrn: '1217800105819',
  foundingDate: '2021',
  addressLocality: 'Санкт-Петербург',
  addressRegion: 'Санкт-Петербург',
  streetAddress: 'ул. Предпортовая, д. 3 лит А, БЦ «Реформа», офис 41',
  addressCountry: 'RU',
  areaServed: ['Санкт-Петербург', 'Ленинградская область'],
} as const;

/** Логотип для метаданных/структурированных данных. */
export const LOGO_PATH = '/images/logo.svg';

/** `tel:+79312626666` → `+79312626666`. */
function telFromHref(href: string): string {
  return href.replace(/^tel:/, '');
}

/** Абсолютный URL от корня сайта: `/catalog` → `https://deltapri.me/catalog`. */
export function absoluteUrl(path = '/'): string {
  return new URL(path, SITE_URL).toString();
}

/**
 * Метаданные внутренней страницы: canonical + согласованные OG/Twitter.
 * `title` — короткий (шаблон layout добавит «· Delta Prime» в <title>),
 * но в OG/Twitter кладём уже полный заголовок.
 */
export function pageMetadata({
  title,
  description,
  path,
  images,
}: {
  title: string;
  description: string;
  path: string;
  images?: NonNullable<Metadata['openGraph']>['images'];
}): Metadata {
  const fullTitle = `${title} · ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: SITE_LOCALE,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      ...(images ? { images: images as never } : {}),
    },
  };
}

/**
 * JSON-LD организации (LocalBusiness). Рендерится глобально в layout —
 * помогает поисковикам сформировать карточку компании (NAP, часы, зона).
 */
export function organizationJsonLd() {
  const office = OFFICES[0];
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: ORGANIZATION.legalName,
    url: SITE_URL,
    logo: absoluteUrl(LOGO_PATH),
    image: absoluteUrl(LOGO_PATH),
    description: SITE_DESCRIPTION,
    foundingDate: ORGANIZATION.foundingDate,
    telephone: telFromHref(PRIMARY_PHONE.href),
    email: PRIMARY_EMAIL.value,
    priceRange: '₽₽',
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORGANIZATION.streetAddress,
      addressLocality: office?.city ?? ORGANIZATION.addressLocality,
      addressRegion: ORGANIZATION.addressRegion,
      addressCountry: ORGANIZATION.addressCountry,
    },
    areaServed: ORGANIZATION.areaServed.map((name) => ({ '@type': 'Place', name })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '09:00',
        closes: '21:00',
      },
    ],
    contactPoint: PHONES.map((p) => ({
      '@type': 'ContactPoint',
      telephone: telFromHref(p.href),
      contactType: 'customer service',
      areaServed: 'RU',
      availableLanguage: 'Russian',
    })),
    sameAs: MESSENGERS.map((m) => m.href),
  };
}

/** JSON-LD хлебных крошек для внутренних страниц. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
