import { CheckCircle2, Eye, RefreshCw, Search, ShieldAlert, Trash2, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import StaffLayout from '../components/StaffLayout';
import { adminBookingsApi, type AdminBookingItem } from '../services/adminBookings';

export default function StaffWorkshopBookingsPage() {
  const [items, setItems] = useState<AdminBookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<AdminBookingItem | null>(null);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const data = await adminBookingsApi.list();
      setItems(data.bookings || []);
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
      await adminBookingsApi.updateStatus(code, payload);
      setMessage(payload.status === 'confirmed' ? 'Đã xác nhận booking.' : 'Đã từ chối booking.');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cập nhật booking thất bại');
    }
  }

  async function handleDelete(code: string) {
    if (!confirm('Bạn chắc chắn muốn xoá booking này?')) return;
    try {
      await adminBookingsApi.remove(code);
      setMessage('Xoá booking thành công.');
      await loadData();
      if (selected?.booking_code === code) setSelected(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xoá booking thất bại');
    }
  }

  return (
    <StaffLayout title="Quản lý booking / bill" subtitle="Duyệt booking, duyệt bill, cập nhật trạng thái và xoá booking">
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
                  <th className="px-4 py-3">Workshop</th>
                  <th className="px-4 py-3">Khách hàng</th>
                  <th className="px-4 py-3">SĐT</th>
                  <th className="px-4 py-3">Bill</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-t border-[#eef2f7] align-top">
                    <td className="px-4 py-4 text-[#6f7b8b]">
                      <div className="font-medium text-foreground">{item.workshop?.title || '—'}</div>
                      <div className="text-xs text-[#9aa4b2]">{item.workshop?.event_date ? new Date(item.workshop.event_date).toLocaleString('vi-VN') : ''}</div>
                    </td>
                    <td className="px-4 py-4 text-[#6f7b8b]">
                      <div>{item.customer_name}</div>
                    </td>
                    <td className="px-4 py-4 text-[#6f7b8b]">
                      <div className="font-medium text-foreground">{item.customer_phone}</div>
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
                    <td className="px-4 py-4 text-[#6f7b8b]">
                      <div className={`inline-flex rounded-full px-3 py-1 text-xs ${item.bill_status === 'approved' ? 'bg-emerald-50 text-emerald-700' : item.bill_status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                        {item.bill_status === 'approved' ? 'confirmed' : item.bill_status === 'rejected' ? 'cancelled' : 'pending'}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button onClick={() => handleAction(item.booking_code, { status: 'confirmed' })} className="rounded-full border border-emerald-200 bg-emerald-50 p-2 text-emerald-700" title="Xác nhận">
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleAction(item.booking_code, { status: 'cancelled' })} className="rounded-full border border-amber-200 bg-amber-50 p-2 text-amber-700" title="Từ chối">
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

      {selected ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 px-4 py-8 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="w-full max-w-4xl overflow-hidden rounded-[2rem] border border-[#e8edf3] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.2)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#eef2f7] px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#8f9bb3]">Chi tiết booking</p>
                <h3 className="mt-2 font-serif text-3xl font-light text-foreground">{selected.booking_code}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-full p-2 text-[#8f9bb3] transition hover:bg-[#f6f7fb] hover:text-foreground">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-[1fr_0.9fr]">
              <div className="space-y-4">
                <InfoCard title="Khách hàng" content={`${selected.customer_name} | ${selected.customer_phone}`} />
                <InfoCard title="Workshop" content={`${selected.workshop?.title || '—'} | ${selected.workshop?.event_date ? new Date(selected.workshop.event_date).toLocaleString('vi-VN') : ''}`} />
                <InfoCard title="Số chỗ" content={String(selected.seats_booked)} />
                <InfoCard title="Ghi chú" content={selected.bill_url ? 'Có bill đã upload' : 'Chưa có bill'} />
              </div>

              <div className="space-y-4 rounded-[1.5rem] bg-[#f6f7fb] p-5">
                <div className="rounded-2xl border border-[#e8edf3] bg-white p-4 text-sm text-[#6f7b8b]">
                  <div className="flex justify-between"><span>Tổng tiền</span><span className="font-medium text-foreground">{selected.total_price}</span></div>
                  <div className="mt-2 flex justify-between"><span>Đã cọc</span><span className="font-medium text-foreground">{selected.deposit_amount}</span></div>
                  <div className="mt-2 flex justify-between"><span>Đã trả</span><span className="font-medium text-foreground">{selected.paid_amount}</span></div>
                  <div className="mt-2 flex justify-between"><span>Còn lại</span><span className="font-medium text-foreground">{selected.remaining_amount}</span></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleAction(selected.booking_code, { status: 'confirmed' })} className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">Xác nhận</button>
                  <button onClick={() => handleAction(selected.booking_code, { status: 'cancelled' })} className="rounded-full border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">Huỷ</button>

                </div>
                <button onClick={() => handleDelete(selected.booking_code)} className="w-full rounded-full border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">Xoá booking</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </StaffLayout>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-[#e8edf3] bg-[#f6f7fb] px-4 py-3 text-sm outline-none" />
    </label>
  );
}

function InfoCard({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-[1.25rem] border border-[#e8edf3] bg-[#f6f7fb] p-4">
      <p className="text-xs uppercase tracking-[0.28em] text-[#8f9bb3]">{title}</p>
      <p className="mt-2 text-sm leading-7 text-foreground">{content}</p>
    </div>
  );
}
