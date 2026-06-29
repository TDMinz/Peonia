import { lazy, Suspense } from 'react';

const AdminDashboardPage = lazy(() => import('./AdminDashboardPage'));
const AdminCategoriesPage = lazy(() => import('./AdminCategoriesPage'));
const AdminProductsPage = lazy(() => import('./AdminProductsPage'));
const AdminWorkshopsPage = lazy(() => import('./AdminWorkshopsPage'));
const AdminEventsPage = lazy(() => import('./AdminEventsPage'));
const AdminBookingsPage = lazy(() => import('./AdminBookingsPage'));
const AdminOrdersPage = lazy(() => import('./AdminOrdersPage'));
const AdminUsersPage = lazy(() => import('./AdminUsersPage'));
const AdminWorkshopBookingsPage = lazy(
  () => import('./AdminWorkshopBookingsPage')
);

export function isAdminPath(path: string) {
  return path === '/admin' || path.startsWith('/admin/');
}

type Props = {
  path: string;
};

export default function AdminRoutePage({ path }: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#d8e1ea] border-t-emerald-950" />
            <p className="text-sm text-slate-500">
              Đang tải trang quản trị...
            </p>
          </div>
        </div>
      }
    >
      {path === '/admin/categories' && <AdminCategoriesPage />}
      {path === '/admin/products' && <AdminProductsPage />}
      {path === '/admin/workshops' && <AdminWorkshopsPage />}
      {path === '/admin/events' && <AdminEventsPage />}
      {path === '/admin/bookings' && <AdminBookingsPage />}
      {path === '/admin/workshop-bookings' && (
        <AdminWorkshopBookingsPage />
      )}
      {path === '/admin/orders' && <AdminOrdersPage />}
      {path === '/admin/users' && <AdminUsersPage />}

      {![
        '/admin/categories',
        '/admin/products',
        '/admin/workshops',
        '/admin/events',
        '/admin/bookings',
        '/admin/workshop-bookings',
        '/admin/orders',
        '/admin/users',
      ].includes(path) && <AdminDashboardPage />}
    </Suspense>
  );
}