import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { EMAILS, MESSENGERS, PHONES, WORKING_HOURS } from '@/data/contacts';
import { MaxIcon } from '@/components/ui/MaxIcon';

/** Контакты: email-блоки и телефоны слева, плейсхолдер-карта справа. */
export function ContactsSection() {
  return (
    <div className="border-border bg-surface grid h-full gap-8 overflow-hidden rounded-2xl border p-6 sm:p-10 lg:grid-cols-2 lg:grid-rows-1 lg:gap-12">
      <div className="flex flex-col gap-6">
        <div className="grid gap-3">
          {EMAILS.map(({ label, value }) => (
            <a
              key={value}
              href={`mailto:${value}`}
              className="group border-border bg-surface-2 hover:border-brand flex flex-col gap-1 rounded-xl border p-4 transition-colors"
            >
              <span className="text-text-subtle text-xs font-semibold tracking-wide uppercase">
                {label}
              </span>
              <span className="text-text group-hover:text-brand flex items-center gap-1.5 text-sm font-semibold transition-colors">
                <Mail className="size-3.5 shrink-0" aria-hidden />
                <span className="min-w-0 break-words">{value}</span>
              </span>
            </a>
          ))}
        </div>

        <ul className="border-border divide-border flex flex-col divide-y rounded-xl border">
          {PHONES.map(({ label, value, href }) => (
            <li key={value}>
              <a href={href} className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="text-text-muted text-sm">{label}</span>
                <span className="text-text inline-flex items-center gap-2 text-base font-bold tracking-tight tabular-nums">
                  <Phone className="text-brand size-4" aria-hidden />
                  {value}
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* Режим работы */}
        <div className="text-text-muted inline-flex items-center gap-2 text-sm">
          <Clock className="text-brand size-4 shrink-0" aria-hidden />
          {WORKING_HOURS}
        </div>

        {/* Мессенджеры */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {MESSENGERS.map((messenger) => (
            <a
              key={messenger.href}
              href={messenger.href}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border bg-surface-2 text-text hover:border-brand hover:text-brand inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors"
            >
              {messenger.kind === 'telegram' ? (
                <Send className="size-4" aria-hidden />
              ) : messenger.kind === 'max' ? (
                <MaxIcon className="size-4" aria-hidden />
              ) : (
                <MessageCircle className="size-4" aria-hidden />
              )}
              {messenger.label}
            </a>
          ))}
        </div>
      </div>

      {/* Адрес офиса (плейсхолдер карты) */}
      <div className="border-border bg-surface-2 text-brand relative flex min-h-[240px] items-center justify-center rounded-xl border">
        <MapPin className="size-12 opacity-40" aria-hidden />
        <span className="text-text-subtle absolute right-4 bottom-4 left-4 text-center text-xs font-medium">
          Санкт-Петербург, БЦ «Реформа», офис 41, ул. Предпортовая, д. 3 лит А
        </span>
      </div>
    </div>
  );
}
