import AdminDashboardPage from './AdminDashboardPage';
import AdminCategoriesPage from './AdminCategoriesPage';
import AdminProductsPage from './AdminProductsPage';
import AdminWorkshopsPage from './AdminWorkshopsPage';
import AdminEventsPage from './AdminEventsPage';
import AdminBookingsPage from './AdminBookingsPage';
import AdminOrdersPage from './AdminOrdersPage';
import AdminUsersPage from './AdminUsersPage';
import AdminWorkshopBookingsPage from './AdminWorkshopBookingsPage';

export function isAdminPath(path: string) {
  return path === '/admin' || path.startsWith('/admin/');
}

type Props = { path: string };

export default function AdminRoutePage({ path }: Props) {
  if (path === '/admin/categories') return <AdminCategoriesPage />;
  if (path === '/admin/products') return <AdminProductsPage />;
  if (path === '/admin/workshops') return <AdminWorkshopsPage />;
  if (path === '/admin/events') return <AdminEventsPage />;
  if (path === '/admin/bookings') return <AdminBookingsPage />;
  if (path === '/admin/workshop-bookings') return <AdminWorkshopBookingsPage />;
  if (path === '/admin/orders') return <AdminOrdersPage />;
  if (path === '/admin/users') return <AdminUsersPage />;
  return <AdminDashboardPage />;
}
