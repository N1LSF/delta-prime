import Link from 'next/link';
import Image from 'next/image';
import { featuredEquipment, getCategoryTitle } from '@/lib/catalog';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { Reveal } from '@/components/ui/Reveal';
import { Container } from '@/components/ui/Container';
import { B2BTrust } from '@/components/blocks/B2BTrust';
import { EquipmentCard } from '@/components/blocks/EquipmentCard';
import { HeroSearch } from '@/components/blocks/HeroSearch';
import { ServicesGrid } from '@/components/blocks/ServicesGrid';
import { Advantages } from '@/components/blocks/Advantages';

export default function HomePage() {
  return (
    <>
      {/* ============= HERO (фото справа, края тают в фон) ============= */}
      <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden">
        {/* Декоративное фото справа */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[58%] lg:block"
        >
          <Image
            src="/media/hero-poster.jpg"
            alt=""
            fill
            priority
            sizes="60vw"
            className="object-cover object-center"
          />
          {/* Растворение краёв в фон: слева и снизу */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--bg),transparent_40%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_55%,var(--bg))]" />
        </div>

        <Container className="pt-32 pb-20 sm:pt-36">
          <div className="flex max-w-2xl flex-col items-start gap-7">
            <h1 className="text-text text-5xl font-extrabold tracking-tighter text-balance sm:text-6xl lg:text-7xl">
              Аренда спецтехники
            </h1>

            <p className="text-text-muted max-w-xl text-lg text-balance sm:text-xl">
              Собственный парк в Санкт-Петербурге и Ленинградской области: экскаваторы, погрузчики,
              краны и самосвалы. Подача на объект от часа с момента заявки.
            </p>

            <HeroSearch />
          </div>
        </Container>
      </section>

      {/* ============= УСЛУГИ ============= */}
      <section id="services" className="scroll-mt-28 py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHead
              title="Полный сервис и гарантия исправной техники"
              subtitle="Закрываем задачи на объекте без подрядчиков на стороне — от земляных работ до уборки снега"
            />
          </Reveal>
          <Reveal delay={0.05}>
            <ServicesGrid />
          </Reveal>
        </Container>
      </section>

      {/* ============= ЦИФРЫ ============= */}
      <section className="bg-blueprint py-16 sm:py-20">
        <Container>
          <Reveal>
            <B2BTrust />
          </Reveal>
        </Container>
      </section>

      {/* ============= ПРЕИМУЩЕСТВА ============= */}
      <section className="bg-surface py-16 sm:py-20">
        <Container>
          <Reveal>
            <Advantages />
          </Reveal>
        </Container>
      </section>

      {/* ============= ПОПУЛЯРНАЯ ТЕХНИКА ============= */}
      <section id="catalog" className="scroll-mt-28 py-16 sm:py-20">
        <Container>
          <Reveal>
            <div className="border-border mb-8 flex flex-wrap items-end justify-between gap-4 border-b pb-5">
              <div className="flex flex-col gap-2">
                <h2 className="text-text text-3xl font-extrabold tracking-tighter sm:text-4xl">
                  Популярная техника
                </h2>
                <p className="text-text-muted text-base">
                  Чаще всего бронируют на объекты в этом сезоне
                </p>
              </div>
              <Link
                href="/catalog"
                className={buttonClasses({ variant: 'secondary', size: 'md' })}
              >
                Весь каталог
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.05} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredEquipment.map((equipment) => (
              <EquipmentCard
                key={equipment.id}
                equipment={equipment}
                categoryTitle={getCategoryTitle(equipment.categorySlug)}
              />
            ))}
          </Reveal>
        </Container>
      </section>
    </>
  );
}

/** Единый заголовок секции с подписью. */
function SectionHead({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="border-border mb-8 flex flex-col gap-2 border-b pb-5">
      <h2 className="text-text text-3xl font-extrabold tracking-tighter text-balance sm:text-4xl">
        {title}
      </h2>
      <p className="text-text-muted text-base text-balance">{subtitle}</p>
    </div>
  );
}
