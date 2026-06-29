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

export type AdminProductItem = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_addon?: boolean;

  image_url?: string;
  images?: string[];      // thêm dòng này
  price?: number;
  sale_price?: number;
  category_ids?: string[];
  created_at?: string;
  is_featured?: boolean;
  is_best_seller?: boolean;
};


export type AdminCategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export const adminProductsApi = {
  list: () => request<{ data: AdminProductItem[] }>('/api/admin/products?limit=100'),
  create: (formData: FormData) => request<{ data: AdminProductItem }>('/api/admin/products', { method: 'POST', body: formData }),
  update: (id: string, formData: FormData) => request<{ data: AdminProductItem }>(`/api/admin/products/${id}`, { method: 'PATCH', body: formData }),
  remove: (id: string) => request<{ message: string }>(`/api/admin/products/${id}`, { method: 'DELETE' }),
  categories: () => request<{ data: AdminCategoryOption[] }>('/api/admin/categories?limit=100'),
};
