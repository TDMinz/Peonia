import { CheckCircle2, Eye, RefreshCw, Search, ShieldAlert, Trash2, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminPagination from '../components/AdminPagination';
import { adminBookingsApi, type AdminBookingItem } from '../services/adminBookings';

const PAGE_SIZE = 8;

export default function AdminBookingsPage() {
  const [items, setItems] = useState<AdminBookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  async function loadData() { setLoading(true); setError(''); try { const data = await adminBookingsApi.list(); setItems(data.bookings || []); } catch (err) { setError(err instanceof Error ? err.message : 'Không tải được booking'); setItems([]); } finally { setLoading(false); } }
  useEffect(() => { loadData(); }, []);
  const filtered = useMemo(() => { const keyword = search.trim().toLowerCase(); return !keyword ? items : items.filter((item) => [item.booking_code, item.customer_name, item.customer_phone, item.status, item.payment_status, item.workshop?.title].some((field) => String(field || '').toLowerCase().includes(keyword))); }, [items, search]);
  const paged = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);
  useEffect(() => { setPage(1); }, [search]);

  async function handleAction(code: string, payload: { status?: string; payment_status?: string }) { try { await adminBookingsApi.updateStatus(code, payload); setMessage('Cập nhật booking thành công.'); await loadData(); } catch (err) { setError(err instanceof Error ? err.message : 'Cập nhật booking thất bại'); } }
  async function handleReviewBill(code: string, action: 'approve' | 'reject') { try { await adminBookingsApi.reviewBill(code, action); setMessage('Duyệt bill thành công.'); await loadData(); } catch (err) { setError(err instanceof Error ? err.message : 'Duyệt bill thất bại'); } }
  async function handleDelete(code: string) { if (!confirm('Bạn chắc chắn muốn xoá booking này?')) return; try { await adminBookingsApi.remove(code); setMessage('Xoá booking thành công.'); await loadData(); } catch (err) { setError(err instanceof Error ? err.message : 'Xoá booking thất bại'); } }

  return <AdminLayout title="Quản lý booking / bill" subtitle="Duyệt booking, duyệt bill, cập nhật trạng thái và xoá booking"><div className="rounded-[2rem] border border-[#e8edf3] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">...<div className="overflow-hidden rounded-[1.5rem] border border-[#e8edf3]"><table className="w-full text-left text-sm"><thead className="bg-[#f6f7fb] text-[#8f9bb3]"><tr><th className="px-4 py-3">Mã</th><th className="px-4 py-3">Khách hàng</th><th className="px-4 py-3">Workshop</th><th className="px-4 py-3">Thanh toán</th><th className="px-4 py-3">Bill</th><th className="px-4 py-3 text-right">Thao tác</th></tr></thead><tbody>{paged.map((item) => (<tr key={item.id} className="border-t border-[#eef2f7] align-top">...<td className="px-4 py-4"><div className="flex flex-wrap justify-end gap-2"><button onClick={() => handleAction(item.booking_code, { status: 'confirmed' })} className="rounded-full border border-emerald-200 bg-emerald-50 p-2 text-emerald-700" title="Xác nhận"><CheckCircle2 className="h-4 w-4" /></button><button onClick={() => handleAction(item.booking_code, { status: 'cancelled' })} className="rounded-full border border-amber-200 bg-amber-50 p-2 text-amber-700" title="Huỷ"><ShieldAlert className="h-4 w-4" /></button><button onClick={() => handleReviewBill(item.booking_code, 'approve')} className="rounded-full border border-blue-200 bg-blue-50 p-2 text-blue-700" title="Duyệt bill"><CheckCircle2 className="h-4 w-4" /></button><button onClick={() => handleReviewBill(item.booking_code, 'reject')} className="rounded-full border border-red-200 bg-red-50 p-2 text-red-700" title="Từ chối bill"><XCircle className="h-4 w-4" /></button><button onClick={() => handleDelete(item.booking_code)} className="rounded-full border border-red-200 bg-red-50 p-2 text-red-700" title="Xoá"><Trash2 className="h-4 w-4" /></button></div></td></tr>))}</tbody></table></div><AdminPagination page={page} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} /></div></AdminLayout>;
}
