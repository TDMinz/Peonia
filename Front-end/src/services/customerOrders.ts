import { API_BASE_URL } from './api';


function getAuthToken() {
  const token = localStorage.getItem('peonia_token') || '';

  console.log('TOKEN =', token);

  return token;
}
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  const data = (await response.json()) as T;

  if (!response.ok) {
    const error = data as { message?: string };
    throw new Error(error.message || "Request failed");
  }

  return data;
}

export type CustomerOrderItem = {
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
  created_at?: string;
  items?: Array<{
    id: string;
    quantity: number;
    price: number;

    product_name?: string;
    image_url?: string;
    product_id?: string;

    variant?: {
        variant_name?: string;
        sku?: string;
        product_id?: string | {
            name?: string;
        };
    };
}>;
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
  workshop?: {
    title?: string;
    event_date?: string;
  };
};

export const customerOrdersApi = {
  list: (
    page = 1,
    limit = 3
  ) =>
    request<{
      orders: CustomerOrderItem[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(
      `/api/orders?page=${page}&limit=${limit}`
    ),
  detail: (code: string) => request<{ order: CustomerOrderItem }>(`/api/orders/${code}`),
  getMyBookings: () =>
    request<{ bookings: CustomerWorkshopBooking[] }>('/api/bookings/my-bookings')
};
