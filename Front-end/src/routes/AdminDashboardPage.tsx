import { useEffect, useMemo, useState } from 'react';
import { LayoutDashboard, Package, Layers3, CalendarDays, ClipboardList, ShoppingBag, Users, ArrowRight } from 'lucide-react';
import { adminApi, type AdminBooking, type AdminCategory, type AdminOrder, type AdminProduct, type AdminVariant, type AdminWorkshop } from '../services/admin';
import AdminLayout from '../components/AdminLayout';

type MetricCardProps = { label: string; value: string; icon: React.ComponentType<{ className?: string }>; tone: string };
function MetricCard({ label, value, icon: Icon, tone }: MetricCardProps) {
  return (
    <div className="rounded-[1.5rem] border border-[#e8edf3] bg-white p-5 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#8f9bb3]">{label}</p>
          <p className="mt-2 font-serif text-3xl font-light text-foreground">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${tone}`}><Icon className="h-5 w-5" /></div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [variants, setVariants] = useState<AdminVariant[]>([]);
  const [workshops, setWorkshops] = useState<AdminWorkshop[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  useEffect(() => {
    adminApi.categories().then((d) => setCategories(d.data || [])).catch(() => setCategories([]));
    adminApi.products().then((d) => setProducts(d.data || [])).catch(() => setProducts([]));
    adminApi.variants().then((d) => setVariants(d.data || [])).catch(() => setVariants([]));
    adminApi.workshops().then((d) => setWorkshops(d.data || [])).catch(() => setWorkshops([]));
    adminApi.bookings().then((d) => setBookings(d.bookings || [])).catch(() => setBookings([]));
    adminApi.orders().then((d) => setOrders(d.orders || [])).catch(() => setOrders([]));
  }, []);

  const metrics = useMemo(
    () => [
      { label: 'Danh mục', value: String(categories.length), icon: Layers3, tone: 'bg-[#64748b]' },
      { label: 'Sản phẩm', value: String(products.length), icon: Package, tone: 'bg-emerald-950' },
      { label: 'Biến thể', value: String(variants.length), icon: ShoppingBag, tone: 'bg-[#e38b67]' },
      { label: 'Workshop', value: String(workshops.length), icon: CalendarDays, tone: 'bg-[#8b5cf6]' },
      { label: 'Booking', value: String(bookings.length), icon: ClipboardList, tone: 'bg-[#0ea5e9]' },
      { label: 'Đơn hàng', value: String(orders.length), icon: Users, tone: 'bg-[#111827]' },
    ],
    [categories, products, variants, workshops, bookings, orders]
  );

  return (
    <AdminLayout title="Dashboard" subtitle="Tổng quan dữ liệu quản trị Peonia">
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
      </section>
    </AdminLayout>
  );
}

