import { useEffect, useMemo, useState } from 'react';

import { HomePage } from './routes/HomePage';
import GiftBouquetsPage from './routes/GiftBouquetsPage';
import AuthPage from './routes/AuthPage';
import WorkshopPage from './routes/WorkshopPage';
import CartPage from './routes/CartPage';
import CheckoutPage from './routes/CheckoutPage';
import CategoryRoutePage from './routes/CategoryRoutePage';
import AdminRoutePage, {
  isAdminPath,
} from './routes/AdminRoutePage';
// import StaffRoutePage, { isStaffPath } from './routes/StaffRoutePage';

import OrderHistoryPage from './routes/OrderHistoryPage';
import ChangePasswordPage from './routes/ChangePasswordPage';
import ProductDetailPage from './routes/ProductDetailPage';

import FloatingContactButton from './components/FloatingContactButton';

import AboutPage from './routes/AboutPage';
import PrivacyPolicyPage from './routes/PrivacyPolicy';
import OrderWarrantyPage from './routes/OrderWarrantyPolicyPage';
import ShippingPolicyPage from './routes/ShippingPolicyPage';
import PaymentPolicyPage from './routes/PaymentPolicyPage';

import WorkshopDetailPage from './routes/WorkshopDetailPage';
import CourseDetailPage from './routes/CourseDetailPage';
import CourseHoaSapNangCaoPage from "./routes/CourseHoaSapNangCaoPage";


type Route =
  | 'home'
  | 'about'
  | 'privacy-policy'
  | 'workshop-detail'
  | 'order-warranty'
  | 'shipping-policy'
  | 'payment-policy'
  | 'gift-bouquets'
  | 'workshop'
  | 'khoa-hoc'
  | 'course-hoa-sap-nang-cao'
  | 'cart'
  | 'checkout'
  | 'category'
  | 'admin'
  | 'staff'
  | 'auth-login'
  | 'auth-register'
  | 'auth-forgot'
  | 'order-history'
  | 'change-password'
  | 'product-detail';


function getStoredUser() {
  const raw = localStorage.getItem('peonia_user');

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}


/* =========================================================
   LẤY SLUG KHÓA HỌC TỪ URL
========================================================= */

function getCourseSlugFromLocation() {
  const path = window.location.pathname;

  if (!path.startsWith('/khoa-hoc/')) {
    return '';
  }

  return (
    path
      .split('/')
      .filter(Boolean)[1] || ''
  );
}


/* =========================================================
   ROUTING
========================================================= */

