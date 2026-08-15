import {
  User,
  Clock,
  Star,
  Wallet,
} from 'lucide-react';
import type { WorkshopDto } from '../services/api';

type Props = {
  workshop: WorkshopDto;
};

export default function WorkshopCard({ workshop }: Props) {
  const detailHref = `/workshop/${workshop.id}`;

  return (
    <div className="flex h-full min-h-[520px] flex-col rounded-[2rem] bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Ảnh */}
      <button
        type="button"
        onClick={() => (window.location.href = detailHref)}
        className="group relative mb-4 block w-full overflow-hidden rounded-[1.5rem] text-left"
      >
        <div className="relative overflow-hidden rounded-[1.5rem] bg-[#f6f3ee]">
          <img
            src={workshop.image_url}
            alt={workshop.title}
            className="h-[320px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </button>

      {/* Nội dung */}
      <div className="flex h-[calc(100%-376px)] flex-col lg:h-[calc(100%-416px)]">
        <h3 className="line-clamp-2 min-h-[56px] font-serif text-xl font-semibold leading-snug text-foreground">
          {workshop.title}
        </h3>

        <div className="mt-4 space-y-3 text-sm text-[#5f564d]">
          {/* Hàng 1 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-[#f8f4ef] px-3 py-2">
              <User className="h-4 w-4 shrink-0 text-[#c49a6c]" />
              <span className="truncate">
                <strong>Độ tuổi:</strong> {workshop.age_range || ''}
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-[#f8f4ef] px-3 py-2">
              <Star className="h-4 w-4 shrink-0 text-[#c49a6c]" />
              <div className="flex items-center gap-1">
                <span className="font-medium">Độ khó:</span>

                <span className="text-[18px] leading-none text-[#F4B400]">
                  {Array.from({ length: 5 }, (_, i) =>
                    i < (workshop.difficulty || 1) ? '★' : '☆'
                  ).join('')}
                </span>
              </div>
            </div>
          </div>

          {/* Hàng 2 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-[#f8f4ef] px-3 py-2">
              <Clock className="h-4 w-4 shrink-0 text-[#c49a6c]" />
              <span className="truncate">
                <strong>Thời gian:</strong> {workshop.duration
                  ? `${workshop.duration} phút`
                  : '60 phút'}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-[#f8f4ef] px-3 py-2">
              <Wallet className="h-4 w-4 shrink-0 text-[#c49a6c]" />
              <span className="truncate">
                <strong>Chi phí:</strong> {workshop.price.toLocaleString('vi-VN')}đ
              </span>
            </div>


          </div>
        </div>

        {/* Nút */}
        <button
          type="button"
          onClick={() => (window.location.href = detailHref)}
          className="mt-5 w-full rounded-full border border-[#e8edf3] px-5 py-3 text-sm font-medium text-foreground transition hover:border-[#C49A6C] hover:bg-[#C49A6C] hover:text-white"
        >
          Xem chi tiết
        </button>
      </div>
    </div>
  )
}