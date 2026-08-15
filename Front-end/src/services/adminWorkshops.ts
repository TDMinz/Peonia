import { API_BASE_URL } from './api';

function getAuthToken() {
  return localStorage.getItem('peonia_token') || '';
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || 'Request failed'
    );
  }

  return data;
}
export type AdminWorkshopItem = {
  id: string;
  title: string;
  price: number;

  age_range?: string;
  difficulty?: number;
  duration?: string;

  short_description?: string;
  description?: string;

  image_url?: string;
  images?: string[];
event_date?: string;
max_slots?: number;
available_slots?: number;
remaining_slots?: number;
booked_slots?: number;
  created_at?: string;
};

export const adminWorkshopsApi = {
  // =========================
  // LẤY DANH SÁCH WORKSHOP
  // =========================
 list: () =>
  request<{ data: AdminWorkshopItem[] }>(
    '/api/admin/workshops?limit=100'
  ),

  // =========================
  // TẠO WORKSHOP
  // =========================
  create: (formData: FormData) =>
    request<{ workshop: AdminWorkshopItem }>(
      '/api/admin/workshops',
      {
        method: 'POST',
        body: formData,
      }
    ),

  // =========================
  // CẬP NHẬT WORKSHOP
  // =========================
  update: (
    id: string,
    formData: FormData
  ) =>
    request<{ workshop: AdminWorkshopItem }>(
      `/api/admin/workshops/${id}`,
      {
        method: 'PATCH',
        body: formData,
      }
    ),

  // =========================
  // XÓA WORKSHOP
  // =========================
  remove: (id: string) =>
    request<{ message: string }>(
      `/api/admin/workshops/${id}`,
      {
        method: 'DELETE',
      }
    ),

  // =========================
  // BOOKING WORKSHOP
  // =========================

  // =========================
  // CẬP NHẬT TRẠNG THÁI BOOKING
  // =========================
  
};