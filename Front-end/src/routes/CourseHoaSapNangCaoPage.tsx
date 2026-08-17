import {
  BookOpen,
  Coins,
  Users,
  Crown,
  ShieldCheck,
  Scissors,
  CheckCircle2,
  CalendarDays,
  Flower2,
  Gift,
  BriefcaseBusiness,
  GraduationCap,
  Store,
  Heart,
  Sparkles,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { getCartItems } from "../services/cart";

export default function CourseDetailPage() {
  const cartItems = getCartItems();

  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  return (
    <>
      <Header cartCount={cartCount} />

      <main className="min-h-screen bg-[#f8f3eb] text-[#3f2d1d]">

        {/* =====================================================
            HERO
        ===================================================== */}
        <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">

            {/* LEFT */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <Flower2 className="h-10 w-10 text-[#c49a5c]" />

                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9b6a2c]">
                  Khóa đào tạo nghề
                </span>
              </div>

              <h1 className="font-serif text-5xl font-bold uppercase leading-[1.05] text-[#75430f] sm:text-6xl lg:text-7xl">
                Bó Hoa Sáp
                <br />
                Nâng Cao
              </h1>

              <div className="mt-6 inline-flex rounded-full bg-[#875015] px-7 py-3 text-lg font-bold uppercase tracking-wide text-white shadow-md">
                12 BUỔI — CHINH PHỤC ĐỈNH CAO FLORIST
              </div>

              <p className="mt-7 max-w-3xl font-serif text-xl italic leading-9 text-[#46392d]">
                Khóa học chuyên sâu dành cho ai muốn nâng tầm tay nghề,
                làm chủ kỹ thuật hoa sáp nghệ thuật và phát triển sự nghiệp
                bền vững.
              </p>
            </div>

            {/* IMAGE */}
            <div className="overflow-hidden rounded-[2rem] border-2 border-[#c9954c] bg-white shadow-xl">
              <img
                src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1786769643/peonia/products/cd0s3zz6a75xudmc5lui.jpg"
                alt="Khóa học bó hoa sáp nâng cao"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>

          </div>
        </section>


        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}
        <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">

          <div className="grid gap-6 lg:grid-cols-2">

            {/* =================================================
                NỘI DUNG CHƯƠNG TRÌNH
            ================================================= */}
            <section className="rounded-[2rem] border border-[#e8d5b2] bg-[#fffdf9] p-7 shadow-sm">

              <SectionTitle
                icon={<BookOpen />}
                title="Nội dung chương trình"
              />

              <div className="mt-7 rounded-xl border border-[#ead9bd] bg-[#fffaf2] px-5 py-3 text-center text-lg font-medium text-[#875015]">
                Chuyên sâu — Đa dạng — Thực tiễn
              </div>

              <div className="mt-7 space-y-6">

                <CourseItem
                  icon={<Flower2 />}
                  title="Nâng cao kỹ thuật bó hoa sáp"
                >
                  Bó tròn, bó dài, bó xoắn, bó tầng,
                  <br />
                  bó đổ thác, bó Hàn Quốc, bó giỏ...
                </CourseItem>

                <CourseItem
                  icon={<Gift />}
                  title="Hoa sáp nghệ thuật"
                >
                  Thiết kế giỏ hoa, hộp hoa cao cấp,
                  <br />
                  hoa chúc mừng, khai trương, sự kiện.
                </CourseItem>

                <CourseItem
                  icon={<Crown />}
                  title="Bó hoa sang trọng"
                >
                  Kỹ thuật phối màu, phối chất liệu
                  <br />
                  nâng tầm giá trị sản phẩm.
                </CourseItem>

                <CourseItem
                  icon={<Gift />}
                  title="Hoa gấu bông nâng cao"
                >
                  Gấu bông mix hoa, gấu bông tạo hình,
                  <br />
                  bó size lớn, hộp trưng bày.
                </CourseItem>

                <CourseItem
                  icon={<Store />}
                  title="Kinh doanh & vận hành"
                >
                  Định giá sản phẩm, marketing,
                  <br />
                  chăm sóc khách hàng, xây dựng thương hiệu.
                </CourseItem>

              </div>
            </section>


            {/* =================================================
                CHI PHÍ + CAM KẾT
            ================================================= */}
            <div className="space-y-6">

              {/* CHI PHÍ */}
              <section className="rounded-[2rem] border border-[#e8d5b2] bg-[#fffdf9] p-7 shadow-sm">

                <SectionTitle
                  icon={<Coins />}
                  title="Chi phí đầu tư"
                />

                <div className="mt-7 space-y-4">

                  <PriceRow
                    icon={<Users />}
                    title="Lớp ghép"
                    subtitle="(2 - 3 học viên)"
                    price="12.xxx.xxx"
                  />

                  <PriceRow
                    icon={<Crown />}
                    title="Lớp VIP 1:1"
                    subtitle="(Kèm riêng)"
                    price="16.xxx.xxx"
                  />

                </div>
              </section>


              {/* CAM KẾT */}
              <section className="rounded-[2rem] border border-[#e8d5b2] bg-[#fffdf9] p-7 shadow-sm">

                <SectionTitle
                  icon={<ShieldCheck />}
                  title="Cam kết vàng"
                />

                <div className="mt-6 space-y-4">

                  <GuaranteeItem>
                    Học <strong>12 buổi</strong> tại lớp
                    (nghỉ T7, CN).
                  </GuaranteeItem>

                  <GuaranteeItem>
                    Được kèm <strong>1:1</strong> đến khi thành thạo.
                  </GuaranteeItem>

                  <GuaranteeItem>
                    Hỗ trợ thực hành thực tế,
                    cập nhật xu hướng mới.
                  </GuaranteeItem>

                  <GuaranteeItem>
                    Hỗ trợ sau khóa học:
                    tư vấn – đồng hành – giải đáp trọn đời.
                  </GuaranteeItem>

                  <GuaranteeItem>
                    Nếu chưa thành thạo,
                    <strong> được học lại miễn phí.</strong>
                  </GuaranteeItem>

                </div>

                {/* BENEFITS */}
                <div className="mt-7 grid grid-cols-2 gap-4 border-t border-[#ead9bd] pt-6 sm:grid-cols-4">

                  <Benefit
                    icon={<GraduationCap />}
                    title="Chứng chỉ"
                    text="sau khóa học"
                  />

                  <Benefit
                    icon={<Heart />}
                    title="Hỗ trợ"
                    text="sau khóa"
                  />

                  <Benefit
                    icon={<BookOpen />}
                    title="Tài liệu"
                    text="mẫu miễn phí"
                  />

                  <Benefit
                    icon={<Sparkles />}
                    title="Đồng hành"
                    text="trọn đời"
                  />

                </div>

              </section>

            </div>
          </div>


          {/* =================================================
              DỤNG CỤ & NGUYÊN LIỆU
              KHÔNG DÙNG ẢNH
          ================================================= */}
          <section className="mt-6 rounded-[2rem] border border-[#e8d5b2] bg-[#fffdf9] p-7 shadow-sm">

            <SectionTitle
              icon={<Scissors />}
              title="Dụng cụ & nguyên liệu"
            />

            <div className="mt-7 grid gap-6 lg:grid-cols-2">

              {/* ĐƯỢC CUNG CẤP */}
              <div className="rounded-2xl border border-[#ead9bd] bg-[#fffaf2] p-6">

                <div className="mb-5 inline-flex rounded-full bg-[#a66b1f] px-5 py-2 text-sm font-semibold text-white">
                  Được cung cấp
                </div>

                <div className="space-y-4">

                  <ToolItem>
                    Toàn bộ dụng cụ chuyên dụng
                    <span className="block text-sm text-[#776653]">
                      (kéo, kìm, súng bắn keo, băng dính...)
                    </span>
                  </ToolItem>

                  <ToolItem>
                    Đầy đủ nguyên liệu hoa sáp
                    <span className="block text-sm text-[#776653]">
                      cao cấp trong suốt khóa học.
                    </span>
                  </ToolItem>

                  <ToolItem>
                    Giấy gói và phụ kiện
                    <span className="block text-sm text-[#776653]">
                      sử dụng cho các bài thực hành.
                    </span>
                  </ToolItem>

                </div>
              </div>


              {/* HƯỚNG DẪN */}
              <div className="rounded-2xl border border-[#ead9bd] bg-[#fffaf2] p-6">

                <div className="mb-5 inline-flex rounded-full bg-[#a66b1f] px-5 py-2 text-sm font-semibold text-white">
                  Học viên được hướng dẫn
                </div>

                <div className="space-y-4">

                  <ToolItem>
                    Cách lựa chọn nguyên liệu chất lượng.
                  </ToolItem>

                  <ToolItem>
                    Cách bảo quản và sử dụng
                    dụng cụ hiệu quả.
                  </ToolItem>

                  <ToolItem>
                    Cách phối màu và chất liệu
                    để sản phẩm cao cấp hơn.
                  </ToolItem>

                  <ToolItem>
                    Nguồn cung uy tín – giá tốt.
                  </ToolItem>

                </div>
              </div>

            </div>
          </section>


          {/* =================================================
              LỊCH TRÌNH ĐÓNG HỌC PHÍ
          ================================================= */}
          <section className="mt-6 rounded-[2rem] border border-[#e8d5b2] bg-[#fffdf9] p-7 shadow-sm">

            <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.45fr]">

              <div>

                <SectionTitle
                  icon={<CalendarDays />}
                  title="Lịch trình & đóng học phí"
                />

                <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center">

                  <PaymentStep
                    number="01"
                    title="Đặt cọc trước:"
                    content={
                      <>
                        <strong className="text-[#875015]">
                          5.000.000 VNĐ
                        </strong>
                        <br />
                        để giữ chỗ.
                      </>
                    }
                  />

                  <div className="hidden text-3xl text-[#875015] md:block">
                    →
                  </div>

                  <PaymentStep
                    number="02"
                    title="Hoàn thành phần còn lại:"
                    content={
                      <>
                        Trước buổi học đầu tiên
                        <br />
                        hoặc theo thỏa thuận.
                      </>
                    }
                  />

                </div>

              </div>


              {/* NOTE */}
              <div className="rotate-1 rounded-2xl bg-[#fff0cf] p-6 text-center shadow-md">

                <div className="text-xl font-serif font-bold italic text-[#a13b22]">
                  Lưu ý
                </div>

                <p className="mt-4 leading-7 text-[#5c4a37]">
                  Giá học có thể thay đổi
                  <br />
                  theo thời gian và
                  <br />
                  kiến thức khác.
                </p>

                <div className="mt-3 text-3xl text-[#c9954c]">
                  ♡
                </div>

              </div>

            </div>

          </section>


          {/* =================================================
              CTA
          ================================================= */}
          <div className="mt-8 overflow-hidden rounded-[2rem] border border-[#d7ad69] bg-gradient-to-r from-[#fff1d7] to-[#f5d79e] px-6 py-7 text-center shadow-sm">

  <div className="flex flex-col items-center justify-center gap-4 md:flex-row">

    <Heart className="h-10 w-10 text-[#9b5f18]" />

    <div>
      <h2 className="font-serif text-2xl font-bold uppercase tracking-wide text-[#75430f]">
        Bứt phá tay nghề
      </h2>

      <p className="mt-1 font-serif text-lg italic text-[#79552e]">
        Tự tin mở tiệm — Tạo thu nhập đỉnh cao
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
      className="cursor-pointer rounded-full bg-[#875015] px-8 py-4 font-semibold uppercase tracking-wide text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#6f3f0e]"
    >
      Đăng ký ngay hôm nay
    </button>

  </div>

</div>


{/* FOOT NOTE */}
<div className="mt-6 text-center">
  <p className="font-serif text-lg italic text-[#75430f]">
    Học thật — Làm thật — Thành công thật
  </p>
</div>

        </section>

      </main>

      <Footer />
    </>
  );
}