function getRouteFromLocation(): Route {
  const path = window.location.pathname;


  /* =========================
     HOA SÁP - QUÀ TẶNG
  ========================= */

  if (
    path === '/hoa-sap-qua-tang/hoa-bo'
  ) {
    return 'gift-bouquets';
  }


  /* =========================
     CATEGORY
  ========================= */

  if (
    path.startsWith('/hoa-sap-qua-tang/') ||
    path.startsWith('/hoa-gia-hoa-lua/')
  ) {
    return 'category';
  }


  /* =========================
     WORKSHOP DETAIL
  ========================= */

  if (
    path.startsWith('/workshop/')
  ) {
    return 'workshop-detail';
  }


  /* =========================
     WORKSHOP
  ========================= */

  if (
    path === '/workshop'
  ) {
    return 'workshop';
  }


  /* =========================
     KHÓA HỌC
  ========================= */

 /* =========================
   KHÓA HỌC
========================= */

if (path === '/khoa-hoc/hoa-sap-nang-cao') {
  return 'course-hoa-sap-nang-cao';
}

if (path.startsWith('/khoa-hoc/')) {
  return 'khoa-hoc';
}

if (path === '/khoa-hoc') {
  return 'khoa-hoc';
}


  /* =========================
     GIỚI THIỆU
  ========================= */

  if (
    path === '/gioi-thieu'
  ) {
    return 'about';
  }


  /* =========================
     CHÍNH SÁCH
  ========================= */

  if (
    path === '/chinh-sach-bao-mat'
  ) {
    return 'privacy-policy';
  }

  if (
    path === '/chinh-sach-doi-tra'
  ) {
    return 'order-warranty';
  }

  if (
    path === '/chinh-sach-van-chuyen'
  ) {
    return 'shipping-policy';
  }

  if (
    path === '/chinh-sach-thanh-toan'
  ) {
    return 'payment-policy';
  }


  /* =========================
     GIỎ HÀNG
  ========================= */

  if (
    path === '/gio-hang'
  ) {
    return 'cart';
  }


  /* =========================
     CHECKOUT
  ========================= */

  if (
    path === '/checkout'
  ) {
    return 'checkout';
  }


  /* =========================
     LỊCH SỬ ĐƠN HÀNG
  ========================= */

  if (
    path === '/lich-su-don-hang'
  ) {
    return 'order-history';
  }


  /* =========================
     ĐỔI MẬT KHẨU
  ========================= */

  if (
    path === '/doi-mat-khau'
  ) {
    return 'change-password';
  }


  /* =========================
     PRODUCT DETAIL
  ========================= */

  if (
    path.startsWith('/san-pham/')
  ) {
    return 'product-detail';
  }


  /* =========================
     ADMIN
  ========================= */

  if (
    isAdminPath(path)
  ) {
    return 'admin';
  }


  /* =========================
     STAFF
  ========================= */

  // if (isStaffPath(path)) return 'staff';


  /* =========================
     AUTH
  ========================= */

  if (
    path === '/dang-nhap'
  ) {
    return 'auth-login';
  }

  if (
    path === '/dang-ky'
  ) {
    return 'auth-register';
  }

  if (
    path === '/quen-mat-khau'
  ) {
    return 'auth-forgot';
  }


  return 'home';
}


/* =========================================================
   GUARDED AREA
========================================================= */

function GuardedArea({
  role,
  children,
}: {
  role: 'super_admin' | 'staff';
  children: React.ReactNode;
}) {
  const user = getStoredUser();
  const storedRole = user?.role;

  useEffect(() => {
    if (storedRole !== role) {
      window.location.href = '/dang-nhap';
    }
  }, [storedRole, role]);

  if (storedRole !== role) {
    return null;
  }

  return <>{children}</>;
}


/* =========================================================
   CUSTOMER AREA
========================================================= */

