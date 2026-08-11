import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { api } from '../services/api';

import type {
  ProductDto,
  CategoryDto,
} from '../services/api';

type ProductContextType = {
  products: ProductDto[];
  categories: Record<string, CategoryDto[]>;
  loading: boolean;
  getCategories: (
    parentSlug: string
  ) => Promise<CategoryDto[]>;
};

const ProductContext =
  createContext<ProductContextType | null>(null);

export function ProductProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] =
    useState<Record<string, CategoryDto[]>>({});

  useEffect(() => {
    async function load() {
      try {
        const data = await api.products();

        setProducts(data.products);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const getCategories = async (
    parentSlug: string
  ) => {
    if (categories[parentSlug]) {
      return categories[parentSlug];
    }

    const data = await api.categories({
      parentSlug,
      is_active: true,
    });

    setCategories((prev) => ({
      ...prev,
      [parentSlug]: data.categories,
    }));

    return data.categories;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        getCategories,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error(
      "useProducts must be used inside ProductProvider"
    );
  }

  return context;
}