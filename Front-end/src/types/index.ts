export type Banner = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  href?: string;
};

export type Category = {
  id?: string;
  name: string;
  slug?: string;
  image?: string;
  image_url?: string;
};

export type Product = {
  id: string;
  name: string;
  slug?: string;
  price?: number;
  image?: string;
  image_url?: string;
  hover_image?: string;
  hover_image_url?: string;
  category?: string;
};
