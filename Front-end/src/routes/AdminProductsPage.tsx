import { Edit3, Plus, RefreshCw, Search, Trash2, UploadCloud, ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminPagination from '../components/AdminPagination';
import { adminProductsApi, type AdminCategoryOption, type AdminProductItem } from '../services/adminProducts';

const PAGE_SIZE = 7;
const emptyForm = {
  name: '',
  slug: '',
  description: '',
  price: '',
  sale_price: '',
  is_addon: false,
};

export default function AdminProductsPage() {
  const [items, setItems] = useState<AdminProductItem[]>([]);
  const [categories, setCategories] = useState<AdminCategoryOption[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [categoryFilter, setCategoryFilter] =
    useState('');
  const [showCategoryFilter, setShowCategoryFilter] =
    useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [activeImage, setActiveImage] = useState(0);
  const [previews, setPreviews] = useState<string[]>([
    '',
    '',
    '',
    '',
  ]);
  const [page, setPage] = useState(1);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [productData, categoryData] = await Promise.all([adminProductsApi.list(), adminProductsApi.categories()]);
      setItems(productData.data || []);
      setCategories(categoryData.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được sản phẩm');
      setItems([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (!message) return;
  
    const timer = setTimeout(() => {
      setMessage('');
    }, 4000);
  
    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => { loadData(); }, []);
  

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchSearch =
        !keyword ||
        [item.name, item.slug, item.description]
          .some((field) =>
            String(field || '')
              .toLowerCase()
              .includes(keyword)
          );

      const matchCategory =
        !categoryFilter ||
        item.category_ids?.includes(
          categoryFilter
        );

      return (
        matchSearch &&
        matchCategory
      );
    });
  }, [
    items,
    search,
    categoryFilter,
  ]);

  const paged = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);
  useEffect(() => {
    setPage(1);
  }, [
    search,
    categoryFilter,
  ]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);

    setImageFiles([
      null,
      null,
      null,
      null,
    ]);

    setPreviews([
      '',
      '',
      '',
      '',
    ]);

    setSelectedCategoryIds([]);
   
  }

  function startEdit(item: AdminProductItem) {
    setMessage('');
  setError('');
    setEditingId(item.id);
    setActiveImage(0);
    setForm({
      name: item.name || '',
      slug: item.slug || '',
      description: item.description || '',
      price: String(item.price || ''),
      sale_price: String(item.sale_price || ''),
      is_addon: Boolean(item.is_addon),
    });
    setSelectedCategoryIds(
      item.category_ids || []
    );
    setPreviews([
      item.images?.[0] || '',
      item.images?.[1] || '',
      item.images?.[2] || '',
      item.images?.[3] || '',
    ]);
  }

  function toggleCategory(id: string) {
    setSelectedCategoryIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, String(value)));
      formData.append(
        'categoryId',
        selectedCategoryIds[0] || ''
      );
      imageFiles.forEach((file, index) => {
        if (file) {
          formData.append(`image_${index}`, file);
        }
      });

      if (editingId) {
        await adminProductsApi.update(editingId, formData);
        setMessage('Cập nhật sản phẩm thành công.');
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      } else {
        await adminProductsApi.create(formData);
        setMessage('Tạo sản phẩm thành công.');
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }

      await loadData();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu sản phẩm thất bại');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bạn chắc chắn muốn xoá sản phẩm này?')) return;
    try {
      await adminProductsApi.remove(id);
      setMessage('Xoá sản phẩm thành công.');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xoá sản phẩm thất bại');
    }
  }

  return (
    <AdminLayout title="Quản lý sản phẩm" subtitle="Thêm, sửa, xoá sản phẩm, upload ảnh và gắn danh mục">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-[#e8edf3] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#8f9bb3]">Sản phẩm</p>
              <h2 className="mt-2 font-serif text-3xl font-light text-foreground">{editingId ? 'Chỉnh sửa' : 'Tạo mới'}</h2>
            </div>
            <button type="button" onClick={resetForm} className="rounded-full border border-[#e8edf3] px-4 py-2 text-sm text-foreground">Làm mới</button>
          </div>

          {message ? <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div> : null}
          {error ? <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          <div className="space-y-4">
            <Field label="Tên sản phẩm" value={form.name} onChange={(name) => setForm((p) => ({ ...p, name }))} />
            <Field label="Slug" value={form.slug} onChange={(slug) => setForm((p) => ({ ...p, slug }))} />
            <Field label="Mô tả" value={form.description || ''} onChange={(description) => setForm((p) => ({ ...p, description }))} textarea />
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Giá gốc
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={
                      form.price
                        ? Number(form.price).toLocaleString('vi-VN')
                        : ''
                    }
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '');

                      setForm((prev) => ({
                        ...prev,
                        price: raw,
                      }));
                    }}
                    placeholder="Nhập giá gốc"
                    className="
          w-full
          rounded-2xl
          border border-[#e8edf3]
          bg-white
          px-4 py-3
          pr-16
          text-foreground
          focus:border-emerald-700
          focus:outline-none
        "
                  />

                  <span
                    className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-sm
          font-medium
          text-[#8f9bb3]
        "
                  >
                    VNĐ
                  </span>
                </div>


              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Giá khuyến mãi
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={
                      form.sale_price
                        ? Number(form.sale_price).toLocaleString('vi-VN')
                        : ''
                    }
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '');

                      setForm((prev) => ({
                        ...prev,
                        sale_price: raw,
                      }));
                    }}
                    placeholder="Nhập giá khuyến mãi"
                    className="
          w-full
          rounded-2xl
          border border-[#e8edf3]
          bg-white
          px-4 py-3
          pr-16
          text-foreground
          focus:border-emerald-700
          focus:outline-none
        "
                  />

                  <span
                    className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-sm
          font-medium
          text-[#8f9bb3]
        "
                  >
                    VNĐ
                  </span>
                </div>


              </div>
            </div>

            <div className="rounded-2xl border border-[#e8edf3] bg-[#f6f7fb] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Gắn danh mục</span>

              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.length > 0 ? (
                  categories
                    .filter(
                      (c) =>
                        c.slug !== 'hoa-qua-tang' &&
                        c.slug !== 'hoa-trang-tri'
                    )
                    .map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() =>
                          setSelectedCategoryIds([category.id])
                        }
                        className={`
            rounded-full
            px-4
            py-2
            text-sm
            transition-all
            duration-200
            ${selectedCategoryIds[0] === category.id
                            ? 'bg-emerald-950 text-white shadow-md'
                            : 'bg-white text-[#6f7b8b] border border-[#e8edf3] hover:border-emerald-700 hover:text-foreground'
                          }
          `}
                      >
                        {category.name}
                      </button>
                    ))
                ) : (
                  <p className="text-sm text-[#6f7b8b]">
                    Chưa có danh mục nào
                  </p>
                )}
              </div>
            </div>

            <label className="block">
              <span className="mb-3 block text-sm font-medium text-foreground">
                Ảnh sản phẩm
              </span>

              {editingId ? (
  <div className="space-y-4">
    {/* Ảnh chính */}
    <div className="overflow-hidden rounded-[1.5rem] border border-[#e8edf3] bg-white p-3">
      <img
        src={
          previews[activeImage] ||
          '/placeholder.jpg'
        }
        alt=""
        className="h-72 w-full rounded-xl object-cover"
      />
    </div>

    {/* Thumbnail */}
    <div className="grid grid-cols-4 gap-3">
      {previews.map((image, index) => (
        <div
          key={index}
          className={`
            relative
            overflow-hidden
            rounded-xl
            border
            cursor-pointer
            transition-all
            ${
              activeImage === index
                ? 'border-emerald-900 ring-2 ring-emerald-200'
                : 'border-[#e8edf3]'
            }
          `}
          onClick={() =>
            setActiveImage(index)
          }
        >
          <img
            src={
              image || '/placeholder.jpg'
            }
            alt=""
            className="h-24 w-full object-cover"
          />

          <label
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              bg-black/0
              opacity-0
              transition
              hover:bg-black/40
              hover:opacity-100
              cursor-pointer
            "
          >
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium">
              Đổi ảnh
            </span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file =
                  e.target.files?.[0];

                if (!file) return;

                const newFiles = [
                  ...imageFiles,
                ];

                newFiles[index] =
                  file;

                setImageFiles(
                  newFiles
                );

                const newPreviews = [
                  ...previews,
                ];

                newPreviews[index] =
                  URL.createObjectURL(
                    file
                  );

                setPreviews(
                  newPreviews
                );
              }}
            />
          </label>
        </div>
      ))}
    </div>
  </div>
) : (
  <div className="space-y-4">
    {/* Ảnh chính */}
    <div className="overflow-hidden rounded-[1.5rem] border border-[#e8edf3] bg-white p-3">
      {previews[activeImage] ? (
        <img
          src={previews[activeImage]}
          alt=""
          className="h-72 w-full rounded-xl object-cover"
        />
      ) : (
        <div className="flex h-72 items-center justify-center rounded-xl bg-[#f6f7fb]">
          <div className="text-center">
            <UploadCloud className="mx-auto h-10 w-10 text-[#8f9bb3]" />
            <p className="mt-2 text-sm text-[#6f7b8b]">
              Chưa chọn ảnh sản phẩm
            </p>
          </div>
        </div>
      )}
    </div>

    {/* Thumbnail */}
    <div className="grid grid-cols-4 gap-3">
      {[0, 1, 2, 3].map((index) => (
        <label
          key={index}
          className={`
            relative
            overflow-hidden
            rounded-xl
            border
            cursor-pointer
            transition-all
            ${
              activeImage === index
                ? 'border-emerald-900 ring-2 ring-emerald-200'
                : 'border-[#e8edf3]'
            }
          `}
        >
          {previews[index] ? (
            <img
              src={previews[index]}
              alt=""
              className="h-24 w-full object-cover"
              onClick={() =>
                setActiveImage(index)
              }
            />
          ) : (
            <div className="flex h-24 items-center justify-center bg-[#f6f7fb]">
              <UploadCloud className="h-6 w-6 text-[#8f9bb3]" />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file =
                e.target.files?.[0];

              if (!file) return;

              const newFiles = [
                ...imageFiles,
              ];

              newFiles[index] =
                file;

              setImageFiles(newFiles);

              const newPreviews = [
                ...previews,
              ];

              newPreviews[index] =
                URL.createObjectURL(file);

              setPreviews(newPreviews);

              setActiveImage(index);
            }}
          />
        </label>
      ))}
    </div>
  </div>
)}
            </label>
          </div>

          <button disabled={saving} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-950 px-5 py-4 text-sm font-medium text-white transition hover:bg-emerald-900 disabled:opacity-60">
            {editingId ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {saving ? 'Đang lưu...' : editingId ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}
          </button>
        </form>

        <div className="rounded-[2rem] border border-[#e8edf3] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>

              <h2 className="mt-2 font-serif text-3xl font-light text-foreground">Tất Cả Sản Phẩm</h2>

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

          <div className="relative mb-6 mt-4">
            <button
              type="button"
              onClick={() =>
                setShowCategoryFilter(
                  !showCategoryFilter
                )
              }
              className="
    flex items-center gap-2
    rounded-2xl
    border border-[#e8edf3]
    bg-white
    px-4 py-3
    text-sm
    shadow-sm
  "
            >
              Lọc theo danh mục

              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${showCategoryFilter
                  ? 'rotate-180'
                  : ''
                  }`}
              />
            </button>

            {showCategoryFilter && (
              <div
                className="
    absolute
    left-0
    top-full
    z-50
    mt-3
    rounded-2xl
    border border-[#e8edf3]
    bg-white
    p-4
    shadow-xl
    min-w-[500px]
  "
              >
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryFilter('');
                      setShowCategoryFilter(false);
                    }}
                    className={`rounded-full px-4 py-2 text-sm ${categoryFilter === ''
                      ? 'bg-emerald-950 text-white'
                      : 'bg-[#f6f7fb]'
                      }`}
                  >
                    Tất cả
                  </button>

                  {categories
                    .filter(
                      (c) =>
                        c.slug !== 'hoa-qua-tang' &&
                        c.slug !== 'hoa-trang-tri'
                    )
                    .map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          setCategoryFilter(
                            category.id
                          );
                          setShowCategoryFilter(false);
                        }}
                        className={`rounded-full px-4 py-2 text-sm ${categoryFilter ===
                          category.id
                          ? 'bg-emerald-950 text-white'
                          : 'bg-[#f6f7fb]'
                          }`}
                      >
                        {category.name}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
          {loading ? (
            <div className="rounded-2xl border border-[#e8edf3] bg-[#f6f7fb] p-6 text-sm text-[#6f7b8b]">Đang tải...</div>
          ) : (
            <>

              <div className="overflow-hidden rounded-[1.5rem] border border-[#e8edf3]">
                <table className="w-full text-left text-sm">

                  <thead className="bg-[#f6f7fb] text-[#8f9bb3]"><tr><th className="px-4 py-3">Tên</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Giá gốc</th><th className="px-4 py-3">Giá khuyến mãi</th><th className="px-4 py-3">Danh mục</th><th className="px-4 py-3 text-right">Thao tác</th></tr></thead>
                  <tbody>
                    {paged.map((item) => (
                      <tr key={item.id} className="border-t border-[#eef2f7]">
                        <td className="px-4 py-4 font-medium text-foreground">{item.name}</td>
                        <td className="px-4 py-4 text-[#6f7b8b]">{item.slug}</td>
                        <td className="px-4 py-4 text-[#6f7b8b]">
                          {Number(item.price || 0).toLocaleString('vi-VN')}đ
                        </td>

                        <td className="px-4 py-4 text-emerald-700 font-medium">
                          {item.sale_price
                            ? `${Number(item.sale_price).toLocaleString('vi-VN')}đ`
                            : '-'}
                        </td>
                        <td className="px-4 py-4 text-[#6f7b8b]">
                          {(item.category_ids || []).length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {(item.category_ids || []).map((id) => {
                                const category = categories.find((c) => c.id === id);
                                return <span key={id} className="rounded-full bg-[#f6f7fb] px-3 py-1 text-xs text-foreground">{category?.name || id}</span>;
                              })}
                            </div>
                          ) : (
                            <span className="text-xs text-[#9aa4b2]">Chưa gán danh mục</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => startEdit(item)} className="rounded-full border border-[#e8edf3] p-2 text-foreground"><Edit3 className="h-4 w-4" /></button>
                            <button onClick={() => handleDelete(item.id)} className="rounded-full border border-red-200 bg-red-50 p-2 text-red-700"><Trash2 className="h-4 w-4" /></button>
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
      {textarea ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} className="w-full rounded-2xl border border-[#e8edf3] bg-[#f6f7fb] px-4 py-3 text-sm outline-none" /> : <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-[#e8edf3] bg-[#f6f7fb] px-4 py-3 text-sm outline-none" />}
    </label>
  );
}
