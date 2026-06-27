import { useEffect, useMemo, useState } from 'react';
import { Phone, MessageCircleMore, ChevronUp, Flower, X } from 'lucide-react';

type ContactItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  bgClass: string;
  phoneNumber?: string;
};

function FacebookMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.2-1.5 1.6-1.5h1.7V4.6c-.3 0-1.4-.1-2.6-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.5V14h2.5v8h3.5z" />
    </svg>
  );
}

function InstagramMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TiktokMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.5 3c.6 1.8 1.8 3 3.5 3.4v2.8c-1.4 0-2.7-.4-3.8-1.2v6.7c0 3.3-2.4 5.6-5.7 5.6-3 0-5.2-2.1-5.2-4.8 0-2.9 2.5-5 6.1-4.6v2.9c-1.6-.5-3 .2-3 1.7 0 1 .8 1.8 2 1.8 1.5 0 2.5-1.2 2.5-3.1V3h3.6z" />
    </svg>
  );
}

const contacts: ContactItem[] = [
  { label: 'Zalo', href: 'https://zalo.me/0352363833', icon: MessageCircleMore, bgClass: 'bg-[#0068ff]' },
  { label: 'Facebook', href: 'https://www.facebook.com/PeoniaWorkshop', icon: FacebookMark, bgClass: 'bg-[#1877f2]' },
  { label: 'Điện thoại', href: 'tel:0352363833', icon: Phone, bgClass: 'bg-emerald-950'},
  { label: 'Instagram', href: 'https://www.instagram.com/peoniastudio.hn?igsh=cjEwaWM0eXpvNXIy&utm_source=qr', icon: InstagramMark, bgClass: 'bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@peonia.workshop?_r=1&_t=ZS-97Cf2um7Qiw', icon: TiktokMark, bgClass: 'bg-[#111111]' },
];

export default function FloatingContactButton() {
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [phonePopupOpen, setPhonePopupOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 240);
    const onOpenContacts = () => setOpen(true);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('peonia-open-contact-panel', onOpenContacts as EventListener);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('peonia-open-contact-panel', onOpenContacts as EventListener);
    };
  }, []);

  const panelTitle = useMemo(() => (open ? 'Liên hệ nhanh' : 'Hỗ trợ'), [open]);

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      <div
        className={`origin-bottom-right transition-all duration-200 ${open ? 'pointer-events-auto translate-y-0 opacity-100 scale-100' : 'pointer-events-none translate-y-2 opacity-0 scale-95'}`}
      >
        <div className="mb-2 rounded-[1.4rem] border border-white/60 bg-white/95 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between gap-4 border-b border-[#eee4d8] pb-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#8f877d]">Peonia</p>
              <h3 className="mt-1 text-sm font-semibold text-foreground">{panelTitle}</h3>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-[#8f877d] transition hover:bg-[#fbf7f1] hover:text-foreground"
              aria-label="Đóng liên hệ"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {contacts.map((item) => {
              const Icon = item.icon;
              const isPhone = item.label === 'Điện thoại';
              return isPhone ? (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setPhonePopupOpen(true)}
                  className="group flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition hover:bg-[#fbf7f1]"
                >
                  <span className={`flex h-11 w-11 items-center justify-center rounded-full text-white shadow-sm ${item.bgClass}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground">{item.label}</span>
                    <span className="mt-0.5 block text-xs text-[#8f877d]">{item.phoneNumber}</span>
                  </span>
                </button>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="group flex items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-[#fbf7f1]"
                >
                  <span className={`flex h-11 w-11 items-center justify-center rounded-full text-white shadow-sm ${item.bgClass}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground">{item.label}</span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {phonePopupOpen ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/20 px-4 pb-24 sm:items-center sm:pb-0" onClick={() => setPhonePopupOpen(false)}>
          <div
            className="w-full max-w-sm rounded-[1.6rem] border border-white/60 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#8f877d]">Peonia</p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">Liên hệ qua điện thoại</h3>
              </div>
              <button
                type="button"
                onClick={() => setPhonePopupOpen(false)}
                className="rounded-full p-2 text-[#8f877d] transition hover:bg-[#fbf7f1] hover:text-foreground"
                aria-label="Đóng popup số điện thoại"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-[#e8edf3] bg-[#fbf7f1] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.28em] text-[#8f877d]">Số điện thoại</p>
              <p className="mt-2 text-2xl font-semibold tracking-wide text-foreground">0352363833</p>
            </div>

            <div className="mt-5 flex gap-3">
              <a href="tel:0942986000" className="flex-1 rounded-full bg-emerald-950 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-emerald-900">
                Gọi ngay
              </a>
              <button
                type="button"
                onClick={() => setPhonePopupOpen(false)}
                className="rounded-full border border-[#e8edf3] px-4 py-3 text-sm font-medium text-foreground transition hover:bg-[#f6f7fb]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col items-end gap-2">
        

<button
  type="button"
  onClick={() => setOpen((prev) => !prev)}
  className="
    flex
    h-14
    w-14
    items-center
    justify-center
    rounded-full
    bg-[#C49A6C]
    text-white
    shadow-[0_14px_35px_rgba(196,154,108,0.35)]
    transition-all
    duration-300
    hover:-translate-y-1
    hover:scale-110
    hover:bg-[#D2A878]
  "
>
  {open ? (
    <X className="h-6 w-6" />
  ) : (
    <Flower className="h-6 w-6" strokeWidth={1.8} />
  )}
</button>
{showTop ? (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:scale-105"
            aria-label="Lên đầu trang"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
