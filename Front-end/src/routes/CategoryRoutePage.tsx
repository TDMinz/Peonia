import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryPage from '../components/CategoryPage';
import { categoryCatalog } from '../data/categoryCatalog';
import {
  api,
  type ProductDto,
  type CategoryDto,
} from '../services/api';

export default function CategoryRoutePage({ slug }: { slug: string }) {
  const config = categoryCatalog[slug];
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [categories, setCategories] =
  useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
  
    async function loadProducts() {
      if (!config) return;
  
      setLoading(true);
  
      try {
        const [productData, categoryData] =
          await Promise.all([
            api.products(),
            api.categories(),
          ]);
  
        if (!mounted) return;
  
        setProducts(productData.products || []);
        setCategories(
          categoryData.categories || []
        );
      } catch {
        if (mounted) {
          setProducts([]);
          setCategories([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
  
    loadProducts();
  
    return () => {
      mounted = false;
    };
  }, [config]);
  const normalizedProducts = useMemo(() => {
    if (!config) return [];

    const matched = products.filter((product) => {
      const ids = [product.categoryId, ...(product.category_ids || [])].filter(Boolean).map(String);
      return ids.some((id) => config.categoryIds.includes(id));
    });

    return matched.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.sale_price && product.sale_price > 0 ? `${product.sale_price.toLocaleString('vi-VN')}đ` : `${(product.price || 0).toLocaleString('vi-VN')}đ`,
      originalPrice: product.sale_price && product.sale_price > 0 && product.price && product.sale_price < product.price ? `${product.price.toLocaleString('vi-VN')}đ` : undefined,
      image: product.image_url || product.images?.[0] || '',
      tag: product.is_featured ? 'HOT' : product.is_best_seller ? 'BEST' : undefined,
    }));
  }, [products, config]);

  if (!config) {
    return (
      <>
        <Header cartCount={0} />
        <main className="bg-[#fbf7f1] px-4 py-20 text-center">
          <h1 className="font-serif text-4xl text-foreground">Không tìm thấy danh mục</h1>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header cartCount={0} />
      <CategoryPage
  categoryName={config.title}
  breadcrumbRoot={config.breadcrumbRoot}
  title={config.title}
  description={config.description}
  bannerImage={config.bannerImage}
  products={loading ? [] : normalizedProducts}
  categories={categories}
/>
      <Footer />
    </>
  );
}
