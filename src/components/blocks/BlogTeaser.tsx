'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Newspaper } from 'lucide-react';
import { cn } from '@/lib/cn';
import { posts, type PostTag } from '@/data/posts';
import { buttonClasses } from '@/components/ui/buttonStyles';

const TABS: PostTag[] = ['Статьи', 'Новости'];

export function BlogTeaser() {
  const [tab, setTab] = useState<PostTag>('Статьи');
  const list = posts.filter((post) => post.tag === tab).slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      {/* Табы */}
      <div className="border-border flex gap-6 border-b" role="tablist" aria-label="Разделы блога">
        {TABS.map((label) => {
          const active = tab === label;
          return (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(label)}
              className={cn(
                'relative -mb-px py-2 text-sm font-medium transition-colors',
                active ? 'text-brand' : 'text-text-muted hover:text-text',
              )}
            >
              {label}
              {active ? (
                <span className="bg-brand absolute inset-x-0 -bottom-px h-0.5 rounded-full" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Карточки */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {list.map((post) => (
          <Link
            key={post.slug}
            href="/catalog"
            className="group border-border bg-surface hover:border-brand flex flex-col overflow-hidden rounded-lg border transition-colors"
          >
            {/* Плейсхолдер превью */}
            <div className="border-border bg-surface-2 text-brand flex aspect-[16/10] items-center justify-center border-b">
              <Newspaper
                className="size-9 transition-transform duration-300 group-hover:scale-105"
                aria-hidden
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <span className="text-text-subtle text-xs font-medium">{post.date}</span>
              <h3 className="text-text group-hover:text-brand text-base leading-snug font-bold tracking-tight transition-colors">
                {post.title}
              </h3>
              <p className="text-text-muted text-sm">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/catalog"
        className={buttonClasses({ variant: 'secondary', size: 'md', className: 'self-start' })}
      >
        Читать блог
      </Link>
    </div>
  );
}
