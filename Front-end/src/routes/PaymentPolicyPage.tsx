import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PaymentPolicyPage() {
  return (
    <>
      <Header cartCount={0} />

      <main className="bg-white py-16">

        <div className="mx-auto max-w-5xl px-6">

          <h1 className="text-center font-serif text-5xl font-light text-[#3d2c1f]">
            CHÍNH SÁCH THANH TOÁN
          </h1>

          <div className="mx-auto mt-5 h-[2px] w-24 bg-[#b08b57]" />

          <div className="mt-14 space-y-8 text-[17px] leading-9 text-gray-700">

            <p className="font-semibold text-[#3d2c1f]">
              Peonia – Tiện lợi, an tâm trong từng giao dịch
            </p>

            <p>
              Chào mừng bạn đến với Peonia! Để hành trình sở hữu những tác phẩm
              hoa lụa thiết kế và dịch vụ decor của bạn diễn ra suôn sẻ, an toàn
              nhất, Peonia xin gửi đến bạn các phương thức thanh toán linh hoạt
              hiện đang được áp dụng tại hệ thống của chúng tôi.
            </p>

            <p>
              Hiện tại, hệ thống Website của Peonia đang trong quá trình nâng
              cấp tính năng thanh toán trực tuyến để mang lại trải nghiệm tối ưu
              nhất cho bạn trong tương lai gần. Ở thời điểm hiện tại, bạn có thể
              hoàn toàn an tâm lựa chọn một trong hai hình thức thanh toán bảo
              mật dưới đây:
            </p>

            {/* ================================================= */}

            <h2 className="pt-8 text-3xl font-semibold text-[#3d2c1f]">
              1. Phương Thức Chuyển Khoản Ngân Hàng (Khuyến khích lựa chọn)
            </h2>

            <p>
              Đây là hình thức được phần lớn khách hàng tại Peonia ưu tiên lựa
              chọn nhờ tính tiện dụng, an toàn tuyệt đối, giúp giao dịch được
              xác thực ngay lập tức và tiết kiệm tối đa thời gian.
            </p>

            <div className="space-y-6 border-l-4 border-[#b08b57] pl-6">

              <div>

                <p className="font-semibold text-[#3d2c1f]">
                  • Cách thức thực hiện
                </p>

                <p className="mt-2">
                  Ngay sau khi chọn được mẫu bình hoa ưng ý hoặc chốt thiết kế
                  riêng, quý khách có thể tiến hành chuyển khoản qua tài khoản
                  ngân hàng chính thức của Peonia. Khi hệ thống ghi nhận thanh
                  toán thành công, đội ngũ của chúng tôi sẽ lập tức tiến hành
                  chuẩn bị, đóng gói tỉ mỉ và giao tác phẩm đến tận tay bạn.
                </p>

              </div>

              <div>

                <p className="font-semibold text-[#3d2c1f]">
                  • Lợi ích tối ưu
                </p>

                <p className="mt-2">
                  Vì các sản phẩm bình hoa decor của Peonia thường tương đối
                  cồng kềnh, việc chuyển khoản trước sẽ giúp bạn tiết kiệm được
                  một khoản chi phí đáng kể. Các đơn vị vận chuyển thường tính
                  thêm phí thu hộ (phí COD) khá cao đối với các kiện hàng giá
                  trị và cồng kềnh, điều này vô tình làm tăng chi phí không đáng
                  có cho bạn.
                </p>

              </div>

            </div>
                        {/* ================================================= */}

            <h2 className="pt-8 text-3xl font-semibold text-[#3d2c1f]">
              2. Phương Thức Thanh Toán Khi Nhận Hàng (COD)
            </h2>

            <p>
              Để bạn có thể thoải mái và tự tin hơn trong lần đầu trải nghiệm
              dịch vụ tại Peonia, chúng tôi hỗ trợ hình thức giao hàng và thu
              tiền mặt tận nơi với các lưu ý sau:
            </p>

            <div className="space-y-6 border-l-4 border-[#b08b57] pl-6">

              <div>

                <p className="font-semibold text-[#3d2c1f]">
                  • Phạm vi áp dụng
                </p>

                <p className="mt-2">
                  Hình thức nhận hàng – thanh toán tiền mặt hiện chỉ áp dụng cho
                  các đơn hàng giao trong khu vực nội thành Hà Nội.
                </p>

              </div>

              <div>

                <p className="font-semibold text-[#3d2c1f]">
                  • Giá trị đơn hàng
                </p>

                <p className="mt-2">
                  Áp dụng đối với các đơn hàng có sẵn và có tổng trị giá từ
                  1.000.000đ trở xuống (không áp dụng cho các đơn hàng thiết kế
                  riêng cần đặt cọc trước). Sau khi bạn đặt hàng thành công,
                  nhân viên giao hàng sẽ liên hệ trước để xác nhận thời gian và
                  trao hoa, nhận tiền mặt trực tiếp tại địa chỉ của bạn.
                </p>

              </div>

            </div>

            {/* ================================================= */}

            <h2 className="pt-8 text-3xl font-semibold text-[#3d2c1f]">
              Lời Nhắn Nhủ Từ Tâm Đến Quý Khách Hàng
            </h2>

            <p>
              Mọi giao dịch chuyển khoản tại Peonia đều được bảo mật, xác thực
              minh bạch qua hệ thống ngân hàng và được pháp luật bảo vệ.
            </p>

            <p>
              Nếu bạn còn bất kỳ băn khoăn nào về chất lượng hoa, phom dáng hay
              độ vẹn nguyên của sản phẩm trong quá trình vận chuyển, xin đừng lo
              lắng! Bạn hoàn toàn có thể tham khảo Chính sách Đặt hàng & Bảo
              hành của Peonia để thấy được những cam kết tối cao của chúng tôi
              đối với quyền lợi của bạn. Sự an tâm và nụ cười hài lòng của bạn
              khi đón nhận những đóa hoa chính là hạnh phúc lớn nhất của
              Peonia.
            </p>

            <div className="rounded-2xl border border-[#e8dccd] bg-[#faf8f5] p-8">

              <p className="text-lg font-semibold text-[#3d2c1f]">
                Peonia xin chân thành cảm ơn sự đồng hành và tin tưởng của bạn!
              </p>

            </div>

          </div>

        </div>

      </main>

      <Footer />

    </>
  );
}