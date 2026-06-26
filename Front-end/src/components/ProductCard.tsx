import { Eye, ShoppingCart } from 'lucide-react';
import { addToCart } from '../services/cart';
import { useRef } from "react";
import { flyToCart } from "../utils/flyToCart";

type ProductCardProps = {
  id: number;
  slug?: string;
  name: string;
  price: string;
  image: string;
  originalPrice?: string;
  tag?: string;
  variant?: 'default' | 'hot' | 'bestseller';
};

export default function ProductCard({ id, slug, name, price, image, originalPrice, tag }: ProductCardProps) {
  const priceClass = 'font-semibold text-primary';
  const detailHref = slug ? `/san-pham/${slug}` : `/san-pham/${id}`;
  const imageRef = useRef<HTMLImageElement>(null);

  return (
    <div className="group" data-product-id={id}>
      <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-muted">
        <img ref={imageRef} src={image} alt={name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />

        {tag && (
          <div className="absolute left-4 top-4 z-20">
            <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold uppercase text-white shadow-sm">{tag}</span>
          </div>
        )}

        <div className="absolute inset-0 z-10 bg-black/0 transition-all duration-300 group-hover:bg-black/20" />

        <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 translate-y-3">
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-black/85 px-4 py-3 text-white shadow-lg backdrop-blur-md">
            
          <button
  type="button"
  onClick={() => window.location.href = detailHref}
  className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-md cursor-pointer"
>
  <Eye size={18} className="shrink-0" />
  <span className="text-sm font-medium whitespace-nowrap">
    Xem nhanh
  </span>
</button>
            
            <div className="h-6 w-px bg-white/20" />
            <button
              type="button"
             onClick={() => {
    addToCart({
        id: String(id),
        name,
        price,
        image,
    });

    if (imageRef.current) {
        const cart =
            document.getElementById("cart-icon");

        if (cart) {
            flyToCart(imageRef.current, cart);
        }
    }
}}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 cursor-pointer"
            >
              <ShoppingCart size={18} className="shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap">
                Thêm vào giỏ
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-light leading-snug text-foreground line-clamp-2">{name}</h3>
        <div className="flex items-center gap-2">
          <p className={priceClass}>{price}</p>
          {originalPrice && <p className="text-sm text-muted-foreground line-through">{originalPrice}</p>}
        </div>
      </div>
    </div>
  );
}
