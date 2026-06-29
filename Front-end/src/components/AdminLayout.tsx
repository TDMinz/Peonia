import { CalendarDays, Layers3, LogOut, Package, ShoppingBag,ClipboardList, Users, LayoutDashboard } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Quản lý sản phẩm', icon: Package },
  { href: '/admin/workshops', label: 'Quản lý workshop', icon: CalendarDays },
  { href: '/admin/workshop-bookings', label: 'Booking workshop', icon: ClipboardList },
  { href: '/admin/orders', label: 'Đơn hàng', icon: ShoppingBag },
  { href: '/admin/users', label: 'Quản lý tài khoản', icon: Users },
];

export default function AdminLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  const currentPath = window.location.pathname;

  function handleLogout() {
    localStorage.removeItem('peonia_token');
    localStorage.removeItem('peonia_user');
    window.location.href = '/dang-nhap';
  }
  

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="border-r border-[#e8edf3] bg-white px-4 py-5 shadow-[8px_0_30px_rgba(15,23,42,0.04)]">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-950 text-white shadow-sm">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <p className="font-serif text-xl font-semibold leading-none">Peonia</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[#8f9bb3]">Admin panel</p>
            </div>
          </div>

          <div className="mb-4 px-2">
            <p className="text-xs uppercase tracking-[0.3em] text-[#9aa4b2]">Administration</p>
          </div>

          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentPath === item.href;
              return (
                <a key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? 'bg-emerald-950 text-white shadow-[0_10px_24px_rgba(16,185,129,0.22)]' : 'text-[#5f6b7a] hover:bg-[#f6f7fb] hover:text-foreground'}`}>
                  <Icon className="h-[18px] w-[18px]" />
                  <span className="text-[14px] font-medium">{item.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="mt-6 border-t border-[#eef2f7] pt-6">
            <button type="button" onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e8edf3] bg-white px-4 py-3 text-sm font-medium text-foreground transition hover:bg-[#f6f7fb]">
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </aside>

        <main className="px-5 py-5 lg:px-6">
  {title === 'Dashboard' && (
    <div className="mb-6 rounded-[2rem] border border-[#e8edf3] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
      <p className="text-xs uppercase tracking-[0.35em] text-[#8f9bb3]">
        {title}
      </p>

      {subtitle ? (
        <p className="mt-2 text-sm text-[#6f7b8b]">
          {subtitle}
        </p>
      ) : null}
    </div>
  )}

  {children}
</main>
      </div>
    </div>
  );
}
