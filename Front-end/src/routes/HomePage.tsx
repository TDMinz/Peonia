import { ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useState } from 'react';
import BannerCarousel from '../components/BannerCarousel';
import Footer from '../components/Footer';
import Header from '../components/Header';

import { api, type ProductDto } from '../services/api';

import { useRef } from "react";
import ProductSlide from "../components/ProductSlide";



const banners = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/di4qsw8gl/image/upload/v1781431550/z7935468161539_da0f5053c8580ac80a4219fe0621eadb_pybuod.jpg',
    title: 'Hoa Tươi Sang Trọng',
    subtitle: 'Biểu lộ tình cảm của bạn qua những bó hoa độc đáo',
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/di4qsw8gl/image/upload/v1781431550/z7935468161539_da0f5053c8580ac80a4219fe0621eadb_pybuod.jpg',
    title: 'Bộ Sưu Tập Mới',
    subtitle: 'Khám phá những sáng tạo hoa tươi nhất của mùa',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1549927537-b46e30f19eac?w=1200&h=500&fit=crop',
    title: 'Dịch Vụ Events',
    subtitle: 'Trang trí sự kiện đặc biệt của bạn với hoa tươi',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=1200&h=500&fit=crop',
    title: 'Workshop Cắm Hoa',
    subtitle: 'Học cách tạo những bó hoa đẹp từ các chuyên gia',
  },
];

const categoryRanges = {
  gifts: { start: '686b00000000000000000002', end: '686b00000000000000000008' },
  interiors: { start: '686b00000000000000000009', end: '686b00000000000000000012' },
};

function idInRange(id?: string | null, start?: string, end?: string) {
  if (!id || !start || !end) return false;
  return id >= start && id <= end;
}

function formatPrice(value?: number) {
  if (typeof value !== 'number') return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
}

function mapToCard(product: ProductDto) {
  const image = product.images?.[0] || product.image_url || '';

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: formatPrice(product.sale_price ?? product.price),
    originalPrice:
      product.sale_price &&
      product.price &&
      product.sale_price < product.price
        ? formatPrice(product.price)
        : undefined,
    image,
    tag: product.is_featured
      ? 'HOT'
      : product.is_best_seller
      ? 'BEST'
      : undefined,
  };
}

