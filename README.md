# Delta Prime

Сайт аренды спецтехники в Санкт-Петербурге и Ленинградской области.

## Стек

- Next.js 15, App Router
- React 19, TypeScript
- Tailwind CSS 4
- Статический JSON-каталог без базы данных
- Серверная отправка заявок в Telegram

## Локальный запуск

Требуется Node.js 22 или новее.

```bash
npm ci
npm run dev
```

Открыть `http://localhost:3000`.

## Production-сборка

```bash
npm ci
npm run build
npm start
```

## Переменные окружения

Для отправки заявок нужны серверные переменные:

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

Реальные значения задаются только в панели хостинга или локально в `.env.local`. Файлы `.env` и `.env*.local` исключены из Git. Не публиковать токены в репозитории.

## Деплой на Timeweb Cloud App Platform

1. Подключить этот репозиторий в App Platform.
2. Выбрать фреймворк Next.js.
3. **Включить SSR при создании приложения** — это необходимо для `/api/booking`.
4. Использовать команду сборки `npm run build` и команду запуска `npm start`.
5. Добавить `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` в переменные приложения.
6. Подключить домен и проверить отправку тестовой заявки.

Шрифт Manrope хранится локально в `src/app/fonts`, поэтому сборка не зависит от Google Fonts.
