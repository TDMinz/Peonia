
// import { useEffect, useMemo, useState } from 'react';
// import {
//   Plus,
//   Pencil,
//   Trash2,
//   UploadCloud,
//   X,
// } from 'lucide-react';

// import AdminLayout from '../components/AdminLayout';
// import RichTextEditor from '../components/RichTextEditor';

// import {
//   api,
//   type WorkshopDto,
// } from '../services/api';

// const emptyWorkshopForm = {
//   title: '',
//   price: '',

//   age_range: 'Mọi lứa tuổi',
//   difficulty: 1,
//   duration: '60 phút',

//   short_description: '',
//   description: '',

//   image_url: '',
//   images: [] as string[],
// };

// export default function AdminWorkshopsPage() {
//   const [workshops, setWorkshops] = useState<
//     WorkshopDto[]
//   >([]);

//   const [loading, setLoading] = useState(true);

//   const [openModal, setOpenModal] =
//     useState(false);

//   const [editingWorkshop, setEditingWorkshop] =
//     useState<WorkshopDto | null>(null);

//   const [formData, setFormData] = useState(
//     emptyWorkshopForm
//   );

//   const [saving, setSaving] = useState(false);

//   const [uploadingImages, setUploadingImages] =
//     useState(false);

//   const loadWorkshops = async () => {
//     try {
//       setLoading(true);

//       const data = await api.workshops();

//       setWorkshops(data.workshops || []);
//     } catch {
//       setWorkshops([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadWorkshops();
//   }, []);

//   const openCreateModal = () => {
//     setEditingWorkshop(null);
//     setFormData(emptyWorkshopForm);
//     setOpenModal(true);
//   };

//   const openEditModal = (workshop: WorkshopDto) => {
//     setEditingWorkshop(workshop);

//     setFormData({
//       title: workshop.title || '',
//       price: String(workshop.price || ''),

//       age_range:
//         workshop.age_range || 'Mọi lứa tuổi',

//       difficulty: workshop.difficulty || 1,

//       duration: workshop.duration || '60 phút',

//       short_description:
//         workshop.short_description || '',

//       description: workshop.description || '',

//       image_url: workshop.image_url || '',

//       images: workshop.images || [],
//     });

//     setOpenModal(true);
//   };

//   const handleImagesUpload = async (
//     files: FileList | null
//   ) => {
//     if (!files || files.length === 0) return;

//     if (
//       formData.images.length + files.length >
//       4
//     ) {
//       alert('Chỉ được tối đa 4 ảnh');
//       return;
//     }

//     setUploadingImages(true);

//     try {
//       const uploadedUrls: string[] = [];

//       for (const file of Array.from(files)) {
//         const result = await api.uploadImage(file);

//         uploadedUrls.push(result.url);
//       }

//       setFormData((prev) => ({
//         ...prev,
//         image_url:
//           prev.image_url ||
//           uploadedUrls[0] ||
//           '',

//         images: [
//           ...prev.images,
//           ...uploadedUrls,
//         ],
//       }));
//     } catch {
//       alert('Upload ảnh thất bại');
//     } finally {
//       setUploadingImages(false);
//     }
//   };

//   const removeImage = (index: number) => {
//     setFormData((prev) => {
//       const newImages = prev.images.filter(
//         (_, i) => i !== index
//       );

//       return {
//         ...prev,
//         images: newImages,
//         image_url: newImages[0] || '',
//       };
//     });
//   };

//   const handleSubmit = async (
//     e: React.FormEvent
//   ) => {
//     e.preventDefault();

//     if (!formData.title.trim()) {
//       alert('Vui lòng nhập tên workshop');
//       return;
//     }

//     try {
//       setSaving(true);

//       const payload = {
//         title: formData.title.trim(),

//         price: Number(formData.price) || 0,

//         age_range: formData.age_range,

//         difficulty: formData.difficulty,

//         duration: formData.duration,

//         short_description:
//           formData.short_description,

//         description: formData.description,

//         image_url:
//           formData.image_url ||
//           formData.images[0] ||
//           '',

//         images: formData.images,
//       };

//       if (editingWorkshop) {
//         await api.updateWorkshop(
//           editingWorkshop.id,
//           payload
//         );
//       } else {
//         await api.createWorkshop(payload);
//       }

//       setOpenModal(false);

