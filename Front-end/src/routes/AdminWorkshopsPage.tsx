import { Edit3, Plus, RefreshCw, Search, Trash2, UploadCloud } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { adminWorkshopsApi, type AdminWorkshopItem } from '../services/adminWorkshops';
import AdminPagination from '../components/AdminPagination';

const emptyForm = {
  title: '',
  description: '',
  event_date: '',
  max_slots: 0,
  available_slots: 0,
  price: 0,
};
const PAGE_SIZE = 8;
export default function AdminWorkshopsPage() {
  const [items, setItems] = useState<AdminWorkshopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [page, setPage] = useState(1);
  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const data = await adminWorkshopsApi.list();
      setItems(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được workshop');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);
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
    return items.filter((item) => [item.title, item.description].some((field) => String(field || '').toLowerCase().includes(keyword)));
  }, [items, search]);
  const paged = useMemo(
    () =>
      filtered.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
      ),
    [filtered, page]
  );
  
  useEffect(() => {
    setPage(1);
  }, [search]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setPreview('');
  }

  function startEdit(item: AdminWorkshopItem) {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      description: item.description || '',
      event_date: item.event_date ? new Date(item.event_date).toISOString().slice(0, 16) : '',
      max_slots: item.max_slots || 0,
      available_slots: item.available_slots || 0,
      price: item.price || 0,
    });
    setPreview(item.image_url || '');
    setImageFile(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, String(value)));
      if (imageFile) formData.append('image', imageFile);

      if (editingId) {
        await adminWorkshopsApi.update(editingId, formData);
        setMessage('Cập nhật workshop thành công.');
      } else {
        await adminWorkshopsApi.create(formData);
        setMessage('Tạo workshop thành công.');
      }

      await loadData();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu workshop thất bại');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bạn chắc chắn muốn xoá workshop này?')) return;
    try {
      await adminWorkshopsApi.remove(id);
      setMessage('Xoá workshop thành công.');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xoá workshop thất bại');
    }
  }

  return (
    <AdminLayout title="Quản lý workshop" subtitle="Tạo, sửa, xoá workshop và upload ảnh">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-[#e8edf3] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#8f9bb3]">Workshop</p>
              <h2 className="mt-2 font-serif text-3xl font-light text-foreground">{editingId ? 'Chỉnh sửa' : 'Tạo mới'}</h2>
            </div>
            <button type="button" onClick={resetForm} className="rounded-full border border-[#e8edf3] px-4 py-2 text-sm text-foreground">Làm mới</button>
          </div>

          {message ? <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div> : null}
          {error ? <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          <div className="space-y-4">
            <Field label="Tiêu đề" value={form.title} onChange={(title) => setForm((p) => ({ ...p, title }))} />
            <Field label="Mô tả" value={form.description || ''} onChange={(description) => setForm((p) => ({ ...p, description }))} textarea />
            <Field label="Ngày giờ tổ chức" value={form.event_date} onChange={(event_date) => setForm((p) => ({ ...p, event_date }))} type="datetime-local" />
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Số chỗ tối đa" value={String(form.max_slots)} onChange={(max_slots) => setForm((p) => ({ ...p, max_slots: Number(max_slots) || 0, available_slots: p.available_slots || Number(max_slots) || 0 }))} type="number" />
              <Field label="Số chỗ còn lại" value={String(form.available_slots)} onChange={(available_slots) => setForm((p) => ({ ...p, available_slots: Number(available_slots) || 0 }))} type="number" />
              <Field label="Giá" value={String(form.price)} onChange={(price) => setForm((p) => ({ ...p, price: Number(price) || 0 }))} type="number" />
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Ảnh workshop</span>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d8e1ea] bg-[#f6f7fb] px-5 py-8 text-center transition hover:border-emerald-700">
                <UploadCloud className="h-8 w-8 text-[#8f9bb3]" />
                <span className="mt-2 text-sm font-medium text-foreground">Chọn ảnh từ máy</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0] || null; setImageFile(file); setPreview(file ? URL.createObjectURL(file) : preview); }} />
              </label>
              {preview ? <img src={preview} alt="Preview" className="mt-3 h-48 w-full rounded-2xl object-cover" /> : null}
            </label>
          </div>

          <button disabled={saving} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-950 px-5 py-4 text-sm font-medium text-white transition hover:bg-emerald-900 disabled:opacity-60">
            {editingId ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {saving ? 'Đang lưu...' : editingId ? 'Cập nhật workshop' : 'Tạo workshop'}
          </button>
        </form>

        <div className="rounded-[2rem] border border-[#e8edf3] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#8f9bb3]">Danh sách</p>
              <h2 className="mt-2 font-serif text-3xl font-light text-foreground">Tất cả workshop</h2>
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

          {loading ? <div className="rounded-2xl border border-[#e8edf3] bg-[#f6f7fb] p-6 text-sm text-[#6f7b8b]">Đang tải...</div> : (
            <div className="overflow-hidden rounded-[1.5rem] border border-[#e8edf3]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f6f7fb] text-[#8f9bb3]"><tr><th className="px-4 py-3">Tiêu đề</th><th className="px-4 py-3">Ngày</th><th className="px-4 py-3">Chỗ còn lại</th><th className="px-4 py-3 text-right">Thao tác</th></tr></thead>
                <tbody>
                  {paged.map((item) => (
                    <tr key={item.id} className="border-t border-[#eef2f7]">
                      <td className="px-4 py-4 font-medium text-foreground">{item.title}</td>
                      <td className="px-4 py-4 text-[#6f7b8b]">{new Date(item.event_date).toLocaleString('vi-VN')}</td>
                      <td className="px-4 py-4 text-[#6f7b8b]">{item.available_slots} / {item.max_slots}</td>
                      <td className="px-4 py-4"><div className="flex justify-end gap-2"><button onClick={() => startEdit(item)} className="rounded-full border border-[#e8edf3] p-2 text-foreground"><Edit3 className="h-4 w-4" /></button><button onClick={() => handleDelete(item.id)} className="rounded-full border border-red-200 bg-red-50 p-2 text-red-700"><Trash2 className="h-4 w-4" /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <AdminPagination
      page={page}
      totalItems={filtered.length}
      pageSize={PAGE_SIZE}
      onPageChange={setPage}
    />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function Field({ label, value, onChange, type = 'text', textarea = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      {textarea ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} className="w-full rounded-2xl border border-[#e8edf3] bg-[#f6f7fb] px-4 py-3 text-sm outline-none" /> : <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-[#e8edf3] bg-[#f6f7fb] px-4 py-3 text-sm outline-none" />}
    </label>
  );
}
