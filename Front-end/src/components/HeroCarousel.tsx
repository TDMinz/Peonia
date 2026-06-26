import type { Banner } from '../types';

type Props = {
  banners: Banner[];
};

export function HeroCarousel({ banners }: Props) {
  const banner = banners[0];

  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-4 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <a href={banner.href || '#'} className="relative overflow-hidden bg-[#f6efe7]">
          <img src={banner.image} alt={banner.title} className="h-[420px] w-full object-cover md:h-[560px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
            <p className="text-xs uppercase tracking-[0.45em] opacity-80">{banner.subtitle}</p>
            <h1 className="mt-4 font-serif text-4xl md:text-6xl">{banner.title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 opacity-90">{banner.description}</p>
          </div>
        </a>
        <div className="grid gap-4">
          {banners.slice(1).map((item) => (
            <a key={item.title} href={item.href || '#'} className="relative min-h-[210px] overflow-hidden bg-[#f6efe7]">
              <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-black/35" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="text-xs uppercase tracking-[0.4em] opacity-80">{item.subtitle}</p>
                <h2 className="mt-2 font-serif text-3xl">{item.title}</h2>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
