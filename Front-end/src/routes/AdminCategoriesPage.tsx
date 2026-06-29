import { Edit3, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminPagination from '../components/AdminPagination';
import { adminCategoriesApi, type AdminCategoryItem } from '../services/adminCategories';

const PAGE_SIZE = 8;
const emptyForm = {
  name: '',
  slug: '',
  description: '',
  icon: '',
  order: 0,
  is_active: true,
};

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<AdminCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState(1);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const data = await adminCategoriesApi.list();
      setItems(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được danh mục');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    if (!message) return;
  
    const timer = setTimeout(() => {
      setMessage('');
    }, 5000);
  
    return () => clearTimeout(timer);
  }, [message]);
  
  useEffect(() => {
    if (!error) return;
  
    const timer = setTimeout(() => {
      setError('');
    }, 5000);
  
    return () => clearTimeout(timer);
  }, [error]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((item) => [item.name, item.slug, item.description, item.icon].some((field) => String(field || '').toLowerCase().includes(keyword)));
  }, [items, search]);

  const paged = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function startEdit(item: AdminCategoryItem) {
    setEditingId(item.id);
    setForm({
      name: item.name || '',
      slug: item.slug || '',
      description: item.description || '',
      icon: item.icon || '',
      order: item.order || 0,
      is_active: item.is_active ?? true,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      if (editingId) {
        await adminCategoriesApi.update(editingId, form);
        setMessage('Cập nhật danh mục thành công.');
      } else {
        await adminCategoriesApi.create(form);
        setMessage('Tạo danh mục thành công.');
      }
      await loadData();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu danh mục thất bại');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bạn chắc chắn muốn xoá danh mục này?')) return;
    try {
      await adminCategoriesApi.remove(id);
      setMessage('Xoá danh mục thành công.');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xoá danh mục thất bại');
    }
  }

  return (
    <AdminLayout title="Quản lý danh mục" subtitle="Thêm, sửa, xoá danh mục và sắp xếp hiển thị">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-[#e6ddd3] bg-white p-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#8f877d]">Danh mục</p>
              <h2 className="mt-2 font-serif text-3xl font-light text-foreground">{editingId ? 'Chỉnh sửa' : 'Tạo mới'}</h2>
            </div>
            <button type="button" onClick={resetForm} className="rounded-full border border-[#e6ddd3] px-4 py-2 text-sm text-foreground">
              Làm mới
            </button>
          </div>

          {message ? <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div> : null}
          {error ? <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          <div className="space-y-4">
            <Field label="Tên danh mục" value={form.name} onChange={(name) => setForm((p) => ({ ...p, name }))} />
            <Field label="Slug" value={form.slug} onChange={(slug) => setForm((p) => ({ ...p, slug }))} />
            <Field label="Mô tả" value={form.description || ''} onChange={(description) => setForm((p) => ({ ...p, description }))} textarea />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Icon" value={form.icon || ''} onChange={(icon) => setForm((p) => ({ ...p, icon }))} />
              <Field label="Thứ tự" value={String(form.order)} onChange={(order) => setForm((p) => ({ ...p, order: Number(order) || 0 }))} />
            </div>
            <label className="flex items-center gap-3 rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3 text-sm text-foreground">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} />
              Đang hoạt động
            </label>
          </div>

          <button disabled={saving} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-950 px-5 py-4 text-sm font-medium text-white transition hover:bg-emerald-900 disabled:opacity-60">
            {editingId ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {saving ? 'Đang lưu...' : editingId ? 'Cập nhật danh mục' : 'Tạo danh mục'}
          </button>
        </form>

        <div className="rounded-[2rem] border border-[#e6ddd3] bg-white p-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)]">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#8f877d]">Danh sách</p>
              <h2 className="mt-2 font-serif text-3xl font-light text-foreground">Tất cả danh mục</h2>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 rounded-full border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-2">
                <Search className="h-4 w-4 text-[#8f877d]" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm outline-none" placeholder="Tìm kiếm..." />
              </div>
              <button type="button" onClick={loadData} className="rounded-full border border-[#e6ddd3] bg-[#fbf7f1] p-3 text-foreground">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] p-6 text-sm text-[#6f665d]">Đang tải...</div>
          ) : (
            <>
              <div className="overflow-hidden rounded-[1.5rem] border border-[#e6ddd3]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#fbf7f1] text-[#8f877d]">
                    <tr>
                      <th className="px-4 py-3">Tên</th>
                      <th className="px-4 py-3">Slug</th>
                      <th className="px-4 py-3">Trạng thái</th>
                      <th className="px-4 py-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((item) => (
                      <tr key={item.id} className="border-t border-[#eee4d8] bg-white">
                        <td className="px-4 py-4 font-medium text-foreground">{item.name}</td>
                        <td className="px-4 py-4 text-[#6f665d]">{item.slug}</td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs ${item.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                            {item.is_active ? 'Đang hoạt động' : 'Đã ẩn'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => startEdit(item)} className="rounded-full border border-[#e6ddd3] p-2 text-foreground">
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="rounded-full border border-red-200 bg-red-50 p-2 text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </button>
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
      </div>
    </AdminLayout>
  );
}

function Field({ label, value, onChange, textarea = false }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} className="w-full rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3 text-sm outline-none" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3 text-sm outline-none" />
      )}
    </label>
  );
}
