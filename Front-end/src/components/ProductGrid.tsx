// import type { Product } from '../types';
// import ProductCard from './ProductCard';

// type Props = {
//   title: string;
//   products: Product[];
// };

// export function ProductGrid({ title, products }: Props) {
//   return (
//     <section className="mx-auto max-w-[1400px] px-4 py-10 lg:px-8">
//       <div className="mb-6 flex items-end justify-between border-b border-[#e6ddd3] pb-4">
//         <h2 className="font-serif text-3xl md:text-4xl">{title}</h2>
//         <a href="#" className="text-xs uppercase tracking-[0.3em] text-[#8f877d]">Xem thêm</a>
//       </div>
//       <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
//         {products.map((product) => (
//           <ProductCard
//             key={product.id}
//             id={product.id}
//             name={product.name}
//             price={typeof product.price === 'number' ? new Intl.NumberFormat('vi-VN').format(product.price) + ' ₫' : String(product.price ?? 'Liên hệ')}
//             image={product.image || product.image_url || ''}
//             originalPrice={product.original_price ? new Intl.NumberFormat('vi-VN').format(product.original_price) + ' ₫' : undefined}
//             tag={product.tag}
//             variant="default"
//           />
//         ))}
//       </div>
//     </section>
//   );
// }