function CustomerArea({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getStoredUser();

  if (
    user &&
    user.role &&
    user.role !== 'customer'
  ) {
    return null;
  }

  return <>{children}</>;
}


/* =========================================================
   APP
========================================================= */

export default function App() {
  const [route, setRoute] =
    useState<Route>('home');

  const [pathname, setPathname] =
    useState(window.location.pathname);

  const user = useMemo(
    () => getStoredUser(),
    []
  );


  /* =====================================================
     ĐỒNG BỘ ROUTE KHI URL THAY ĐỔI
  ===================================================== */

  useEffect(() => {
    const syncRoute = () => {
      const currentPath =
        window.location.pathname;

      setPathname(currentPath);
      setRoute(
        getRouteFromLocation()
      );
    };

    syncRoute();

    window.addEventListener(
      'popstate',
      syncRoute
    );

    return () => {
      window.removeEventListener(
        'popstate',
        syncRoute
      );
    };
  }, []);


  /* =====================================================
     AUTH REDIRECT
  ===================================================== */

  useEffect(() => {
    if (
      route === 'auth-login' &&
      user?.role === 'super_admin'
    ) {
      window.location.href = '/admin';
    }

    if (
      route === 'auth-login' &&
      user?.role === 'staff'
    ) {
      window.location.href = '/staff';
    }
  }, [route, user?.role]);


  /* =====================================================
     LẤY SLUG KHÓA HỌC
  ===================================================== */

  const courseSlug =
    getCourseSlugFromLocation();


  /* =====================================================
     PAGE
  ===================================================== */

  const page = (
    <>

      {/* =================================================
          HOA SÁP - QUÀ TẶNG
      ================================================= */}

      {route === 'gift-bouquets' && (
        <GiftBouquetsPage />
      )}


      {/* =================================================
          CATEGORY
      ================================================= */}

      {route === 'category' && (
        <CategoryRoutePage
          key={pathname}
          slug={
            pathname
              .split('/')
              .filter(Boolean)[1] || ''
          }
        />
      )}


      {/* =================================================
          WORKSHOP
      ================================================= */}

      {route === 'workshop' && (
        <WorkshopPage />
      )}


      {/* =================================================
          WORKSHOP DETAIL
      ================================================= */}

      {route === 'workshop-detail' && (
        <WorkshopDetailPage
          id={
            pathname.split('/')[2] || ''
          }
        />
      )}


      {/* =================================================
          GIỚI THIỆU
      ================================================= */}

      {route === 'about' && (
        <AboutPage />
      )}


      {/* =================================================
          KHÓA HỌC
      ================================================= */}

      {route === 'khoa-hoc' && (
        <CourseDetailPage
          slug={courseSlug}
        />
      )}
      {route === 'course-hoa-sap-nang-cao' && (
  <CourseHoaSapNangCaoPage />
)}


      {/* =================================================
          GIỎ HÀNG
      ================================================= */}

      {route === 'cart' && (
        <CartPage />
      )}


      {/* =================================================
          CHECKOUT
      ================================================= */}

      {route === 'checkout' && (
        <CheckoutPage />
      )}


      {/* =================================================
          LỊCH SỬ ĐƠN HÀNG
      ================================================= */}

      {route === 'order-history' && (
        <CustomerArea>
          <OrderHistoryPage />
        </CustomerArea>
      )}


      {/* =================================================
          ĐỔI MẬT KHẨU
      ================================================= */}

      {route === 'change-password' && (
        <CustomerArea>
          <ChangePasswordPage />
        </CustomerArea>
      )}


      {/* =================================================
          PRODUCT DETAIL
      ================================================= */}

      {route === 'product-detail' && (
        <ProductDetailPage
          slug={
            pathname
              .split('/')
              .filter(Boolean)
              .slice(1)
              .join('/') || ''
          }
        />
      )}


      {/* =================================================
          ADMIN
      ================================================= */}

      {route === 'admin' && (
        <GuardedArea role="super_admin">
          <AdminRoutePage
            path={pathname}
          />
        </GuardedArea>
      )}


      {/* =================================================
          STAFF
      ================================================= */}

      {/*
      {route === 'staff' && (
        <GuardedArea role="staff">
          <StaffRoutePage
            path={pathname}
          />
        </GuardedArea>
      )}
      */}


      {/* =================================================
          LOGIN
      ================================================= */}

      {route === 'auth-login' && (
        <AuthPage
          initialMode="login"
        />
      )}


      {/* =================================================
          REGISTER
      ================================================= */}

      {route === 'auth-register' && (
        <AuthPage
          initialMode="register"
        />
      )}


      {/* =================================================
          FORGOT PASSWORD
      ================================================= */}

      {route === 'auth-forgot' && (
        <AuthPage
          initialMode="forgot"
        />
      )}


      {/* =================================================
          HOME
      ================================================= */}

      {route === 'home' && (
        <HomePage />
      )}


      {/* =================================================
          PRIVACY POLICY
      ================================================= */}

      {route === 'privacy-policy' && (
        <PrivacyPolicyPage />
      )}


      {/* =================================================
          ORDER WARRANTY
      ================================================= */}

      {route === 'order-warranty' && (
        <OrderWarrantyPage />
      )}


      {/* =================================================
          SHIPPING POLICY
      ================================================= */}

      {route === 'shipping-policy' && (
        <ShippingPolicyPage />
      )}


      {/* =================================================
          PAYMENT POLICY
      ================================================= */}

      {route === 'payment-policy' && (
        <PaymentPolicyPage />
      )}

    </>
  );


  return (
    <>
      {page}

      {route !== 'admin' &&
        route !== 'staff' && (
          <FloatingContactButton />
        )}
    </>
  );
}