import AdminLayout from '../components/AdminLayout';

export default function AdminEventsPage() {
  return (
    <AdminLayout title="Quản lý events" subtitle="Sự kiện, workshop giới thiệu, và lịch diễn ra">
      <div className="rounded-[2rem] border border-[#e6ddd3] bg-white p-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)]">
        <p className="text-sm text-[#6f665d]">Trang này sẽ quản lý các sự kiện sắp tới, event giới thiệu và lịch diễn ra.</p>
      </div>
    </AdminLayout>
  );
}
