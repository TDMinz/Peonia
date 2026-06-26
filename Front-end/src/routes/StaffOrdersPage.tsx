import { Eye, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import StaffLayout from '../components/StaffLayout';
import { staffAdminApi, type ShopOrderItem, type WorkshopBookingItem } from '../services/adminStaff';

const orderStatuses = ['pending', 'confirmed', 'processing', 'completed', 'cancelled'];
const bookingStatuses = ['pending', 'confirmed', 'processing', 'completed', 'cancelled'];

const statusClasses: Record<string, string> = {
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  confirmed: 'border-blue-200 bg-blue-50 text-blue-700',
  processing: 'border-purple-200 bg-purple-50 text-purple-700',
  completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  cancelled: 'border-red-200 bg-red-50 text-red-700',
};

export default function StaffOrdersPage({ initialTab = 'workshop' }: { initialTab?: 'workshop' | 'shop' }) {
  const [tab, setTab] = useState<'workshop' | 'shop'>(initialTab);
  const [workshopBookings, setWorkshopBookings] = useState<WorkshopBookingItem[]>([]);
  const [shopOrders, setShopOrders] = useState<ShopOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ShopOrderItem | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<WorkshopBookingItem | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [bookingRes, orderRes] = await Promise.all([staffAdminApi.workshopBookings(), staffAdminApi.shopOrders()]);
      setWorkshopBookings(bookingRes.data || []);
      setShopOrders(orderRes.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được dữ liệu');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const filteredWorkshop = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return workshopBookings;
    return workshopBookings.filter((item) => [item.booking_code, item.customer_name, item.customer_phone].some((f) => String(f || '').toLowerCase().includes(keyword)));
  }, [workshopBookings, search]);

  const filteredShop = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return shopOrders;
    return shopOrders.filter((item) => [item.order_code, item.buyer_name, item.recipient_name, item.recipient_address].some((f) => String(f || '').toLowerCase().includes(keyword)));
  }, [shopOrders, search]);

  async function updateBookingStatus(code: string, status: string) {
    try {
      await staffAdminApi.updateWorkshopBookingStatus(code, status);
      setMessage('Cập nhật booking thành công.');
      await loadData();
      if (selectedBooking?.booking_code === code) setSelectedBooking((prev) => (prev ? { ...prev, status } : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi cập nhật booking');
    }
  }

  async function updateOrderStatus(code: string, status: string) {
    try {
      await staffAdminApi.updateShopOrderStatus(code, status);
      setMessage('Cập nhật đơn hàng thành công.');
      await loadData();
      if (selectedOrder?.order_code === code) setSelectedOrder((prev) => (prev ? { ...prev, status } : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi cập nhật đơn hàng');
    }
  }

  async function deleteBooking(code: string) {
    if (!confirm('Xoá booking này?')) return;
    await staffAdminApi.deleteWorkshopBooking(code);
    await loadData();
    setMessage('Xoá booking thành công.');
  }

  async function deleteOrder(code: string) {
    if (!confirm('Xoá đơn hàng này?')) return;
    await staffAdminApi.deleteShopOrder(code);
    await loadData();
    setMessage('Xoá đơn hàng thành công.');
  }

  return (
    <StaffLayout title="Quản lý đơn của staff" subtitle="Xử lý booking workshop và đơn mua hàng">
      <div className="mb-6 flex gap-2">
        <button onClick={() => setTab('workshop')} className={`rounded-full px-4 py-2 text-sm ${tab === 'workshop' ? 'bg-[#111827] text-white' : 'border border-[#e8edf3] bg-white text-foreground'}`}>Booking workshop</button>
        <button onClick={() => setTab('shop')} className={`rounded-full px-4 py-2 text-sm ${tab === 'shop' ? 'bg-[#111827] text-white' : 'border border-[#e8edf3] bg-white text-foreground'}`}>Đơn mua hàng</button>
        <div className="ml-auto flex gap-3">
          <div className="flex items-center gap-2 rounded-full border border-[#e8edf3] bg-white px-4 py-2">
            <Search className="h-4 w-4 text-[#8f9bb3]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm outline-none" placeholder="Tìm kiếm..." />
          </div>
          <button onClick={loadData} className="rounded-full border border-[#e8edf3] bg-white p-3"><RefreshCw className="h-4 w-4" /></button>
        </div>
      </div>

      {message ? <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div> : null}
      {error ? <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      {loading ? <div className="rounded-2xl border border-[#e8edf3] bg-white p-6">Đang tải...</div> : null}

      {tab === 'workshop' ? (
        <div className="rounded-[2rem] border border-[#e8edf3] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
          <h2 className="mb-5 font-serif text-3xl font-light text-foreground">Booking workshop</h2>
          <div className="overflow-hidden rounded-[1.5rem] border border-[#e8edf3]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f6f7fb] text-[#8f9bb3]"><tr><th className="px-4 py-3">Mã booking</th><th className="px-4 py-3">Khách</th><th className="px-4 py-3">Workshop</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3 text-right">Thao tác</th></tr></thead>
              <tbody>
                {filteredWorkshop.map((item) => (
                  <tr key={item.id} className="border-t border-[#eef2f7]">
                    <td className="px-4 py-4 font-medium">{item.booking_code}</td>
                    <td className="px-4 py-4 text-[#6f7b8b]">{item.customer_name}</td>
                    <td className="px-4 py-4 text-[#6f7b8b]">{item.workshop?.title || '---'}</td>
                    <td className="px-4 py-4"><span className={`rounded-full border px-3 py-1 text-xs ${statusClasses[item.status] || statusClasses.pending}`}>{item.status}</span></td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setSelectedBooking(item)} className="rounded-full border border-[#e8edf3] p-2"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => deleteBooking(item.booking_code)} className="rounded-full border border-red-200 bg-red-50 p-2 text-red-700"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-[2rem] border border-[#e8edf3] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
          <h2 className="mb-5 font-serif text-3xl font-light text-foreground">Đơn mua hàng</h2>
          <div className="overflow-hidden rounded-[1.5rem] border border-[#e8edf3]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f6f7fb] text-[#8f9bb3]"><tr><th className="px-4 py-3">Mã đơn</th><th className="px-4 py-3">Người mua</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3 text-right">Thao tác</th></tr></thead>
              <tbody>
                {filteredShop.map((item) => (
                  <tr key={item.id} className="border-t border-[#eef2f7]">
                    <td className="px-4 py-4 font-medium">{item.order_code}</td>
                    <td className="px-4 py-4 text-[#6f7b8b]">{item.buyer_name}</td>
                    <td className="px-4 py-4"><span className={`rounded-full border px-3 py-1 text-xs ${statusClasses[item.status] || statusClasses.pending}`}>{item.status}</span></td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setSelectedOrder(item)} className="rounded-full border border-[#e8edf3] p-2"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => deleteOrder(item.order_code)} className="rounded-full border border-red-200 bg-red-50 p-2 text-red-700"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedBooking ? (
        <Modal title={selectedBooking.booking_code} onClose={() => setSelectedBooking(null)}>
          <p>Khách: {selectedBooking.customer_name}</p>
          <p>Workshop: {selectedBooking.workshop?.title || '---'}</p>
          <p>Số chỗ: {selectedBooking.seats_booked}</p>
          <p>Tổng tiền: {selectedBooking.total_price}</p>
          <div className="mt-4 flex gap-2">
            {bookingStatuses.map((s) => (
              <button key={s} onClick={() => updateBookingStatus(selectedBooking.booking_code, s)} className="rounded-full border px-3 py-2 text-sm">{s}</button>
            ))}
          </div>
        </Modal>
      ) : null}

      {selectedOrder ? (
        <Modal title={selectedOrder.order_code} onClose={() => setSelectedOrder(null)}>
          <p>Người mua: {selectedOrder.buyer_name}</p>
          <p>Người nhận: {selectedOrder.recipient_name}</p>
          <p>Địa chỉ: {selectedOrder.recipient_address}</p>
          <p>Tổng tiền: {selectedOrder.total_price}</p>
          <div className="mt-4 flex gap-2">
            {orderStatuses.map((s) => (
              <button key={s} onClick={() => updateOrderStatus(selectedOrder.order_code, s)} className="rounded-full border px-3 py-2 text-sm">{s}</button>
            ))}
          </div>
        </Modal>
      ) : null}
    </StaffLayout>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4 py-8" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-[2rem] bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-3xl">{title}</h3>
          <button onClick={onClose}><X /></button>
        </div>
        <div className="space-y-2 text-sm text-[#6f7b8b]">{children}</div>
      </div>
    </div>
  );
}
