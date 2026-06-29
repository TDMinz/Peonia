import { useEffect } from 'react';
import {
  Trash2,
  TriangleAlert,
  CheckCircle2,
  Info,
  Loader2,
  X,
} from 'lucide-react';

type DialogType =
  | 'delete'
  | 'success'
  | 'warning'
  | 'info';

type ConfirmDialogProps = {
  open: boolean;

  type?: DialogType;

  title: string;

  description: string;

  confirmText?: string;

  cancelText?: string;

  loading?: boolean;

  onConfirm?: () => void;

  onClose: () => void;
};

export default function ConfirmDialog({
  open,
  type = 'info',
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () =>
      window.removeEventListener(
        'keydown',
        handleEsc
      );
  }, [open, onClose]);

  if (!open) return null;

  const config = {
    delete: {
      icon: Trash2,
      color: 'text-red-600',
      bg: 'bg-red-50',
      button:
        'bg-red-600 hover:bg-red-700',
    },

    success: {
      icon: CheckCircle2,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      button:
        'bg-emerald-700 hover:bg-emerald-800',
    },

    warning: {
      icon: TriangleAlert,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      button:
        'bg-amber-500 hover:bg-amber-600',
    },

    info: {
      icon: Info,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      button:
        'bg-sky-600 hover:bg-sky-700',
    },
  };

  const current = config[type];

  const Icon = current.icon;

  return (
    <div
      className="
        fixed inset-0 z-[999]
        flex items-center justify-center
        bg-black/45
        px-4
        backdrop-blur-sm
        animate-in fade-in duration-200
      "
      onClick={onClose}
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className="
          relative
          w-full
          max-w-md
          rounded-[2rem]
          bg-white
          p-8
          shadow-[0_25px_80px_rgba(0,0,0,.18)]
          animate-in zoom-in-95 duration-300
        "
      >
        <button
          onClick={onClose}
          className="
            absolute
            right-5
            top-5
            rounded-full
            p-2
            text-slate-400
            transition
            hover:bg-slate-100
          "
        >
          <X size={18} />
        </button>

        <div
          className={`
            mx-auto
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full
            ${current.bg}
          `}
        >
          <Icon
            className={`${current.color}`}
            size={38}
          />
        </div>

        <h2
          className="
            mt-6
            text-center
            font-serif
            text-3xl
            font-light
            text-slate-900
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-4
            text-center
            leading-7
            text-slate-500
          "
        >
          {description}
        </p>

        <div
          className="
            mt-10
            flex
            gap-4
          "
        >
          <button
            onClick={onClose}
            disabled={loading}
            className="
              flex-1
              rounded-full
              border
              border-slate-200
              py-3
              font-medium
              transition
              hover:bg-slate-100
            "
          >
            {cancelText}
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className={`
              flex-1
              rounded-full
              py-3
              font-medium
              text-white
              transition
              ${current.button}
              disabled:cursor-not-allowed
              disabled:opacity-70
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Đang xử lý...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}