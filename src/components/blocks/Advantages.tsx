import Link from 'next/link';
import { FileText, HardHat, Headset, ShieldCheck } from 'lucide-react';
import { buttonClasses } from '@/components/ui/buttonStyles';

const ADVANTAGES = [
  {
    icon: ShieldCheck,
    title: 'Собственный парк внутри КАД',
    text: 'Исправная техника в Санкт-Петербурге без посредников — подача на объект от часа с момента заявки.',
  },
  {
    icon: HardHat,
    title: 'Опытные машинисты',
    text: 'Аттестованные операторы со стажем от 6 лет и всеми допусками на объект.',
  },
  {
    icon: Headset,
    title: 'Персональный менеджер 24/7',
    text: 'Ваш менеджер на связи круглосуточно — подбор техники и контроль на каждом этапе.',
  },
  {
    icon: FileText,
    title: 'Работаем с юрлицами и ИП',
    text: 'Договор, НДС, отсрочка платежа и закрывающие документы для бухгалтерии.',
  },
];

/** Секция преимуществ: текст + CTA слева, плитки преимуществ справа. */
export function Advantages() {
  return (
    <div className="border-border bg-surface overflow-hidden rounded-2xl border">
      <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
        <div className="flex flex-col gap-5">
          <span className="text-brand inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
            <span className="bg-accent-500 inline-block h-3 w-1 rounded-full" aria-hidden />
            Почему Delta Prime
          </span>
          <h2 className="text-text text-3xl font-extrabold tracking-tighter text-balance sm:text-4xl">
            Ваш надёжный подрядчик по спецтехнике
          </h2>
          <p className="text-text-muted text-base text-balance">
            Собственный парк спецтехники в Санкт-Петербурге и Ленинградской области. Закрываем задачу
            под ключ: исправные машины, квалифицированные операторы и лучшие цены за счёт своего
            автопарка.
          </p>
          <Link
            href="/about"
            className={buttonClasses({ variant: 'secondary', size: 'md', className: 'self-start' })}
          >
            О компании
          </Link>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {ADVANTAGES.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="border-border bg-surface-2 flex flex-col gap-2 rounded-xl border p-4"
            >
              <span className="bg-brand/10 text-brand flex size-10 items-center justify-center rounded-lg">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="text-text text-base font-bold tracking-tight">{title}</h3>
              <p className="text-text-muted text-sm">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
