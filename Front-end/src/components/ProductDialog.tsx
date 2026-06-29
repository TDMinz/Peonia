import { useEffect, useState } from "react";
import { Loader2, UploadCloud, X } from "lucide-react";

import type {
    AdminCategoryOption,
    AdminProductItem,
} from "../services/adminProducts";

const emptyForm = {
    name: "",
    slug: "",
    description: "",
    price: "",
    sale_price: "",
    is_addon: false,
    is_featured: false,
    is_best_seller: false,
};
type ProductForm = {
    name: string;
    slug: string;
    description: string;
    price: string;
    sale_price: string;

    is_addon: boolean;
    is_featured: boolean;
    is_best_seller: boolean;
};

type ProductDialogProps = {
    open: boolean;

    editingProduct: AdminProductItem | null;

    categories: AdminCategoryOption[];

    saving: boolean;

    onClose: () => void;

    onSubmit: (formData: FormData) => Promise<void>;
};

export default function ProductDialog({
    open,
    editingProduct,
    categories,
    saving,
    onClose,
    onSubmit,
}: ProductDialogProps) {
    const [form, setForm] =
        useState<ProductForm>(emptyForm);

    const [selectedCategoryIds, setSelectedCategoryIds] =
        useState<string[]>([]);

    const [imageFiles, setImageFiles] =
        useState<(File | null)[]>([
            null,
            null,
            null,
            null,
        ]);

    const [previews, setPreviews] =
        useState<string[]>([
            "",
            "",
            "",
            "",
        ]);
    useEffect(() => {
        return () => {
            previews.forEach((image) => {
                if (
                    image &&
                    image.startsWith("blob:")
                ) {
                    URL.revokeObjectURL(image);
                }
            });
        };
    }, [previews]);

    const [activeImage, setActiveImage] =
        useState(0);
    useEffect(() => {
        if (!open) return;

        if (editingProduct) {
            setForm({
                name: editingProduct.name || "",
                slug: editingProduct.slug || "",
                description:
                    editingProduct.description || "",
                price: String(
                    editingProduct.price || ""
                ),
                sale_price: String(
                    editingProduct.sale_price || ""
                ),
                is_addon:
                    !!editingProduct.is_addon,
                is_featured:
                    !!editingProduct.is_featured,
                is_best_seller:
                    !!editingProduct.is_best_seller,
            });

            setSelectedCategoryIds(
                editingProduct.category_ids || []
            );

            setPreviews([
                editingProduct.images?.[0] || "",
                editingProduct.images?.[1] || "",
                editingProduct.images?.[2] || "",
                editingProduct.images?.[3] || "",
            ]);
        } else {
            setForm(emptyForm);

            setSelectedCategoryIds([]);

            setImageFiles([
                null,
                null,
                null,
                null,
            ]);

            setPreviews([
                "",
                "",
                "",
                "",
            ]);
        }

        setActiveImage(0);
    }, [open, editingProduct]);
    useEffect(() => {
        if (!open) {
            setForm(emptyForm);

            setSelectedCategoryIds([]);

            setImageFiles([
                null,
                null,
                null,
                null,
            ]);

            setPreviews([
                "",
                "",
                "",
                "",
            ]);

            setActiveImage(0);
        }
    }, [open]);

    function handleImageChange(
        index: number,
        file: File | null
    ) {
        if (!file) return;

        setImageFiles((prev) => {
            const next = [...prev];

            next[index] = file;

            return next;
        });

        setPreviews((prev) => {
            const next = [...prev];

            if (
                next[index] &&
                next[index].startsWith("blob:")
            ) {
                URL.revokeObjectURL(
                    next[index]
                );
            }

            next[index] =
                URL.createObjectURL(file);

            return next;
        });

        setActiveImage(index);
    }

    function toggleCategory(id: string) {
        setSelectedCategoryIds((prev) =>
            prev[0] === id ? [] : [id]
        );
    }

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        const formData = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            formData.append(key, String(value));
        });

        formData.append(
            "categoryId",
            selectedCategoryIds[0] || ""
        );

        imageFiles.forEach((file, index) => {
            if (file) {
                formData.append(
                    `image_${index}`,
                    file
                );
            }
        });

        await onSubmit(formData);
    }

    function resetDialog() {
        setForm(emptyForm);

        setSelectedCategoryIds([]);

        setImageFiles([
            null,
            null,
            null,
            null,
        ]);

        setPreviews([
            "",
            "",
            "",
            "",
        ]);

        setActiveImage(0);
    }

    function handleClose() {
        resetDialog();

        onClose();
    }

    const isEditing =
        editingProduct !== null;
    if (!open) return null;

    return (
        <div
            className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/50
        px-4
        py-8
        backdrop-blur-sm
        "
            onClick={handleClose}
        >
            <div
                className="
            w-full
            max-w-5xl
            overflow-y-auto
            rounded-[2rem]
            bg-white
            shadow-[0_30px_100px_rgba(0,0,0,0.25)]
            max-h-[90vh]
        "
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}

                <div className="flex items-center justify-between border-b border-[#eef2f7] px-8 py-6">
                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-[#8f9bb3]">
                            Sản phẩm
                        </p>

                        <h2 className="mt-2 font-serif text-4xl font-light">
                            {isEditing
                                ? "Chỉnh sửa sản phẩm"
                                : "Tạo sản phẩm"}
                        </h2>
                    </div>

                    <button
                        onClick={handleClose}
                        className="
                rounded-full
                p-2
                hover:bg-[#f6f7fb]
            "
                    >
                        <X />
                    </button>
                </div>

                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 p-8"
                >


                    {/* Ví dụ */}

                    {/* Tên */}

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="space-y-5">
                            {/* Tên sản phẩm */}

                            <label className="block">
                                <span className="mb-2 block text-sm font-medium">
                                    Tên sản phẩm
                                </span>

                                <input
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm((prev: ProductForm) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    className="w-full rounded-2xl border border-[#e8edf3] bg-[#f6f7fb] px-4 py-3 outline-none"
                                />
                            </label>

                            {/* Slug */}

                            <label className="block">
                                <span className="mb-2 block text-sm font-medium">
                                    Slug
                                </span>

                                <input
                                    value={form.slug}
                                    onChange={(e) =>
                                        setForm((prev: ProductForm) => ({
                                            ...prev,
                                            slug: e.target.value,
                                        }))
                                    }
                                    className="w-full rounded-2xl border border-[#e8edf3] bg-[#f6f7fb] px-4 py-3 outline-none"
                                />
                            </label>

                            {/* Mô tả */}

                            
                        </div>

                        <div className="space-y-5">
                            {/* Giá gốc */}

                            <div>
                                <span className="mb-2 block text-sm font-medium">
                                    Giá gốc
                                </span>

                                <div className="relative">
                                    <input
                                        type="text"
                                        value={
                                            form.price
                                                ? Number(
                                                    form.price
                                                ).toLocaleString("vi-VN")
                                                : ""
                                        }
                                        onChange={(e) => {
                                            const raw =
                                                e.target.value.replace(/\D/g, "");

                                            setForm((prev: ProductForm) => ({
                                                ...prev,
                                                price: raw,
                                            }));
                                        }}
                                        className="w-full rounded-2xl border border-[#e8edf3] bg-[#f6f7fb] px-4 py-3 pr-16 outline-none"
                                    />

                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                        VNĐ
                                    </span>
                                </div>
                            </div>

                            {/* Giá KM */}

                            <div>
                                <span className="mb-2 block text-sm font-medium">
                                    Giá khuyến mãi
                                </span>

                                <div className="relative">
                                    <input
                                        type="text"
                                        value={
                                            form.sale_price
                                                ? Number(
                                                    form.sale_price
                                                ).toLocaleString("vi-VN")
                                                : ""
                                        }
                                        onChange={(e) => {
                                            const raw =
                                                e.target.value.replace(/\D/g, "");

                                            setForm((prev: ProductForm) => ({
                                                ...prev,
                                                sale_price: raw,
                                            }));
                                        }}
                                        className="w-full rounded-2xl border border-[#e8edf3] bg-[#f6f7fb] px-4 py-3 pr-16 outline-none"
                                    />

                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                        VNĐ
                                    </span>
                                </div>
                            </div>

                            {/* Checkbox */}

                            
                            
                        </div>
                        
                        
                    </div>
                    {/* Phân loại */}

<div className="rounded-2xl border border-[#eef2f7] bg-white p-5">
  <h3 className="mb-4 text-sm font-semibold text-slate-700">
    Phân loại
  </h3>

  <div className="grid grid-cols-2 gap-6">
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#eef2f7] p-4 transition hover:border-emerald-300 hover:bg-emerald-50">
      <input
        type="checkbox"
        checked={form.is_featured}
        onChange={(e) =>
          setForm((prev: ProductForm) => ({
            ...prev,
            is_featured: e.target.checked,
          }))
        }
        className="h-4 w-4"
      />

      <span className="font-medium text-slate-700">
        ⭐ Sản phẩm nổi bật
      </span>
    </label>

    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#eef2f7] p-4 transition hover:border-rose-300 hover:bg-rose-50">
      <input
        type="checkbox"
        checked={form.is_best_seller}
        onChange={(e) =>
          setForm((prev: ProductForm) => ({
            ...prev,
            is_best_seller: e.target.checked,
          }))
        }
        className="h-4 w-4"
      />

      <span className="font-medium text-slate-700">
        🔥 Sản phẩm bán chạy
      </span>
    </label>
  </div>
</div>
                    <label className="block">
                                <span className="mb-2 block text-sm font-medium">
                                    Mô tả
                                </span>

                                <textarea
                                    rows={12}
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm((prev: ProductForm) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    className="w-full resize-y rounded-2xl border border-[#e8edf3] bg-[#f6f7fb] px-4 py-3 outline-none"
                                />
                            </label>
                    {/* ===========================
            DANH MỤC
    =========================== */}

                    <div className="rounded-2xl border border-[#e8edf3] bg-[#f8fafc] p-5">
                        <h3 className="mb-4 text-sm font-semibold text-slate-700">
                            Danh mục sản phẩm
                        </h3>

                        <div className="flex flex-wrap gap-3">
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
                                        onClick={() =>
                                            toggleCategory(category.id)
                                        }
                                        className={`
                rounded-full
                px-4
                py-2
                text-sm
                transition-all
                duration-200
                ${selectedCategoryIds.includes(
                                            category.id
                                        )
                                                ? "bg-emerald-950 text-white shadow-md"
                                                : "border border-[#e8edf3] bg-white text-slate-600 hover:border-emerald-800 hover:text-emerald-900"
                                            }
            `}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                        </div>
                    </div>
                    {/* ===========================
            ẢNH SẢN PHẨM
    =========================== */}

                    <div className="rounded-2xl border border-[#e8edf3] bg-white p-5">
                        <h3 className="mb-5 text-sm font-semibold text-slate-700">
                            Hình ảnh sản phẩm
                        </h3>

                        

                        {/* Thumbnail */}

                        <div className="mt-5 grid grid grid-cols-2 md:grid-cols-4 gap-5 gap-4">
                            {[0, 1, 2, 3].map((index) => (
                                <div
                                    key={index}
                                    className={`
            relative
            overflow-hidden
            rounded-xl
            border
            transition-all
            cursor-pointer
            ${activeImage === index
                                            ? "border-emerald-900 ring-2 ring-emerald-200"
                                            : "border-[#e8edf3]"
                                        }
            `}
                                >
                                    {previews[index] ? (
                                        <img
                                            src={previews[index]}
                                            alt=""
                                            onClick={() =>
                                                setActiveImage(index)
                                            }
                                            className="h-48 w-full object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="
                flex
                h-28
                items-center
                justify-center
                bg-[#f6f7fb]
                "
                                            onClick={() =>
                                                setActiveImage(index)
                                            }
                                        >
                                            <UploadCloud
                                                className="text-slate-400"
                                                size={24}
                                            />
                                        </div>
                                    )}

                                    {/* Overlay */}

                                    <label
                                        className="
                absolute
                inset-0
                flex
                cursor-pointer
                items-center
                justify-center
                bg-black/0
                opacity-0
                transition
                hover:bg-black/40
                hover:opacity-100
            "
                                    >
                                        <span
                                            className="
                rounded-full
                bg-white
                px-3
                py-1
                text-xs
                font-medium
                "
                                        >
                                            Đổi ảnh
                                        </span>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                                handleImageChange(
                                                    index,
                                                    e.target.files?.[0] ||
                                                    null
                                                )
                                            }
                                        />
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Nút chọn nhanh */}

                        
                    </div>



                    {/* Footer */}

                    <div className="mt-8 flex items-center justify-between border-t border-[#eef2f7] pt-6">

                        <div className="text-sm text-slate-500">
                            {isEditing
                                ? "Đang chỉnh sửa sản phẩm"
                                : "Tạo sản phẩm mới"}
                        </div>

                        <div className="flex gap-3">

                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={saving}
                                className="
            rounded-full
            border
            border-[#e8edf3]
            px-6
            py-3
            transition
            hover:bg-[#f8fafc]
        "
                            >
                                Hủy
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-emerald-950
            px-8
            py-3
            font-medium
            text-white
            transition
            hover:bg-emerald-900
            disabled:cursor-not-allowed
            disabled:opacity-70
        "
                            >
                                {saving && (
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                )}

                                {saving
                                    ? "Đang lưu..."
                                    : isEditing
                                        ? "Cập nhật sản phẩm"
                                        : "Tạo sản phẩm"}
                            </button>

                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}