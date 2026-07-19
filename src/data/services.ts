import {
  Hammer,
  Layers,
  Mountain,
  Route,
  Shovel,
  Snowflake,
  Truck,
  type LucideIcon,
} from 'lucide-react';

export interface Service {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  /** Опц. путь к фото для карточки в ServicesGrid (напр. '/media/services/road.jpg').
   *  Если не задано — показывается icon-плейсхолдер. */
  image?: string;
}

/**
 * Направления работ Delta Prime. Рендерятся сеткой услуг (ServicesGrid).
 */
export const services: Service[] = [
  {
    slug: 'road-construction',
    title: 'Дорожное строительство',
    description: 'Устройство и ремонт дорог: фрезерование, укладка асфальта, уплотнение основания.',
    icon: Route,
    href: '/catalog',
    image: '/images/main/road-construction.jpg',
  },
  {
    slug: 'earthworks',
    title: 'Котлован и вывоз грунта',
    description: 'Разработка котлованов и траншей, погрузка и вывоз грунта самосвалами.',
    icon: Shovel,
    href: '/catalog',
    image: '/images/main/earthworks.jpg',
  },
  {
    slug: 'demolition',
    title: 'Снос и демонтаж',
    description: 'Демонтаж строений и конструкций с вывозом строительного мусора.',
    icon: Hammer,
    href: '/catalog',
    image: '/images/main/demolition.jpg',
  },
  {
    slug: 'aggregates',
    title: 'Нерудные материалы',
    description: 'Поставка песка, щебня, грунта и ПГС с доставкой на объект.',
    icon: Mountain,
    href: '/catalog',
    image: '/images/main/aggregates.jpg',
  },
  {
    slug: 'land-grading',
    title: 'Планировка земли',
    description: 'Выравнивание и планировка участков бульдозерами и автогрейдерами.',
    icon: Layers,
    href: '/catalog',
    image: '/images/main/land-grading.jpg',
  },
  {
    slug: 'cargo-transport',
    title: 'Перевозка грузов',
    description: 'Доставка техники и негабарита тралами, длинномерами и панелевозами.',
    icon: Truck,
    href: '/catalog',
    image: '/images/main/cargo-transport.jpg',
  },
  {
    slug: 'snow-removal',
    title: 'Уборка снега',
    description: 'Механизированная уборка территорий, погрузка и вывоз снега зимой.',
    icon: Snowflake,
    href: '/catalog',
    image: '/images/main/snow-removal.jpg',
  },
];
