import { Filter } from 'lucide-react';
import type { CategoryDto } from '../services/api';
import ProductCard from './ProductCard';
import CategorySidebar from './CategorySidebar';
import { useMemo, useState } from 'react';


type CategoryPageProps = {
  categoryName: string;
  title: string;
  description: string;
  bannerImage: string;
  breadcrumbRoot: string;
  categories: CategoryDto[];
  products: Array<{
    id: string;
    slug?: string;
    name: string;
    price: string;
    image: string;
    originalPrice?: string;
    tag?: string;
  }>;
};


export default function CategoryPage({
  categoryName,
  breadcrumbRoot,
  products,
  categories,
}: CategoryPageProps) {
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const childCategories = categories
    .filter((item) => item.parentId)
    .map((item) => {
      const parent = categories.find(
        (c) => c.id === item.parentId
      );

      return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        parentSlug: parent?.slug || '',
      };
    });
  const sortedProducts = useMemo(() => {
    const list = [...products];

    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => {
          const priceA = Number(
            a.price.replace(/[^\d]/g, '')
          );

          const priceB = Number(
            b.price.replace(/[^\d]/g, '')
          );

          return priceA - priceB;
        });

      case 'price-desc':
        return list.sort((a, b) => {
          const priceA = Number(
            a.price.replace(/[^\d]/g, '')
          );

          const priceB = Number(
            b.price.replace(/[^\d]/g, '')
          );

          return priceB - priceA;
        });

      case 'best-seller':
        return list.sort((a, b) => {
          if (a.tag === 'BEST') return -1;
          if (b.tag === 'BEST') return 1;
          return 0;
        });

      default:
        return list;
    }
  }, [products, sortBy]);
  return (
    <main className="min-h-screen bg-[#f3ece3]">
      <section className="border-b border-[#e6ddd3] bg-[#fbf7f1]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="text-xs uppercase tracking-[0.28em] text-[#8f877d]">Trang chủ &gt; {breadcrumbRoot} &gt; {categoryName}</nav>
        </div>
      </section>



      <section className="bg-[#f3ece3] py-12 lg:py-16">
        <div className="w-full px-8">


          <div className="grid items-start gap-8 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]">
            {/* Sidebar */}
            <aside>
              <CategorySidebar
                categories={childCategories}
                activeSlug={window.location.pathname.split('/').pop()}
              />
            </aside>

            {/* Content */}
            <div>
              <div className="mb-8 flex items-center justify-end">

                <div className="relative ml-auto">
                  <button
                    type="button"
                    onClick={() => setShowSort((v) => !v)}
                    className="
                                      flex items-center gap-2
                                      rounded-full
                                      border border-[#e8edf3]
                                      bg-white
                                      px-5 py-3
                                      text-sm
                                      font-medium
                                      text-foreground
                                      shadow-sm
                                      transition-all
                                      hover:border-emerald-900
                                      hover:shadow-md
                                    "
                  >
                    <Filter className="h-4 w-4" />

                    {{
                      newest: 'Mới nhất',
                      'price-asc': 'Giá thấp đến cao',
                      'price-desc': 'Giá cao đến thấp',
                      'best-seller': 'Bán chạy nhất',
                    }[sortBy]}

                    <svg
                      className={`h-4 w-4 transition-transform ${showSort ? 'rotate-180' : ''
                        }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {showSort && (
                    <div
                                            className="
                              absolute
                              right-0
                              top-full
                              z-20
                              mt-2
                              w-60
                              overflow-hidden
                              rounded-2xl
                              border border-[#e8edf3]
                              bg-white
                              shadow-xl
                            "
                    >
                      {[
                        {
                          value: 'newest',
                          label: 'Mới nhất',
                        },
                        {
                          value: 'price-asc',
                          label: 'Giá thấp đến cao',
                        },
                        {
                          value: 'price-desc',
                          label: 'Giá cao đến thấp',
                        },
                        {
                          value: 'best-seller',
                          label: 'Bán chạy nhất',
                        },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSort(false);
                          }}
                                          className={`
                            flex w-full items-center justify-between
                            px-5 py-3
                            text-left text-sm
                            transition
                            hover:bg-[#f8fafc]
                            ${sortBy === option.value
                                              ? 'bg-[#f6f7fb] font-medium text-emerald-900'
                                              : ''
                                            }
                          `}
                                        >
                          {option.label}

                          {sortBy === option.value && (
                            <span>✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {products.length === 0 ? (
                <div className="rounded-[2rem] border border-dashed border-[#d7c8b9] bg-white/70 p-10 text-center text-[#6f665d]">
                  Chưa có sản phẩm trong danh mục này.
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      slug={product.slug}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      originalPrice={product.originalPrice}
                      tag={product.tag}
                      variant="default"
                    />
                  ))}
                </div>
              )}
              </div>
          </div>
        </div>
      </section>
    </main>
  );
}
