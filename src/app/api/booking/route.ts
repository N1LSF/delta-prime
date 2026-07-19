import { NextResponse } from 'next/server';

// Отправка заявок в Telegram. Токен бота и id группы берутся только из
// переменных окружения (.env.local) — в клиентский бандл они не попадают.

interface BookingPayload {
  name?: string;
  phone?: string;
  dates?: string;
  comment?: string;
  equipment?: string;
}

const PHONE_RE = /^[\d\s()+-]{10,}$/;

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>]/g,
    (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[ch] ?? ch,
  );
}

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    // Логируем на сервере, наружу деталей не отдаём.
    console.error('Заявки не настроены: заданы не все TELEGRAM_* переменные окружения');
    return NextResponse.json({ error: 'Сервис заявок временно недоступен' }, { status: 503 });
  }

  let data: BookingPayload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }

  // Повторная валидация на сервере — клиенту доверять нельзя.
  const name = String(data.name ?? '').trim();
  const phone = String(data.phone ?? '').trim();
  const dates = String(data.dates ?? '').trim();
  const comment = String(data.comment ?? '').trim();
  const equipment = String(data.equipment ?? '').trim();

  if (name.length < 2 || !PHONE_RE.test(phone) || dates.length < 3) {
    return NextResponse.json({ error: 'Проверьте заполнение полей' }, { status: 422 });
  }

  const text = [
    '🆕 <b>Новая заявка на аренду</b>',
    equipment && `🚜 Техника: ${escapeHtml(equipment)}`,
    `👤 Имя: ${escapeHtml(name)}`,
    `📞 Телефон: ${escapeHtml(phone)}`,
    `📅 Даты: ${escapeHtml(dates)}`,
    comment && `💬 Комментарий: ${escapeHtml(comment)}`,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });
    if (!tgRes.ok) {
      console.error('Telegram sendMessage failed:', tgRes.status, await tgRes.text());
      return NextResponse.json({ error: 'Не удалось отправить заявку' }, { status: 502 });
    }
  } catch (err) {
    console.error('Telegram request error:', err);
    return NextResponse.json({ error: 'Не удалось отправить заявку' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
