import { Search, UserRound, Flower2, Flower, Gift, CakeSlice, PartyPopper, GraduationCap, Sparkles, Trees, Landmark, ChevronDown, LogOut, Lock, History,
  PanelsTopLeft,
  Heart, Building2, Menu, X, ChevronRight,} from 'lucide-react';
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
  trees: Trees,
  panels: PanelsTopLeft,
  heart: Heart,
  building: Building2,
  
};
const navigate = (path: string) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

export default function Header({ cartCount }: HeaderProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
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
      name: 'Hoa Sáp - Quà Tặng',
      href: '/hoa-sap-qua-tang/hoa-bo',
      slug: 'hoa-sap-qua-tang',
    },
    {
      name: 'Hoa Giả - Hoa Lụa',
      href: '/hoa-gia-hoa-lua/binh-hoa-lua-hoa-gia-de-ban',
      slug: 'hoa-gia-hoa-lua',
    },
    {
      name: 'Workshop',
      href: '/workshop',
    },
    {
      name: 'Khóa Học',
      href: '/khoa-hoc',
      slug: 'khoa-hoc',
    },
    {
      name: 'Giới Thiệu',
      href: '/gioi-thieu',
    }
  ];

  const fallbackDropdowns: Record<string, CategoryDto[]> = {
    'hoa-sap-qua-tang': [
      { id: '1', name: 'Hoa bó', slug: 'hoa-bo', icon: 'bouquet' },
      { id: '2', name: 'Hoa giỏ', slug: 'hoa-gio', icon: 'basket' },
      { id: '3', name: 'Box Mica', slug: 'box-mica', icon: 'mica' },
      { id: '4', name: 'Sinh nhật', slug: 'sinh-nhat', icon: 'birthday' },
      { id: '5', name: 'Ngày Lễ', slug: 'ngay-le', icon: 'holiday' },
      { id: '6', name: 'Tốt Nghiệp', slug: 'tot-nghiep', icon: 'graduation' },
    ],
    'hoa-gia-hoa-lua': [
      { id: '7', name: 'Bình Hoa Lụa - Hoa Giả Để Bàn', slug: 'binh-hoa-lua-hoa-gia-de-ban', icon: 'orchid' },
      { id: '8', name: 'Bình Hoa Lụa Trang Trí Kệ - Tủ', slug: 'binh-hoa-lua-trang-tri-ke-tu', icon: 'scenery' },
      { id: '9', name: 'Bình Hoa Quầy Lễ Tân Văn Phòng', slug: 'binh-hoa-quay-le-tan-van-phong', icon: 'hall' },
      { id: '10', name: 'Bình Hoa Lụa Đại Sảnh - Khách Sạn', slug: 'binh-hoa-lua-dai-sanh-khach-san', icon: 'building' },
      { id: '11', name: 'Tiểu Cảnh - Decor Không Gian', slug: 'tieu-canh-decor-khong-gian', icon: 'trees' },
      { id: '12', name: 'Backdrop Hoa - Decor Sự Kiện', slug: 'backdrop-hoa-decor-su-kien', icon: 'panels' },
      { id: '13', name: 'Hoa Cưới', slug: 'hoa-cuoi', icon: 'heart' },
    ],
    'khoa-hoc': [
  {
    id: 'course-1',
    name: 'Khóa học hoa sáp cơ bản',
    slug: 'hoa-sap-co-ban',
    icon: 'flower',
  },
  {
    id: 'course-2',
    name: 'Khóa học hoa sáp nâng cao',
    slug: 'hoa-sap-nang-cao',
    icon: 'flower2',
  },
  {
    id: 'course-3',
    name: 'Khóa học hoa lụa cơ bản',
    slug: 'hoa-lua-co-ban',
    icon: 'bouquet',
  },
  {
    id: 'course-4',
    name: 'Khóa học hoa lụa nâng cao',
    slug: 'hoa-lua-nang-cao',
    icon: 'sparkles',
  },
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

  function closeMobileMenu() {
    setMobileOpen(false);
    setMobileSubmenu(null);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between gap-3 md:gap-6">
          <a href="/" className="flex min-w-0 flex-shrink-0 items-center" onClick={closeMobileMenu}>
            <img
              src="https://res.cloudinary.com/di4qsw8gl/image/upload/v1782630659/1_c%C3%A1i_-_ngang_9cm_2_e7ugfo.png"
              alt="Peonia Studio"
              className="h-20 w-auto object-contain sm:h-24 md:h-28"
            />
          </a>

          <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
            {navigation.map((item) => {
              const submenu = 'slug' in item ? dropdownGroups[item.slug ?? ''] || fallbackDropdowns[item.slug ?? ''] || [] : [];
              const hasSubmenu = submenu.length > 0;
              const slug = 'slug' in item ? item.slug : '';
              return (
                <div
                  key={item.name}
                  className="relative py-6"
                  onMouseEnter={() => hasSubmenu && setOpenMenu(item.name)}
                  onMouseLeave={() => hasSubmenu && setOpenMenu(null)}
                >
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        hasSubmenu
                          ? `/${slug}/${submenu[0].slug}`
                          : item.href
                      )
                    }
                    className="cursor-pointer whitespace-nowrap text-sm uppercase tracking-wide text-foreground transition-colors hover:text-primary"
                  >
                    {item.name}
                  </button>

                  {hasSubmenu && (
                    <div
                      className={`absolute left-1/2 top-full z-50 mt-0 w-[460px] -translate-x-1/2 rounded-3xl border border-[#e6ddd3] bg-[#fbf7f1] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-200 ease-out ${openMenu === item.name ? 'opacity-100 translate-y-0 pointer-events-auto' : 'pointer-events-none translate-y-2 opacity-0'
                        }`}
                      onMouseEnter={() => setOpenMenu(item.name)}
                      onMouseLeave={() => setOpenMenu(null)}
                    >
                      <div className="grid grid-cols-1 gap-1.5">
                        {submenu.map((subItem) => {
                          const Icon = iconMap[subItem.icon || ''] || Flower2;
                          return (
                            <button
                              key={subItem.slug}
                              type="button"
                              onClick={() => {
  const targetPath =
    slug === 'khoa-hoc'
      ? `/khoa-hoc/${subItem.slug}`
      : `/${slug}/${subItem.slug}`;

  navigate(targetPath);
  setOpenMenu(null);
}}
                              className="cursor-pointer group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-foreground transition-colors hover:bg-white"
                            >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3ece3] text-[#1c1c1c] transition-colors group-hover:bg-[#e8dccf]">
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="min-w-0 text-sm uppercase tracking-[0.18em]">{subItem.name}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
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
                  className={`absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-[#e6ddd3] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-200 ${accountOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
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

          {/* Mobile actions */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              type="button"
              className="rounded-xl p-2 transition-colors hover:bg-[#f5ede4]"
              aria-label="Tìm kiếm"
            >
              <Search size={19} className="text-[#6F4E37]" />
            </button>

            <a
              href="/gio-hang"
              className="relative rounded-xl p-2 transition-colors hover:bg-[#f5ede4]"
              aria-label="Giỏ hàng"
            >
              <ShoppingBasket size={21} className="text-[#6F4E37]" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C49A6C] text-[9px] font-semibold text-white">
                {liveCartCount || cartCount}
              </span>
            </a>

            <button
              type="button"
              onClick={() => {
                setMobileOpen((value) => !value);
                setMobileSubmenu(null);
              }}
              className="rounded-xl p-2 transition-colors hover:bg-[#f5ede4]"
              aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} className="text-[#6F4E37]" /> : <Menu size={22} className="text-[#6F4E37]" />}
            </button>
          </div>
        </div>

        {/* Mobile navigation drawer */}
        {mobileOpen ? (
          <div className="fixed inset-0 top-20 z-[70] md:hidden">
            {/* Lớp nền tối: menu mở ra nhưng không đẩy nội dung trang xuống */}
            <button
              type="button"
              aria-label="Đóng menu"
              onClick={closeMobileMenu}
              className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
            />

            {/* Drawer bên trái */}
            <aside className="absolute left-0 top-0 h-[calc(100vh-5rem)] w-[86vw] max-w-[390px] overflow-y-auto bg-white shadow-[12px_0_40px_rgba(0,0,0,0.16)]">
              <div className="p-4">
                {/* Ô tìm kiếm giống menu mobile tham khảo */}
                <div className="mb-3 flex items-center rounded-full border border-[#d9d5d0] bg-white px-4 py-2.5 shadow-sm">
                  <input
                    type="search"
                    placeholder="Tìm kiếm"
                    className="min-w-0 flex-1 bg-transparent text-sm text-[#5f4938] outline-none placeholder:text-[#a19b94]"
                    aria-label="Tìm kiếm sản phẩm"
                  />
                  <Search className="h-5 w-5 shrink-0 text-[#6F6A65]" />
                </div>
              </div>

              <div className="border-t border-[#eee8e2]">
                {navigation.map((item) => {
                  const submenu =
                    'slug' in item
                      ? dropdownGroups[item.slug ?? ''] ||
                        fallbackDropdowns[item.slug ?? ''] ||
                        []
                      : [];
                  const hasSubmenu = submenu.length > 0;
                  const slug = 'slug' in item ? item.slug : '';
                  const expanded = mobileSubmenu === item.name;

                  return (
                    <div key={item.name} className="border-b border-[#eee8e2]">
                      <div className="flex min-h-[58px] items-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (!hasSubmenu) {
                              navigate(item.href);
                              closeMobileMenu();
                              return;
                            }
                            setMobileSubmenu(expanded ? null : item.name);
                          }}
                          className="flex min-h-[58px] flex-1 items-center justify-between px-5 py-3 text-left text-[14px] font-semibold uppercase tracking-[0.06em] text-[#5f4938]"
                        >
                          <span>{item.name}</span>
                          {hasSubmenu ? (
                            <ChevronDown
                              className={`h-5 w-5 shrink-0 text-[#8f877d] transition-transform duration-200 ${
                                expanded ? 'rotate-180' : ''
                              }`}
                            />
                          ) : null}
                        </button>
                      </div>

                      {hasSubmenu && expanded ? (
                        <div className="border-t border-[#f1ece7] bg-[#fbf7f1] px-3 py-2">
                          {submenu.map((subItem) => {
                            const Icon =
                              iconMap[subItem.icon || ''] || Flower2;
                            return (
                              <button
                                key={subItem.slug}
                                type="button"
                                onClick={() => {
                                  const targetPath =
                                    slug === 'khoa-hoc'
                                      ? `/khoa-hoc/${subItem.slug}`
                                      : `/${slug}/${subItem.slug}`;
                                  navigate(targetPath);
                                  closeMobileMenu();
                                }}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[14px] text-[#5f4938] transition-colors hover:bg-white"
                              >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#6F4E37] shadow-sm">
                                  <Icon className="h-4 w-4" />
                                </span>
                                <span className="min-w-0 leading-5">
                                  {subItem.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  );
                })}

                {currentUser ? (
                  <div className="border-t border-[#eee8e2] p-4">
                    <div className="mb-2 text-xs uppercase tracking-[0.12em] text-[#8f877d]">
                      Tài khoản
                    </div>
                    <a
                      href="/lich-su-don-hang"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 rounded-xl px-2 py-3 text-sm text-[#5f4938] hover:bg-[#fbf7f1]"
                    >
                      <History className="h-4 w-4" />
                      Lịch sử đơn hàng
                    </a>
                    <a
                      href="/doi-mat-khau"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 rounded-xl px-2 py-3 text-sm text-[#5f4938] hover:bg-[#fbf7f1]"
                    >
                      <Lock className="h-4 w-4" />
                      Đổi mật khẩu
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        closeMobileMenu();
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <a
                    href="/dang-nhap"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 border-t border-[#eee8e2] px-5 py-4 text-sm font-medium text-[#5f4938]"
                  >
                    <UserRound className="h-4 w-4" />
                    Đăng nhập
                  </a>
                )}
              </div>
            </aside>
          </div>
        ) : null}
      </div>
    </header>
  );
}
