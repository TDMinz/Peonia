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

export type AdminCategory = { id: string; name: string; slug: string; type: string; created_at?: string };
export type AdminProduct = { id: string; name: string; slug: string; description?: string; is_addon?: boolean; image_url?: string; created_at?: string };
export type AdminVariant = { id: string; product_id: string; variant_name: string; price: number; sku?: string; created_at?: string };
export type AdminWorkshop = { id: string; title: string; description?: string; event_date: string; max_slots: number; available_slots: number; price: number; image_url?: string; created_at?: string };
export type AdminBooking = { id: string; booking_code: string; customer_name: string; customer_phone: string; seats_booked: number; total_price: number; deposit_amount: number; paid_amount: number; remaining_amount: number; payment_status: string; bill_url?: string; bill_status?: string; status: string; created_at?: string };
export type AdminOrder = { id: string; order_code: string; buyer_name: string; recipient_name: string; recipient_address: string; total_price: number; payment_status: string; status: string; created_at?: string };

export const adminApi = {
  categories: () => request<{ data: AdminCategory[] }>('/api/admin/categories?limit=50'),
  products: () => request<{ data: AdminProduct[] }>('/api/admin/products?limit=50'),
  variants: () => request<{ data: AdminVariant[] }>('/api/admin/variants?limit=50'),
  workshops: () => request<{ data: AdminWorkshop[] }>('/api/admin/workshops?limit=50'),
  bookings: () => request<{ bookings: AdminBooking[] }>('/api/bookings'),
  orders: () => request<{ orders: AdminOrder[] }>('/api/orders'),
};