/* ============================================================
   SECTION TITLE
============================================================ */

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-4">

      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#875015] text-white shadow-md">
        {icon}
      </div>

      <h2 className="font-serif text-2xl font-bold uppercase text-[#75430f] sm:text-3xl">
        {title}
      </h2>

    </div>
  );
}


/* ============================================================
   COURSE ITEM
============================================================ */

function CourseItem({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-5 border-b border-dashed border-[#dfcba9] pb-6 last:border-0">

      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[#ead7b5] bg-[#fffaf2]">
        <span className="text-[#875015]">
          {icon}
        </span>
      </div>

      <div className="min-w-0">

        <h3 className="text-lg font-bold text-[#241b14]">
          <span className="mr-2 text-red-600">
            ▼
          </span>

          {title}
        </h3>

        <p className="mt-2 leading-7 text-[#625447]">
          {children}
        </p>

      </div>

    </div>
  );
}


/* ============================================================
   PRICE ROW
============================================================ */

function PriceRow({
  icon,
  title,
  subtitle,
  price,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  price: string;
}) {
  return (
    <div className="grid grid-cols-[60px_1fr_auto] items-center gap-4 rounded-2xl border border-[#ead9bd] bg-[#fffaf2] px-4 py-4">

      <div className="flex justify-center text-[#875015]">
        {icon}
      </div>

      <div>
        <h3 className="text-lg font-semibold">
          {title}
        </h3>

        <p className="text-sm text-[#625447]">
          {subtitle}
        </p>
      </div>

      <div className="text-right">

        <div className="text-2xl font-bold text-[#875015]">
          {price}
        </div>

        <div className="text-sm font-semibold">
          VNĐ
        </div>

      </div>

    </div>
  );
}


/* ============================================================
   GUARANTEE ITEM
============================================================ */

function GuaranteeItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">

      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#a66b1f]" />

      <p className="leading-7 text-[#514438]">
        {children}
      </p>

    </div>
  );
}


/* ============================================================
   BENEFIT
============================================================ */

function Benefit({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">

      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f6ead7] text-[#875015]">
        {icon}
      </div>

      <p className="mt-2 text-sm font-semibold text-[#4b3927]">
        {title}
      </p>

      <p className="text-xs text-[#766653]">
        {text}
      </p>

    </div>
  );
}


/* ============================================================
   TOOL ITEM
============================================================ */

function ToolItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">

      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#a66b1f]" />

      <p className="leading-7 text-[#514438]">
        {children}
      </p>

    </div>
  );
}


/* ============================================================
   PAYMENT STEP
============================================================ */

function PaymentStep({
  number,
  title,
  content,
}: {
  number: string;
  title: string;
  content: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">

      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#875015] text-xl font-bold text-white shadow-md">
        {number}
      </div>

      <div className="leading-7">

        <h3 className="font-semibold">
          {title}
        </h3>

        <p className="text-[#625447]">
          {content}
        </p>

      </div>

    </div>
  );
}