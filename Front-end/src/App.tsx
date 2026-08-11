import { useEffect, useMemo, useState } from 'react';
import { HomePage } from './routes/HomePage';
import GiftBouquetsPage from './routes/GiftBouquetsPage';
import AuthPage from './routes/AuthPage';
import WorkshopPage from './routes/WorkshopPage';
import CartPage from './routes/CartPage';
import CheckoutPage from './routes/CheckoutPage';
import CategoryRoutePage from './routes/CategoryRoutePage';
import EventsPage from './routes/EventsPage';
import AdminRoutePage, { isAdminPath } from './routes/AdminRoutePage';
//import StaffRoutePage, { isStaffPath } from './routes/StaffRoutePage';
import OrderHistoryPage from './routes/OrderHistoryPage';
import ChangePasswordPage from './routes/ChangePasswordPage';
import ProductDetailPage from './routes/ProductDetailPage';
import FloatingContactButton from './components/FloatingContactButton';
import AboutPage from './routes/AboutPage';
import PrivacyPolicyPage from './routes/PrivacyPolicy';
import OrderWarrantyPage from './routes/OrderWarrantyPolicyPage';
import ShippingPolicyPage from './routes/ShippingPolicyPage';
import PaymentPolicyPage from './routes/PaymentPolicyPage';

type Route = 'home' | 'about' | 'privacy-policy' | 'order-warranty' | 'shipping-policy' | 'payment-policy' | 'gift-bouquets' | 'workshop' | 'khoa-hoc' | 'cart' | 'checkout' | 'category' | 'admin' | 'staff' | 'auth-login' | 'auth-register' | 'auth-forgot' | 'order-history' | 'change-password' | 'product-detail';

function getStoredUser() {
  const raw = localStorage.getItem('peonia_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getRouteFromLocation(): Route {
  const path = window.location.pathname;
  if (path === '/hoa-sap-qua-tang/hoa-bo') return 'gift-bouquets';
  if (path.startsWith('/hoa-sap-qua-tang/') || path.startsWith('/hoa-gia-hoa-lua/')) return 'category';
  
  if (path === '/workshop') return 'workshop';
  if (path === '/khoa-hoc') return 'khoa-hoc';
  if (path === '/gioi-thieu') return 'about';
  if (path === '/chinh-sach-bao-mat') return 'privacy-policy';
  if (path === '/chinh-sach-doi-tra') return 'order-warranty'; 
  if (path === '/chinh-sach-van-chuyen') return 'shipping-policy';
  if (path === '/chinh-sach-thanh-toan') return 'payment-policy';
  if (path === '/gio-hang') return 'cart';
  if (path === '/checkout') return 'checkout';
  if (path === '/lich-su-don-hang') return 'order-history';
  if (path === '/doi-mat-khau') return 'change-password';
  if (path.startsWith('/san-pham/')) return 'product-detail';
  if (isAdminPath(path)) return 'admin';
 // if (isStaffPath(path)) return 'staff';
  if (path === '/dang-nhap') return 'auth-login';
  if (path === '/dang-ky') return 'auth-register';
  if (path === '/quen-mat-khau') return 'auth-forgot';
  return 'home';
}

function GuardedArea({ role, children }: { role: 'super_admin' | 'staff'; children: React.ReactNode }) {
  const user = getStoredUser();
  const storedRole = user?.role;

  useEffect(() => {
    if (storedRole !== role) {
      window.location.href = '/dang-nhap';
    }
  }, [storedRole, role]);

  if (storedRole !== role) return null;
  return <>{children}</>;
}

function CustomerArea({ children }: { children: React.ReactNode }) {
  const user = getStoredUser();
  if (user && user.role && user.role !== 'customer') return null;
  return <>{children}</>;
}

export default function App() {
  const [route, setRoute] = useState<Route>('home');
  const [pathname, setPathname] = useState(window.location.pathname);
  const user = useMemo(() => getStoredUser(), []);

  useEffect(() => {
  const syncRoute = () => {
    setPathname(window.location.pathname);
    setRoute(getRouteFromLocation());
  };

  syncRoute();

  window.addEventListener('popstate', syncRoute);

  return () => {
    window.removeEventListener('popstate', syncRoute);
  };
}, []);

  useEffect(() => {
    if (route === 'auth-login' && user?.role === 'super_admin') window.location.href = '/admin';
    if (route === 'auth-login' && user?.role === 'staff') window.location.href = '/staff';
  }, [route, user?.role]);

  const page = (
    <>
      {route === 'gift-bouquets' && <GiftBouquetsPage />}
      {route === 'category' && (
  <CategoryRoutePage
    key={pathname}
    slug={pathname.split('/').filter(Boolean)[1] || ''}
  />
)}
      {route === 'workshop' && <WorkshopPage />}
      {route === 'about' && <AboutPage />}
      {route === 'khoa-hoc' && <EventsPage />}
      {route === 'cart' && <CartPage />}
      {route === 'checkout' && <CheckoutPage />}
      {route === 'order-history' && <CustomerArea><OrderHistoryPage /></CustomerArea>}
      {route === 'change-password' && <CustomerArea><ChangePasswordPage /></CustomerArea>}
      {route === 'product-detail' && <ProductDetailPage slug={window.location.pathname.split('/').filter(Boolean).slice(1).join('/') || ''} />}
      {route === 'admin' && <GuardedArea role="super_admin"><AdminRoutePage path={window.location.pathname} /></GuardedArea>}
  {/* {route === 'staff' && <GuardedArea role="staff"><StaffRoutePage path={window.location.pathname} /></GuardedArea>} */}
      {route === 'auth-login' && <AuthPage initialMode="login" />}
      {route === 'auth-register' && <AuthPage initialMode="register" />}
      {route === 'auth-forgot' && <AuthPage initialMode="forgot" />}
      {route === 'home' && <HomePage />}
      {route === 'privacy-policy' && <PrivacyPolicyPage />}
      {route === 'order-warranty' && <OrderWarrantyPage />}
      {route === 'shipping-policy' && <ShippingPolicyPage />}
      {route === 'payment-policy' && <PaymentPolicyPage />}

    </>
  );

  return (
    <>
      {page}
      {route !== 'admin' && route !== 'staff' ? <FloatingContactButton /> : null}
    </>
  );
}
