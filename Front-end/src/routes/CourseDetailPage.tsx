import {
  BookOpen,
  Coins,
  Users,
  Crown,
  ShieldCheck,
  Scissors,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  ArrowRight,
  Flower2,
  Gift,
  Sparkles,
  Heart,
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



      {/* =========================

          HERO

      ========================= */}

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



            <h1 className="font-serif text-5xl font-bold uppercase leading-[1.05] text-[#75430f] sm:text-5xl lg:text-6xl">

              Bó hoa sáp cơ bản

            </h1>



            <div className="mt-6 inline-flex rounded-full bg-[#875015] px-7 py-3 text-lg font-bold uppercase tracking-wide text-white shadow-md">

              [ 7 BUỔI — ĐÁNH THỨC ĐAM MÊ FLORIST ]

            </div>



            <p className="mt-7 max-w-3xl font-serif text-xl italic leading-9 text-[#46392d]">

              Bạn muốn làm chủ kỹ thuật bó hoa xu hướng

              và tự tin mở tiệm? Hãy bắt đầu ngay hôm nay!

            </p>



          </div>



          {/* IMAGE */}

          <div className="overflow-hidden rounded-[2rem] border-2 border-[#c9954c] bg-white shadow-xl">

            <img

              src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1786764290/peonia/products/kwoedfbs02pnl3tz8kyj.jpg"

              alt="Khóa học bó hoa cơ bản"

              className="aspect-[4/5] w-full object-cover"

            />

          </div>



        </div>

      </section>





      {/* =========================

          MAIN CONTENT

      ========================= */}

      <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">



        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">



          {/* =====================

              CHƯƠNG TRÌNH

          ===================== */}

          <section className="rounded-[2rem] border border-[#e8d5b2] bg-[#fffdf9] p-7 shadow-sm">



            <SectionTitle

              icon={<BookOpen />}

              title="Nội dung chương trình"

            />



            <div className="mt-8 space-y-7">



              <CourseItem

                icon={<Flower2 />}

                title="Kỹ thuật bó hoa sáp"

              >

                Từ cơ bản đến nâng cao

                <br />

                (1 bó, 3 bó... đến 99 bó)

                <br />

                kết hợp các dáng gói giấy hiện đại.

              </CourseItem>



              <CourseItem

                icon={<Crown />}

                title="Bó hoa Công Chúa"

              >

                Bí quyết tạo form hình tròn &

                <br />

                hình trái tim bồng bềnh, sang chảnh.

              </CourseItem>



              <CourseItem

                icon={<Gift />}

                title="Hoa gấu bông"

              >

                Kỹ thuật lên cốt nhựa

                <br />

                chắc chắn, cân đối.

              </CourseItem>



            </div>

          </section>





          {/* =====================

              CHI PHÍ + CAM KẾT

          ===================== */}

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

                  price="5.xxx.xxx"

                />



                <PriceRow

                  icon={<Crown />}

                  title="Lớp VIP 1:1"

                  subtitle="(Kèm riêng)"

                  price="7.xxx.xxx"

                />



              </div>



            </section>





            {/* CAM KẾT */}

            <section className="rounded-[2rem] border border-[#e8d5b2] bg-[#fffdf9] p-7 shadow-sm">



              <SectionTitle

                icon={<ShieldCheck />}

                title="Cam kết vàng"

              />



              <div className="mt-6 flex gap-4">



                <div className="shrink-0 rounded-full bg-[#f6ead7] p-3">

                  <ShieldCheck className="h-7 w-7 text-[#875015]" />

                </div>



                <p className="leading-7 text-[#514438]">

                  Học 7 buổi tại lớp (nghỉ T7, CN).

                  <br />

                  Nếu chưa thành thạo, được hỗ trợ

                  <br />

                  thêm <strong>3 buổi thực hành miễn phí</strong>

                  <br />

                  để vững tay nghề ra nghề.

                </p>



              </div>



              {/* SAMPLE IMAGES */}

              <div className="mt-7 grid grid-cols-3 gap-3">



                <SampleImage

                  src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1786763658/peonia/products/yy3crg26rvhtgrhtw8ic.jpg"

                  alt="Mẫu hoa 1"

                />



                <SampleImage

                  src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1786680962/peonia/products/o3eu22ju8mttlc19ylnv.jpg"

                  alt="Mẫu hoa 2"

                />



                <SampleImage

                  src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1782581361/peonia/products/xhhn4yukzcub3cfkm53j.jpg"

                  alt="Mẫu hoa 3"

                />



              </div>



            </section>



          </div>



        </div>





        {/* =========================

            TOOLS

        ========================= */}

        <section className="mt-6 rounded-[2rem] border border-[#e8d5b2] bg-[#fffdf9] p-7 shadow-sm">



          <SectionTitle

            icon={<Scissors />}

            title="Dụng cụ & nguyên liệu"

          />



          <div className="mt-7 grid items-center gap-8 lg:grid-cols-[1fr_1.2fr_0.8fr]">



            {/* INCLUDED */}

            <div className="rounded-2xl border border-[#ead9bd] bg-[#fffaf2] p-5">



              <div className="flex items-start gap-3">



                <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-[#875015]" />



                <div>

                  <h3 className="font-semibold text-lg">

                    Lớp tài trợ sẵn:

                  </h3>



                  <p className="mt-2 leading-7 text-[#625447]">

                    Toàn bộ dụng cụ chuyên dụng

                    <br />

                    (Kéo, kìm, băng dính, keo nến,

                    ghim...).

                  </p>

                </div>



              </div>



            </div>





            {/* TOOLS IMAGE */}

            <div className="flex justify-center">



              <img

                src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1782638939/peonia/products/rbvrht8mlmbcdgqkevto.jpg"

                alt="Dụng cụ khóa học"

                className="max-h-52 w-full object-contain"

              />



            </div>





            {/* NOTE */}

            <div className="rounded-2xl border border-[#ead9bd] bg-[#fffaf2] p-5">



              <div className="flex gap-3">



                <AlertCircle className="mt-1 h-6 w-6 shrink-0 text-[#875015]" />



                <div>



                  <h3 className="font-semibold">

                    Lưu ý:

                  </h3>



                  <p className="mt-2 leading-7 text-[#625447]">

                    Chưa bao gồm giấy và đầu

                    <br />

                    bông hoa sáp.

                    <br />

                    Học viên sẽ mua thêm

                    <br />

                    nguyên liệu này tại lớp

                    <br />

                    theo sở thích để thực hành.

                  </p>



                </div>



              </div>



            </div>



          </div>



        </section>





        {/* =========================

            PAYMENT

        ========================= */}

        <section className="mt-6 rounded-[2rem] border border-[#e8d5b2] bg-[#fffdf9] p-7 shadow-sm">



          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.55fr]">



            <div>



              <SectionTitle

                icon={<CalendarDays />}

                title="Lịch trình đóng học phí"

              />



              <div className="mt-8 flex flex-col items-center gap-6 md:flex-row">



                {/* STEP 1 */}

                <PaymentStep

                  number="01"

                  title="Đặt cọc trước:"

                  content={

                    <>

                      <strong className="text-[#875015]">

                        2.000.000 VNĐ

                      </strong>

                      <br />

                      để giữ chỗ.

                    </>

                  }

                />



                <ArrowRight className="hidden h-8 w-8 text-[#875015] md:block" />



                {/* STEP 2 */}

                <PaymentStep

                  number="02"

                  title="Hoàn thành phần còn lại:"

                  content={

                    <>

                      Ngay sau khi kết thúc

                      <br />

                      buổi học đầu tiên.

                    </>

                  }

                />



              </div>



            </div>





            {/* NOTE */}

            <div className="rotate-1 rounded-xl bg-[#fff0cf] p-6 text-center shadow-md">



              <div className="text-xl font-serif font-bold italic text-red-600">

                Note:

              </div>



              <p className="mt-3 leading-7 text-[#5c4a37]">

                Giá học có thể thay đổi

                <br />

                theo thời gian và

                <br />

                kiến thức khác.

              </p>



              <div className="mt-3 text-2xl text-pink-300">

                ♡

              </div>



            </div>



          </div>



        </section>





        {/* =========================

            CTA

        ========================= */}

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
          "https://zalo.me/XXXXXXXXXX",
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


/* =====================================================
   COMPONENTS
===================================================== */

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
    <div className="flex gap-5 border-b border-dashed border-[#dfcba9] pb-7 last:border-0">

      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[#ead7b5] bg-[#fffaf2]">
        <span className="text-[#875015]">
          {icon}
        </span>
      </div>

      <div>

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
        <h3 className="font-semibold text-lg">
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


function SampleImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#dfc49b]">
      <img
        src={src}
        alt={alt}
        className="aspect-square w-full object-cover transition duration-500 hover:scale-105"
      />
    </div>
  );
}


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

      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#875015] text-xl font-bold text-white">
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