import type { Category } from '../types';

type Props = { categories: Category[] };

export function CategoryStrip({ categories }: Props) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-8 lg:px-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
        {categories.map((category) => (
          <a key={category.name} href="#" className="group text-center">
            <div className="mx-auto aspect-square max-w-[150px] overflow-hidden rounded-full border border-[#e6ddd3] bg-white shadow-sm">
              <img src={category.image_url || category.image_url} alt={category.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
            </div>
            <div className="mt-3 text-[11px] uppercase tracking-[0.28em] text-[#1c1c1c]">{category.name}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
