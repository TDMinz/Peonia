const nodemailer = require('nodemailer');

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || 'false') === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP chưa được cấu hình.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

async function sendResetCodeEmail(to, code, fullName) {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to,
    subject: 'Mã khôi phục mật khẩu Peonia',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; padding: 24px; background: #f6f7fb;">
        <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 32px; border: 1px solid #e8edf3;">
          <h2 style="margin: 0 0 12px; font-size: 24px; font-weight: 700;">Xin chào ${fullName || 'bạn'}</h2>
          <p style="margin: 0 0 18px; font-size: 15px; color: #4b5563;">Mã khôi phục mật khẩu của bạn là:</p>
          <div style="display:inline-block; padding: 16px 22px; border-radius: 14px; background: #111827; color: #ffffff; font-size: 28px; letter-spacing: 8px; font-weight: 700;">${code}</div>
          <p style="margin: 18px 0 0; font-size: 13px; color: #6b7280;">Mã này có hiệu lực trong 15 phút. Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
        </div>
      </div>
    `,
  });
}

async function sendNewOrderNotification(order, items = []) {
  const transporter = createTransporter();

  const from =
    process.env.SMTP_FROM ||
    process.env.SMTP_USER;

  const productHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #ececec;">
          🌸 ${item.product_id?.name || "Sản phẩm"}
          × ${item.quantity}
        </td>

        <td
          align="right"
          style="padding:12px 0;border-bottom:1px solid #ececec;font-weight:600;"
        >
          ${(item.price * item.quantity).toLocaleString(
            "vi-VN"
          )}đ
        </td>
      </tr>
    `
    )
    .join("");

  await transporter.sendMail({
    from,
    to: process.env.COMPANY_EMAIL,

    subject: `🌸 Đơn hàng mới ${order.order_code}`,

    html: `
    <div
      style="
        background:#f7f7f7;
        padding:40px;
        font-family:Arial,sans-serif;
      "
    >

      <div
        style="
          max-width:650px;
          margin:auto;
          background:white;
          border-radius:20px;
          overflow:hidden;
          box-shadow:0 8px 25px rgba(0,0,0,.08);
        "
      >

        <div
          style="
            background:#1f4d36;
            color:white;
            padding:28px;
            text-align:center;
          "
        >

          <h1
            style="
              margin:0;
              font-size:28px;
            "
          >
            🌸 ĐƠN HÀNG MỚI
          </h1>

          

        </div>

        <div style="padding:35px;">

          <h3 style="margin-top:0;">
            Thông tin khách hàng
          </h3>

          <table
            width="100%"
            style="line-height:30px;"
          >

            <tr>
              <td><b>Người mua</b></td>
              <td>${order.buyer_name}</td>
            </tr>

            <tr>
              <td><b>SĐT</b></td>
              <td>${order.buyer_phone}</td>
            </tr>

            <tr>
              <td><b>Người nhận</b></td>
              <td>${order.recipient_name}</td>
            </tr>

            <tr>
              <td><b>Địa chỉ</b></td>
              <td>${order.recipient_address}</td>
            </tr>

            <tr>
              <td><b>Ngày giao</b></td>
              <td>${order.delivery_date}</td>
            </tr>

            <tr>
              <td><b>Khung giờ</b></td>
              <td>${order.delivery_time_slot}</td>
            </tr>

          </table>

          <hr
            style="
              margin:35px 0;
              border:none;
              border-top:1px solid #ececec;
            "
          >

          <h3>Danh sách sản phẩm</h3>

          <table width="100%">

            ${productHtml}

          </table>

          <div
            style="
              margin-top:35px;
              background:#f5f5f5;
              padding:18px 24px;
              border-radius:12px;
              display:flex;
              justify-content:space-between;
              font-size:18px;
            "
          >

            <span>
              <b>Tổng tiền</b>
            </span>

            <span
              style="
                color:#1f4d36;
                font-weight:bold;
              "
            >
              ${order.total_price.toLocaleString("vi-VN")}đ
            </span>

          </div>

          <p
            style="
              margin-top:40px;
              text-align:center;
              color:#666;
            "
          >
            Vui lòng đăng nhập hệ thống Admin để xử lý đơn hàng.
          </p>

        </div>

      </div>

    </div>
    `,
  });
}

async function sendWorkshopBookingNotification(
  booking,
  workshop
) {
  const transporter = createTransporter();

  const from =
    process.env.SMTP_FROM ||
    process.env.SMTP_USER;

  await transporter.sendMail({

    from,

    to: process.env.COMPANY_EMAIL,

    subject:
      `🌸 Booking Workshop mới - ${booking.booking_code}`,

    html: `
      <div style="font-family:Arial,sans-serif;background:#f6f7fb;padding:30px">

        <div style="max-width:650px;margin:auto;background:#fff;padding:30px;border-radius:20px">

          <h2 style="margin-top:0;color:#166534">
            🌿 Có booking workshop mới
          </h2>

          <table style="width:100%">

            <tr>
              <td><strong>Mã booking</strong></td>
              <td>${booking.booking_code}</td>
            </tr>

            <tr>
              <td><strong>Workshop</strong></td>
              <td>${workshop.title}</td>
            </tr>

            <tr>
              <td><strong>Khách hàng</strong></td>
              <td>${booking.customer_name}</td>
            </tr>

            <tr>
              <td><strong>SĐT</strong></td>
              <td>${booking.customer_phone}</td>
            </tr>

            <tr>
              <td><strong>Số người</strong></td>
              <td>${booking.seats_booked}</td>
            </tr>

            <tr>
              <td><strong>Tổng tiền</strong></td>
              <td>
                ${booking.total_price.toLocaleString("vi-VN")}đ
              </td>
            </tr>

          </table>

          <hr style="margin:25px 0">

          <p>
            Vui lòng đăng nhập hệ thống để xác nhận booking.
          </p>

        </div>

      </div>
    `,
  });
}

module.exports = {
  sendResetCodeEmail,
  sendNewOrderNotification,
  sendWorkshopBookingNotification,
};
