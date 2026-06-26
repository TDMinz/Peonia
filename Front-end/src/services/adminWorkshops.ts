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

  const data = await response.json();
  if (!response.ok) throw new Error(data?.message || 'Request failed');
  return data;
}

export type AdminWorkshopItem = {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  max_slots: number;
  available_slots: number;
  price: number;
  image_url?: string;
  created_at?: string;
};

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

export const adminWorkshopsApi = {
  list: () => request<{ data: AdminWorkshopItem[] }>('/api/admin/workshops?limit=100'),
  create: (formData: FormData) => request('/api/admin/workshops', { method: 'POST', body: formData }),
  update: (id: string, formData: FormData) => request(`/api/admin/workshops/${id}`, { method: 'PATCH', body: formData }),
  remove: (id: string) => request(`/api/admin/workshops/${id}`, { method: 'DELETE' }),
  workshopBookings: () => request<{ data: WorkshopBookingItem[] }>('/api/admin/workshop-bookings'),
  updateWorkshopBookingStatus: (code: string, status: string) =>
    request(`/api/admin/workshop-bookings/${code}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }),
};
