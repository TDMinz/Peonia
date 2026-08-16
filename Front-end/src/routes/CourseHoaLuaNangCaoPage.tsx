import {
  Clock3,
  CalendarDays,
  CheckCircle2,
  ShieldCheck,
  Store,
  Flower2,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { getCartItems } from "../services/cart";

export default function CourseHoaLuaNangCaoPage() {
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
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

          {/* =====================================================
              COURSE HEADER
          ===================================================== */}

          <section className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-[#a07b22] sm:text-sm">
              Peonia Workshops & Academy
            </p>

            <h1 className="mt-3 font-serif text-3xl font-bold uppercase leading-tight text-[#806019] sm:text-4xl lg:text-5xl">
              Khóa học chuyên sâu cắm hoa lụa
            </h1>

            <p className="mt-2 font-serif text-base italic text-[#806f4d] sm:text-lg">
              Chương Trình Đào Tạo Kinh Doanh Toàn Diện (Gói VIP)
            </p>
          </section>

          {/* =========================
              GOLD LINE
          ========================= */}

          <div className="mx-auto mt-5 h-[2px] max-w-5xl bg-[#d4b34b]" />

          {/* =====================================================
              COURSE INFO
          ===================================================== */}

          <section className="mx-auto mt-4 max-w-5xl rounded-2xl border-2 border-[#d5b94d] bg-[#fffdf7] px-5 py-5 shadow-sm">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">

              {/* LEFT INFO */}

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#806019]" />

                  <div className="text-sm sm:text-base">
                    <span className="font-bold">
                      Thời lượng:
                    </span>{" "}
                    07 Ngày học chính thức (8 buổi) + 2-3 Ngày luyện tay
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#806019]" />

                  <div className="text-sm sm:text-base">
                    <span className="font-bold">
                      Khung giờ:
                    </span>{" "}
                    Sáng 9h30 - 11h30 | Chiều 13h30 - 15h30
                  </div>
                </div>
              </div>

              {/* PRICE */}

              <div className="border-t border-[#e5d7aa] pt-4 text-center md:border-l md:border-t-0 md:pl-8 md:pt-0 md:text-right">
                <p className="text-xl font-bold text-[#806019] sm:text-2xl">
                  15.xxx.xxx VNĐ
                </p>

                <div className="mt-1 flex items-center justify-center gap-2 text-sm font-bold uppercase text-[#8b681d] md:justify-end">
                  <ShieldCheck className="h-5 w-5" />
                  Bảo hành trọn đời
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              MAIN COURSE CONTENT
              LEFT + RIGHT ALWAYS SAME HEIGHT
          ===================================================== */}

          <section className="mt-6 grid items-stretch gap-5 lg:grid-cols-[1.7fr_0.85fr]">

            {/* =================================================
                LEFT - COURSE ROADMAP
            ================================================= */}

            <section className="flex h-full flex-col">

              {/* TITLE */}

              <div className="mb-3 flex items-center gap-3">
                <div className="h-8 w-1.5 shrink-0 rounded-full bg-[#c9a52d]" />

                <h2 className="font-serif text-xl font-bold uppercase text-[#806019] sm:text-2xl">
                  Lộ trình đào tạo chi tiết (7 ngày chuyên sâu)
                </h2>
              </div>

              {/* TABLE */}

              <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-[#d3b64b] bg-[#fffdf7]">

                {/* TABLE HEADER */}

                <div className="grid shrink-0 grid-cols-[110px_1fr] border-b border-[#d3b64b] bg-[#d4b334] text-sm font-bold uppercase text-white sm:grid-cols-[125px_1fr]">

                  <div className="border-r border-white/30 px-4 py-3">
                    Thời gian
                  </div>

                  <div className="px-4 py-3">
                    Nội dung trọng tâm
                  </div>
                </div>

                {/* TABLE BODY */}

                <div className="flex flex-1 flex-col">

                  <CourseRow
                    day="Ngày 1"
                    title="Bánh Xe Màu Sắc & Bố Cục Nền Tảng"
                  />

                  <CourseRow
                    day="Ngày 2"
                    title="Bình Nghệ Thuật 1 Mặt, 3 Mặt & Bình Để Bàn"
                  />

                  <CourseRow
                    day="Ngày 3"
                    title="Tiểu Cảnh Lan Hồ Điệp Cao Cấp"
                  />

                  <CourseRow
                    day="Ngày 4"
                    title="Tranh Hoa Nghệ Thuật & Khay Hoa Tiểu Cảnh"
                  />

                  <CourseRow
                    day="Ngày 5"
                    title="Bó Hoa Style Hàn Quốc & Bó Hoa Cưới"
                  />

                  <CourseRow
                    day="Ngày 6"
                    title="Giỏ Hoa Style Hàn Quốc"
                  />

                  <CourseRow
                    day="Ngày 7"
                    title="Tư Duy Kinh Doanh & Định Hướng Mở Shop"
                    last
                  />

                </div>
              </div>
            </section>


            {/* =================================================
                RIGHT - SAMPLE IMAGES
            ================================================= */}

            <aside className="flex h-full">

              <div className="flex h-full w-full flex-col rounded-2xl border-2 border-[#d3b64b] bg-[#fffdf7] p-3">

                {/* TITLE */}

                <h2 className="mb-3 shrink-0 text-center font-serif text-lg font-bold uppercase text-[#806019]">
                  Mẫu hoa tham khảo
                </h2>

                {/* IMAGES */}

                <div className="flex flex-1 flex-col gap-2">

                  {/* MAIN IMAGE */}

                  <SampleImage
                    src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1786856564/peonia/products/blemtw7oe6ytpgkrd1pp.jpg"
                    alt="Mẫu hoa lụa chuyên sâu 1"
                    className="aspect-[4/3]"
                  />

                  {/* SMALL IMAGES */}

                  <div className="grid flex-1 grid-cols-2 gap-2">

                    <SampleImage
                      src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1786899804/1786881011096_7750340579882786894_7750340579882786894_7391e92f4ac13541c7f2de03fd38480b_aosyi8.jpg"
                      alt="Mẫu hoa lụa chuyên sâu 2"
                    />

                    <SampleImage
                      src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1786899809/1786881011092_7750340579882786894_7750340579882786894_67cea03d6405d77793e1be4765b72a37_ichb6l.jpg"
                      alt="Mẫu hoa lụa chuyên sâu 3"
                    />

                    <SampleImage
                      src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1786899644/1786881015971_7750340579882786894_7750340579882786894_fe455dc5fad0c953ef224c94c41b596b_tkx9pc.jpg"
                      alt="Mẫu hoa lụa chuyên sâu 4"
                    />

                    <SampleImage
                      src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1786899949/1786881011071_7750340579882786894_7750340579882786894_9cc4aadb791b2a463336654e5ad30167_xg2wvf.jpg"
                      alt="Mẫu hoa lụa chuyên sâu 5"
                    />

                    <SampleImage
                      src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1786899815/1786881011088_7750340579882786894_7750340579882786894_14a321f09b4f6015776cbf168aaaeb92_zypjk0.jpg"
                      alt="Mẫu hoa lụa chuyên sâu 6"
                    />

                    <SampleImage
                      src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1786899821/1786881011084_7750340579882786894_7750340579882786894_bc9e9ad1d9d1b8c7cbc5e950f57c9336_pijkoe.jpg"
                      alt="Mẫu hoa lụa chuyên sâu 7"
                    />

                  </div>
                </div>
              </div>
            </aside>
          </section>


          {/* =====================================================
              VIP BENEFITS
          ===================================================== */}

          <section className="mt-5 rounded-2xl border border-[#d3b64b] bg-[#fffaf0] p-5 sm:p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d4b334] text-white">
                <Flower2 className="h-5 w-5" />
              </div>

              <h2 className="font-serif text-xl font-bold uppercase text-[#806019] sm:text-2xl">
                Đặc quyền đã bao gồm trong gói chuyên sâu 15.xxx.xxx VNĐ
              </h2>

            </div>

            <div className="mt-5 space-y-4">

              <VipBenefit
                icon={<ShieldCheck />}
                title="Bảo hành kiến thức trọn đời:"
                description="Hỗ trợ 1:1 qua tin nhắn/Zalo/Phone khi học viên quên bài hoặc gặp vướng mắc."
              />

              <VipBenefit
                icon={<CheckCircle2 />}
                title="Ở lại luyện tay miễn phí 2 - 3 ngày:"
                description="Sau 7 ngày học chính thức, được ở lại xưởng để rèn luyện thêm tay nghề."
              />

              <VipBenefit
                icon={<Store />}
                title="Sử dụng mẫu Peonia & nguồn hàng giá sỉ:"
                description="Kết nối nguồn nguyên vật liệu giá sỉ và được phép khai thác catalogue, bộ mẫu độc quyền."
              />

            </div>
          </section>


          {/* =====================================================
              CTA
          ===================================================== */}

          <section className="mx-auto mt-6 max-w-4xl rounded-2xl border border-[#d5b94d] bg-gradient-to-r from-[#fff8df] to-[#f5e4aa] px-5 py-5 shadow-sm">

            <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d4b334] text-white">
                <Flower2 className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-serif text-lg font-bold uppercase text-[#765616]">
                  Sẵn sàng nâng tầm tay nghề?
                </h2>

                <p className="mt-1 text-sm italic text-[#806f4d]">
                  Trở thành florist chuyên nghiệp cùng Peonia
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.open(
                    "https://zalo.me/XXXXXXXXXX",
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
                className="cursor-pointer rounded-full bg-[#875015] px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#6f3f0e]"
              >
                Đăng ký ngay
              </button>

            </div>
          </section>


          {/* =====================================================
              FOOT NOTE
          ===================================================== */}

          

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
   COURSE ROW
===================================================== */

function CourseRow({
  day,
  title,
  last = false,
}: {
  day: string;
  title: string;
  last?: boolean;
}) {
  return (
    <div
      className={`
        grid
        flex-1
        grid-cols-[110px_1fr]
        sm:grid-cols-[125px_1fr]
        ${!last ? "border-b border-[#e3d9bd]" : ""}
      `}
    >

      {/* DAY */}

      <div className="flex items-center border-r border-[#e3d9bd] px-3 py-4">

        <span className="rounded-lg bg-[#f5eed5] px-3 py-2 text-xs font-bold text-[#a18124] sm:text-sm">
          {day}
        </span>

      </div>


      {/* CONTENT */}

      <div className="flex items-center px-4 py-4">

        <p className="text-sm font-semibold leading-6 text-[#3f362c] sm:text-base">
          {title}
        </p>

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
  className = "aspect-square",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className="h-full min-h-0 overflow-hidden rounded-xl border border-[#dfc77d] bg-white">

      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`${className} h-full w-full object-cover transition duration-500 hover:scale-[1.04]`}
      />

    </div>
  );
}


/* =====================================================
   VIP BENEFIT
===================================================== */

function VipBenefit({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8d89c] text-[#806019]">

        {icon}

      </div>

      <div className="text-sm leading-6 sm:text-base">

        <span className="font-bold text-[#44382c]">
          • {title}
        </span>{" "}

        <span className="text-[#5d5144]">
          {description}
        </span>

      </div>

    </div>
  );
}