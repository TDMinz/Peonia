import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminPagination({
  page,
  totalItems,
  pageSize,
  onPageChange,
}: {
  page: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalItems === 0) return null;

  return (
    <div className="mt-6 flex items-center justify-between gap-3 rounded-[1.25rem] border border-[#e8edf3] bg-[#f6f7fb] px-4 py-3 text-sm text-[#6f7b8b]">
      <span>
        Trang {page} / {totalPages} — {totalItems} mục
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="inline-flex items-center gap-1 rounded-full border border-[#e8edf3] bg-white px-4 py-2 text-foreground disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" /> Trước
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="inline-flex items-center gap-1 rounded-full border border-[#e8edf3] bg-white px-4 py-2 text-foreground disabled:opacity-50"
        >
          Sau <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
