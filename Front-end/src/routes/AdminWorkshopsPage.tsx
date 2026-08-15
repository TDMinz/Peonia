
import { useEffect, useMemo, useState } from 'react';
import {
  api,
} from '../services/api';

import {
  Plus,
  Pencil,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';

import AdminLayout from '../components/AdminLayout';
import RichTextEditor from '../components/RichTextEditor';

import {
  adminWorkshopsApi,
  type AdminWorkshopItem,
} from '../services/adminWorkshops';

const emptyWorkshopForm = {
  title: '',
  price: '',

  age_range: '',
  difficulty: 1,
  duration: '',

  short_description: '',
  description: '',

  image_url: '',
  images: [] as string[],
};

export default function AdminWorkshopsPage() {
  const [workshops, setWorkshops] =
    useState<AdminWorkshopItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] =
    useState(false);

  const [editingWorkshop, setEditingWorkshop] =
    useState<AdminWorkshopItem | null>(null);

  const [formData, setFormData] = useState(
    emptyWorkshopForm
  );

  const [saving, setSaving] = useState(false);

  const [uploadingImages, setUploadingImages] =
    useState(false);

  const loadWorkshops = async () => {
    try {
      setLoading(true);

      const data = await adminWorkshopsApi.list();

      setWorkshops(data.data || []);
    } catch (error) {
      console.error(
        'LOAD WORKSHOPS ERROR:',
        error
      );

      setWorkshops([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkshops();
  }, []);

  const openCreateModal = () => {
    setEditingWorkshop(null);

    setFormData({
      ...emptyWorkshopForm,
      images: [],
    });

    setImageFiles([
      null,
      null,
      null,
      null,
    ]);

    setImagePreviews([
      '',
      '',
      '',
      '',
    ]);

    setOpenModal(true);
  };

  const openEditModal = (workshop: AdminWorkshopItem) => {
    setEditingWorkshop(workshop);

    setFormData({
      title: workshop.title || '',
      price: String(workshop.price || ''),

      age_range:
        workshop.age_range || '',
      difficulty:
        workshop.difficulty || 1,

      duration:
        workshop.duration || '',

      short_description:
        workshop.short_description || '',

      description:
        workshop.description || '',

      image_url:
        workshop.image_url || '',

      images:
        workshop.images || [],
    });

    setImageFiles([
      null,
      null,
      null,
      null,
    ]);

    setImagePreviews([
      workshop.images?.[0] || '',
      workshop.images?.[1] || '',
      workshop.images?.[2] || '',
      workshop.images?.[3] || '',
    ]);

    setOpenModal(true);
  };
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const [imagePreviews, setImagePreviews] = useState<string[]>([
    '',
    '',
    '',
    '',
  ]);
  const handleImageChange = (
    index: number,
    file: File | null
  ) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh.');
      return;
    }

    // Giới hạn 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Ảnh không được vượt quá 5MB.');
      return;
    }

    const newFiles = [...imageFiles];
    newFiles[index] = file;

    const newPreviews = [...imagePreviews];

    // Xóa URL preview cũ nếu có
    if (newPreviews[index]) {
      URL.revokeObjectURL(newPreviews[index]);
    }

    newPreviews[index] = URL.createObjectURL(file);

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = [...imageFiles];
    newFiles[index] = null;

    const newPreviews = [...imagePreviews];

    if (newPreviews[index]) {
      URL.revokeObjectURL(newPreviews[index]);
    }

    newPreviews[index] = '';

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Vui lòng nhập tên workshop');
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      data.append(
        'title',
        formData.title.trim()
      );

      data.append(
        'price',
        String(
          Number(formData.price) || 0
        )
      );

      data.append(
        'age_range',
        formData.age_range
      );

      data.append(
        'difficulty',
        String(formData.difficulty)
      );

      data.append(
        'duration',
        formData.duration
      );

      data.append(
        'short_description',
        formData.short_description
      );

      data.append(
        'description',
        formData.description
      );

      // ============================
      // 4 ẢNH
      // ============================

      imageFiles.forEach(
        (file, index) => {
          if (file) {
            data.append(
              `image_${index}`,
              file
            );
          }
        }
      );

      // ============================
      // CREATE / UPDATE
      // ============================

      if (editingWorkshop) {
        await adminWorkshopsApi.update(
          editingWorkshop.id,
          data
        );
      } else {
        await adminWorkshopsApi.create(
          data
        );
      }

      setOpenModal(false);

      setImageFiles([
        null,
        null,
        null,
        null,
      ]);

      setImagePreviews([
        '',
        '',
        '',
        '',
      ]);

      await loadWorkshops();

    } catch (error) {
      console.error(
        'SAVE WORKSHOP ERROR:',
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : 'Không thể lưu workshop'
      );

    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    workshop: AdminWorkshopItem
  ) => {
    if (
      !window.confirm(
        `Xóa workshop "${workshop.title}"?`
      )
    ) {
      return;
    }

    try {
      await adminWorkshopsApi.remove(
        workshop.id
      );

      await loadWorkshops();
    } catch {
      alert('Xóa workshop thất bại');
    }
  };

  const sortedWorkshops = useMemo(
    () =>
      [...workshops].sort(
        (a, b) =>
          new Date(
            b.created_at || 0
          ).getTime() -
          new Date(
            a.created_at || 0
          ).getTime()
      ),
    [workshops]
  );

  return (
    <AdminLayout
      title="Quản lý Workshop"
      subtitle="Tạo và cập nhật workshop sáng tạo hoa."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Danh sách workshop
            </h2>

            <p className="text-sm text-slate-500">
              {sortedWorkshops.length} workshop
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#C49A6C] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#b38657]"
          >
            <Plus className="h-4 w-4" />
            Thêm workshop
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 text-left text-sm font-semibold text-slate-600">
                <tr>
                  <th className="px-6 py-4">
                    Workshop
                  </th>

                  <th className="px-6 py-4">
                    Chi phí
                  </th>

                  <th className="px-6 py-4">
                    Độ tuổi
                  </th>

                  <th className="px-6 py-4">
                    Độ khó
                  </th>

                  <th className="px-6 py-4">
                    Thời gian
                  </th>

                  <th className="px-6 py-4 text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      Đang tải workshop...
                    </td>
                  </tr>
                ) : sortedWorkshops.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      Chưa có workshop nào.
                    </td>
                  </tr>
                ) : (
                  sortedWorkshops.map(
                    (workshop) => (
                      <tr
                        key={workshop.id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {workshop.title}
                        </td>

                        <td className="px-6 py-4">
                          {workshop.price.toLocaleString(
                            'vi-VN'
                          )}
                          đ
                        </td>

                        <td className="px-6 py-4">
                          {workshop.age_range ||
                            ''}
                        </td>

                        <td className="px-6 py-4 text-[#C49A6C]">
                          {'★'.repeat(
                            workshop.difficulty ||
                            1
                          )}
                        </td>

                        <td className="px-6 py-4">
                          {workshop.duration ||
                            ''}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                openEditModal(
                                  workshop
                                )
                              }
                              className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-[#C49A6C] hover:text-[#C49A6C]"
                              title="Chỉnh sửa"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(
                                  workshop
                                )
                              }
                              className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:text-red-500"
                              title="Xóa workshop"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-800">
                {editingWorkshop
                  ? 'Cập nhật workshop'
                  : 'Tạo workshop mới'}
              </h3>

              <button
                onClick={() =>
                  setOpenModal(false)
                }
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">
                    Tên workshop
                  </label>

                  <input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                    placeholder="Nhập tên workshop"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Chi phí
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={
                        formData.price
                          ? Number(formData.price).toLocaleString('vi-VN')
                          : ''
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, '');

                        setFormData({
                          ...formData,
                          price: rawValue,
                        });
                      }}
                      placeholder="Nhập chi phí"
                      className="w-full rounded-xl border border-[#dfe6ee] px-4 py-3 pr-12 outline-none transition focus:border-[#006b57]"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#777]">
                      VNĐ
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Độ tuổi
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={
                        formData.age_range
                          ? `${formData.age_range}`
                          : ''
                      }
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/Tuổi/gi, '')
                          .replace(/\D/g, '');

                        setFormData({
                          ...formData,
                          age_range: value,
                        });
                      }}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-16"
                      placeholder="VD: 7"
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                      Tuổi
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Độ khó
                  </label>

                  <div className="flex items-center gap-1 rounded-2xl border border-slate-200 px-4 py-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            difficulty: star,
                          })
                        }
                        className={`text-2xl transition-all duration-150 hover:scale-110 ${star <= formData.difficulty
                            ? 'text-[#F4B400]'
                            : 'text-[#D1D5DB]'
                          }`}
                      >
                        ★
                      </button>
                    ))}

                    <span className="ml-2 text-sm text-slate-500">
                      {formData.difficulty}/5
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Thời gian
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={
                        formData.duration
                          ? `${formData.duration}`
                          : ''
                      }
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/Phút/gi, '')
                          .replace(/\D/g, '');

                        setFormData({
                          ...formData,
                          duration: value,
                        });
                      }}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-16"
                      placeholder="VD: 60"
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                      Phút
                    </span>
                  </div>
                </div>



                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">
                    Mô tả chi tiết
                  </label>

                  <RichTextEditor
                    value={formData.short_description}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        short_description:
                          value,
                      })
                    }
                    
                  />
                </div>

                <div className="col-span-full mt-6 w-full rounded-2xl border border-[#e1e7ef] bg-white p-6">
                  <h3 className="mb-5 font-serif text-lg font-semibold text-[#183b35]">
                    Hình ảnh workshop
                  </h3>

                  <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index}>
                        <input
                          id={`workshop-image-${index}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            handleImageChange(index, file);

                            // Cho phép chọn lại cùng một file
                            e.target.value = '';
                          }}
                        />

                        <label
                          htmlFor={`workshop-image-${index}`}
                          className={`group relative flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 transition-all ${preview
                            ? 'border-[#006b57]'
                            : index === 0
                              ? 'border-[#006b57]'
                              : 'border-[#dfe6ee] hover:border-[#9db5ae]'
                            } bg-[#f7f8fb]`}
                        >
                          {preview ? (
                            <>
                              <img
                                src={preview}
                                alt={`Workshop ${index + 1}`}
                                className="h-full w-full object-cover"
                              />

                              {/* Overlay */}
                              <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />

                              {/* Nút xóa */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleRemoveImage(index);
                                }}
                                className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-500 shadow-md transition hover:scale-110 hover:bg-red-50"
                              >
                                <X size={16} />
                              </button>

                              {/* Nhãn */}
                              <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                                {index === 0 ? 'Ảnh chính' : `Ảnh ${index + 1}`}
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-2 text-center">
                              <UploadCloud
                                className="h-9 w-9 text-[#91a5c1]"
                                strokeWidth={1.5}
                              />

                              <span className="text-sm text-[#4c4c4c]">
                                Chọn ảnh
                              </span>

                              <span className="text-xs text-[#9aa3af]">
                                {index === 0
                                  ? 'Ảnh chính'
                                  : `Ảnh ${index + 1}`}
                              </span>
                            </div>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 text-xs text-[#8a929c]">
                    Có thể chọn tối đa 4 ảnh. Ảnh đầu tiên sẽ được sử dụng làm ảnh chính.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={() =>
                    setOpenModal(false)
                  }
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-[#C49A6C] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#b38657] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? 'Đang lưu...'
                    : editingWorkshop
                      ? 'Cập nhật workshop'
                      : 'Tạo workshop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
