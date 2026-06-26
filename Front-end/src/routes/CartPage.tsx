import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { clearCart, getCartItems, removeFromCart, updateCartQuantity, type CartItem } from '../services/cart';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(getCartItems());

  useEffect(() => {
    const sync = () => setItems(getCartItems());
    window.addEventListener('peonia-cart-updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('peonia-cart-updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const priceNumber = Number(String(item.price).replace(/[^0-9]/g, '')) || 0;
        return sum + priceNumber * item.quantity;
      }, 0),
    [items]
  );

  return (
    <>
      <Header cartCount={items.reduce((sum, item) => sum + item.quantity, 0)} />
      <main className="bg-[#fbf7f1] py-12">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#8f877d]">Giỏ hàng</p>
              <h1 className="mt-2 font-serif text-4xl font-light text-foreground">Sản phẩm đã chọn</h1>
            </div>
            {items.length > 0 ? (
              <button onClick={clearCart} className="rounded-full border border-[#e6ddd3] bg-white px-5 py-3 text-sm text-foreground transition hover:bg-[#fbf7f1]">
                Xóa tất cả
              </button>
            ) : null}
          </div>

          {items.length === 0 ? (
            <div className="rounded-[2rem] border border-[#e6ddd3] bg-white px-6 py-20 text-center shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
              <ShoppingBag className="mx-auto h-12 w-12 text-[#8f877d]" />
              <h2 className="mt-4 font-serif text-3xl font-light text-foreground">Giỏ hàng đang trống</h2>
              <p className="mt-3 text-sm text-[#6f665d]">Hãy thêm những bó hoa bạn yêu thích vào giỏ để bắt đầu đặt hàng.</p>
              <a href="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-900">
                Tiếp tục mua sắm <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col gap-4 rounded-[1.75rem] border border-[#e6ddd3] bg-white p-4 shadow-[0_10px_25px_rgba(0,0,0,0.04)] sm:flex-row sm:items-center">
                    <img src={item.image} alt={item.name} className="h-28 w-28 rounded-[1.25rem] object-cover" />
                    <div className="flex-1">
                      <h3 className="font-serif text-2xl font-light text-foreground">{item.name}</h3>
                      <p className="mt-2 text-sm text-[#6f665d]">{item.price}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="rounded-full border border-[#e6ddd3] bg-[#fbf7f1] p-2 text-foreground transition hover:bg-white">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="rounded-full border border-[#e6ddd3] bg-[#fbf7f1] p-2 text-foreground transition hover:bg-white">
                        <Plus className="h-4 w-4" />
                      </button>
                      <button onClick={() => removeFromCart(item.id)} className="ml-2 rounded-full border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="h-fit rounded-[1.75rem] border border-[#e6ddd3] bg-white p-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)]">
                <p className="text-xs uppercase tracking-[0.35em] text-[#8f877d]">Tổng đơn hàng</p>
                <div className="mt-4 space-y-3 border-y border-[#eee4d8] py-4 text-sm text-[#6f665d]">
                  <div className="flex items-center justify-between"><span>Tạm tính</span><span className="font-medium text-foreground">{formatCurrency(subtotal)}</span></div>
                  <div className="flex items-center justify-between"><span>Phí giao hàng</span><span className="font-medium text-foreground">Liên hệ</span></div>
                </div>
                <div className="mt-4 flex items-center justify-between text-lg font-semibold text-foreground"><span>Thành tiền</span><span>{formatCurrency(subtotal)}</span></div>
                <a href="/checkout" className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-950 px-5 py-4 text-sm font-medium text-white transition hover:bg-emerald-900">
                  Thanh toán <ArrowRight className="h-4 w-4" />
                </a>
              </aside>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
