import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ShippingPolicyPage() {
  return (
    <>
      <Header cartCount={0} />

      <main className="bg-white py-16">

        <div className="mx-auto max-w-5xl px-6">

          <h1 className="text-center font-serif text-5xl font-light text-[#3d2c1f]">
            CHÍNH SÁCH GIAO NHẬN & VẬN CHUYỂN
          </h1>

          <div className="mx-auto mt-5 h-[2px] w-24 bg-[#b08b57]" />

          <div className="mt-14 space-y-8 text-[17px] leading-9 text-gray-700">

            <p className="font-semibold text-[#3d2c1f]">
              Peonia – Đưa nghệ thuật an tâm đến không gian của bạn
            </p>

            <p>
              Mỗi sản phẩm tại Peonia (thương hiệu thuộc Công ty TNHH Kim Bảo
              Phát Gifts) đều là một tác phẩm nghệ thuật được chăm chút bằng cả
              tâm huyết. Vì vậy, chúng tôi luôn mong muốn hành trình đưa những
              đóa hoa xinh đẹp ấy đến gõ cửa nhà bạn sẽ là một trải nghiệm trọn
              vẹn, an toàn và thuận lợi nhất.
            </p>

            <p>
              Vui lòng dành ít phút đọc kỹ các chính sách giao nhận dưới đây để
              cùng Peonia bảo vệ quyền lợi cho chính mình, bạn nhé!
            </p>

            {/* ================================================= */}

            <h2 className="pt-8 text-3xl font-semibold text-[#3d2c1f]">
              1. Thời Gian Hoàn Thiện & Giao Hàng
            </h2>

            <p>
              Tại Peonia, thời gian chuẩn bị đơn hàng sẽ phụ thuộc vào đặc tính
              của từng dòng sản phẩm:
            </p>

            <div className="space-y-6 border-l-4 border-[#b08b57] pl-6">

              <div>

                <p className="font-semibold text-[#3d2c1f]">
                  • Đối với sản phẩm có sẵn
                </p>

                <p className="mt-2">
                  Tiệm sẽ tiến hành đóng gói và giao ngay cho đơn vị vận chuyển
                  để đưa đến tay bạn nhanh nhất có thể.
                </p>

              </div>

              <div>

                <p className="font-semibold text-[#3d2c1f]">
                  • Đối với các dòng Bình hoa Decor thiết kế
                </p>

                <p className="mt-2">
                  Do mỗi tác phẩm mang một phom dáng nghệ thuật riêng và tùy
                  thuộc vào sự độc bản của dáng bình/sắc hoa tại thời điểm đó,
                  một số mẫu sẽ không có sẵn ngay tại tiệm. Trong trường hợp
                  này, Peonia rất mong bạn đặt trước từ 1 – 2 tuần để các nghệ
                  nhân của chúng tôi có đủ thời gian tỉ mỉ tạo tác sản phẩm hoàn
                  hảo nhất dành riêng cho bạn.
                </p>

              </div>

            </div>

            {/* ================================================= */}

            <h2 className="pt-8 text-3xl font-semibold text-[#3d2c1f]">
              2. Các Phương Thức Vận Chuyển (Áp dụng Toàn quốc)
            </h2>

            <p>
              Peonia hợp tác với các đơn vị vận chuyển uy tín để giao hàng đến
              một địa điểm duy nhất theo yêu cầu của bạn, thông qua hai hình
              thức:
            </p>

            <div className="space-y-8 border-l-4 border-[#b08b57] pl-6">

              <div>

                <p className="text-xl font-semibold text-[#3d2c1f]">
                  • Giao hàng Tiêu chuẩn (Thảnh thơi đón hoa)
                </p>

                <div className="mt-4 space-y-5">

                  <div>

                    <p className="font-semibold">
                      Khu vực nội thành Hà Nội
                    </p>

                    <p>
                      Nhận hàng sau 1 – 2 ngày kể từ khi sản phẩm hoàn thiện.
                      Phí ship được tính dựa trên độ cồng kềnh của kiện hàng
                      (dao động từ 20.000đ – 150.000đ).
                    </p>

                  </div>

                  <div>

                    <p className="font-semibold">
                      Các tỉnh thành khác
                    </p>

                    <p>
                      Nhận hàng sau 3 – 7 ngày tùy khu vực. Phí cước sẽ được
                      thông báo cụ thể cho bạn theo biểu phí của đơn vị vận
                      chuyển (đối với các kiện hàng cồng kềnh, Peonia sẽ hỗ trợ
                      tư vấn phương thức tối ưu chi phí nhất cho bạn).
                    </p>

                  </div>

                </div>

              </div>
                          <div>

              <p className="text-xl font-semibold text-[#3d2c1f]">
                • Giao hàng Nhanh (Hoa ship hỏa tốc)
              </p>

              <div className="mt-4 space-y-5">

                <div>

                  <p className="font-semibold">
                    Nội thành Hà Nội
                  </p>

                  <p>
                    Giao ngay trong ngày theo chi phí thực tế của ứng dụng gọi
                    xe công nghệ.
                  </p>

                </div>

                <div>

                  <p className="font-semibold">
                    Các tỉnh thành khác
                  </p>

                  <p>
                    Nhận hàng hỏa tốc sau 2 – 4 ngày tùy khu vực và điều kiện
                    kết nối chuyến của đơn vị vận tải.
                  </p>

                </div>

              </div>

            </div>

            </div>

            {/* ================================================= */}

            <h2 className="pt-8 text-3xl font-semibold text-[#3d2c1f]">
              3. Quy Cách Đóng Gói An Toàn
            </h2>

            <p>
              Các tác phẩm hoa lụa và bình gốm/thủy tinh của Peonia thường có
              giá trị thẩm mỹ cao và tương đối cồng kềnh. Để những cánh hoa luôn
              giữ đúng phom dáng mềm mại và bình không bị rạn nứt, đội ngũ
              Peonia luôn tuân thủ quy trình đóng gói nghiêm ngặt: bọc xốp bong
              bóng khí, chèn mút chống va đập và đặt trong thùng carton chịu
              lực.
            </p>

            <p>
              Mỗi kiện hàng đi tỉnh xa đều được mua bảo hiểm hàng hóa, giúp bạn
              hoàn toàn an tâm trong suốt hành trình vận chuyển.
            </p>

            {/* ================================================= */}

            <h2 className="pt-8 text-3xl font-semibold text-[#3d2c1f]">
              4. Điều Khoản Trách Nhiệm & Đồng Hành
            </h2>

            <p>
              Peonia cam kết chịu trách nhiệm đối với các rủi ro (như mất mát
              hoặc hư hại) trong suốt quá trình vận chuyển từ tiệm đến tay bạn.
              Tuy nhiên, để đảm bảo quyền lợi tối đa, chúng tôi rất cần sự đồng
              hành từ bạn:
            </p>

            <div className="space-y-6 border-l-4 border-[#b08b57] pl-6">

              <div>

                <p className="font-semibold text-[#3d2c1f]">
                  • Quy trình nhận hàng an tâm
                </p>

                <p className="mt-2">
                  Khi shipper giao tới, xin bạn vui lòng kiểm tra kỹ kiện hàng
                  (Peonia khuyến khích bạn quay lại video mở hộp). Nếu phát hiện
                  hoa bị biến dạng, bình gốm bị nứt vỡ hoặc sai mẫu, hãy ký xác
                  nhận tình trạng với shipper và liên hệ ngay với Hotline của
                  Peonia để được xử lý đổi trả trong tích tắc.
                </p>

              </div>

              <div>

                <p className="font-semibold text-[#3d2c1f]">
                  • Sau khi đã ký nhận
                </p>

                <p className="mt-2">
                  Nếu bạn đã ký nhận hàng từ shipper mà không có ghi chú hay
                  phản hồi ngay lúc đó, Peonia xin phép từ chối giải quyết các
                  khiếu nại về hư hỏng, nứt vỡ hay sai mẫu phát sinh sau này.
                </p>

              </div>

              <div>

                <p className="font-semibold text-[#3d2c1f]">
                  • Trường hợp vận chuyển riêng
                </p>

                <p className="mt-2">
                  Nếu bạn tự chỉ định đơn vị vận chuyển khác ngoài hệ thống đối
                  tác của Peonia, bạn sẽ là người chịu mọi trách nhiệm về cước
                  phí cũng như tổn thất (nhếu có) trong quá trình vận hành của
                  đơn vị đó.
                </p>

              </div>

            </div>
                        {/* ================================================= */}

            <h2 className="pt-8 text-3xl font-semibold text-[#3d2c1f]">
              5. Lời Sẻ Chia Cho Những Trường Hợp Bất Khả Kháng
            </h2>

            <p>
              Hành trình của những chuyến xe đôi khi gặp phải những trở ngại
              ngoài ý muốn như thiên tai, mưa lũ, hoặc sự cố giao thông bất
              ngờ. Nếu bình hoa của bạn có đến trễ hơn lịch hẹn đôi chút vì
              những lý do bất khả kháng này, Peonia rất mong nhận được sự mở
              lòng và cảm thông sâu sắc từ bạn.
            </p>

            <div className="rounded-2xl border border-[#e8dccd] bg-[#faf8f5] p-8">

              <p className="text-lg font-semibold text-[#3d2c1f]">
                Peonia xin chân thành cảm ơn bạn đã lựa chọn tin tưởng và đồng
                hành cùng chúng tôi!
              </p>

            </div>

          </div>

        </div>

      </main>

      <Footer />

    </>
  );
}