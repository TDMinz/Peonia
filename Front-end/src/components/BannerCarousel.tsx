import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";

type Banner = {
  id: number;
  image: string;
  title: string;
  subtitle?: string;
};

type BannerCarouselProps = {
  banners: Banner[];
};

export default function BannerCarousel({
  banners,
}: BannerCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      dragFree: false,
    },
    [
      Autoplay({
        delay: 5000,
        stopOnInteraction: false,
      }),
    ]
  );

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);


  return (
    <section className="relative overflow-hidden">

      <div
        className="overflow-hidden"
        ref={emblaRef}
      >
        <div className="flex">

          {banners.map((banner) => (
            <div
              key={banner.id}
              className="min-w-0 flex-[0_0_100%]"
            >
              <div className="relative aspect-[16/6] w-full">

                <img
                  src={banner.image}
                  alt={banner.title}
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 p-6 text-white md:p-12">
                  <h2 className="font-serif text-3xl font-light md:text-5xl">
                    {banner.title}
                  </h2>

                  {banner.subtitle && (
                    <p className="mt-2 text-lg text-white/90">
                      {banner.subtitle}
                    </p>
                  )}
                </div>

              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Left */}
      <button
        onClick={scrollPrev}
        className="
          absolute
          left-6
          top-1/2
          z-20
          -translate-y-1/2
          rounded-full
          bg-white/20
          p-3
          text-white
          backdrop-blur-md
          transition
          hover:bg-white/40
        "
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right */}
      <button
        onClick={scrollNext}
        className="
          absolute
          right-6
          top-1/2
          z-20
          -translate-y-1/2
          rounded-full
          bg-white/20
          p-3
          text-white
          backdrop-blur-md
          transition
          hover:bg-white/40
        "
      >
        <ChevronRight size={24} />
      </button>

    </section>
  );
}