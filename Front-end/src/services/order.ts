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
  const data = raw && contentType.includes('application/json') ? JSON.parse(raw) : raw ? { message: raw } : null;

  if (!response.ok) throw new Error(data?.message || 'Request failed');
  return data as T;
}

export const orderApi = {
  createOrder: (payload: any) =>
    request('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
};
