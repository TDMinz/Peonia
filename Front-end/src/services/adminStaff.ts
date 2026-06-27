import { API_BASE_URL } from './api';

function getAuthToken() {
  return localStorage.getItem('peonia_token') || '';
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const raw = await response.text();
  const data = contentType.includes('application/json') ? JSON.parse(raw) : { message: raw || `Request failed: ${response.status}` };
  if (!response.ok) throw new Error(data?.message || 'Request failed');
  return data;
}

export type WorkshopBookingItem = {
  id: string;
  booking_code: string;
  workshop?: { title?: string; event_date?: string };
  customer_name: string;
  customer_phone: string;
  seats_booked: number;
  total_price: number;
  deposit_amount: number;
  paid_amount: number;
  remaining_amount: number;
  payment_status: string;
  bill_url?: string;
  bill_status?: string;
  status: string;
  created_at?: string;
};

export type ShopOrderItem = {
  id: string;
  order_code: string;
  buyer_name: string;
  recipient_name: string;
  recipient_address: string;
  total_price: number;
  payment_status: string;
  status: string;
  created_at?: string;
};

export const staffAdminApi = {
  workshopBookings: () => request<{ data: WorkshopBookingItem[] }>('/api/admin/workshop-bookings'),
  updateWorkshopBookingStatus: (code: string, status: string) =>
    request(`/api/admin/workshop-bookings/${code}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }),
  deleteWorkshopBooking: (code: string) => request(`/api/admin/workshop-bookings/${code}`, { method: 'DELETE' }),

  shopOrders: () => request<{ data: ShopOrderItem[] }>('/api/admin/shop-orders'),
  shopOrderDetail: (code: string) => request<{ data: ShopOrderItem }>(`/api/admin/shop-orders/${code}`),
  updateShopOrderStatus: (
    code: string,
    status: string
  ) =>
    request<{
      data: ShopOrderItem;
    }>(`/api/admin/shop-orders/${code}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    }),
  deleteShopOrder: (code: string) => request(`/api/admin/shop-orders/${code}`, { method: 'DELETE' }),
};