export function HomePage() {
  const [products, setProducts] = useState<ProductDto[]>([]);

  useEffect(() => {
    api.products()
      .then((data) => setProducts(data.products || []))
      .catch(() => setProducts([]));
  }, []);

  const hotProducts = useMemo(() => products.filter((p) => p.is_featured), [products]);
  const bestSellers = useMemo(() => products.filter((p) => p.is_best_seller), [products]);
  const giftProducts = useMemo(() => products.filter((p) => idInRange(p.categoryId, categoryRanges.gifts.start, categoryRanges.gifts.end)), [products]);
  const interiorProducts = useMemo(() => products.filter((p) => idInRange(p.categoryId, categoryRanges.interiors.start, categoryRanges.interiors.end)), [products]);

  const categoryBanner = [
    {
      title: 'Hoa Giỏ',
      subtitle: 'Biểu lộ tình cảm của bạn',
      href: '/hoa-qua-tang/hoa-gio',
      image: 'https://res.cloudinary.com/di4qsw8gl/image/upload/v1781521826/z7905554251089_d25cb20ea2eeeac6ec013ad3d8d2945a_gvdovu.jpg',
      count: giftProducts.length,
    },
    {
      title: 'Trang Trí Nhà Ở',
      subtitle: 'Trang trí không gian sống',
      href: '/hoa-trang-tri/trang-tri-nha-o',
      image: 'https://res.cloudinary.com/di4qsw8gl/image/upload/v1781521894/z7905554241206_ca5c06b0315ac0fbe08b82aafc9ef5fe_pnzytm.jpg',
      count: interiorProducts.length,
    },
    {
      title: 'Workshop',
      subtitle: 'Học cách cắm hoa từ chuyên gia',
      href: '/workshop',
      image: 'https://res.cloudinary.com/di4qsw8gl/image/upload/v1780831589/z7905554232472_b0595644981027c31fb1b89e9ec42ee1_e0ypko.jpg',
    },
    {
      title: 'Events',
      subtitle: 'Trang trí sự kiện đặc biệt',
      href: '/events',
      image: 'https://res.cloudinary.com/di4qsw8gl/image/upload/v1781522015/z7905554239105_6ce25010469fa39e6d29eb743cb5a0a0_whycql.jpg',
    },
    {
      title: 'Trang Trí Văn Phòng',
      subtitle: 'Trang trí sự kiện đặc biệt',
      href: '/hoa-trang-tri/trang-tri-van-phong',
      image: 'https://res.cloudinary.com/di4qsw8gl/image/upload/v1781522345/z7935621144414_6b8d405f1ec215e73f025c90670177fc_gmdito.jpg',
    },
    {
      title: 'Tiểu Cảnh',
      subtitle: 'Trang trí sự kiện đặc biệt',
      href: '/hoa-trang-tri/tieu-canh',
      image: 'https://res.cloudinary.com/di4qsw8gl/image/upload/v1781522271/Cute_Farms_Terrarium_Kit_-_Website_Cover_82aed1c5-d734-4828-a2fa-41f7969ad414_ghmibm.jpg',
    },
  ];

  return (
    <>
      <Header cartCount={0} />
      <main className="min-h-screen bg-background">
        <BannerCarousel banners={banners} />
        <section className="bg-[#f3ece3] py-20">
          <div className="w-full ">

            <div className="grid gap-6 lg:grid-cols-2">

              {/* CỘT TRÁI */}
              <div className="grid gap-6">

                {/* Ảnh lớn */}
                <a
                  href={categoryBanner[0]?.href}
                  className="group relative block h-[420px] overflow-hidden rounded-3xl"
                >
                  <img
                    src={categoryBanner[0]?.image}
                    alt={categoryBanner[0]?.title}
                    className="
      h-full
      w-full
      object-cover
      transition-all
      duration-700
      group-hover:scale-110
    "
                  />

                  {/* Shine Effect */}
                  <div
                    className="
      absolute inset-0
      -translate-x-full
      bg-gradient-to-r
      from-transparent
      via-white/20
      to-transparent
      transition-transform
      duration-1000
      group-hover:translate-x-full
      z-10
    "
                  />

                  {/* Overlay */}
                  <div
                    className="
      absolute inset-0
      bg-black/20
      transition-all
      duration-500
      group-hover:bg-black/40
    "
                  />

                  {/* Text */}
                  <div
                    className="
      absolute bottom-6 left-6 z-20
      text-white
      transition-all
      duration-500
      group-hover:-translate-y-2
    "
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-xs uppercase tracking-[0.3em]">
                        Xem thêm
                      </p>

                      <ArrowUpRight
                        className="
          h-4 w-4
          opacity-0
          transition-all
          duration-500
          group-hover:translate-x-1
          group-hover:-translate-y-1
          group-hover:opacity-100
        "
                      />
                    </div>

                    <h3 className="mt-2 font-serif text-3xl">
                      {categoryBanner[0]?.title}
                    </h3>
                  </div>
                </a>

                {/* 2 ảnh nhỏ */}
                <div className="grid grid-cols-2 gap-6">
                  {[categoryBanner[1], categoryBanner[2]].map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      className="
        group
        relative
        block
        h-[260px]
        overflow-hidden
        rounded-3xl
        transition-all
        duration-500
        hover:-translate-y-1
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)]
      "
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="
          h-full
          w-full
          object-cover
          transition-all
          duration-700
          group-hover:scale-110
        "
                      />

                      {/* Shine Effect */}
                      <div
                        className="
          absolute
          inset-0
          z-10
          -translate-x-full
          bg-gradient-to-r
          from-transparent
          via-white/20
          to-transparent
          transition-transform
          duration-1000
          group-hover:translate-x-full
        "
                      />

                      {/* Overlay */}
                      <div
                        className="
          absolute
          inset-0
          bg-black/20
          transition-all
          duration-500
          group-hover:bg-black/40
        "
                      />

                      {/* Content */}
                      <div
                        className="
          absolute
          bottom-5
          left-5
          z-20
          text-white
          transition-all
          duration-500
          group-hover:-translate-y-2
        "
                      >
                        <div className="flex items-center gap-2">
                          <p className="text-xs uppercase tracking-[0.2em]">
                            Xem thêm
                          </p>

                          <ArrowUpRight
                            className="
              h-4
              w-4
              opacity-0
              transition-all
              duration-500
              group-hover:translate-x-1
              group-hover:-translate-y-1
              group-hover:opacity-100
            "
                          />
                        </div>

                        <h3 className="mt-1 font-serif text-xl">
                          {item.title}
                        </h3>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* CỘT PHẢI */}
              <div className="grid gap-6">

                {/* 2 ảnh nhỏ */}
                <div className="grid grid-cols-2 gap-6">

                  {/* Card 1 */}
                  <a
                    href={categoryBanner[3]?.href}
                    className="
        group
        relative
        block
        h-[260px]
        overflow-hidden
        rounded-3xl
        transition-all
        duration-500
        hover:-translate-y-1
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)]
      "
                  >
                    <img
                      src={categoryBanner[3]?.image}
                      alt={categoryBanner[3]?.title}
                      className="
          h-full
          w-full
          object-cover
          transition-all
          duration-700
          group-hover:scale-110
        "
                    />

                    {/* Shine Effect */}
                    <div
                      className="
          absolute inset-0 z-10
          -translate-x-full
          bg-gradient-to-r
          from-transparent
          via-white/20
          to-transparent
          transition-transform
          duration-1000
          group-hover:translate-x-full
        "
                    />

                    {/* Overlay */}
                    <div
                      className="
          absolute inset-0
          bg-black/20
          transition-all
          duration-500
          group-hover:bg-black/40
        "
                    />

                    {/* Text */}
                    <div
                      className="
          absolute bottom-5 left-5 z-20
          text-white
          transition-all
          duration-500
          group-hover:-translate-y-2
        "
                    >
                      <div className="flex items-center gap-2">
                        <p className="text-xs uppercase tracking-[0.2em]">
                          Xem thêm
                        </p>

                        <ArrowUpRight
                          className="
              h-4 w-4
              opacity-0
              transition-all
              duration-500
              group-hover:translate-x-1
              group-hover:-translate-y-1
              group-hover:opacity-100
            "
                        />
                      </div>

                      <h3 className="mt-1 font-serif text-xl">
                        {categoryBanner[3]?.title}
                      </h3>
                    </div>
                  </a>

                  {/* Card 2 */}
                  <a
                    href={categoryBanner[4]?.href}
                    className="
        group
        relative
        block
        h-[260px]
        overflow-hidden
        rounded-3xl
        transition-all
        duration-500
        hover:-translate-y-1
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)]
      "
                  >
                    <img
                      src={categoryBanner[4]?.image}
                      alt={categoryBanner[4]?.title}
                      className="
          h-full
          w-full
          object-cover
          transition-all
          duration-700
          group-hover:scale-110
        "
                    />

                    {/* Shine Effect */}
                    <div
                      className="
          absolute inset-0 z-10
          -translate-x-full
          bg-gradient-to-r
          from-transparent
          via-white/20
          to-transparent
          transition-transform
          duration-1000
          group-hover:translate-x-full
        "
                    />

                    {/* Overlay */}
                    <div
                      className="
          absolute inset-0
          bg-black/20
          transition-all
          duration-500
          group-hover:bg-black/40
        "
                    />

                    {/* Text */}
                    <div
                      className="
          absolute bottom-5 left-5 z-20
          text-white
          transition-all
          duration-500
          group-hover:-translate-y-2
        "
                    >
                      <div className="flex items-center gap-2">
                        <p className="text-xs uppercase tracking-[0.2em]">
                          Xem thêm
                        </p>

                        <ArrowUpRight
                          className="
              h-4 w-4
              opacity-0
              transition-all
              duration-500
              group-hover:translate-x-1
              group-hover:-translate-y-1
              group-hover:opacity-100
            "
                        />
                      </div>

                      <h3 className="mt-1 font-serif text-xl">
                        {categoryBanner[4]?.title}
                      </h3>
                    </div>
                  </a>

                </div>

                {/* Ảnh lớn dưới */}
                <a
                  href={categoryBanner[5]?.href}
                  className="
      group
      relative
      block
      h-[420px]
      overflow-hidden
      rounded-3xl
      transition-all
      duration-500
      hover:-translate-y-1
      hover:shadow-[0_25px_60px_rgba(0,0,0,0.25)]
    "
                >
                  <img
                    src={categoryBanner[5]?.image}
                    alt={categoryBanner[5]?.title}
                    className="
        h-full
        w-full
        object-cover
        transition-all
        duration-700
        group-hover:scale-110
      "
                  />

                  {/* Shine Effect */}
                  <div
                    className="
        absolute inset-0 z-10
        -translate-x-full
        bg-gradient-to-r
        from-transparent
        via-white/20
        to-transparent
        transition-transform
        duration-1000
        group-hover:translate-x-full
      "
                  />

                  {/* Overlay */}
                  <div
                    className="
        absolute inset-0
        bg-black/20
        transition-all
        duration-500
        group-hover:bg-black/40
      "
                  />

                  {/* Text */}
                  <div
                    className="
        absolute bottom-6 left-6 z-20
        text-white
        transition-all
        duration-500
        group-hover:-translate-y-2
      "
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-xs uppercase tracking-[0.3em]">
                        Xem thêm
                      </p>

                      <ArrowUpRight
                        className="
            h-4 w-4
            opacity-0
            transition-all
            duration-500
            group-hover:translate-x-1
            group-hover:-translate-y-1
            group-hover:opacity-100
          "
                      />
                    </div>

                    <h3 className="mt-2 font-serif text-3xl">
                      {categoryBanner[5]?.title}
                    </h3>
                  </div>
                </a>

              </div>



            </div>

          </div>
        </section>

        <section className="bg-white py-20">

          {/* Tiêu đề vẫn giới hạn chiều rộng */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">


              <h2 className="font-serif text-3xl font-light text-foreground">
                SẢN PHẨM HOT
              </h2>

              <p className="mt-4 text-muted-foreground">
                Những sản phẩm được yêu thích nhất với giá đặc biệt
              </p>
            </div>
          </div>

          {/* Danh sách sản phẩm full width */}
          <ProductSlide
            products={hotProducts}
            mapToCard={mapToCard}
          />
        </section>

        <section className="bg-[#f3ece3] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">


              <h2 className="font-serif text-3xl font-light text-foreground">
                SẢN PHẨM BÁN CHẠY
              </h2>

              <p className="mt-4 text-muted-foreground">
                Những sản phẩm được tiếp cận nhiều nhất và bán chạy với nhiều ưu đãi
              </p>
            </div>
          </div>

          {/* Danh sách sản phẩm full width */}
          <ProductSlide
            products={bestSellers}
            mapToCard={mapToCard}
          />
        </section>

        <section className="bg-white py-20">

          {/* Tiêu đề vẫn giới hạn chiều rộng */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">


              <h2 className="font-serif text-3xl font-light text-foreground">
                SẢN PHẨM MỚI
              </h2>

              <p className="mt-4 text-muted-foreground">
                Những mẫu sản phẩm mới, độc đáo và đầy cá tính
              </p>
            </div>
          </div>

          {/* Danh sách sản phẩm full width */}
          <ProductSlide
            products={hotProducts}
            mapToCard={mapToCard}
          />
        </section>




        <section className="group relative overflow-hidden py-13">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-out group-hover:scale-110"
            style={{
              backgroundImage: `url("https://res.cloudinary.com/di4qsw8gl/image/upload/v1781688747/t%E1%BA%A3i_xu%E1%BB%91ng_9_pwv0sw.jpg")`,
            }}
          />

          <div className="absolute inset-0 bg-black/10 bg-white/45" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[500px] w-[850px] rounded-full bg-white/45 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d8cfc4] bg-white/70 px-5 py-2 text-sm text-[#8f877d] backdrop-blur">
              ✿ Peonia Floral Studio ✿
            </div>

            <h2 className="mt-8 font-serif text-6xl font-light leading-tight text-foreground">
              Bạn Đang Tìm Một
              <br />
              <span className="italic">
                Bó Hoa Độc Nhất?
              </span>
            </h2>

            <p className="mt-6 text-2xl font-light text-[#5c5248]">
              🌸 Hay một workshop riêng cho nhóm của mình?
            </p>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-9 text-[#4f463f]">
              Từ bó hoa sinh nhật, hoa cưới, quà tặng doanh nghiệp đến
              workshop riêng tư cho gia đình, bạn bè hoặc công ty —
              Peonia luôn sẵn sàng tạo nên một trải nghiệm mang dấu ấn riêng.
            </p>
            <div className="absolute left-20 top-24 text-3xl opacity-40 transition-all duration-700 group-hover:-translate-y-3 group-hover:rotate-12">
              🌸
            </div>

            <div className="absolute right-24 top-32 text-4xl opacity-40 transition-all duration-700 group-hover:-translate-y-4">
              ✨
            </div>

            <div className="absolute bottom-24 left-32 text-3xl opacity-40 transition-all duration-700 group-hover:translate-y-[-10px]">
              🌿
            </div>
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(
                  new Event('peonia-open-contact-panel')
                )
              }
              className="mt-12 rounded-full bg-[#063c33] px-10 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:bg-[#0b4f43]"
            >
              💌 Liên Hệ Ngay
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
