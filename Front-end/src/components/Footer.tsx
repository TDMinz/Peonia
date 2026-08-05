import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#e7dccf] bg-[#f8f3ed]">
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">

          {/* CỘT 1 */}
          <div>
            <img
              src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1781513409/Y%E1%BA%BFm_1_kjuh4f.png"
              alt="Peonia"
              className="mb h-42 w-auto -mt-16 -ml-16"
            />

            <h3 className="mb-4 text-xl font-semibold text-[#4b3a2f] -mt-7">
              Peonia Studio
            </h3>

            <p className="mb-4 leading-8 text-[#6f6258]">
              Chuyên hoa lụa cao cấp, hoa sáp, hoa nội thất, workshop cắm hoa
              
              và trang trí sự kiện với phong cách tinh tế, sang trọng.
              
            </p>


          </div>

          {/* CỘT 2 */}
          <div>
            <h3 className="mb-6 font-serif text-3xl text-[#7b5e45]">
              Thông tin liên hệ
            </h3>

            <ul className="space-y-5">

              <li className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 text-[#C49A6C]" />
                <span className="text-[#6f6258]">
                  0352 363 833/ 0327 082 507/ 0399 389 933
                </span>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 text-[#C49A6C]" />
                <span className="text-[#6f6258]">
                peoniastudio.hanoi@gmail.com
                </span>
              </li>


              <li className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 text-[#C49A6C]" />
                <span className="text-[#6f6258]">
                  09:30 - 20:00 hàng ngày
                </span>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-[#C49A6C]" />
                <span className="text-[#6f6258]">
                  Số 1C Ngách 22, Ngõ 61 Lạc Trung
                  <br />
                  Vĩnh Tuy, Hà Nội <br />
                </span>
              </li>
              <a
                href="https://maps.app.goo.gl/Zo54qaC3eJ93v2iu9"
                target="_blank"
                rel="noreferrer"
                className="
    inline-flex
    items-center
    gap-2
    rounded-full
    border
    border-[#C49A6C]
    px-4
    py-2
    text-sm
    text-[#C49A6C]
    transition
    hover:bg-[#C49A6C]
    hover:text-white
  "
              >
                <MapPin size={16} />
                Xem chỉ đường
              </a>

            </ul>
          </div>

          {/* CỘT 3 */}
          <div>
            <h3 className="mb-6 font-serif text-3xl text-[#7b5e45]">
              Chính Sách
            </h3>

            <ul className="space-y-4 text-[#6f6258]">
              <li>
                <a href="/chinh-sach-bao-mat" className="hover:text-[#C49A6C]">
                  • Chính Sách Bảo Mật
                </a>
              </li>

              <li>
                <a href="/chinh-sach-doi-tra" className="hover:text-[#C49A6C]">
                  • Chính Sách Đổi Trả
                </a>
              </li>

              <li>
                <a href="/chinh-sach-van-chuyen" className="hover:text-[#C49A6C]">
                  • Chính Sách Giao Nhận & Vận Chuyển
                </a>
              </li>

              <li>
                <a href="/chinh-sach-thanh-toan" className="hover:text-[#C49A6C]">
                  • Chính Sách Thanh Toán
                </a>
              </li>
            </ul>

            {/* Facebook */}
            <div className="mt-5 ">
              <a
                href="https://www.facebook.com/PeoniaWorkshop"
                target="_blank"
                rel="noreferrer"
                className="
                  inline-flex
                  items-center
                  rounded-xl
                  border
                  border-[#e7dccf]
                  bg-white
                  px-4
                  py-3
                  text-[#6f6258]
                  transition
                  hover:border-[#C49A6C]
                "
              >
                Theo dõi Facebook
              </a>
            </div>
          </div>

        </div>

        {/* COPYRIGHT */}


      </div>
    </footer>
  );
}