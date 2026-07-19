'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Wrench } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function HeroSearch() {
  const router = useRouter();
  const [type, setType] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = type.trim();
    router.push(query ? `/catalog?q=${encodeURIComponent(query)}` : '/catalog');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border bg-surface/80 flex w-full max-w-3xl flex-col gap-2 rounded-xl border p-2 shadow-elev-1 backdrop-blur-md md:flex-row"
    >
      <div className="md:flex-1">
        <Input
          icon={Wrench}
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Тип техники"
          aria-label="Тип техники"
        />
      </div>
      <Button type="submit" variant="primary" size="md" className="w-full md:w-auto md:px-6">
        <Search className="size-4 shrink-0" aria-hidden />
        Найти
      </Button>
    </form>
  );
}
