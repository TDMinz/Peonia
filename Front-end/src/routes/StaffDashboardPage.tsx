import StaffLayout from '../components/StaffLayout';

export default function StaffDashboardPage() {
  return (
    <StaffLayout title="Dashboard staff" subtitle="Tổng quan xử lý workshop booking và đơn mua hàng">
      <div className="grid gap-6 md:grid-cols-3">
        <Card title="Workshop booking" value="Quản lý danh sách booking workshop, duyệt trạng thái, xoá booking." />
        <Card title="Đơn mua hàng" value="Theo dõi đơn hàng sản phẩm, cập nhật trạng thái xử lý." />
        <Card title="Nhanh chóng" value="Giao diện tách riêng, không có header/footer, tối ưu cho staff." />
      </div>
    </StaffLayout>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-[#e8edf3] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
      <p className="text-xs uppercase tracking-[0.35em] text-[#8f9bb3]">{title}</p>
      <p className="mt-3 text-sm leading-7 text-[#6f7b8b]">{value}</p>
    </div>
  );
}
