// Инъекция structured data (JSON-LD) в разметку. Данные строятся билдерами
// из '@/lib/seo' и сериализуются в <script type="application/ld+json">.

/** Один блок JSON-LD. `data` — готовый объект схемы (schema.org). */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Данные формируются на сервере из наших же констант — не пользовательский ввод.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
