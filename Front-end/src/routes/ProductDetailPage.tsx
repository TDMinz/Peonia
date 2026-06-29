import { ArrowLeft, CheckCircle2, Minus, Plus, ShoppingCart, Phone, MessageCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from "react-router-dom";
import { api, type CategoryDto, type ProductDto } from '../services/api';
import { addToCart } from '../services/cart';
import {
  PhotoProvider,
  PhotoView,
} from "react-photo-view";

import "react-photo-view/dist/react-photo-view.css";

function formatPrice(value?: number) {
  if (typeof value !== 'number') return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
}

export default function ProductDetailPage({ slug }: { slug: string }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] =
    useState('');


  useEffect(() => {
    let mounted = true;
    Promise.all([api.products(), api.categories({ is_active: true })])
      .then(([productData, categoryData]) => {
        if (!mounted) return;
        setProducts(productData.products || []);
        setCategories(categoryData.categories || []);
      })
      .catch(() => {
        if (mounted) {
          setProducts([]);
          setCategories([]);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);


  const normalizedSlug = decodeURIComponent(slug).trim().toLowerCase();
  const product = useMemo(() => products.find((item) => String(item.slug || '').trim().toLowerCase() === normalizedSlug), [products, normalizedSlug]);

  const images = useMemo<string[]>(() => {
    if (!product) return [];

    return Array.from(
      new Set(
        [product.image_url, ...(product.images || [])].filter(
          (img): img is string => Boolean(img)
        )
      )
    ).slice(0, 4);
  }, [product]);
  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]!);
    }
  }, [images]);

  const categoryIds = useMemo(() => {
    if (!product) return [] as string[];
    return [product.categoryId, ...(product.category_ids || [])].filter(Boolean).map(String);
  }, [product]);

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((item) => item.id !== product.id)
      .filter((item) => {
        const ids = [item.categoryId, ...(item.category_ids || [])].filter(Boolean).map(String);
        return ids.some((id) => categoryIds.includes(id));
      })
      .slice(0, 8);
  }, [products, product, categoryIds]);

  const price = formatPrice(product?.sale_price ?? product?.price);
  const originalPrice = product?.sale_price && product?.price && product.sale_price < product.price ? formatPrice(product.price) : '';

  if (loading) {
    return (
      <>
        <Header cartCount={0} />
        <main className="bg-[#fbf7f1] px-4 py-20">
          <div className="mx-auto max-w-7xl animate-pulse rounded-[2rem] border border-[#e8edf3] bg-white p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="h-[620px] rounded-[1.75rem] bg-[#f6f7fb]" />
              <div className="space-y-4">
                <div className="h-8 w-1/2 rounded bg-[#f6f7fb]" />
                <div className="h-6 w-1/4 rounded bg-[#f6f7fb]" />
                <div className="h-24 rounded bg-[#f6f7fb]" />
                <div className="h-14 rounded-full bg-[#f6f7fb]" />
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header cartCount={0} />
        <main className="bg-[#fbf7f1] px-4 py-20">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#e8edf3] bg-white p-10 text-center">
            <h1 className="font-serif text-4xl text-foreground">Không tìm thấy sản phẩm</h1>
            <p className="mt-4 text-sm text-[#6f7b8b]">Slug bạn mở chưa khớp với dữ liệu sản phẩm hiện có.</p>
            <a href="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-950 px-6 py-3 text-sm font-medium text-white">
              <ArrowLeft className="h-4 w-4" /> Quay lại trang chủ
            </a>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header cartCount={0} />
      <main className="bg-[#fbf7f1] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
        <div className="mb-4">
          <button
  onClick={() => navigate(-1)}
  className="
    inline-flex
    items-center
    gap-2
    rounded-full
    border
    border-[#d8e1ea]
    bg-white
    px-5
    py-3
    text-sm
    font-medium
    text-slate-700
    shadow-sm
    transition
    hover:-translate-x-1
    hover:border-emerald-900
    hover:bg-emerald-950
    hover:text-white
  "
>
  <ArrowLeft size={18} />
  Quay lại
</button>
        </div>

          <div className="overflow-hidden rounded-[2.5rem] border border-[#e8edf3] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <div className="grid lg:grid-cols-2">
              <div className="border-b border-[#e8edf3] bg-[#f6f7fb] p-4 lg:border-b-0 lg:border-r">
                <div className="overflow-hidden rounded-[2rem] bg-white">
                  <PhotoProvider
                    maskOpacity={0.95}
                    bannerVisible={false}
                  >
                    <PhotoView
                      src={
                        selectedImage ||
                        images[0] ||
                        product.image_url ||
                        ""
                      }
                    >
                      <img
                        src={
                          selectedImage ||
                          images[0] ||
                          product.image_url ||
                          ""
                        }
                        alt={product.name}
                        className="
          h-[700px]
          w-full
          cursor-zoom-in
          rounded-[2rem]
          object-cover
          transition
          duration-300
          hover:scale-[1.02]
        "
                      />
                    </PhotoView>
                  </PhotoProvider>
                </div>
              </div>

              <div className="p-6 lg:p-10">
                <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-emerald-700">
                  {product.is_featured ? 'HOT' : product.is_best_seller ? 'BEST SELLER' : 'Sản phẩm'}
                </div>
                <h1 className="mt-4 font-serif text-4xl font-light text-foreground lg:text-5xl">{product.name}</h1>
                <div className="mt-4 flex items-center gap-3">
                  <p className="text-3xl font-semibold text-foreground">{price}</p>
                  {originalPrice ? <p className="text-lg text-[#8f9bb3] line-through">{originalPrice}</p> : null}
                </div>


                {images.length > 1 && (
                  <div className="mt-5">
                    <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#8f9bb3]">
                      Hình ảnh sản phẩm
                    </p>

                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {images.map((src, index) => (
                        <button
                          key={`${src}-${index}`}
                          type="button"
                          onClick={() =>
                            setSelectedImage(src)
                          }
                          className={`
            overflow-hidden
            rounded-2xl
            border-2
            transition-all
            shrink-0
            ${selectedImage === src
                              ? 'border-emerald-700'
                              : 'border-[#e8edf3]'
                            }
          `}
                        >
                          <img
                            src={src}
                            alt={`${product.name} ${index + 1
                              }`}
                            className="h-24 w-24 object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}



                <div className="mt-8 rounded-[1.5rem] border border-[#e8edf3] bg-white p-5 shadow-[0_10px_25px_rgba(15,23,42,0.03)]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">Số lượng</p>
                      <p className="mt-1 text-xs text-[#8f9bb3]">Chọn số lượng mong muốn</p>
                    </div>
                    <div className="inline-flex items-center rounded-full border border-[#e8edf3] bg-[#f6f7fb] p-1">
                      <button type="button" onClick={() => setQuantity((v) => Math.max(1, v - 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                      <button type="button" onClick={() => setQuantity((v) => v + 1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <button
                      type="button"
                      onClick={() =>
                        addToCart(
                          {
                            id: String(product.id),
                            product_id: String(product.id),
                            name: product.name,
                            price,
                            image:
                              selectedImage ||
                              images[0] ||
                              product.image_url ||
                              '',
                          },
                          quantity
                        )
                      }
                      className="w-full rounded-full bg-emerald-950 px-5 py-4 text-sm font-medium text-white transition hover:bg-emerald-900"
                    >
                      <ShoppingCart className="mr-2 inline h-4 w-4" />
                      Thêm vào giỏ
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href="tel:0963552971"
                        className="
        flex items-center justify-center gap-2
        rounded-full
        bg-lime-600
        px-4 py-3
        text-sm font-semibold
        text-white
        transition
        hover:bg-lime-700
      "
                      >
                        <Phone className="h-4 w-4" /> 0352363833
                      </a>

                      <a
                        href="https://zalo.me/0352363833"
                        target="_blank"
                        rel="noreferrer"
                        className="
        flex items-center justify-center gap-2
        rounded-full
        bg-sky-500
        px-4 py-3
        text-sm font-semibold
        text-white
        transition
        hover:bg-sky-600
      "
                      >
                        <MessageCircle className="h-4 w-4" />
                        ZALO
                      </a>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" /> Thanh toán an toàn, giao nhanh, đóng gói tinh tế.
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ================= MÔ TẢ SẢN PHẨM ================= */}

          <section className="mt-16">

            <div className="rounded-[2.5rem] bg-white px-16 lg:px-24 py-14 shadow-[0_20px_60px_rgba(15,23,42,.05)]">

              <div className="mb-10 text-center">

                <p className="text-sm uppercase tracking-[0.35em] text-[#8f9bb3]">
                  Thông tin
                </p>

                <h2 className="mt-2 font-serif text-4xl font-light text-foreground">
                  Mô Tả Sản Phẩm
                </h2>

              </div>

              <article
                className="
        prose
    prose-lg
    max-w-none

    prose-headings:font-serif
    prose-headings:font-light

    prose-p:leading-9
    prose-li:leading-9

    prose-ul:marker:text-slate-700
    prose-ol:marker:text-slate-700

    prose-img:rounded-3xl
    prose-img:mx-auto
    prose-img:w-full
      "
                dangerouslySetInnerHTML={{
                  __html: product.description || "",
                }}
              />

            </div>

          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}
