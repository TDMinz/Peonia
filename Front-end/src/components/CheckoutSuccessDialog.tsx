import {
  CheckCircle2,
  Home,
  X,
} from 'lucide-react';

export default function CheckoutSuccessDialog({
  open,
  onClose,
  title = 'Đặt Hàng Thành Công',
  description = 'Đơn hàng của bạn đã được ghi nhận thành công. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận thông tin đơn hàng.',
  note = '🌿 Mỗi bó hoa đều được Peonia chuẩn bị với sự chỉn chu và tận tâm. Chúng tôi hy vọng sản phẩm sẽ mang đến niềm vui và những khoảnh khắc ý nghĩa cho bạn.',
  buttonText = 'Tiếp tục mua sắm',
  buttonHref = '/',
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  note?: string;
  buttonText?: string;
  buttonHref?: string;
}) {
  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-[90]
        flex items-center justify-center
        bg-black/50
        px-4 py-8
        backdrop-blur-sm
      "
      onClick={onClose}
    >
      <div
        className="
          w-full max-w-xl
          overflow-hidden
          rounded-[2rem]
          bg-white
          shadow-[0_30px_100px_rgba(0,0,0,0.22)]
        "
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* Header */}
        <div className="relative px-8 pt-8">
          <button
            type="button"
            onClick={onClose}
            className="
              absolute right-5 top-5
              rounded-full p-2
              text-[#8f9bb3]
              transition
              hover:bg-[#f6f7fb]
            "
          >
            <X className="h-5 w-5" />
          </button>

          <div className="text-center">
            <div
              className="
                mx-auto
                flex h-24 w-24
                items-center justify-center
                rounded-full
                bg-emerald-50
                ring-8 ring-emerald-50/50
              "
            >
              <CheckCircle2 className="h-12 w-12 text-emerald-700" />
            </div>

            <h3
  className="
    mt-6
    font-serif
    text-4xl
    font-light
    text-foreground
  "
>
  {title}
</h3>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 pb-8 pt-6 text-center">
          <p className="mt-4 leading-8 text-[#6f7b8b]">
          {description}
          </p>
         

          <div
            className="
      mt-6
      rounded-3xl
      border border-[#e8f3eb]
      bg-gradient-to-r
      from-[#f5fbf7]
      to-[#fafdfb]
      p-5
    "
          >
            <p className="text-sm leading-7 text-[#56705f]">
            {note}
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <a
                href={buttonHref}
              className="
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-full
        bg-emerald-950
        px-8
        py-4
        text-sm
        font-medium
        text-white
        transition
        hover:bg-emerald-900
      "
            >
              <Home className="h-4 w-4" />
              {buttonText}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}