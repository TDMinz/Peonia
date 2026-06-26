import StaffDashboardPage from './StaffDashboardPage';
import StaffWorkshopBookingsPage from './StaffWorkshopBookingsPage';
import StaffShopOrdersPage from './StaffShopOrdersPage';
import StaffWorkshopsPage from './StaffWorkshopsPage';

export function isStaffPath(path: string) {
  return path === '/staff' || path.startsWith('/staff/');
}

type Props = { path: string };

export default function StaffRoutePage({ path }: Props) {
  if (path === '/staff/workshops') return <StaffWorkshopsPage />;
  if (path === '/staff/workshop-bookings') return <StaffWorkshopBookingsPage />;
  if (path === '/staff/shop-orders') return <StaffShopOrdersPage />;
  return <StaffDashboardPage />;
}
