// Единый источник контактных данных: используется в ContactsSection (/about),
// Footer и любых других местах — чтобы не дублировать.

export interface ContactEmail {
  label: string;
  value: string;
}

export interface ContactPhone {
  label: string;
  value: string;
  href: string;
}

export interface Office {
  city: string;
  address: string;
}

export type MessengerKind = 'telegram' | 'whatsapp' | 'max';

export interface Messenger {
  kind: MessengerKind;
  label: string;
  href: string;
}

export const EMAILS: ContactEmail[] = [
  { label: 'Основная почта', value: 'delta@prime98.ru' },
  { label: 'Заявки', value: 'deltaprimespb@yandex.ru' },
];

export const PHONES: ContactPhone[] = [
  { label: 'Аренда техники', value: '+7 (931) 262-66-66', href: 'tel:+79312626666' },
  { label: 'Офис', value: '+7 (812) 946-46-46', href: 'tel:+78129464646' },
];

export const OFFICES: Office[] = [
  {
    city: 'Санкт-Петербург',
    address: 'БЦ «Реформа», офис 41, ул. Предпортовая, д. 3 лит А',
  },
];

/** Режим работы (диспетчерская / приём заявок). */
export const WORKING_HOURS = 'Ежедневно с 9:00 до 21:00';

/** Мессенджеры для быстрой связи. */
export const MESSENGERS: Messenger[] = [
  { kind: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/79312626666' },
  { kind: 'telegram', label: 'Telegram — Павел', href: 'https://t.me/PavelDeltaP' },
  { kind: 'telegram', label: 'Telegram — Игорь', href: 'https://t.me/igorspb92' },
  { kind: 'max', label: 'MAX', href: 'https://max.ru/u/f9LHodD0cOLWW1Fw9OVh1IvRghNhqQh9Csn6Z7LXoGZYV5O21WymM0vNZRs' },
];

export interface SocialLink {
  label: string;
  /** Путь к брендовой SVG-иконке в /public. */
  icon: string;
  href: string;
}

/** Брендовые иконки-ссылки (шапка + подвал). */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'MAX', icon: '/images/icons/max.svg', href: 'https://max.ru/u/f9LHodD0cOLWW1Fw9OVh1IvRghNhqQh9Csn6Z7LXoGZYV5O21WymM0vNZRs' },
  { label: 'Telegram', icon: '/images/icons/telegram.svg', href: 'https://t.me/PavelDeltaP' },
];

/** Основные контакты для краткого блока (подвал и т.п.). */
export const PRIMARY_PHONE: ContactPhone = PHONES[0]!;
export const PRIMARY_EMAIL: ContactEmail = EMAILS[0]!;
