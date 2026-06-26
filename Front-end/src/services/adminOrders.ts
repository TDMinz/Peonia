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

export type AdminOrderItem = {
  id: string;
  order_code: string;
  buyer_name: string;
  buyer_phone?: string;
  recipient_name: string;
  recipient_phone?: string;
  recipient_address: string;
  delivery_date?: string;
  delivery_time_slot?: string;
  card_message?: string;
  subtotal_price: number;
  deposit_amount: number;
  paid_amount: number;
  remaining_amount: number;
  total_price: number;
  payment_status: string;
  status: string;
  items?: Array<{
    id: string;
    variant?: { _id?: string; variant_name?: string; price?: number; sku?: string } | string;
    quantity: number;
    price: number;
  }>;
  created_at?: string;
};

export const adminOrdersApi = {
  list: () => request<{ orders: AdminOrderItem[] }>('/api/orders'),
  detail: (code: string) => request<{ order: AdminOrderItem }>(`/api/orders/${code}`),
  updateStatus: (code: string, payload: { status?: string; payment_status?: string }) =>
    request(`/api/orders/${code}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  remove: (code: string) => request(`/api/orders/${code}`, { method: 'DELETE' }),
};
