import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import type { ProductDto } from '../services/api';

function formatPrice(value?: number) {
  if (typeof value !== 'number') return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
}

function mapToCard(product: ProductDto) {
  const image = product.images?.[0] || product.image_url || '';
  return {
    id={item.id},
    slug: product.slug,
    name: product.name,
    price: formatPrice(product.sale_price ?? product.price),
    originalPrice: product.sale_price && product.price && product.sale_price < product.price ? formatPrice(product.price) : undefined,
    image,
    tag: product.is_featured ? 'HOT' : product.is_best_seller ? 'BEST' : undefined,
  };
}

export default function HorizontalProductRow({ title, subtitle, products }: { title: string; subtitle: string; products: ProductDto[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const cards = useMemo(() => products.map(mapToCard), [products]);

  function scrollByAmount(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.85, 1200);
    el.scrollBy({ left: amount * direction, behavior: 'smooth' });
  }

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#8f9bb3]">Bộ sưu tập</p>
            <h2 className="mt-3 font-serif text-4xl font-light text-foreground">{title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f7b8b]">{subtitle}</p>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button type="button" onClick={() => scrollByAmount(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-[#e8edf3] bg-white text-foreground shadow-sm transition hover:bg-[#f6f7fb]">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => scrollByAmount(1)} className="grid h-11 w-11 place-items-center rounded-full border border-[#e8edf3] bg-white text-foreground shadow-sm transition hover:bg-[#f6f7fb]">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div ref={scrollerRef} className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-webkit-overflow-scrolling:touch] cursor-grab active:cursor-grabbing">
            {cards.map((card, index) => (
              <motion.div key={card.id} className="shrink-0 snap-start" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3) }}>
                <div className="w-[78vw] sm:w-[42vw] md:w-[calc((100%-1.5rem*1)/2)] lg:w-[calc((100%-1.5rem*3)/4)]">
                  <ProductCard {...card} />
                </div>
              </motion.div>
            ))}
          </div>

          <button type="button" onClick={() => scrollByAmount(-1)} className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-[#e8edf3] bg-white p-3 text-foreground shadow-lg md:grid">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => scrollByAmount(1)} className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-[#e8edf3] bg-white p-3 text-foreground shadow-lg md:grid">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
