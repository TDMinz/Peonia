import {
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import AdminLayout from "../components/AdminLayout";
import AdminPagination from "../components/AdminPagination";
import ProductDialog from "../components/ProductDialog";

import {
  adminProductsApi,
  type AdminCategoryOption,
  type AdminProductItem,
} from "../services/adminProducts";

const PAGE_SIZE = 7;

export default function AdminProductsPage() {
  const [items, setItems] = useState<
    AdminProductItem[]
  >([]);

  const [categories, setCategories] =
    useState<AdminCategoryOption[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [search, setSearch] =
    useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    
    const [showResultDialog, setShowResultDialog] =
      useState(false);
    
    const [resultType, setResultType] = useState<
      "success" | "warning"
    >("success");

  const [showProductDialog, setShowProductDialog] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState<AdminProductItem | null>(
      null
    );

  const [categoryFilter, setCategoryFilter] =
    useState("");
  const [typeFilter, setTypeFilter] =
    useState<
      "all" |
      "featured" |
      "bestSeller" |
      "both" |
      "normal"
    >("all");

  const [showTypeFilter, setShowTypeFilter] =
    useState(false);

  const [showCategoryFilter, setShowCategoryFilter] =
    useState(false);

  const [page, setPage] =
    useState(1);

  const [selectedIds, setSelectedIds] =
    useState<string[]>([]);

  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [
        productData,
        categoryData,
      ] = await Promise.all([
        adminProductsApi.list(),
        adminProductsApi.categories(),
      ]);

      setItems(productData.data || []);

      setCategories(
        categoryData.data || []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Không tải được sản phẩm"
      );

      setItems([]);
      setCategories([]);
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
      setMessage("");
    }, 4000);

    return () =>
      clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    categoryFilter,
    typeFilter,
  ]);

  const filtered = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    return items.filter((item) => {
      const matchSearch =
        !keyword ||
        [
          item.name,
          item.slug,
          item.description,
        ].some((field) =>
          String(field || "")
            .toLowerCase()
            .includes(keyword)
        );

      const matchCategory =
        !categoryFilter ||
        item.category_ids?.includes(
          categoryFilter
        );

      const matchType =
        typeFilter === "all"
          ? true
          : typeFilter === "featured"
            ? item.is_featured
            : typeFilter === "bestSeller"
              ? item.is_best_seller
              : typeFilter === "both"
                ? item.is_featured &&
                item.is_best_seller
                : !item.is_featured &&
                !item.is_best_seller;

      return (
        matchSearch &&
        matchCategory &&
        matchType
      );
    });
  }, [
    items,
    search,
    categoryFilter,
    typeFilter,
  ]);

  const paged = useMemo(
    () =>
      filtered.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
      ),
    [filtered, page]
  );
  const isAllSelected =
    paged.length > 0 &&
    paged.every((item) =>
      selectedIds.includes(item.id)
    );

  const isIndeterminate =
    selectedIds.length > 0 &&
    !isAllSelected;

  function openCreate() {
    setMessage("");
    setError("");

    setEditingProduct(null);

    setShowProductDialog(true);
  }

  function openEdit(
    item: AdminProductItem
  ) {
    setMessage("");
    setError("");

    setEditingProduct(item);

    setShowProductDialog(true);
  }

  function closeDialog() {
    setEditingProduct(null);

    setShowProductDialog(false);
  }
  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  }
  function toggleSelectAll() {
    if (isAllSelected) {
      setSelectedIds((prev) =>
        prev.filter(
          (id) =>
            !paged.some(
              (item) => item.id === id
            )
        )
      );

      return;
    }

    setSelectedIds((prev) => [
      ...new Set([
        ...prev,
        ...paged.map((item) => item.id),
      ]),
    ]);
  }

  async function handleSubmit(
    formData: FormData
  ) {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (editingProduct) {
        await adminProductsApi.update(
          editingProduct.id,
          formData
        );

        

setResultType("success");
setShowResultDialog(true);
      } else {
        await adminProductsApi.create(
          formData
        );

        

        setResultType("success");
        setShowResultDialog(true);
      }

      await loadData();

      closeDialog();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      const msg =
  err instanceof Error
    ? err.message
    : "Lưu sản phẩm thất bại";

setError(msg);

setResultType("warning");
setShowResultDialog(true);
    } finally {
      setSaving(false);
    }
  }


  function openDeleteDialog(
    id?: string
  ) {
    setDeleteId(id || null);

    setShowDeleteDialog(true);
  }

  function closeDeleteDialog() {
    setDeleteId(null);

    setShowDeleteDialog(false);
  }
  async function confirmDelete() {
    setDeleting(true);

    try {
      if (deleteId) {
        await adminProductsApi.remove(
          deleteId
        );

        setSelectedIds((prev) =>
          prev.filter(
            (id) => id !== deleteId
          )
        );
        setDeleteId(null);
        setMessage(
          "Xóa sản phẩm thành công."
        );
        setResultType("success");
setShowResultDialog(true);
      } else {
        await Promise.all(
          selectedIds.map((id) =>
            adminProductsApi.remove(id)
          )
        );

        setMessage(
          `Đã xóa ${selectedIds.length} sản phẩm.`
        );

        setSelectedIds([]);
        setDeleteId(null);
      }

      await loadData();
      setPage(1);
      closeDeleteDialog();
    } catch (err) {
      const msg =
  err instanceof Error
    ? err.message
    : "Xóa sản phẩm thất bại";

setError(msg);

setResultType("warning");
setShowResultDialog(true);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AdminLayout title="Quản lý sản phẩm" subtitle="Thêm, sửa, xoá sản phẩm, upload ảnh và gắn danh mục">
      <div
        className="grid gap-6 grid-cols-1"
      >
        <ProductDialog
          open={showProductDialog}
          editingProduct={editingProduct}
          categories={categories}
          saving={saving}
          onClose={closeDialog}
          onSubmit={handleSubmit}
        />
        <div className="rounded-[2rem] border border-[#e8edf3] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>

              <h2 className="mt-2 font-serif text-3xl font-light text-foreground">Tất Cả Sản Phẩm</h2>

            </div>
            <div className="flex gap-3">

              <button
                type="button"
                onClick={openCreate}
                className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        bg-emerald-950
                        px-5
                        py-3
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-emerald-900
                        "
              >

                <Plus className="h-4 w-4" />

                Tạo sản phẩm

              </button>
              <div className="flex items-center gap-2 rounded-full border border-[#e8edf3] bg-[#f6f7fb] px-4 py-2">
                <Search className="h-4 w-4 text-[#8f9bb3]" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm outline-none" placeholder="Tìm kiếm..." />
              </div>
              <button type="button" onClick={() => {
                setPage(1);
                loadData();
              }} className="rounded-full border border-[#e8edf3] bg-[#f6f7fb] p-3 text-foreground">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>


          </div>
          {selectedIds.length > 0 && (
            <div className="mb-5 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
              <span className="font-medium text-red-700">
                Đã chọn {selectedIds.length} sản phẩm
              </span>

              <button
                type="button"
                onClick={() => openDeleteDialog()}
                className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          bg-red-600
                          px-5
                          py-2.5
                          text-sm
                          font-medium
                          text-white
                          transition
                           hover:bg-red-700
                                             "
              >
                <Trash2 className="h-4 w-4" />

                Xóa đã chọn
              </button>
            </div>
          )}
          <div className="mb-6 mt-4 flex flex-wrap gap-4">

{/* ================= DANH MỤC ================= */}

<div className="relative">

  <button
    type="button"
    onClick={() => {
      setShowCategoryFilter((prev) => !prev);
      setShowTypeFilter(false);
    }}
    className="
      flex
      min-w-[230px]
      items-center
      justify-between
      rounded-2xl
      border
      border-[#e8edf3]
      bg-white
      px-5
      py-3
      text-sm
      shadow-sm
      transition
      hover:border-emerald-300
    "
  >
    <span>
      Danh mục:&nbsp;

      <span className="font-medium">
        {categoryFilter
          ? categories.find(
              (c) => c.id === categoryFilter
            )?.name
          : "Tất cả"}
      </span>
    </span>

    <ChevronDown
      className={`h-4 w-4 transition ${
        showCategoryFilter
          ? "rotate-180"
          : ""
      }`}
    />
  </button>

  {showCategoryFilter && (

    <div
      className="
        absolute
        left-0
        top-[calc(100%+12px)]
        z-50
        w-[360px]
        rounded-2xl
        border
        border-[#e8edf3]
        bg-white
        p-4
        shadow-xl
      "
    >

      <div className="flex flex-wrap gap-2">

        <button
          type="button"
          onClick={() => {
            setCategoryFilter("");
            setShowCategoryFilter(false);
          }}
          className={`rounded-full px-4 py-2 text-sm ${
            categoryFilter === ""
              ? "bg-emerald-950 text-white"
              : "bg-[#f6f7fb]"
          }`}
        >
          Tất cả
        </button>

        {categories
          .filter(
            (c) =>
              c.slug !== "hoa-qua-tang" &&
              c.slug !== "hoa-trang-tri"
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
              className={`rounded-full px-4 py-2 text-sm ${
                categoryFilter ===
                category.id
                  ? "bg-emerald-950 text-white"
                  : "bg-[#f6f7fb]"
              }`}
            >
              {category.name}
            </button>

          ))}

      </div>

    </div>

  )}

</div>

{/* ================= PHÂN LOẠI ================= */}

<div className="relative">

  <button
    type="button"
    onClick={() => {
      setShowTypeFilter((prev) => !prev);
      setShowCategoryFilter(false);
    }}
    className="
      flex
      min-w-[230px]
      items-center
      justify-between
      rounded-2xl
      border
      border-[#e8edf3]
      bg-white
      px-5
      py-3
      text-sm
      shadow-sm
      transition
      hover:border-emerald-300
    "
  >
    <span>
      Phân loại:&nbsp;

      <span className="font-medium">

        {{
          all: "Tất cả",
          featured: "⭐ Nổi bật",
          bestSeller: "🔥 Bán chạy",
          both: "⭐🔥 Nổi bật & bán chạy",
          normal: "Thông thường",
        }[typeFilter]}

      </span>
    </span>

    <ChevronDown
      className={`h-4 w-4 transition ${
        showTypeFilter
          ? "rotate-180"
          : ""
      }`}
    />
  </button>

  {showTypeFilter && (

    <div
      className="
        absolute
        left-0
        top-[calc(100%+12px)]
        z-50
        w-[280px]
        rounded-2xl
        border
        border-[#e8edf3]
        bg-white
        p-3
        shadow-xl
      "
    >

      {[
        {
          value: "all",
          label: "Tất cả",
        },
        {
          value: "featured",
          label: "⭐ Nổi bật",
        },
        {
          value: "bestSeller",
          label: "🔥 Bán chạy",
        },
        {
          value: "both",
          label:
            "⭐🔥 Nổi bật & bán chạy",
        },
        {
          value: "normal",
          label: "Thông thường",
        },
      ].map((option) => (

        <button
          key={option.value}
          type="button"
          onClick={() => {
            setTypeFilter(
              option.value as
                | "all"
                | "featured"
                | "bestSeller"
                | "both"
                | "normal"
            );

            setShowTypeFilter(false);
          }}
          className={`mb-2 block w-full rounded-xl px-4 py-3 text-left transition ${
            typeFilter === option.value
              ? "bg-emerald-950 text-white"
              : "hover:bg-[#f6f7fb]"
          }`}
        >
          {option.label}
        </button>

      ))}

    </div>

  )}

</div>

</div>
          
          {loading ? (
            <div className="rounded-2xl border border-[#e8edf3] bg-[#f6f7fb] p-6 text-sm text-[#6f7b8b]">Đang tải...</div>
          ) : (
            <>

              <div className="overflow-hidden rounded-[1.5rem] border border-[#e8edf3]">
                <table className="w-full text-left text-sm">

                  <thead className="bg-[#f6f7fb] text-[#8f9bb3]">
                    <tr>

                      <th className="w-14 px-4 py-3">

                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          ref={(el) => {
                            if (el) {
                              el.indeterminate =
                                isIndeterminate;
                            }
                          }}
                          onChange={toggleSelectAll}
                          className="h-4 w-4"
                        />

                      </th>

                      <th className="px-4 py-3">
                        Tên
                      </th>

                      <th className="px-4 py-3">
                        Slug
                      </th>

                      <th className="px-4 py-3">
                        Giá gốc
                      </th>

                      <th className="px-4 py-3">
                        Giá khuyến mãi
                      </th>

                      <th className="px-4 py-3">
                        Danh mục
                      </th>

                      <th className="px-4 py-3">
                        Phân loại
                      </th>

                      <th className="px-4 py-3 text-right">
                        Thao tác
                      </th>

                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((item) => (
                      <tr key={item.id} className="border-t border-[#eef2f7]">
                        <td className="px-4 py-4">

                          <input
                            type="checkbox"
                            checked={selectedIds.includes(
                              item.id
                            )}
                            onChange={() =>
                              toggleSelect(item.id)
                            }
                            className="h-4 w-4"
                          />

                        </td>
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
                          <div className="flex flex-wrap gap-2">

                            {item.is_featured && (
                              <span
                                className="
          rounded-full
          border border-amber-200
          bg-amber-50
          px-3
          py-1
          text-xs
          font-medium
          text-amber-700
        "
                              >
                                ⭐ Nổi bật
                              </span>
                            )}

                            {item.is_best_seller && (
                              <span
                                className="
          rounded-full
          border border-rose-200
          bg-rose-50
          px-3
          py-1
          text-xs
          font-medium
          text-rose-700
        "
                              >
                                🔥 Bán chạy
                              </span>
                            )}

                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEdit(item)}
                              className="rounded-full border border-[#e8edf3] p-2 text-foreground"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                openDeleteDialog(item.id)
                              }
                              className="
    rounded-full
    border
    border-red-200
    bg-red-50
    p-2
    text-red-700
    transition
    hover:bg-red-100
  "
                            >
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
      <ConfirmDialog
        open={showDeleteDialog}
        type="delete"
        loading={deleting}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title={
          deleteId
            ? "Xóa sản phẩm"
            : `Xóa ${selectedIds.length} sản phẩm`
        }
        description={
          deleteId
            ? "Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
            : `Bạn có chắc chắn muốn xóa ${selectedIds.length} sản phẩm đã chọn? Hành động này không thể hoàn tác.`
        }
        confirmText="Xóa"
        cancelText="Hủy"
      />
      <ConfirmDialog
  open={showResultDialog}
  type={resultType}
  title={
    resultType === "success"
      ? "Thành công"
      : "Có lỗi xảy ra"
  }
  description={
    resultType === "success"
      ? message
      : error
  }
  confirmText="Đóng"
  onClose={() => setShowResultDialog(false)}
  onConfirm={() => setShowResultDialog(false)}
/>
    </AdminLayout>
  );
}
