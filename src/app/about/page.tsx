import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, FileText, Headset, MapPin, Truck, Users } from 'lucide-react';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { ShaderBackground } from '@/components/ui/ShaderBackground';
import { B2BTrust } from '@/components/blocks/B2BTrust';
import { ContactsSection } from '@/components/blocks/ContactsSection';
import { BookingForm } from '@/components/blocks/BookingForm';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'О компании',
  description:
    'Delta Prime — аренда спецтехники в Санкт-Петербурге с 2021 года. Собственный парк, опытные машинисты, подача на объект от часа.',
  path: '/about',
});

const ADVANTAGES = [
  {
    icon: Truck,
    title: 'Собственный парк внутри КАД',
    text: 'Исправная техника в Санкт-Петербурге без посредников — оперативная подача на объект.',
  },
  {
    icon: Clock,
    title: 'Подача от часа',
    text: 'Привезём технику на объект от часа с момента получения вашей заявки.',
  },
  {
    icon: Users,
    title: 'Опытные машинисты',
    text: 'Аттестованные операторы со стажем от 6 лет и всеми допусками на объект.',
  },
  {
    icon: Headset,
    title: 'Персональный менеджер 24/7',
    text: 'Ваш менеджер на связи круглосуточно и контролирует работу на каждом этапе.',
  },
  {
    icon: FileText,
    title: 'Работаем с юрлицами и ИП',
    text: 'Договор, НДС, отсрочка платежа и закрывающие документы для бухгалтерии.',
  },
  {
    icon: MapPin,
    title: 'Санкт-Петербург и область',
    text: 'Выезд на любой объект в городе и Ленинградской области, включая удалённые площадки.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero — полноширинная лента с шейдер-фоном (только высота hero) */}
      <section className="relative isolate overflow-hidden">
        <ShaderBackground />
        <div className="mx-auto flex max-w-content flex-col items-start gap-6 px-4 pt-28 pb-12 sm:px-6 sm:pt-36 sm:pb-16 lg:px-8">
          <span className="text-brand inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
            <span className="bg-accent-500 inline-block h-3 w-1 rounded-full" aria-hidden />
            О компании
          </span>
          <h1 className="text-text max-w-3xl text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl">
            Спецтехника, на которую можно положиться
          </h1>
          <p className="text-text-muted max-w-2xl text-base sm:text-lg">
            Delta Prime с 2021 года помогает строительным и промышленным компаниям Санкт-Петербурга и
            Ленинградской области закрывать задачи без покупки дорогой техники. Отвечаем за
            исправность парка, сроки подачи и квалификацию машинистов — чтобы ваш объект не стоял.
          </p>
          <Link href="/catalog" className={buttonClasses({ variant: 'primary', size: 'lg' })}>
            Перейти в каталог
          </Link>
        </div>
      </section>

      {/* Остальной контент — в пределах ширины контента */}
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        {/* Статистика */}
        <section className="py-12">
          <B2BTrust />
        </section>

      {/* Преимущества */}
      <section className="py-12">
        <div className="border-border mb-8 flex flex-col gap-1 border-b pb-4">
          <h2 className="text-text text-2xl font-bold tracking-tight sm:text-3xl">
            Почему выбирают нас
          </h2>
          <p className="text-text-muted text-sm">Шесть причин доверить технику Delta Prime</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map((advantage) => {
            const Icon = advantage.icon;
            return (
              <div
                key={advantage.title}
                className="border-border bg-surface hover:border-brand flex flex-col gap-3 rounded-lg border p-6 transition-colors"
              >
                <span className="bg-brand/10 text-brand inline-flex size-10 items-center justify-center rounded-md">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="text-text text-base font-semibold">{advantage.title}</h3>
                <p className="text-text-muted text-sm">{advantage.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Контакты */}
      <section id="contacts" className="scroll-mt-28 py-12">
        <div className="border-border mb-8 flex flex-col gap-1 border-b pb-4">
          <h2 className="text-text text-2xl font-bold tracking-tight sm:text-3xl">Контакты</h2>
          <p className="text-text-muted text-sm">
            Подберём технику, рассчитаем смету и согласуем доставку в день обращения
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <ContactsSection />
          <BookingForm equipmentName="спецтехники" className="h-full" />
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="border-border bg-surface flex flex-col items-start gap-4 rounded-lg border p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-text text-2xl font-bold tracking-tight">
              Нужна техника на объект?
            </h2>
            <p className="text-text-muted">
              Подберём подходящую машину и привезём в течение 24 часов.
            </p>
          </div>
          <Link
            href="/catalog"
            className={buttonClasses({ variant: 'primary', size: 'lg', className: 'shrink-0' })}
          >
            Смотреть каталог
          </Link>
        </div>
      </section>
      </div>
    </>
  );
}
