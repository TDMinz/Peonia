import { useEffect, useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api, type WorkshopDto } from '../services/api';
import {
  ArrowLeft,
  CalendarDays,
  Users,
  MessageCircle,
  Clock3,
  Wallet,
  Star,
  UserRound,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

function renderStars(level = 1) {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      className={`h-4 w-4 ${index < level
        ? 'fill-[#f5b942] text-[#f5b942]'
        : 'text-[#d9d9d9]'
        }`}
    />
  ))
}

export default function WorkshopDetailPage({ id }: { id: string }) {
  const [workshop, setWorkshop] = useState<WorkshopDto | null>(null)
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState('')

  const images = useMemo<string[]>(() => {
    if (!workshop) return []

    return Array.from(
      new Set(
        [
          workshop.image_url,
          ...(workshop.images || []),
        ].filter((img): img is string => Boolean(img))
      )
    ).slice(0, 4)
  }, [workshop])

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]!)
    }
  }, [images])

  useEffect(() => {
    api.workshops().then((data) => {
      const found = data.workshops.find((w) => w.id === id)
      setWorkshop(found || null)
    })
  }, [id])

  if (!workshop) return null

  return (
    <>
      <Header cartCount={0} />

      <main className="bg-[#fbf7f1] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
          {/* Nút quay lại */}
          <div className="mb-4">
            <button
              onClick={() => navigate(-1)}
              className=" cursor-pointer inline-flex items-center gap-2 rounded-full border border-[#d8e1ea] bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-x-1 hover:border-[#C49A6C] hover:bg-[#C49A6C] hover:text-white"
            >
              <ArrowLeft size={18} />
              Quay lại
            </button>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] border border-[#e8edf3] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start p-4 lg:p-8">

              {/* ===== GALLERY ===== */}
              <div>
                <div className="overflow-hidden rounded-[2rem] bg-[#f6f7fb]">
                  <PhotoProvider maskOpacity={0.95} bannerVisible={false}>
                    <PhotoView src={selectedImage || images[0]}>
                      <img
                        src={selectedImage || images[0]}
                        alt={workshop.title}
                        className="h-[590px] w-full cursor-zoom-in rounded-[2rem] object-cover transition duration-300 hover:scale-[1.02]"
                      />
                    </PhotoView>
                  </PhotoProvider>
                </div>

                {/* Thumbnail ngang */}

              </div>

              {/* ===== THÔNG TIN ===== */}
              <div className="flex flex-col justify-start">
                <div className="inline-flex w-fit rounded-full bg-[#f8f4ef] px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-[#C49A6C]">
                  Workshop
                </div>



                {/* Thumbnail ngang dưới tiêu đề */}
                <h1 className="mt-4 font-serif text-3xl font-light leading-tight text-foreground lg:text-5xl">
                  {workshop.title}
                </h1>

                {/* Thumbnail dưới tiêu đề */}
                {images.length > 1 && (
                  <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
                    {images.map((src, index) => (
                      <button
                        key={`${src}-${index}`}
                        type="button"
                        onClick={() => setSelectedImage(src)}
                        className={`overflow-hidden rounded-2xl border-2 transition-all shrink-0 ${selectedImage === src
                          ? 'border-[#C49A6C] shadow-md'
                          : 'border-[#e8edf3] hover:border-[#d8c2a7]'
                          }`}
                      >
                        <img
                          src={src}
                          alt={`${workshop.title} ${index + 1}`}
                          className="h-20 w-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-6 grid gap-3 rounded-[2rem] bg-[#f8f4ef] p-5 text-sm text-[#5f564d]">

                  <div className="flex items-center gap-3">
                    <UserRound className="h-5 w-5 text-[#C49A6C]" />
                    <span>
                      <strong>Độ tuổi:</strong> {workshop.age_range || ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-[#C49A6C]" />
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Độ khó:</span>
                      <div className="flex items-center gap-1">
                        {renderStars(workshop.difficulty || 1)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-[#C49A6C]" />
                    <span>
                      <strong>Chi phí:</strong> {workshop.price.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock3 className="h-5 w-5 text-[#C49A6C]" />
                    <span>
                      <strong>Thời gian:</strong> {workshop.duration || ''}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSfklpVqBLoAM9Gn9sa-UUbO6Ls0F2A0YyqYv-bhWnrqT-_dOQ/viewform"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-[#C49A6C] px-5 py-4 text-sm font-medium text-white transition hover:bg-[#b38657]"
                  >
                    Đăng ký ngay
                  </a>

                  <a
                    href="https://zalo.me/0399389933"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-5 py-4 text-sm font-medium text-white transition hover:bg-sky-600"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Liên hệ ngay
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ===== MÔ TẢ ===== */}
          <section className="mt-16">
  <div className="rounded-[2.5rem] bg-white px-16 py-14 shadow-[0_20px_60px_rgba(15,23,42,.05)] lg:px-24">

    <div className="mb-10 text-center">
      <p className="text-sm uppercase tracking-[0.35em] text-[#8f9bb3]">
        Thông tin
      </p>

      <h2 className="mt-2 font-serif text-4xl font-light text-foreground">
        Mô Tả Workshop
      </h2>
    </div>

    <article
      className="
        prose
        prose-lg
        max-w-none

        prose-headings:font-serif
        prose-headings:font-light
        prose-headings:text-foreground

        prose-p:leading-9
        prose-p:mb-5

        prose-li:leading-9

        prose-ul:marker:text-slate-700
        prose-ol:marker:text-slate-700

        prose-strong:text-foreground
        prose-em:text-foreground

        prose-img:rounded-3xl
        prose-img:mx-auto
        prose-img:w-full
      "
      dangerouslySetInnerHTML={{
        __html: workshop.short_description|| "",
      }}
    />

  </div>
</section>
        </div>
      </main>

      <Footer />
    </>
  )
}