import { Edit3, RefreshCw, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminPagination from '../components/AdminPagination';
import { adminUsersApi, type AdminUserItem } from '../services/adminUsers';

const roleOptions = ['super_admin', 'staff', 'customer'] as const;

const roleStyles: Record<string, string> = {
  super_admin: 'border-violet-200 bg-violet-50 text-violet-700',
  staff: 'border-blue-200 bg-blue-50 text-blue-700',
  customer: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

export default function AdminUsersPage() {
  const [items, setItems] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<AdminUserItem | null>(null);
  const [form, setForm] = useState({ full_name: '', role: 'customer' as AdminUserItem['role'], is_active: true });
  const [page, setPage] = useState(1);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const data = await adminUsersApi.list();
      setItems(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được tài khoản');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((item) => [item.username, item.full_name, item.role].some((field) => String(field || '').toLowerCase().includes(keyword)));
  }, [items, search]);

  const paged = useMemo(() => filtered.slice((page - 1) * 8, page * 8), [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  function openEdit(item: AdminUserItem) {
    setEditing(item);
    setForm({ full_name: item.full_name, role: item.role, is_active: item.is_active });
    setMessage('');
    setError('');
  }

  async function handleSave() {
    if (!editing) return;
    try {
      const data = await adminUsersApi.update(editing.id, form);
      setItems((prev) => prev.map((u) => (u.id === editing.id ? { ...u, ...(data.user || {}) } : u)));
      setMessage('Cập nhật tài khoản thành công.');
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cập nhật tài khoản thất bại');
    }
  }

  return (
    <AdminLayout title="Quản lý tài khoản" subtitle="Xem, sửa thông tin, role và trạng thái tài khoản">
      <div className="rounded-[2rem] border border-[#e8edf3] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#8f9bb3]">Tài khoản</p>
            <h2 className="mt-2 font-serif text-3xl font-light text-foreground">Danh sách người dùng</h2>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 rounded-full border border-[#e8edf3] bg-[#f6f7fb] px-4 py-2">
              <Search className="h-4 w-4 text-[#8f9bb3]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm outline-none" placeholder="Tìm username, tên..." />
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
              <thead className="bg-[#f6f7fb] text-[#8f9bb3]"><tr><th className="px-4 py-3">Username</th><th className="px-4 py-3">Họ tên</th><th className="px-4 py-3">Vai trò</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3 text-right">Thao tác</th></tr></thead>
              <tbody>
                {paged.map((item) => (
                  <tr key={item.id} className="border-t border-[#eef2f7]">
                    <td className="px-4 py-4 font-medium text-foreground">{item.username}</td>
                    <td className="px-4 py-4 text-[#6f7b8b]">{item.full_name}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full border px-3 py-1 text-xs ${roleStyles[item.role] || 'border-slate-200 bg-slate-50 text-slate-700'}`}>{item.role}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full border px-3 py-1 text-xs ${item.is_active ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                        {item.is_active ? 'Đang hoạt động' : 'Đã khoá'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button onClick={() => openEdit(item)} className="inline-flex items-center gap-2 rounded-full border border-[#e8edf3] px-4 py-2 text-sm text-foreground">
                        <Edit3 className="h-4 w-4" />
                        Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminPagination page={page} totalItems={filtered.length} pageSize={8} onPageChange={setPage} />
          </>
        )}
      </div>

      {editing ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4 py-8 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="w-full max-w-xl rounded-[2rem] border border-[#e8edf3] bg-white p-6 shadow-[0_30px_100px_rgba(0,0,0,0.2)]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#8f9bb3]">Chỉnh sửa tài khoản</p>
                <h3 className="mt-2 font-serif text-3xl font-light text-foreground">{editing.username}</h3>
              </div>
              <button onClick={() => setEditing(null)} className="rounded-full p-2 text-[#8f9bb3] transition hover:bg-[#f6f7fb] hover:text-foreground">×</button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">Họ tên</span>
                <input value={form.full_name} onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))} className="w-full rounded-2xl border border-[#e8edf3] bg-[#f6f7fb] px-4 py-3 text-sm outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">Vai trò</span>
                <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as AdminUserItem['role'] }))} className="w-full rounded-2xl border border-[#e8edf3] bg-[#f6f7fb] px-4 py-3 text-sm outline-none">
                  {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-[#e8edf3] bg-[#f6f7fb] px-4 py-3 text-sm text-foreground">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} />
                Đang hoạt động
              </label>
            </div>

            <button onClick={handleSave} className="mt-6 w-full rounded-full bg-emerald-950 px-5 py-4 text-sm font-medium text-white transition hover:bg-emerald-900">
              Lưu thay đổi
            </button>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}
