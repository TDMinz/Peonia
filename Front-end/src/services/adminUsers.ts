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

export type AdminUserItem = {
  id: string;
  username: string;
  full_name: string;
  role: 'super_admin' | 'staff' | 'customer';
  is_active: boolean;
  created_at?: string;
};

export const adminUsersApi = {
  list: () => request<{ data: AdminUserItem[] }>('/api/admin/users?limit=100'),
  update: (
    id: string,
    payload: {
        full_name: string;
        role: AdminUserItem["role"];
        is_active: boolean;
    }
) =>
request<{
    user: AdminUserItem;
}>(
    `/api/admin/users/${id}`,
    {
        method: "PATCH",
        body: JSON.stringify(payload),
    }
),
};