//       await loadWorkshops();
//     } catch {
//       alert('Không thể lưu workshop');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (
//     workshop: WorkshopDto
//   ) => {
//     if (
//       !window.confirm(
//         `Xóa workshop "${workshop.title}"?`
//       )
//     ) {
//       return;
//     }

//     try {
//       await api.deleteWorkshop(workshop.id);

//       await loadWorkshops();
//     } catch {
//       alert('Xóa workshop thất bại');
//     }
//   };

//   const sortedWorkshops = useMemo(
//     () =>
//       [...workshops].sort(
//         (a, b) =>
//           new Date(
//             b.created_at || 0
//           ).getTime() -
//           new Date(
//             a.created_at || 0
//           ).getTime()
//       ),
//     [workshops]
//   );

//   return (
//     <AdminLayout
//       title="Quản lý Workshop"
//       description="Tạo và cập nhật workshop sáng tạo hoa."
//     >
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-xl font-semibold text-slate-800">
//               Danh sách workshop
//             </h2>

//             <p className="text-sm text-slate-500">
//               {sortedWorkshops.length} workshop
//             </p>
//           </div>

//           <button
//             onClick={openCreateModal}
//             className="inline-flex items-center gap-2 rounded-2xl bg-[#C49A6C] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#b38657]"
//           >
//             <Plus className="h-4 w-4" />
//             Thêm workshop
//           </button>
//         </div>

//         <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-slate-200">
//               <thead className="bg-slate-50 text-left text-sm font-semibold text-slate-600">
//                 <tr>
//                   <th className="px-6 py-4">
//                     Workshop
//                   </th>

//                   <th className="px-6 py-4">
//                     Chi phí
//                   </th>

//                   <th className="px-6 py-4">
//                     Độ tuổi
//                   </th>

//                   <th className="px-6 py-4">
//                     Độ khó
//                   </th>

//                   <th className="px-6 py-4">
//                     Thời gian
//                   </th>

//                   <th className="px-6 py-4 text-right">
//                     Thao tác
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
//                 {loading ? (
//                   <tr>
//                     <td
//                       colSpan={6}
//                       className="px-6 py-10 text-center text-slate-500"
//                     >
//                       Đang tải workshop...
//                     </td>
//                   </tr>
//                 ) : sortedWorkshops.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={6}
//                       className="px-6 py-10 text-center text-slate-500"
//                     >
//                       Chưa có workshop nào.
//                     </td>
//                   </tr>
//                 ) : (
//                   sortedWorkshops.map(
//                     (workshop) => (
//                       <tr
//                         key={workshop.id}
//                         className="hover:bg-slate-50"
//                       >
//                         <td className="px-6 py-4 font-medium text-slate-800">
//                           {workshop.title}
//                         </td>

//                         <td className="px-6 py-4">
//                           {workshop.price.toLocaleString(
//                             'vi-VN'
//                           )}
//                           đ
//                         </td>

//                         <td className="px-6 py-4">
//                           {workshop.age_range ||
//                             'Mọi lứa tuổi'}
//                         </td>

//                         <td className="px-6 py-4 text-[#C49A6C]">
//                           {'★'.repeat(
//                             workshop.difficulty ||
//                               1
//                           )}
//                         </td>

//                         <td className="px-6 py-4">
//                           {workshop.duration ||
//                             '60 phút'}
//                         </td>

//                         <td className="px-6 py-4">
//                           <div className="flex items-center justify-end gap-2">
//                             <button
//                               onClick={() =>
//                                 openEditModal(
//                                   workshop
//                                 )
//                               }
//                               className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-[#C49A6C] hover:text-[#C49A6C]"
//                               title="Chỉnh sửa"
//                             >
//                               <Pencil className="h-4 w-4" />
//                             </button>

