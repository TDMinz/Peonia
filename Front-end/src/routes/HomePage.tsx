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
    image: 'https://res.cloudinary.com/di4qsw8gl/image/upload/v1786001854/Gemini_Generated_Image_jltmxtjltmxtjltm_ivr1fc.png',
    title: '',
    subtitle: '',
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/di4qsw8gl/image/upload/v1786001602/Gemini_Generated_Image_sxyri3sxyri3sxyr_c0pp0v.png',
    title: '',
    subtitle: '',
    
  },
  {
    id: 3,
    image: 'https://res.cloudinary.com/di4qsw8gl/image/upload/v1786001045/Gemini_Generated_Image_v5lpzzv5lpzzv5lp_hrgazh.png',
    title: '',
    subtitle: '',
  },
  {
    id: 4,
    image: 'https://res.cloudinary.com/di4qsw8gl/image/upload/v1786001704/Gemini_Generated_Image_3sx6zs3sx6zs3sx6_o1bpbz.png',
    title: '',
    subtitle: '',
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
      image: 'https://res.cloudinary.com/di4qsw8gl/image/upload/v1785922878/1785921556703_7750340579882786894_7750340579882786894_692fc012c0e83edea4cd29e16500ed46_fxkjph.jpg',
      count: giftProducts.length,
    },
    {
      title: 'Trang Trí Nhà Ở',
      subtitle: 'Trang trí không gian sống',
      href: '/hoa-trang-tri/trang-tri-nha-o',
      image: 'https://res.cloudinary.com/di4qsw8gl/image/upload/v1785921107/1785921082445_7750340579882786894_7750340579882786894_ce8ecfc2ed886e6d0cd27e38186dee87_ywsbjj.jpg',
      count: interiorProducts.length,
    },
    {
      title: 'Workshop',
      subtitle: 'Học cách cắm hoa từ chuyên gia',
      href: '/workshop',
      image: 'https://res.cloudinary.com/di4qsw8gl/image/upload/v1785920180/1785916900869_7750340579882786894_7750340579882786894_c057b798a128b037e7a8cce82c7bc864_sblxpu.jpg',
    },
    {
      title: 'Events',
      subtitle: 'Trang trí sự kiện đặc biệt',
      href: '/events',
      image: 'https://res.cloudinary.com/di4qsw8gl/image/upload/v1785920174/1785916750526_7750340579882786894_7750340579882786894_c82212f115e74c975c38c0bf70fec389_zi7o8s.jpg',
    },
    {
      title: 'Trang Trí Văn Phòng',
      subtitle: 'Trang trí sự kiện đặc biệt',
      href: '/hoa-trang-tri/trang-tri-van-phong',
      image: 'https://res.cloudinary.com/di4qsw8gl/image/upload/v1785922811/1785921547802_7750340579882786894_7750340579882786894_0b7422f30b8b82c01b3df01469d582d4_k5exkw.jpg',
    },
    {
      title: 'Tiểu Cảnh',
      subtitle: 'Trang trí sự kiện đặc biệt',
      href: '/hoa-trang-tri/tieu-canh',
      image: 'https://res.cloudinary.com/di4qsw8gl/image/upload/v1785920942/1785920868272_7750340579882786894_7750340579882786894_0fcfb7876d7ffdc7babaa3cad124b7bf_tsb9ul.jpg',
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

        




        <section className="group relative overflow-hidden py-13">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-out group-hover:scale-110"
            style={{
    backgroundImage: `url("https://res.cloudinary.com/di4qsw8gl/image/upload/v1786001777/Gemini_Generated_Image_b0gy41b0gy41b0gy_r954o5.png")`,
  }}
          />

          <div className="absolute inset-0 bg-black/10 bg-white/45" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[500px] w-[850px] rounded-full bg-white/45 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d8cfc4] bg-white/70 px-5 py-2 text-sm text-[#8f877d] backdrop-blur">
              ✿ Peonia Studio ✿
            </div>

            <h2 className="mt-8 font-serif text-6xl font-light leading-tight text-foreground">
            Bạn Đang Đi Tìm Một
              <br />
              <span className="italic">
               Bản Phối Nghệ Thuật Độc Nhất?
              </span>
            </h2>

            <p className="mt-6 text-2xl font-light text-[#5c5248]">
            🌸 Nơi mỗi cánh hoa kể một câu chuyện riêng, và mỗi buổi workshop là một hành trình chạm vào bình yên của tâm hồn.

            </p>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-9 text-[#4f463f]">
            Dù là một nhành hoa gửi trao tâm tình, món quà sang trọng gửi đối tác, hay một không gian workshop gắn kết thiết kế riêng… Hãy để chúng mình biến ý tưởng của bạn thành tác phẩm nghệ thuật mang đậm dấu ấn cá nhân.
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
