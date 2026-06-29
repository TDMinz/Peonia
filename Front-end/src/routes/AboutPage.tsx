import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <Header cartCount={0} />

      <main className="bg-[#fbf7f1] overflow-hidden">

        {/* ================= HERO ================= */}

        <section className="relative h-[92vh] min-h-[760px] overflow-hidden">
          <img
            src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1782376004/c838739e02347e6ce9c131f835b72a63_eukh9r.jpg"
            alt="Peonia"
            className="
              absolute inset-0
              h-full
              w-full
              object-cover
              scale-105
            "
          />

          <div className="absolute inset-0 bg-black/35" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl px-6 text-center text-white">

              <p className="uppercase tracking-[0.6em] text-sm text-white/80">
                PEONIA STUDIO
              </p>

              <h1
                className="
                  mt-8
                  font-serif
                  text-6xl
                  font-light
                  leading-tight
                  md:text-8xl
                "
              >
                Flowers
                <br />
                That Speak
                <br />
                Without Words
              </h1>

              <p
                className="
                  mx-auto
                  mt-10
                  max-w-2xl
                  text-lg
                  leading-9
                  text-white/85
                "
              >
                Mỗi đóa hoa đều được tạo nên để lưu giữ
                những khoảnh khắc đẹp nhất,
                gửi gắm yêu thương và những cảm xúc chân thành.
              </p>

              
            </div>
          </div>

          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              h-40
              bg-gradient-to-t
              from-[#fbf7f1]
              to-transparent
            "
          />
        </section>

        {/* ================= STORY ================= */}

        <section className="py-32">
          <div className="mx-auto max-w-7xl px-8">

            <div className="grid items-center gap-20 lg:grid-cols-2">

              <div>

                <div className="overflow-hidden rounded-[2.5rem]">

                  <img
                    src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1782376177/b1627215f0198bb51782094483f4116e_kqbd4j.jpg"
                    alt=""
                    className="
                      h-[760px]
                      w-full
                      object-cover
                      transition
                      duration-700
                      hover:scale-105
                    "
                  />

                </div>

              </div>

              <div>

               

                <h2
                  className="
                    mt-8
                    font-serif
                    text-5xl
                    font-light
                    leading-tight
                    text-foreground
                  "
                >
                  Hoa Lụa Peonia –  Giữ 
                  <br />
                  Trọn Nét Đẹp Thời Gian.
                  <br />
                </h2>

                <div
                  className="
                    mt-12
                    space-y-8
                    text-[17px]
                    leading-9
                    text-[#6f7b8b]
                  "
                >
                  <p>
                  Một bình hoa không chỉ để ngắm nhìn, mà là để cảm nhận và khơi gợi cảm hứng cho không gian sống.
                  </p>

                  <p>
                  Được tuyển chọn tỉ mỉ và tạo tác bằng cả tâm hồn, hoa lụa tại Peonia mang vẻ đẹp chân thực, sống động như hoa tươi nhưng sở hữu "đặc quyền" vĩnh cửu với thời gian. Không cần chăm sóc cầu kỳ, mỗi dáng hoa vẫn luôn rực rỡ, mềm mại và bền bỉ như ngày đầu tiên.
                  </p>

                  <p>
                  Mỗi sản phẩm tại Peonia là một bản phối độc bản, hài hòa từ sắc hoa đến dáng bình. Đó không chỉ là điểm nhấn sang trọng cho ngôi nhà của bạn, mà còn là một tác phẩm nghệ thuật tĩnh lặng, thay bạn lưu giữ kỷ niệm và thổi hồn thiên nhiên vào không gian sống.
                  </p>
                
                </div>

              </div>

            </div>

          </div>
        </section>
               
{/* ================= PHILOSOPHY ================= */}

<section className="bg-white py-32">
  <div className="mx-auto max-w-7xl px-8">

    <div className="grid items-center gap-20 lg:grid-cols-2">

      {/* Text */}

      <div>

       

        <h2
          className="
            mt-8
            font-serif
            text-5xl
            font-light
            leading-tight
            text-foreground
          "
        >
          Peonia – Tinh Tế
          <br />
          Từ Sự Nguyên Bản
          <br />
         
        </h2>

        <div
          className="
            mt-12
            space-y-8
            text-[17px]
            leading-9
            text-[#6f7b8b]
          "
        >
          <p>
          Vẻ đẹp thực sự vốn đến từ những điều giản dị và sự cân bằng trong tâm hồn. Tại Peonia, chúng tôi khước từ những chi tiết rườm rà, tôn trọng nét đẹp tự nhiên của từng nhành hoa, chiếc lá để tạo nên những khoảng lặng thanh tịnh, giúp dòng chảy năng lượng trong không gian được khai thông và nhẹ nhàng lan tỏa.
          </p>

          <p>
          Hướng đến sự tối giản và thanh lịch tuyệt đối, mỗi thiết kế là một câu chuyện tĩnh lặng được kết hợp khéo léo giữa màu sắc và phom dáng, mang lại năng lượng bình an cho ngôi nhà. Đó không đơn thuần là một sản phẩm decor, mà là liệu pháp tinh thần giúp nuôi dưỡng tổ ấm, mang đến sự hòa thuận và thư thái cho tâm trí bạn.
          </p>

        
        </div>

      </div>

      {/* Image */}

      <div>

        <div className="overflow-hidden rounded-[2.5rem]">

          <img
            src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1782377203/94dcbfc10ada7729cefa680ce6c024b3_ynhgvw.jpg"
            alt="Peonia Philosophy"
            className="
              h-[760px]
              w-full
              object-cover
              transition
              duration-700
              hover:scale-105
            "
          />

        </div>

      </div>

    </div>

  </div>
</section>


        {/* ================= LUXURY QUOTE ================= */}

        <section className="py-36">

          <div className="mx-auto max-w-5xl px-8 text-center">

            <p
              className="
                font-serif
                text-5xl
                font-light
                italic
                leading-[1.5]
                text-[#303030]
              "
            >
              "Flowers are the music
              <br />
              of the earth,
              <br />
              heard by the heart."
            </p>

            <div className="mx-auto mt-10 h-px w-24 bg-[#d7dfe8]" />


          </div>

        


        {/* ================= GALLERY ================= */}

     

          <div className="mx-auto max-w-7xl px-8">

            <div className="mb-16 text-center">

            

            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

              <div className="h-[520px] overflow-hidden rounded-[2rem]">
                <img
                  src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1782376594/679a2bc70083f546caca6aba6e44a18d_l3ds57.jpg"
                  className="block h-full w-full object-cover transition duration-700 hover:scale-110"
                />
              </div>

              <div className="mt-20 h-[480px] overflow-hidden rounded-[2rem]">
                <img
                  src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1782376483/3725efde5398aa18fbd99b8cb9188956_ihhmg7.jpg"
                  className="block h-full w-full object-cover transition duration-700 hover:scale-110"
                />
              </div>

              <div className="overflow-hidden rounded-[2rem]">
                <img
                  src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1782376637/2f194a69bf1ac93372932844ee750e01_xlxnc5.jpg"
                  className="h-[620px] w-full object-cover transition duration-700 hover:scale-110"
                />
              </div>

              <div className="mt-12 h-[460px] overflow-hidden rounded-[2rem]">
                <img
                  src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1782376603/b73d300f81d33a4cfe123e1f5c6ef456_vsvdc9.jpg"
                  className="block h-full w-full object-cover transition duration-700 hover:scale-110"
                />
              </div>

            </div>

          </div>
          <div className="mt-20 flex flex-wrap items-center justify-center gap-5">
  <a
    href="/hoa-qua-tang/hoa-bo"
    className="
      inline-flex
      items-center
      justify-center
      rounded-full
      bg-emerald-950
      px-8
      py-4
      text-sm
      font-medium
      text-white
      transition-all
      duration-300
      hover:-translate-y-1
      hover:bg-emerald-900
      hover:shadow-xl
    "
  >
    Khám phá sản phẩm
  </a>

  <a
    href="/"
    className="
      inline-flex
      items-center
      justify-center
      rounded-full
      border
      border-[#d9dee7]
      bg-white
      px-8
      py-4
      text-sm
      font-medium
      text-foreground
      transition-all
      duration-300
      hover:-translate-y-1
      hover:border-emerald-900
      hover:text-emerald-900
      hover:shadow-lg
    "
  >
    Về trang chủ
  </a>
</div>

        </section>
                


      </main>

      <Footer />

    </>
  );
}   