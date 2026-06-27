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

  const data = (await response.json()) as T;

if (!response.ok) {
  const error = data as { message?: string };
  throw new Error(error.message || 'Request failed');
}

return data;
}

export type AdminBookingItem = {
  id: string;
  booking_code: string;
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
  workshop?: { title?: string; event_date?: string; price?: number };
  user?: { username?: string; full_name?: string; role?: string };
  created_at?: string;
};

export const adminBookingsApi = {
  list: () => request<{ bookings: AdminBookingItem[] }>('/api/bookings'),
  create: (payload: { workshop_id: string; customer_name: string; customer_phone: string; seats_booked: number }) =>
    request<{ data: AdminBookingItem }>('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  updateStatus: (code: string, payload: { status?: string; payment_status?: string }) =>
    request<{ data: AdminBookingItem }>(`/api/bookings/${code}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  reviewBill: (code: string, action: 'approve' | 'reject') =>
    request<{ message: string }>(`/api/bookings/${code}/bill/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    }),
  remove: (code: string) => request<{ message: string }>(`/api/bookings/${code}`, { method: 'DELETE' }),
};
