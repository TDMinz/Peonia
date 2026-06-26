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

export type AdminCategoryItem = {
  id: string;
  name: string;
  slug: string;
  type?: string;
  description?: string;
  parentId?: string | null;
  image_url?: string;
  icon?: string;
  order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export const adminCategoriesApi = {
  list: () => request<{ data: AdminCategoryItem[] }>('/api/admin/categories?limit=100'),
  create: (payload: Partial<AdminCategoryItem>) =>
    request('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: Partial<AdminCategoryItem>) =>
    request(`/api/admin/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  remove: (id: string) =>
    request(`/api/admin/categories/${id}`, {
      method: 'DELETE',
    }),
};
