import { CheckCircle2, Eye, RefreshCw, Search, ShieldAlert, Trash2, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import StaffLayout from '../components/StaffLayout';
import { staffAdminApi, type WorkshopBookingItem } from '../services/adminStaff';

export default function StaffBookingsPage() {
  const [items, setItems] = useState<WorkshopBookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const data = await staffAdminApi.workshopBookings();
      setItems(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được booking');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((item) => [item.booking_code, item.customer_name, item.customer_phone, item.status, item.payment_status, item.workshop?.title].some((field) => String(field || '').toLowerCase().includes(keyword)));
  }, [items, search]);

  async function handleAction(code: string, payload: { status?: string; payment_status?: string }) {
    try {
      await staffAdminApi.updateWorkshopBookingStatus(code, payload.status || 'pending');
      setMessage('Cập nhật booking thành công.');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cập nhật booking thất bại');
    }
  }

  async function handleDelete(code: string) {
    if (!confirm('Bạn chắc chắn muốn xoá booking này?')) return;
    try {
      await staffAdminApi.deleteWorkshopBooking(code);
      setMessage('Xoá booking thành công.');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xoá booking thất bại');
    }
  }

  return (
    <StaffLayout title="Booking workshop" subtitle="Duyệt booking, cập nhật trạng thái và xoá booking">
      <div className="rounded-[2rem] border border-[#e8edf3] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#8f9bb3]">Booking</p>
            <h2 className="mt-2 font-serif text-3xl font-light text-foreground">Tất cả booking</h2>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 rounded-full border border-[#e8edf3] bg-[#f6f7fb] px-4 py-2">
              <Search className="h-4 w-4 text-[#8f9bb3]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm outline-none" placeholder="Tìm kiếm..." />
            </div>
            <button type="button" onClick={loadData} className="rounded-full border border-[#e8edf3] bg-[#f6f7fb] p-3 text-foreground">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {message ? <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div> : null}
        {error ? <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        {loading ? (
          <div className="rounded-2xl border border-[#e8edf3] bg-[#f6f7fb] p-6 text-sm text-[#6f7b8b]">Đang tải...</div>
        ) : (
          <div className="overflow-hidden rounded-[1.5rem] border border-[#e8edf3]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f6f7fb] text-[#8f9bb3]">
                <tr>
                  <th className="px-4 py-3">Mã</th>
                  <th className="px-4 py-3">Khách hàng</th>
                  <th className="px-4 py-3">Workshop</th>
                  <th className="px-4 py-3">Thanh toán</th>
                  <th className="px-4 py-3">Bill</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-t border-[#eef2f7] align-top">
                    <td className="px-4 py-4 font-medium text-foreground">{item.booking_code}</td>
                    <td className="px-4 py-4 text-[#6f7b8b]">
                      <div>{item.customer_name}</div>
                      <div className="text-xs text-[#9aa4b2]">{item.customer_phone}</div>
                    </td>
                    <td className="px-4 py-4 text-[#6f7b8b]">
                      <div className="font-medium text-foreground">{item.workshop?.title || '—'}</div>
                      <div className="text-xs text-[#9aa4b2]">{item.workshop?.event_date ? new Date(item.workshop.event_date).toLocaleString('vi-VN') : ''}</div>
                    </td>
                    <td className="px-4 py-4 text-[#6f7b8b]">
                      <div className={`inline-flex rounded-full px-3 py-1 text-xs ${item.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700' : item.payment_status === 'partial_paid' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                        {item.payment_status}
                      </div>
                      <div className="mt-2 text-xs text-[#9aa4b2]">Trạng thái: {item.status}</div>
                    </td>
                    <td className="px-4 py-4 text-[#6f7b8b]">
                      <div className={`inline-flex rounded-full px-3 py-1 text-xs ${item.bill_status === 'approved' ? 'bg-emerald-50 text-emerald-700' : item.bill_status === 'rejected' ? 'bg-red-50 text-red-700' : item.bill_status === 'uploaded' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {item.bill_status || 'none'}
                      </div>
                      {item.bill_url ? (
                        <a href={item.bill_url} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-1 text-xs text-emerald-700 hover:underline">
                          <Eye className="h-3.5 w-3.5" /> Xem bill
                        </a>
                      ) : null}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button onClick={() => handleAction(item.booking_code, { status: 'confirmed' })} className="rounded-full border border-emerald-200 bg-emerald-50 p-2 text-emerald-700" title="Xác nhận">
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleAction(item.booking_code, { status: 'cancelled' })} className="rounded-full border border-amber-200 bg-amber-50 p-2 text-amber-700" title="Huỷ">
                          <ShieldAlert className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(item.booking_code)} className="rounded-full border border-red-200 bg-red-50 p-2 text-red-700" title="Xoá">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}
