import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from './ProductCard';

type ProductSliderProps = {
  products: any[];
  mapToCard: (product: any) => any;
};

export default function ProductSlider({ products, mapToCard }: ProductSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps',
  });

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="relative w-full px-6 lg:px-10">
      <button onClick={scrollPrev} className="absolute left-[40px] top-1/2 z-[999] hidden -translate-y-1/2 md:block text-[#C49A6C] transition-all duration-200 hover:scale-125 hover:text-[#B88A5A]">
        <ChevronLeft className="h-8 w-8" strokeWidth={1.5} />
      </button>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="grid grid-cols-2 gap-3 md:flex md:gap-8">
          {products.map((product) => {
            const card = mapToCard(product);
            return (
              <div key={card.id} className="min-w-0 md:min-w-[330px] md:flex-shrink-0">
                <ProductCard {...card} />
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={scrollNext} className="absolute right-[60px] top-1/2 z-[999] hidden -translate-y-1/2 md:block text-[#C49A6C] transition-all duration-200 hover:scale-125 hover:text-[#B88A5A]">
        <ChevronRight className="h-8 w-8" strokeWidth={1.5} />
      </button>
    </div>
  );
}
