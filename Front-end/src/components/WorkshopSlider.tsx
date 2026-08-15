import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import WorkshopCard from './WorkshopCard';
import type { WorkshopDto } from '../services/api';

type Props = {
  workshops: WorkshopDto[];
};

export default function WorkshopSlider({ workshops }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps',
  })

  const scrollPrev = () => emblaApi?.scrollPrev()
  const scrollNext = () => emblaApi?.scrollNext()

  return (
    <div className="relative w-full px-6 lg:px-10">
      {/* Nút trái */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-[#C49A6C] hover:text-white"
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
      </button>

      {/* Slider */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {workshops.map((workshop) => (
            <div
              key={workshop.id}
              className="min-w-[300px] sm:min-w-[340px] lg:min-w-[360px] flex-shrink-0"
            >
              <WorkshopCard workshop={workshop} />
            </div>
          ))}
        </div>
      </div>

      {/* Nút phải */}
      <button
  onClick={scrollNext}
  className="absolute right-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white p-4 shadow-xl transition-all duration-200 hover:scale-110 hover:bg-[#C49A6C] hover:text-white cursor-pointer"
>
  <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
</button>
    </div>
  )
}