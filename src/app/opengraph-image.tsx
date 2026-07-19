import { ImageResponse } from 'next/og';
import { SITE_URL } from '@/lib/seo';

// Дефолтная OG/Twitter-картинка (генерируется на build через next/og).
export const runtime = 'nodejs';
export const alt = 'Delta Prime — аренда спецтехники в Санкт-Петербурге';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Догружаем Manrope с Google Fonts (только нужные глифы через &text=), чтобы
// кириллица рендерилась — встроенный шрифт next/og её не покрывает.
// Без UA-заголовка Google отдаёт ttf, который понимает Satori.
// ponytail: build-time fetch к Google Fonts; упадёт при офлайн-билде — тогда бандлить .ttf в репо.
async function loadManrope(weight: number, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=Manrope:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const src = css.match(/src:\s*url\((.+?)\)\s*format\('(?:opentype|truetype)'\)/)?.[1];
  if (!src) throw new Error('Manrope: font url not found in Google CSS');
  return (await fetch(src)).arrayBuffer();
}

export default async function OpengraphImage() {
  const host = SITE_URL.replace(/^https?:\/\//, '');
  const label = 'АРЕНДА СПЕЦТЕХНИКИ';
  const title = 'Delta Prime';
  const subtitle = 'Санкт-Петербург и Ленинградская область';
  const footerRight = 'Подача на объект от часа';
  const glyphs = label + title + subtitle + footerRight + host;

  const [bold, medium] = await Promise.all([loadManrope(800, glyphs), loadManrope(500, glyphs)]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          backgroundImage: 'linear-gradient(135deg, #0e1416 0%, #14525c 100%)',
          color: '#ffffff',
          fontFamily: 'Manrope',
        }}
      >
        {/* Верхняя метка */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: 6,
            color: '#8fd0d9',
          }}
        >
          <div
            style={{
              width: 14,
              height: 40,
              borderRadius: 8,
              backgroundColor: '#f59e0b',
              marginRight: 20,
            }}
          />
          {label}
        </div>

        {/* Заголовок */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 128, fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>
            {title}
          </div>
          <div
            style={{ marginTop: 24, fontSize: 40, fontWeight: 500, color: 'rgba(255,255,255,0.82)' }}
          >
            {subtitle}
          </div>
        </div>

        {/* Низ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 30,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          <span>{host}</span>
          <span>{footerRight}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Manrope', data: bold, weight: 800, style: 'normal' },
        { name: 'Manrope', data: medium, weight: 500, style: 'normal' },
      ],
    },
  );
}
