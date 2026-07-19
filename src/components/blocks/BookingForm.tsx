'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export interface BookingFormProps {
  equipmentName: string;
  /** Доп. классы корневого элемента (напр. `h-full` для выравнивания по высоте). */
  className?: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  dates?: string;
}

const PHONE_RE = /^[\d\s()+-]{10,}$/;

export function BookingForm({ equipmentName, className }: BookingFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // Название техники уходит с заявкой (см. скрытое поле `equipment` ниже).
    const name = String(formData.get('name') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim();
    const dates = String(formData.get('dates') ?? '').trim();
    const comment = String(formData.get('comment') ?? '').trim();
    const equipment = String(formData.get('equipment') ?? '').trim();

    const nextErrors: FormErrors = {};
    if (name.length < 2) nextErrors.name = 'Укажите имя';
    if (!PHONE_RE.test(phone)) nextErrors.phone = 'Введите корректный телефон';
    if (dates.length < 3) nextErrors.dates = 'Укажите даты аренды';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSending(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, dates, comment, equipment }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSubmitted(true);
    } catch {
      setSubmitError('Не удалось отправить заявку. Позвоните нам или попробуйте ещё раз.');
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div
        className={cn(
          'border-success/30 bg-success/10 flex flex-col items-start gap-3 rounded-lg border p-6',
          className,
        )}
      >
        <CheckCircle2 className="text-success size-8" aria-hidden />
        <h3 className="text-text text-lg font-bold">Заявка принята</h3>
        <p className="text-text-muted text-sm">
          Спасибо! Мы свяжемся с вами в ближайшее время по вопросу аренды «{equipmentName}».
        </p>
        <Button variant="secondary" size="sm" onClick={() => setSubmitted(false)}>
          Отправить ещё одну
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn(
        'border-border bg-surface flex flex-col gap-4 rounded-lg border p-6',
        className,
      )}
    >
      <input type="hidden" name="equipment" value={equipmentName} readOnly />

      <div className="flex flex-col gap-1">
        <h3 className="text-text text-lg font-bold">Оставить заявку</h3>
        <p className="text-text-muted text-sm">Перезвоним и подтвердим наличие и сроки.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input name="name" label="Ваше имя" placeholder="Иван" error={errors.name} />
        <Input
          name="phone"
          type="tel"
          label="Телефон"
          placeholder="+7 (___) ___-__-__"
          error={errors.phone}
        />
      </div>

      <Input
        name="dates"
        label="Даты аренды"
        placeholder="27.06 — 29.06.2026"
        error={errors.dates}
      />

      <div className="grid gap-1">
        <label htmlFor="booking-comment" className="text-text text-xs font-semibold">
          Комментарий
        </label>
        <textarea
          id="booking-comment"
          name="comment"
          rows={3}
          placeholder="Адрес объекта, задачи, нужен ли оператор…"
          className="border-border bg-surface text-text placeholder:text-text-subtle hover:border-text-subtle focus:border-brand focus:ring-ring w-full rounded-md border p-3 text-sm transition-[border-color,box-shadow] outline-none focus:ring-4"
        />
      </div>

      {submitError && (
        <p className="text-error text-sm" role="alert">
          {submitError}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={sending}
        className="mt-auto disabled:pointer-events-none disabled:opacity-60"
      >
        {sending ? 'Отправляем…' : 'Забронировать технику'}
      </Button>
    </form>
  );
}
