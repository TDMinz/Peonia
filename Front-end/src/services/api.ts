const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
// ===== Cache =====
let productsCache: ProductDto[] | null = null;
let productsCacheTime = 0;

const categoriesCache = new Map<
  string,
  {
    data: CategoryDto[];
    time: number;
  }
>();

const CACHE_TIME = 5 * 60 * 1000; // 5 phút

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      ...options,
    }
  );

  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status}`
    );
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
  price: number;
  image_url: string;
  images?: string[];

  // thêm các field này
  age_range?: string;
  difficulty?: number; // 1-5
  duration?: string; // ví dụ: "60 phút"
  short_description?: string;
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
  categories: async (params?: {
    parentSlug?: string;
    parentId?: string | null;
    is_active?: boolean;
  }) => {

    const key = JSON.stringify(params || {});

    const cache = categoriesCache.get(key);

    if (cache && Date.now() - cache.time < CACHE_TIME) {
      return {
        categories: cache.data,
      };
    }

    const searchParams = new URLSearchParams();

    if (params?.parentSlug)
      searchParams.set("parentSlug", params.parentSlug);

    if (
      params?.parentId !== undefined &&
      params.parentId !== null
    ) {
      searchParams.set("parentId", params.parentId);
    }

    if (typeof params?.is_active === "boolean") {
      searchParams.set(
        "is_active",
        String(params.is_active)
      );
    }

    const query = searchParams.toString();

    const data = await request<{
      categories: CategoryDto[];
    }>(
      `/api/categories${query ? `?${query}` : ""}`
    );

    categoriesCache.set(key, {
      data: data.categories,
      time: Date.now(),
    });

    return data;
  },
  workshops: () => request<{ workshops: WorkshopDto[] }>('/api/workshops'),
  createWorkshop: (payload: {
    title: string;
    price: number;
    age_range?: string;
    difficulty?: number;
    duration?: string;
    short_description?: string;
    description?: string;
    image_url?: string;
    images?: string[];
  }) =>
    request<{ workshop: WorkshopDto }>(
      '/api/workshops',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),

  updateWorkshop: (
    id: string,
    payload: Partial<{
      title: string;
      price: number;
      age_range: string;
      difficulty: number;
      duration: string;
      short_description: string;
      description: string;
      image_url: string;
      images: string[];
    }>
  ) =>
    request<{ workshop: WorkshopDto }>(
      `/api/workshops/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    ),

  deleteWorkshop: (id: string) =>
    request<{ message: string }>(
      `/api/workshops/${id}`,
      {
        method: 'DELETE',
      }
    ),

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(
      `${API_BASE_URL}/api/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload thất bại');
    }

    return response.json();
  },
  products: async (params?: {
    categoryId?: string;
    is_featured?: boolean;
    is_best_seller?: boolean;
    search?: string;
  }) => {

    const canUseCache =
      !params ||
      Object.keys(params).length === 0;

    if (
      canUseCache &&
      productsCache &&
      Date.now() - productsCacheTime <
      CACHE_TIME
    ) {
      return {
        products: productsCache,
      };
    }

    const searchParams = new URLSearchParams();

    if (params?.categoryId)
      searchParams.set(
        "categoryId",
        params.categoryId
      );

    if (
      typeof params?.is_featured === "boolean"
    ) {
      searchParams.set(
        "is_featured",
        String(params.is_featured)
      );
    }

    if (
      typeof params?.is_best_seller === "boolean"
    ) {
      searchParams.set(
        "is_best_seller",
        String(params.is_best_seller)
      );
    }

    if (params?.search) {
      searchParams.set(
        "search",
        params.search
      );
    }

    const query = searchParams.toString();

    const data = await request<{
      products: ProductDto[];
    }>(
      `/api/products${query ? `?${query}` : ""}`
    );

    if (canUseCache) {
      productsCache = data.products;
      productsCacheTime = Date.now();
    }

    return data;
  },
    productBySlug: (slug: string) =>
    request<{
      product: ProductDto;
      variants: any[];
      categories: CategoryDto[];
    }>(
      `/api/products/${encodeURIComponent(slug)}`
    ),
    
  addons: () => request<any>('/api/addons'),
  clearCache() {
    productsCache = null;
    productsCacheTime = 0;

    categoriesCache.clear();
  },
};

export { API_BASE_URL };
