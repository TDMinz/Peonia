export type Workshop = {
  id: string;
  title?: string;
  description?: string;
  event_date?: string;
  max_slots?: number;
  available_slots?: number;
  price?: number;
  image_url?: string;
  created_at?: string;
};

export type Category = {
  id?: string;
  name?: string;
  slug?: string;
  type?: string;
  image_url?: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;

  description?: string;

  image_url?: string;
  images?: string[];

  price?: number;
  sale_price?: number;

  is_featured?: boolean;
  is_best_seller?: boolean;
  is_addon?: boolean;

  created_at?: string;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  variant_name: string;
  price: number;
  sku?: string;
};
