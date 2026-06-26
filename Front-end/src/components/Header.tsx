import { Search, UserRound, Flower2, Flower, Gift, CakeSlice, PartyPopper, GraduationCap, Sparkles, Trees, Landmark, ChevronDown, LogOut, Lock, History } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api, type CategoryDto } from '../services/api';
import { getCartItems } from '../services/cart';
import { ShoppingBasket } from "lucide-react";

type HeaderProps = {
  cartCount: number;
};

type StoredUser = {
  id?: string;
  full_name?: string;
  username?: string;
  role?: string;
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  gift: Gift,
  bouquet: Flower2,
  basket: Gift,
  mica: Sparkles,
  birthday: CakeSlice,
  holiday: PartyPopper,
  graduation: GraduationCap,
  decor: Trees,
  orchid: Flower2,
  scenery: Trees,
  hall: Landmark,
  mini: Flower,
};

export default function Header({ cartCount }: HeaderProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [accountOpen, setAccountOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const syncUser = () => {
      const raw = localStorage.getItem('peonia_user');
      if (!raw) return setCurrentUser(null);
      try {
        setCurrentUser(JSON.parse(raw));
      } catch {
        setCurrentUser(null);
      }
    };

    syncUser();
    window.addEventListener('storage', syncUser);
    window.addEventListener('peonia-auth-updated', syncUser as EventListener);
    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('peonia-auth-updated', syncUser as EventListener);
    };
  }, []);

  useEffect(() => {
    let alive = true;
    api
      .categories({ is_active: true })
      .then((data) => {
        if (alive) setCategories(data.categories || []);
      })
      .catch(() => {
        if (alive) setCategories([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  const dropdownGroups = useMemo(() => {
    const roots = categories.filter((category) => !category.parentId).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const childrenByParentSlug = roots.reduce<Record<string, CategoryDto[]>>((acc, root) => {
      acc[root.slug] = categories
        .filter((category) => category.parentId)
        .filter((category) => categories.find((parent) => parent.id === category.parentId)?.slug === root.slug)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      return acc;
    }, {});
    return childrenByParentSlug;
  }, [categories]);

  const navigation = [
    
    {
      name: 'Hoa Quà Tặng',
      href: '/hoa-qua-tang/hoa-bo',
      slug: 'hoa-qua-tang',
    },
    {
      name: 'Hoa Trang Trí',
      href: '/hoa-trang-tri/trang-tri-nha-o',
      slug: 'hoa-trang-tri',
    },
    {
      name: 'Workshop',
      href: '/workshop',
    },
    {
      name: 'Events',
      href: '/events',
    },
    {
      name: 'Giới Thiệu',
      href: '/gioi-thieu',
    }
  ];

  const fallbackDropdowns: Record<string, CategoryDto[]> = {
    'hoa-qua-tang': [
      { id: '1', name: 'Hoa bó', slug: 'hoa-bo', icon: 'bouquet' },
      { id: '2', name: 'Hoa giỏ', slug: 'hoa-gio', icon: 'basket' },
      { id: '3', name: 'Hoa Mica', slug: 'hoa-mica', icon: 'mica' },
      { id: '4', name: 'Sinh nhật', slug: 'sinh-nhat', icon: 'birthday' },
      { id: '5', name: 'Ngày Lễ', slug: 'ngay-le', icon: 'holiday' },
      { id: '6', name: 'Tốt Nghiệp', slug: 'tot-nghiep', icon: 'graduation' },
    ],
    'hoa-trang-tri': [ 
      { id: '7', name: 'Trang Trí Nhà Ở', slug: 'trang-tri-nha-o', icon: 'orchid' },
      { id: '8', name: 'Trang Trí Văn Phòng', slug: 'trang-tri-van-phong', icon: 'scenery' },
      { id: '9', name: 'Hoa tại sảnh', slug: 'hoa-tai-sanh', icon: 'hall' },
      { id: '10', name: 'Tiểu Cảnh', slug: 'tieu-canh', icon: 'mini' },
    ],
  };

  const [liveCartCount, setLiveCartCount] = useState(0);

  useEffect(() => {
    const sync = () => setLiveCartCount(getCartItems().reduce((sum, item) => sum + item.quantity, 0));
    sync();
    window.addEventListener('peonia-cart-updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('peonia-cart-updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const displayName = currentUser?.full_name || currentUser?.username || 'Khách hàng';
  const isCustomer = !currentUser || currentUser.role === 'customer';

  function handleLogout() {
    localStorage.removeItem('peonia_token');
    localStorage.removeItem('peonia_user');
    window.dispatchEvent(new Event('peonia-auth-updated'));
    window.location.href = '/';
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between gap-6">
        <a href="/" className="flex-shrink-0">
  <img
    src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1781178365/Ngang_5cm_1_jcyq7h.png"
    alt="Peonia Studio"
    className="h-26 w-auto"
  />
</a>

          <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
            {navigation.map((item) => {
              const submenu = 'slug' in item ? dropdownGroups[item.slug] || fallbackDropdowns[item.slug] || [] : [];
              const hasSubmenu = submenu.length > 0;
              const slug = 'slug' in item ? item.slug : '';
              return (
                <div
                  key={item.name}
                  className="relative py-6"
                  onMouseEnter={() => hasSubmenu && setOpenMenu(item.name)}
                  onMouseLeave={() => hasSubmenu && setOpenMenu(null)}
                >
                  <a  href={
    hasSubmenu
      ? `/${slug}/${submenu[0].slug}`
      : item.href
  } className="whitespace-nowrap text-sm uppercase tracking-wide text-foreground transition-colors hover:text-primary">
                    {item.name}
                  </a>

                  {hasSubmenu && (
                    <div
                      className={`absolute left-1/2 top-full z-50 mt-0 w-[460px] -translate-x-1/2 rounded-3xl border border-[#e6ddd3] bg-[#fbf7f1] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-200 ease-out ${
                        openMenu === item.name ? 'opacity-100 translate-y-0 pointer-events-auto' : 'pointer-events-none translate-y-2 opacity-0'
                      }`}
                      onMouseEnter={() => setOpenMenu(item.name)}
                      onMouseLeave={() => setOpenMenu(null)}
                    >
                      <div className="grid grid-cols-1 gap-1.5">
                        {submenu.map((subItem) => {
                          const Icon = iconMap[subItem.icon || ''] || Flower2;
                          return (
                            <a
                              key={subItem.slug}
                              href={`/${slug}/${subItem.slug}`}
                              className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-foreground transition-colors hover:bg-white"
                            >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3ece3] text-[#1c1c1c] transition-colors group-hover:bg-[#e8dccf]">
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="min-w-0 text-sm uppercase tracking-[0.18em]">{subItem.name}</div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <button className="rounded-lg p-2 transition-colors hover:bg-muted" aria-label="Tìm kiếm">
              <Search size={20} className="text-[#6F4E37]" />
            </button>

            <a
   id="cart-icon"          
  href="/gio-hang"
  className="
    relative
    rounded-xl
    p-2
    transition-all
    duration-300
    hover:bg-[#f5ede4]
    hover:scale-105
  "
  aria-label="Giỏ hàng"
>
  <ShoppingBasket size={22} className="text-[#6F4E37]" />

  <span
    className="
      absolute
      -right-1
      -top-1
      flex
      h-5
      w-5
      items-center
      justify-center
      rounded-full
      bg-[#C49A6C]
      text-[10px]
      font-semibold
      text-white
    "
  >
    {liveCartCount || cartCount}
  </span>
</a>

            {isCustomer && currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-muted"
                >
                  <UserRound size={20} className="text-[#6F4E37]" />
                  <span className="max-w-[180px] truncate text-sm font-medium text-[#6F4E37]">Xin chào, {displayName}</span>
                  <ChevronDown size={16} className={`text-foreground transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
                </button>

                <div
                  className={`absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-[#e6ddd3] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-200 ${
                    accountOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
                  }`}
                >
                  <a href="/lich-su-don-hang" className="flex items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-[#fbf7f1]">
                    <History className="h-4 w-4" />
                    Lịch sử đơn hàng
                  </a>
                  <a href="/doi-mat-khau" className="flex items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-[#fbf7f1]">
                    <Lock className="h-4 w-4" />
                    Đổi mật khẩu
                  </a>
                  <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 transition-colors hover:bg-red-50 ">
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <a href="/dang-nhap" className="rounded-lg p-2 transition-colors hover:bg-muted" aria-label="Tài khoản">
                <UserRound size={20} className="text-[#6F4E37]" />
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
