import {
  BookOpen,
  Clock3,
  Coins,
  Flower2,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { getCartItems } from "../services/cart";

export default function CourseHoaLuaCoBanPage() {
  // =========================
  // CART
  // =========================

  const cartItems = getCartItems();

  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  return (
    <>
      {/* =========================
          HEADER
      ========================= */}

      <Header cartCount={cartCount} />

      {/* =========================
          MAIN
      ========================= */}

      <main className="min-h-screen bg-[#faf8f2] text-[#302820]">

        {/* =========================
            COURSE POSTER
        ========================= */}

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

          <div className="grid gap-5 lg:grid-cols-[1.55fr_0.95fr]">

            {/* =================================================
                LEFT COLUMN
            ================================================= */}

            <div className="space-y-4">

              {/* =========================
                  TITLE
              ========================= */}

              <section className="rounded-2xl border border-[#d6b85c] bg-[#fffdf7] px-6 py-7 text-center shadow-sm">

                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#80651d]">
                  Peonia Workshops & Academy
                </p>

                <h1 className="mt-3 font-serif text-3xl font-bold uppercase leading-tight text-[#8b6518] sm:text-4xl">
                  Khóa học cơ bản
                  <br />
                  cắm hoa lụa
                </h1>

                <p className="mt-2 text-base italic text-[#806f4d]">
                  Chương trình Đào tạo Thực hành Gọn (05 Ngày)
                </p>

              </section>


              {/* =========================
                  INFO
              ========================= */}

              <section className="rounded-2xl border border-[#d6b85c] bg-[#fffdf7] p-5">

                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4e8bd] text-[#8b6518]">
                      <Clock3 className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#5d4725]">
                        Thời lượng
                      </p>

                      <p className="text-sm text-[#51473c]">
                        05 ngày học thực hành cốt lõi
                      </p>
                    </div>

                  </div>


                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4e8bd] text-[#8b6518]">
                      <CalendarDays className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#5d4725]">
                        Khung giờ
                      </p>

                      <p className="text-sm leading-6 text-[#51473c]">
                        Sáng 09h30 - 11h30
                        <br />
                        Chiều 13h30 - 15h30
                      </p>
                    </div>

                  </div>

                </div>

                <div className="mt-5 flex items-center justify-between rounded-xl border border-[#ead9a7] bg-[#fff9e9] px-5 py-4">

                  <div className="flex items-center gap-3">

                    <Coins className="h-6 w-6 text-[#8b6518]" />

                    <span className="font-bold text-[#604a20]">
                      Học phí khóa học
                    </span>

                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-[#8b6518]">
                      12.xxx.xxx
                    </p>

                    <p className="text-xs font-semibold text-[#604a20]">
                      VNĐ
                    </p>
                  </div>

                </div>

              </section>


              {/* =========================
                  LỘ TRÌNH
              ========================= */}

              <section className="rounded-2xl border border-[#d6b85c] bg-[#fffdf7] p-5 sm:p-6">

                <div className="mb-5 flex items-center gap-3 border-b border-[#e7d9b3] pb-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8b6518] text-white">
                    <BookOpen className="h-5 w-5" />
                  </div>

                  <h2 className="font-serif text-xl font-bold uppercase text-[#806019] sm:text-2xl">
                    Lộ trình đào tạo thực hành (05 ngày)
                  </h2>

                </div>


                <div className="space-y-3">

                  <CourseDay
                    day="Ngày 1"
                    title="Phối Màu & Bố Cục Nền Tảng"
                  >
                    <p>
                      • Lý thuyết bánh xe màu sắc và nguyên lý phối màu cơ bản.
                    </p>

                    <p>
                      • Quy tắc phân bổ tỷ lệ và form dáng cắm hoa.
                    </p>
                  </CourseDay>


                  <CourseDay
                    day="Ngày 2"
                    title="Bình Hoa 1 Mặt & Bình Để Bàn"
                  >
                    <p>
                      • Thực hành cắm bình hoa 1 mặt.
                    </p>

                    <p>
                      • Thực hành cắm bình hoa để bàn cơ bản.
                    </p>

                    <p>
                      • Lưu ý: Không học bình hoa 3 mặt.
                    </p>
                  </CourseDay>


                  <CourseDay
                    day="Ngày 3"
                    title="Lan Hồ Điệp Tiểu Cảnh"
                  >
                    <p>
                      • Kỹ thuật cắm và ghép chậu Lan Hồ Điệp cơ bản.
                    </p>

                    <p>
                      • Trang trí tiểu cảnh gốc cây và rêu đá.
                    </p>
                  </CourseDay>


                  <CourseDay
                    day="Ngày 4"
                    title="Bó Hoa Style Hàn Quốc"
                  >
                    <p>
                      • Kỹ thuật cắm và tạo dáng bó hoa style Hàn Quốc.
                    </p>

                    <p>
                      • Kỹ thuật bọc giấy gói và thắt nơ hoàn thiện.
                    </p>
                  </CourseDay>


                  <CourseDay
                    day="Ngày 5"
                    title="Giỏ Hoa Style Hàn Quốc"
                  >
                    <p>
                      • Thực hành cắm giỏ hoa style Hàn Quốc đơn giản.
                    </p>

                    <p>
                      • Định giá sản phẩm & tổng kết khóa học.
                    </p>
                  </CourseDay>

                </div>

              </section>


              {/* =========================
                  ĐIỀU KIỆN
              ========================= */}

              <section className="rounded-2xl border border-[#d6b85c] bg-[#fffdf7] p-5 sm:p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8b6518] text-white">
                    <AlertCircle className="h-5 w-5" />
                  </div>

                  <h2 className="font-serif text-xl font-bold uppercase text-[#806019]">
                    Lưu ý về điều kiện gói cơ bản
                  </h2>

                </div>


                <div className="mt-5 space-y-3">

                  <ConditionItem>
                    Lược bớt các bài học nâng cao.
                  </ConditionItem>

                  <ConditionItem>
                    Không áp dụng chính sách bảo hành kiến thức trọn đời.
                  </ConditionItem>

                  <ConditionItem>
                    Không hỗ trợ đầy đủ catalogue & bộ mẫu sản phẩm độc quyền
                    của Peonia.
                  </ConditionItem>

                </div>

              </section>

            </div>


            {/* =================================================
                RIGHT COLUMN
            ================================================= */}

            <aside>

              <div className="sticky top-24 rounded-2xl border-2 border-[#d6b85c] bg-[#fffdf7] p-4 shadow-sm">

                <h2 className="mb-5 text-center font-serif text-xl font-bold uppercase tracking-wide text-[#806019]">
                  Ảnh sản phẩm
                </h2>


                <div className="space-y-4">

                  <SampleImage
                    src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1786879326/1786875886770_7750340579882786894_7750340579882786894_840d0d929f9b81069b68c3e22b7d136d_cnjvae.jpg"
                    alt="Mẫu hoa lụa 1"
                  />

                  <SampleImage
                    src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1786973133/b2ee0c46-39f3-4471-b3b6-2412f1b694df_v3m3dw.png"
                    alt="Mẫu hoa lụa 2"
                  />

                  <SampleImage
                    src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1786879331/1786875886788_7750340579882786894_7750340579882786894_fd8fd54cdffe5ca721e676027ab6f643_x4dar3.jpg"
                    alt="Mẫu hoa lụa 3"
                  />

                  <SampleImage
                    src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1786879344/1786875886812_7750340579882786894_7750340579882786894_b63ca13f48856e015ee47e765c099486_mkgvax.jpg"
                    alt="Mẫu hoa lụa 4"
                  />

                </div>

              </div>

            </aside>

          </div>


          {/* =========================
              CTA
          ========================= */}

          <div className="mx-auto mt-7 max-w-5xl rounded-2xl border border-[#d6b85c] bg-gradient-to-r from-[#fff8df] to-[#f7e8b9] px-5 py-5 shadow-sm">

            <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row">

              <Flower2 className="h-7 w-7 shrink-0 text-[#8b6518]" />

              <div>

                <h2 className="font-serif text-lg font-bold uppercase text-[#765616]">
                  Sẵn sàng bắt đầu hành trình florist?
                </h2>

                <p className="text-sm italic text-[#806f4d]">
                  Học thật — Làm thật — Thành công thật
                </p>

              </div>

              <button
                type="button"
                onClick={() => {
                  window.open(
                    "https://zalo.me/0352363833",
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
                className="cursor-pointer rounded-full bg-[#8b6518] px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#704f12]"
              >
                Đăng ký ngay
              </button>

            </div>

          </div>


          {/* =========================
              FOOT NOTE
          ========================= */}

          

        </section>

      </main>


      {/* =========================
          FOOTER
      ========================= */}

      <Footer />
    </>
  );
}


/* =====================================================
   COURSE DAY
===================================================== */

function CourseDay({
  day,
  title,
  children,
}: {
  day: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#e4d7b7] bg-[#fffaf0] p-4">

      <div className="flex items-start gap-3">

        <div className="flex shrink-0 items-center justify-center rounded-lg bg-[#f2e6bd] px-3 py-2 text-sm font-bold text-[#806019]">
          {day}
        </div>

        <div className="min-w-0">

          <h3 className="text-base font-bold text-[#332a21] sm:text-lg">
            {title}
          </h3>

          <div className="mt-1.5 space-y-0.5 text-sm leading-6 text-[#51473c] sm:text-base">
            {children}
          </div>

        </div>

      </div>

    </div>
  );
}


/* =====================================================
   SAMPLE IMAGE
===================================================== */

function SampleImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#dfc88f] bg-white">

      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="aspect-[4/3] w-full object-cover transition duration-500 hover:scale-[1.03]"
      />

    </div>
  );
}


/* =====================================================
   CONDITION
===================================================== */

function ConditionItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#ead9bd] bg-[#fffaf2] px-4 py-3">

      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#8b6518]" />

      <p className="text-sm leading-6 text-[#51473c] sm:text-base">
        {children}
      </p>

    </div>
  );
}