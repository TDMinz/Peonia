const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

export type CategoryDto = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  image_url?: string;
  icon?: string;
  order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type WorkshopDto = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  max_slots: number;
  available_slots: number;
  remaining_slots: number;
  booked_slots: number;
  price: number;
  image_url: string;
  created_at: string;
};

export type ProductDto = {
  id: string;
  name: string;
  slug: string;
  categoryId?: string | null;
  category_ids?: string[];
  description?: string;
  price?: number;
  sale_price?: number;
  images?: string[];
  image_url?: string;
  is_featured?: boolean;
  is_best_seller?: boolean;
  is_active?: boolean;
  is_addon?: boolean;
  created_at?: string;
};

export const api = {
  categories: (params?: { parentSlug?: string; parentId?: string | null; is_active?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.parentSlug) searchParams.set('parentSlug', params.parentSlug);
    if (params?.parentId !== undefined && params?.parentId !== null) searchParams.set('parentId', params.parentId);
    if (typeof params?.is_active === 'boolean') searchParams.set('is_active', String(params.is_active));
    const query = searchParams.toString();
    return request<{ categories: CategoryDto[] }>(`/api/categories${query ? `?${query}` : ''}`);
  },
  workshops: () => request<{ workshops: WorkshopDto[] }>('/api/workshops'),
  products: (params?: { categoryId?: string; is_featured?: boolean; is_best_seller?: boolean; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.categoryId) searchParams.set('categoryId', params.categoryId);
    if (typeof params?.is_featured === 'boolean') searchParams.set('is_featured', String(params.is_featured));
    if (typeof params?.is_best_seller === 'boolean') searchParams.set('is_best_seller', String(params.is_best_seller));
    if (params?.search) searchParams.set('search', params.search);
    const query = searchParams.toString();
    return request<{ products: ProductDto[] }>(`/api/products${query ? `?${query}` : ''}`);
  },
  addons: () => request<any>('/api/addons'),
};

export { API_BASE_URL };
