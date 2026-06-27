const nodemailer = require("nodemailer");

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure =
    String(process.env.SMTP_SECURE || "false") === "true";

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP chưa được cấu hình.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

function getCompanyEmails() {
  return (process.env.COMPANY_EMAIL || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function formatMoney(number = 0) {
  return Number(number).toLocaleString("vi-VN") + "đ";
}

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString(
    "vi-VN"
  );
}

function buildLayout(title, content) {
  return `
<!DOCTYPE html>

<html>

<head>

<meta charset="utf-8"/>

<meta
name="viewport"
content="width=device-width,initial-scale=1"
/>

</head>

<body
style="
margin:0;
padding:0;
background:#f5f6f8;
font-family:Arial,sans-serif;
"
>

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="background:#f5f6f8;padding:30px 10px;"
>

<tr>

<td align="center">

<table
width="650"
cellpadding="0"
cellspacing="0"
style="
max-width:650px;
width:100%;
background:#ffffff;
border-radius:18px;
overflow:hidden;
box-shadow:0 8px 25px rgba(0,0,0,.08);
"
>

<tr>

<td
style="
background:#1f4d36;
padding:30px;
text-align:center;
color:white;
"
>

<h1
style="
margin:0;
font-size:28px;
font-weight:bold;
"
>

🌸 PEONIA

</h1>

<p
style="
margin-top:8px;
font-size:15px;
opacity:.9;
"
>

${title}

</p>

</td>

</tr>

<tr>

<td
style="
padding:28px;
"
>

${content}

</td>

</tr>

<tr>

<td
style="
background:#fafafa;
padding:18px;
text-align:center;
font-size:13px;
color:#888;
"
>

Email được gửi tự động từ hệ thống Peonia.

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
`;
}

function buildInfoCard(title, value) {

return `
<div
style="
padding:12px 16px;
margin-bottom:10px;
border:1px solid #ececec;
border-radius:10px;
background:#fafafa;
"
>

<div
style="
font-size:13px;
color:#666;
margin-bottom:4px;
"
>

${title}

</div>

<div
style="
font-size:15px;
font-weight:bold;
color:#222;
word-break:break-word;
"
>

${value || ""}

</div>

</div>
`;

}

async function sendResetCodeEmail(
to,
code,
fullName
){

const transporter=createTransporter();

const from=
process.env.SMTP_FROM||
process.env.SMTP_USER;

const html=buildLayout(

"Khôi phục mật khẩu",

`

<h2
style="
margin-top:0;
">

Xin chào
${fullName||"bạn"}

</h2>

<p>

Bạn vừa yêu cầu đặt lại mật khẩu.

</p>

<div
style="
margin:35px 0;
text-align:center;
"
>

<div
style="
display:inline-block;
background:#1f4d36;
color:white;
padding:18px 30px;
font-size:34px;
font-weight:bold;
letter-spacing:8px;
border-radius:14px;
"
>

${code}

</div>

</div>

<p>

Mã OTP có hiệu lực trong
<b>15 phút.</b>

</p>

<p
style="
color:#888;
font-size:13px;
"
>

Nếu bạn không thực hiện yêu cầu này,
hãy bỏ qua email.

</p>

`

);

await transporter.sendMail({

from,

to,

subject:"Mã khôi phục mật khẩu Peonia",

html,

});

}

function buildProductTable(items = []) {
  if (!items.length) {
    return `
      <p style="color:#666;">
        Không có sản phẩm.
      </p>
    `;
  }

  return `
<table
width="100%"
cellpadding="0"
cellspacing="0"
style="
border-collapse:collapse;
margin-top:15px;
">

${items
  .map(
    (item) => `
<tr>

<td
style="
padding:14px 0;
border-bottom:1px solid #ececec;
vertical-align:top;
width:70px;
">

${
  item.product_id?.image_url
    ? `
<img
src="${item.product_id.image_url}"
width="60"
height="60"
style="
border-radius:10px;
object-fit:cover;
display:block;
"
/>
`
    : `
<div
style="
width:60px;
height:60px;
border-radius:10px;
background:#edf5ef;
display:flex;
align-items:center;
justify-content:center;
font-size:24px;
">
🌸
</div>
`
}

</td>

<td
style="
padding:14px 10px;
border-bottom:1px solid #ececec;
vertical-align:top;
">

<div
style="
font-weight:bold;
font-size:15px;
color:#222;
">

${item.product_id?.name || "Sản phẩm"}

</div>

<div
style="
margin-top:5px;
font-size:13px;
color:#666;
">

Số lượng:
<b>${item.quantity}</b>

</div>

<div
style="
margin-top:3px;
font-size:13px;
color:#666;
">

Đơn giá:
<b>${formatMoney(item.price)}</b>

</div>

</td>

<td
align="right"
style="
padding:14px 0;
border-bottom:1px solid #ececec;
white-space:nowrap;
font-weight:bold;
color:#1f4d36;
">

${formatMoney(item.price * item.quantity)}

</td>

</tr>
`
  )
  .join("")}

</table>
`;
}

async function sendNewOrderNotification(order, items = []) {

  const transporter = createTransporter();

  const from =
    process.env.SMTP_FROM ||
    process.env.SMTP_USER;

  const html = buildLayout(

    "Có đơn hàng mới",

    `

<h2
style="
margin-top:0;
margin-bottom:20px;
">

🌸 Đơn hàng
${order.order_code}

</h2>

${buildInfoCard(
  "👤 Người mua",
  order.buyer_name
)}

${buildInfoCard(
  "📞 Số điện thoại",
  order.buyer_phone
)}

${buildInfoCard(
  "👤 Người nhận",
  order.recipient_name
)}

${buildInfoCard(
  "📍 Địa chỉ giao",
  order.recipient_address
)}

${buildInfoCard(
  "📅 Ngày giao",
  formatDate(order.delivery_date)
)}

${buildInfoCard(
  "🕒 Khung giờ",
  order.delivery_time_slot
)}

${
order.card_message
? buildInfoCard(
    "💌 Thiệp",
    order.card_message
  )
: ""
}

<hr
style="
margin:28px 0;
border:none;
border-top:1px solid #ececec;
"
/>

<h3
style="
margin:0 0 15px;
">

Danh sách sản phẩm

</h3>

${buildProductTable(items)}

<table
width="100%"
style="
margin-top:25px;
background:#f8faf8;
border-radius:12px;
"
cellpadding="15"
>

<tr>

<td>

<b>

Tổng tiền

</b>

</td>

<td
align="right"
style="
font-size:24px;
font-weight:bold;
color:#1f4d36;
"
>

${formatMoney(order.total_price)}

</td>

</tr>

</table>

<p
style="
margin-top:35px;
color:#666;
line-height:26px;
">

Đơn hàng đã được tạo thành công.

Vui lòng đăng nhập hệ thống quản trị để xác nhận và xử lý đơn hàng.

</p>

`

  );

  await transporter.sendMail({

    from,

    bcc: getCompanyEmails(),

    subject: `🌸 Đơn hàng mới ${order.order_code}`,

    html,

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

  const html = buildLayout(

    "Có booking Workshop mới",

    `

<h2
style="
margin-top:0;
margin-bottom:20px;
">

🌿 Booking
${booking.booking_code}

</h2>

${buildInfoCard(
  "🌸 Workshop",
  workshop?.title || ""
)}

${buildInfoCard(
  "👤 Khách hàng",
  booking.customer_name
)}

${buildInfoCard(
  "📞 Số điện thoại",
  booking.customer_phone
)}

${buildInfoCard(
  "📅 Ngày tổ chức",
  workshop?.event_date
    ? formatDate(workshop.event_date)
    : ""
)}

${buildInfoCard(
  "👥 Số người",
  booking.seats_booked
)}

${buildInfoCard(
  "💳 Trạng thái thanh toán",
  booking.payment_status || "Chưa thanh toán"
)}

<hr
style="
margin:28px 0;
border:none;
border-top:1px solid #ececec;
"
/>

<table
width="100%"
cellpadding="15"
style="
background:#f8faf8;
border-radius:12px;
"
>

<tr>

<td>

<b>

Tổng tiền

</b>

</td>

<td
align="right"
style="
font-size:24px;
font-weight:bold;
color:#1f4d36;
"
>

${formatMoney(
booking.total_price
)}

</td>

</tr>

</table>

<p
style="
margin-top:35px;
color:#666;
line-height:26px;
"
>

Khách hàng vừa đăng ký workshop.

Vui lòng đăng nhập hệ thống để xác nhận booking
và kiểm tra bill thanh toán.

</p>

`

  );

  await transporter.sendMail({

    from,

    bcc: getCompanyEmails(),

    subject:
      `🌿 Booking Workshop ${booking.booking_code}`,

    html,

  });

}

module.exports = {

  sendResetCodeEmail,

  sendNewOrderNotification,

  sendWorkshopBookingNotification,

};