//                             <button
//                               onClick={() =>
//                                 handleDelete(
//                                   workshop
//                                 )
//                               }
//                               className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:text-red-500"
//                               title="Xóa workshop"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     )
//                   )
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {openModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//           <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
//             <div className="mb-6 flex items-center justify-between">
//               <h3 className="text-xl font-semibold text-slate-800">
//                 {editingWorkshop
//                   ? 'Cập nhật workshop'
//                   : 'Tạo workshop mới'}
//               </h3>

//               <button
//                 onClick={() =>
//                   setOpenModal(false)
//                 }
//                 className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             <form
//               onSubmit={handleSubmit}
//               className="space-y-6"
//             >
//               <div className="grid gap-5 md:grid-cols-2">
//                 <div className="space-y-2 md:col-span-2">
//                   <label className="text-sm font-medium text-slate-700">
//                     Tên workshop
//                   </label>

//                   <input
//                     value={formData.title}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         title:
//                           e.target.value,
//                       })
//                     }
//                     className="w-full rounded-2xl border border-slate-200 px-4 py-3"
//                     placeholder="Nhập tên workshop"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-slate-700">
//                     Chi phí
//                   </label>

//                   <input
//                     type="number"
//                     value={formData.price}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         price:
//                           e.target.value,
//                       })
//                     }
//                     className="w-full rounded-2xl border border-slate-200 px-4 py-3"
//                     placeholder="VD: 235000"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-slate-700">
//                     Độ tuổi
//                   </label>

//                   <input
//                     value={formData.age_range}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         age_range:
//                           e.target.value,
//                       })
//                     }
//                     className="w-full rounded-2xl border border-slate-200 px-4 py-3"
//                     placeholder="VD: 7+"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-slate-700">
//                     Độ khó
//                   </label>

//                   <select
//                     value={formData.difficulty}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         difficulty:
//                           Number(
//                             e.target.value
//                           ),
//                       })
//                     }
//                     className="w-full rounded-2xl border border-slate-200 px-4 py-3"
//                   >
//                     <option value={1}>
//                       ★☆☆☆☆
//                     </option>
//                     <option value={2}>
//                       ★★☆☆☆
//                     </option>
//                     <option value={3}>
//                       ★★★☆☆
//                     </option>
//                     <option value={4}>
//                       ★★★★☆
//                     </option>
//                     <option value={5}>
//                       ★★★★★
//                     </option>
//                   </select>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-slate-700">
//                     Thời gian
//                   </label>

//                   <input
//                     value={formData.duration}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         duration:
//                           e.target.value,
//                       })
//                     }
//                     className="w-full rounded-2xl border border-slate-200 px-4 py-3"
//                     placeholder="VD: 60 phút"
//                   />
//                 </div>

              

//                 <div className="space-y-2 md:col-span-2">
//                   <label className="text-sm font-medium text-slate-700">
//                     Mô tả chi tiết
//                   </label>

//                   <RichTextEditor
//                     value={formData.short_description}
//                     onChange={(value) =>
//                       setFormData({
//                         ...formData,
//                         description:
//                           value,
//                       })
//                     }
//                     placeholder="Nhập mô tả workshop..."
//                   />
//                 </div>

//                 <div className="space-y-3 md:col-span-2">
//                   <label className="text-sm font-medium text-slate-700">
//                     Hình ảnh workshop (tối đa 4
//                     ảnh)
//                   </label>

//                   <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center hover:border-[#C49A6C]">
//                     <UploadCloud className="mb-3 h-8 w-8 text-[#C49A6C]" />

//                     <span className="text-sm font-medium text-slate-700">
//                       {uploadingImages
//                         ? 'Đang upload ảnh...'
//                         : 'Chọn tối đa 4 ảnh'}
//                     </span>

//                     <input
//                       type="file"
//                       accept="image/*"
//                       multiple
//                       className="hidden"
//                       onChange={(e) =>
//                         handleImagesUpload(
//                           e.target.files
//                         )
//                       }
//                     />
//                   </label>

//                   {formData.images.length >
//                     0 && (
//                     <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//                       {formData.images.map(
//                         (image, index) => (
//                           <div
//                             key={index}
//                             className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white"
//                           >
//                             <img
//                               src={image}
//                               alt={`Workshop ${index + 1}`}
//                               className="h-28 w-full object-cover"
//                             />

//                             <button
//                               type="button"
//                               onClick={() =>
//                                 removeImage(
//                                   index
//                                 )
//                               }
//                               className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white hover:bg-red-500"
//                             >
//                               <X className="h-4 w-4" />
//                             </button>

//                             {index === 0 && (
//                               <span className="absolute left-2 top-2 rounded-full bg-[#C49A6C] px-2 py-1 text-[10px] font-semibold text-white">
//                                 Ảnh chính
//                               </span>
//                             )}
//                           </div>
//                         )
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setOpenModal(false)
//                   }
//                   className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
//                 >
//                   Hủy
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="rounded-2xl bg-[#C49A6C] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#b38657] disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {saving
//                     ? 'Đang lưu...'
//                     : editingWorkshop
//                     ? 'Cập nhật workshop'
//                     : 'Tạo workshop'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </AdminLayout>
//   );
// }
