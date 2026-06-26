import { API_BASE_URL } from './api';

function getAuthToken() {
  return localStorage.getItem('peonia_token') || '';
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.message || 'Request failed');
  return data;
}

export type StaffDashboardStats = {
  summary: {
    orders: { total: number; pending: number; confirmed: number; cancelled: number };
    bookings: { total: number; pending: number; confirmed: number; cancelled: number };
    revenue: { orders: number; bookings: number; today_orders: number; month_orders: number; total: number };
    counts: { workshops: number; products: number; categories: number };
  };
  workshops: Array<{
    id: string;
    title: string;
    event_date: string;
    max_slots: number;
    available_slots: number;
    booked_slots: number;
    occupancy_rate: number;
    price: number;
  }>;
  activity: { today_orders: number; month_orders: number; today_bookings: number; month_bookings: number };
  top_products: Array<{ _id: string; quantity: number; revenue: number }>;
};

export const dashboardApi = {
  stats: () => request<StaffDashboardStats>('/api/dashboard/stats'),
};
