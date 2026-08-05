import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <Header cartCount={0} />

      <main className="bg-white py-16">

        <div className="mx-auto max-w-5xl px-6">

          <h1 className="text-center font-serif text-5xl font-light text-[#3d2c1f]">
            CHÍNH SÁCH BẢO MẬT THÔNG TIN
          </h1>

          <div className="mx-auto mt-5 h-[2px] w-24 bg-[#b08b57]" />

          <div className="mt-14 space-y-8 text-[17px] leading-9 text-gray-700">

            <p className="font-semibold text-[#3d2c1f]">
              Thương hiệu Peonia – Thuộc Công ty TNHH Kim Bảo Phát Gifts
            </p>

            <p>
              Chào mừng bạn đã ghé thăm không gian trực tuyến của Peonia. Tại
              Peonia, chúng tôi hiểu rằng sự tin tưởng của bạn chính là món quà
              vô giá nhất. Vì vậy, việc bảo vệ thông tin cá nhân và tôn trọng
              quyền riêng tư của khách hàng luôn là tôn chỉ hàng đầu trong mọi
              hoạt động kinh doanh của Công ty TNHH Kim Bảo Phát Gifts.
            </p>

            <p>
              Căn cứ theo Luật An toàn thông tin mạng và Luật Bảo vệ quyền lợi
              người tiêu dùng hiện hành, chúng tôi xin công khai minh bạch các
              điều khoản bảo mật dưới đây để bạn có thể hoàn toàn an tâm trải
              nghiệm.
            </p>

            {/* ================================================= */}

            <h2 className="pt-6 text-3xl font-semibold text-[#3d2c1f]">
              1. Chúng tôi là ai?
            </h2>

            <p>
              Chúng tôi là Peonia, thương hiệu cung cấp hoa lụa thiết kế cao cấp
              và các dịch vụ decor không gian sống thuộc sở hữu của Công ty
              TNHH Kim Bảo Phát Gifts.
            </p>

            <p>
              <strong>Website chính thức: </strong>
              
              https://www.peoniastudio.vn
            </p>

            {/* ================================================= */}

            <h2 className="pt-6 text-3xl font-semibold text-[#3d2c1f]">
              2. Thông tin chúng tôi thu thập & Cách thức sử dụng
            </h2>

            <p>
              Để mang lại trải nghiệm mua sắm và dịch vụ chăm sóc khách hàng tốt
              nhất, Peonia thu thập một số thông tin cơ bản sau:
            </p>

            <div className="space-y-6 border-l-4 border-[#b08b57] pl-6">

              <div>

                <p className="font-semibold text-[#3d2c1f]">
                  • Thông tin giao dịch
                </p>

                <p className="mt-2">
                  Khi bạn đặt hàng hoặc đăng ký nhận tư vấn, chúng tôi lưu trữ
                  Họ tên, Số điện thoại, Email và Địa chỉ giao hàng. Thông tin
                  này giúp chúng tôi xử lý đơn hàng chính xác, vận chuyển nhanh
                  chóng và hỗ trợ bạn kịp thời.
                </p>

              </div>

              <div>

                <p className="font-semibold text-[#3d2c1f]">
                  • Bình luận và Tương tác
                </p>

                <p className="mt-2">
                  Khi bạn để lại cảm nhận hoặc câu hỏi trên website, hệ thống sẽ
                  lưu trữ nội dung đó kèm theo địa chỉ IP để hiển thị phản hồi
                  và tự động lọc các nội dung quảng cáo rác (spam).
                </p>

              </div>

              <div>

                <p className="font-semibold text-[#3d2c1f]">
                  • Dữ liệu Cookies (Bộ nhớ đệm)
                </p>

                <p className="mt-2">
                  Website sử dụng cookie để nhận diện trình duyệt, giúp tự động
                  lưu thông tin đăng nhập hoặc các mặt hàng bạn đã thêm vào giỏ.
                  Nhờ đó, bạn sẽ không phải nhập lại thông tin nhiều lần khi ghé
                  thăm Peonia lần sau.
                </p>

              </div>

            </div>
                        {/* ================================================= */}

            <h2 className="pt-8 text-3xl font-semibold text-[#3d2c1f]">
              3. Cam kết chia sẻ thông tin bảo mật
            </h2>

            <p>
              Peonia và Công ty TNHH Kim Bảo Phát Gifts cam kết không bao giờ
              bán, cho thuê hoặc trao đổi thông tin cá nhân của bạn cho bất kỳ
              bên thứ ba nào vì mục đích thương mại. Thông tin của bạn chỉ được
              chia sẻ trong các trường hợp giới hạn sau:
            </p>

            <div className="space-y-6 border-l-4 border-[#b08b57] pl-6">

              <div>

                <p className="font-semibold text-[#3d2c1f]">
                  • Đối tác vận hành
                </p>

                <p className="mt-2">
                  Giao nhận địa chỉ cho các đơn vị vận chuyển uy tín để đưa
                  những bình hoa lụa xinh đẹp đến tay bạn một cách vẹn nguyên
                  nhất.
                </p>

              </div>

              <div>

                <p className="font-semibold text-[#3d2c1f]">
                  • Yêu cầu pháp lý
                </p>

                <p className="mt-2">
                  Cung cấp thông tin cho các cơ quan chức năng khi có yêu cầu
                  hợp pháp theo đúng quy định của pháp luật Việt Nam.
                </p>

              </div>

            </div>

            {/* ================================================= */}

            <h2 className="pt-8 text-3xl font-semibold text-[#3d2c1f]">
              4. Giải pháp bảo mật tối đa
            </h2>

            <p>
              Chúng tôi áp dụng các biện pháp kỹ thuật và công nghệ bảo mật tiên
              tiến nhất để bảo vệ dữ liệu của bạn khỏi các hành vi truy cập trái
              phép, mất mát hoặc thay đổi ngoài ý muốn. Dù không có một hệ thống
              mạng nào an toàn tuyệt đối 100%, Peonia vẫn luôn nỗ lực không
              ngừng để nâng cấp hàng rào bảo mật, gìn giữ sự an tâm cho bạn.
            </p>

            {/* ================================================= */}

            <h2 className="pt-8 text-3xl font-semibold text-[#3d2c1f]">
              5. Quyền lợi của bạn đối với thông tin cá nhân
            </h2>

            <p>
              Bạn là người sở hữu duy nhất đối với dữ liệu của mình. Bất cứ lúc
              nào, bạn cũng có quyền yêu cầu Peonia:
            </p>

            <ul className="space-y-4 pl-8">

              <li>
                <span className="font-semibold text-[#3d2c1f]">✓ </span>
                Kiểm tra, cập nhật hoặc chỉnh sửa lại thông tin cá nhân.
              </li>

              <li>
                <span className="font-semibold text-[#3d2c1f]">✓ </span>
                Xóa bỏ hoàn toàn dữ liệu của bạn lưu trữ trên hệ thống của chúng
                tôi.
              </li>

              <li>
                <span className="font-semibold text-[#3d2c1f]">✓ </span>
                Từ chối nhận các thông tin quảng cáo, chương trình ưu đãi từ
                thương hiệu.
              </li>

            </ul>
                        {/* ================================================= */}

            <h2 className="pt-8 text-3xl font-semibold text-[#3d2c1f]">
              6. Thay đổi chính sách
            </h2>

            <p>
              Để phù hợp với sự phát triển của công nghệ và quy định pháp luật
              mới, chính sách này có thể được điều chỉnh. Mọi thay đổi sẽ được
              cập nhật công khai ngay tại trang web này để bạn luôn nắm rõ quyền
              lợi của mình.
            </p>

            {/* ================================================= */}

            <h2 className="pt-8 text-3xl font-semibold text-[#3d2c1f]">
              7. Liên hệ với chúng tôi
            </h2>

            <p>
              Nếu bạn có bất kỳ thắc mắc nào về chính sách bảo mật hoặc muốn thay
              đổi thông tin cá nhân trên hệ thống, xin vui lòng kết nối với đội
              ngũ chăm sóc khách hàng của chúng tôi:
            </p>

            <div className="mt-8 rounded-2xl border border-[#e5ddd2] bg-[#faf8f5] p-8">

              <div className="space-y-5">

                <div className="flex flex-col md:flex-row md:gap-3">
                  <span className="min-w-[170px] font-semibold text-[#3d2c1f]">
                    Công ty sở hữu:
                  </span>

                  <span>
                    Công ty TNHH Kim Bảo Phát Gifts
                  </span>
                </div>

                <div className="flex flex-col md:flex-row md:gap-3">
                  <span className="min-w-[170px] font-semibold text-[#3d2c1f]">
                    Thương hiệu:
                  </span>

                  <span>
                    Peonia Workshops / Peonia Decor
                  </span>
                </div>

                <div className="flex flex-col md:flex-row md:gap-3">
                  <span className="min-w-[170px] font-semibold text-[#3d2c1f]">
                    Địa chỉ:
                  </span>

                  <span>
                    Số Nhà 1C, Ngách 22, Ngõ 61 Lạc Trung, Hà Nội
                  </span>
                </div>

                <div className="flex flex-col md:flex-row md:gap-3">
                  <span className="min-w-[170px] font-semibold text-[#3d2c1f]">
                    Hotline / Zalo:
                  </span>

                  <span>
                    0352 363 833
                  </span>
                </div>

                <div className="flex flex-col md:flex-row md:gap-3">
                  <span className="min-w-[170px] font-semibold text-[#3d2c1f]">
                    Email:
                  </span>

                  <span>
                    peoniastudio.hanoi@gmail.com
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

      <Footer />

    </>
  );
}