import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import Footer from '../components/Footer';
import Header from '../components/Header';
import { api, type WorkshopDto } from '../services/api';
import WorkshopCard from '../components/WorkshopCard';

export default function WorkshopPage() {
  const [workshops, setWorkshops] = useState<WorkshopDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: false,
    containScroll: 'trimSnaps',
  });
  let workshopsCache: WorkshopDto[] | null = null;
let workshopsCacheTime = 0;

const WORKSHOP_CACHE_TIME = 5 * 60 * 1000;  

  useEffect(() => {
  let alive = true;

  // Có cache còn hạn → dùng ngay
  if (
    workshopsCache &&
    Date.now() - workshopsCacheTime < WORKSHOP_CACHE_TIME
  ) {
    setWorkshops(workshopsCache);
    setLoading(false);
    return;
  }

  api.workshops()
    .then((data) => {
      if (!alive) return;

      const result = data.workshops || [];

      workshopsCache = result;
      workshopsCacheTime = Date.now();

      setWorkshops(result);
    })
    .catch(() => {
      if (alive) {
        setWorkshops([]);
      }
    })
    .finally(() => {
      if (alive) {
        setLoading(false);
      }
    });

  return () => {
    alive = false;
  };
}, []);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <>
      <Header cartCount={0} />

      <main className="bg-[#fbf7f1]">
        <section className="border-b border-[#e7dfd3] bg-[linear-gradient(180deg,#fffaf4_0%,#fbf7f1_100%)] py-8">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="mt-4 font-serif text-4xl leading-tight text-foreground md:text-6xl">
              Không Gian Sáng Tạo Hoa
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6f665d] md:text-base">
              Nơi bạn đắm chìm vào thế giới hương sắc mộc mạc, tự tay thiết kế
              và gửi gắm tâm tình qua các buổi hướng dẫn tận tình từ florist
              của chúng tôi.
            </p>
          </div>
        </section>

        <section className="relative w-full px-4 py-10 lg:px-8 xl:px-12">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-3">
              <div className="h-[520px] animate-pulse rounded-[2rem] bg-[#eee4d8]" />
              <div className="h-[520px] animate-pulse rounded-[2rem] bg-[#eee4d8]" />
              <div className="h-[520px] animate-pulse rounded-[2rem] bg-[#eee4d8]" />
            </div>
          ) : (
            <>
              {/* Nút trái */}
              <button
                onClick={scrollPrev}
                className="cursor-pointer absolute left-1 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition hover:scale-110 hover:bg-[#C49A6C] hover:text-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Slider */}
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-6">
                  {workshops.map((workshop) => (
                    <div
                      key={workshop.id}
                      className="min-w-[32%] flex-shrink-0"
                    >
                      <WorkshopCard workshop={workshop} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Nút phải */}
              <button
                onClick={scrollNext}
                className="cursor-pointer absolute right-1 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition hover:scale-110 hover:bg-[#C49A6C] hover:text-white"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}