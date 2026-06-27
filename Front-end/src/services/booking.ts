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

export const bookingApi = {
  createBooking: (payload: { workshop_id: string; customer_name: string; customer_phone: string; seats_booked: number }) =>
    request<{
      booking: CustomerWorkshopBooking;
      booking_code: string;
    }>('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  uploadBill: (code: string, file: File) => {
    const formData = new FormData();
    formData.append('bill', file);
    return request<{ message: string }>(`/api/bookings/${code}/bill`, { method: 'POST', body: formData });
  },
  reviewBill: (code: string, action: 'approve' | 'reject') =>
    request<{ message: string }>(`/api/bookings/${code}/bill/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    }),
  getBookings: () => request('/api/bookings'),
  getMyBookings: () =>
    request<{ bookings: CustomerWorkshopBooking[] }>(
      '/api/bookings/my-bookings'
    ),
};

export type CustomerWorkshopBooking = {
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
  status: string;
  created_at?: string;
  workshop?: {
    title?: string;
    event_date?: string;
    price?: number;
  };
};

