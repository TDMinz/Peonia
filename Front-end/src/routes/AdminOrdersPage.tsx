import { Eye, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminPagination from '../components/AdminPagination';
import { adminOrdersApi, type AdminOrderItem } from '../services/adminOrders';

const PAGE_SIZE = 8;
const statusOptions = ['pending', 'confirmed', 'processing', 'completed', 'cancelled'] as const;
const statusStyles: Record<string, string> = {
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  confirmed: 'border-blue-200 bg-blue-50 text-blue-700',
  processing: 'border-purple-200 bg-purple-50 text-purple-700',
  completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  cancelled: 'border-red-200 bg-red-50 text-red-700',
};

export default function AdminOrdersPage() {
  const [items, setItems] = useState<AdminOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<AdminOrderItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('pending');
  const [page, setPage] = useState(1);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const data = await adminOrdersApi.list();
      setItems(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được đơn hàng');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((item) => [item.order_code, item.buyer_name, item.recipient_name, item.recipient_address].some((field) => String(field || '').toLowerCase().includes(keyword)));
  }, [items, search]);

  const paged = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);
  useEffect(() => { setPage(1); }, [search]);

  function openDetail(item: AdminOrderItem) {
    setSelected(item);
    setStatus(item.status || 'pending');
    setMessage('');
    setError('');
  }

  async function handleSaveStatus() {
    if (!selected) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const data = await adminOrdersApi.updateStatus(selected.order_code, { status });
      const updated = data.data || { ...selected, status };
      setSelected(updated);
      setItems((prev) => prev.map((item) => (item.order_code === updated.order_code ? { ...item, ...updated } : item)));
      setMessage('Cập nhật trạng thái đơn hàng thành công.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cập nhật trạng thái thất bại');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(code: string) {
    if (!confirm('Bạn chắc chắn muốn xoá đơn hàng này?')) return;
    try {
      await adminOrdersApi.remove(code);
      setMessage('Xoá đơn hàng thành công.');
      await loadData();
      if (selected?.order_code === code) setSelected(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xoá đơn hàng thất bại');
    }
  }

  return (
    <AdminLayout title="Quản lý đơn hàng" subtitle="Xem chi tiết và cập nhật trạng thái đơn hàng">
      <div className="rounded-[2rem] border border-[#e8edf3] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#8f9bb3]">Đơn hàng</p>
            <h2 className="mt-2 font-serif text-3xl font-light text-foreground">Tất cả đơn hàng</h2>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 rounded-full border border-[#e8edf3] bg-[#f6f7fb] px-4 py-2">
              <Search className="h-4 w-4 text-[#8f9bb3]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm outline-none" placeholder="Tìm mã đơn, tên..." />
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
          <>
            <div className="overflow-hidden rounded-[1.5rem] border border-[#e8edf3]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f6f7fb] text-[#8f9bb3]"><tr><th className="px-4 py-3">Mã đơn</th><th className="px-4 py-3">Người mua</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3 text-right">Thao tác</th></tr></thead>
                <tbody>
                  {paged.map((item) => (
                    <tr key={item.id} className="border-t border-[#eef2f7]">
                      <td className="px-4 py-4 font-medium text-foreground">{item.order_code}</td>
                      <td className="px-4 py-4 text-[#6f7b8b]">{item.buyer_name}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full border px-3 py-1 text-xs ${statusStyles[item.status] || 'border-slate-200 bg-slate-50 text-slate-700'}`}>{item.status}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openDetail(item)} className="rounded-full border border-[#e8edf3] p-2 text-foreground"><Eye className="h-4 w-4" /></button>
                          <button onClick={() => handleDelete(item.order_code)} className="rounded-full border border-red-200 bg-red-50 p-2 text-red-700"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AdminPagination page={page} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </>
        )}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 px-4 py-8 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="w-full max-w-4xl overflow-hidden rounded-[2rem] border border-[#e8edf3] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.2)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#eef2f7] px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#8f9bb3]">Chi tiết đơn hàng</p>
                <h3 className="mt-2 font-serif text-3xl font-light text-foreground">{selected.order_code}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-full p-2 text-[#8f9bb3] transition hover:bg-[#f6f7fb] hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-6 p-6 lg:grid-cols-[1fr_0.9fr]">
              <div className="space-y-4">
                <InfoCard title="Người mua" content={`${selected.buyer_name} | ${selected.buyer_phone || ''}`} />
                <InfoCard title="Người nhận" content={`${selected.recipient_name} | ${selected.recipient_phone || ''}`} />
                <InfoCard title="Địa chỉ giao" content={selected.recipient_address} />
                <InfoCard title="Lịch giao" content={`${selected.delivery_date || ''} - ${selected.delivery_time_slot || ''}`} />
                <InfoCard title="Ghi chú" content={selected.card_message || 'Không có'} />
              </div>
              <div className="space-y-4 rounded-[1.5rem] bg-[#f6f7fb] p-5">
                <label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Trạng thái đơn</span><select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-2xl border border-[#e8edf3] bg-white px-4 py-3 text-sm outline-none">{statusOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}</select></label>
                <div className="rounded-2xl border border-[#e8edf3] bg-white p-4 text-sm text-[#6f7b8b]"><div className="flex justify-between"><span>Tổng tiền</span><span className="font-medium text-foreground">{selected.total_price}</span></div><div className="mt-2 flex justify-between"><span>Đã cọc</span><span className="font-medium text-foreground">{selected.deposit_amount}</span></div><div className="mt-2 flex justify-between"><span>Đã trả</span><span className="font-medium text-foreground">{selected.paid_amount}</span></div><div className="mt-2 flex justify-between"><span>Còn lại</span><span className="font-medium text-foreground">{selected.remaining_amount}</span></div></div>
                <button disabled={saving} onClick={handleSaveStatus} className="w-full rounded-full bg-emerald-950 px-5 py-4 text-sm font-medium text-white transition hover:bg-emerald-900 disabled:opacity-60">{saving ? 'Đang cập nhật...' : 'Cập nhật trạng thái đơn'}</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}

function InfoCard({ title, content }: { title: string; content: string }) {
  return <div className="rounded-[1.25rem] border border-[#e8edf3] bg-[#f6f7fb] p-4"><p className="text-xs uppercase tracking-[0.28em] text-[#8f9bb3]">{title}</p><p className="mt-2 text-sm leading-7 text-foreground">{content}</p></div>;
}
