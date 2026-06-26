import { ArrowRight, Clock3, MapPin, Phone, UserRound, ShoppingBag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import CheckoutSuccessDialog from '../components/CheckoutSuccessDialog';
import { clearCart, getCartItems, type CartItem } from '../services/cart';
import { orderApi } from '../services/order';
import { fetchProvinces, type VnDistrict, type VnProvince, type VnWard } from '../services/vietnamAddress';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
}

function buildTimeSlots() {
  const slots: string[] = [];
  for (let start = 8; start < 22; start += 2) {
    const end = start + 2;
    const pad = (n: number) => String(n).padStart(2, '0');
    slots.push(`${pad(start)}:00 - ${pad(end)}:00`);
  }
  return slots;
}

function getTodayValue() {
  return new Date().toISOString().split('T')[0];
}

function isValidPhone(value: string) {
  return /^(\+84|0)(3|5|7|8|9)\d{8}$/.test(value.replace(/\s+/g, ''));
}

function getCurrentUserName() {
  const raw = localStorage.getItem('peonia_user');
  if (!raw) return '';
  try {
    const user = JSON.parse(raw);
    return user?.full_name || user?.username || '';
  } catch {
    return '';
  }
}

export default function CheckoutPage() {
  const [items] = useState<CartItem[]>(getCartItems());
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);
  const [successOpen, setSuccessOpen] = useState(false);
  const [provinces, setProvinces] = useState<VnProvince[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [orderCode, setOrderCode] = useState('');
  const timeSlots = useMemo(() => buildTimeSlots(), []);
  const currentUserName = useMemo(() => getCurrentUserName(), []);
  const [form, setForm] = useState({
    buyer_name: currentUserName,
    buyer_phone: '',
    recipient_name: '',
    recipient_phone: '',
    province: '',
    district: '',
    ward: '',
    street_address: '',
    delivery_date: getTodayValue(),
    delivery_time_slot: timeSlots[0] || '08:00 - 10:00',
    card_message: '',
  });

  useEffect(() => {
    let alive = true;
    fetchProvinces()
      .then((data) => {
        if (alive) setProvinces(data || []);
      })
      .catch(() => {
        if (alive) setProvinces([]);
      })
      .finally(() => {
        if (alive) setAddressLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const selectedProvince = useMemo(() => provinces.find((p) => p.name === form.province), [provinces, form.province]);
  const selectedDistrict = useMemo(() => selectedProvince?.districts.find((d) => d.name === form.district), [selectedProvince, form.district]);
  const selectedWard = useMemo(() => selectedDistrict?.wards.find((w) => w.name === form.ward), [selectedDistrict, form.ward]);
  const districtOptions = selectedProvince?.districts || [];
  const wardOptions = selectedDistrict?.wards || [];

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (Number(String(item.price).replace(/[^0-9]/g, '')) || 0) * item.quantity, 0), [items]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const normalizedBuyerPhone = form.buyer_phone.replace(/\s+/g, '');
    const normalizedRecipientPhone = form.recipient_phone.replace(/\s+/g, '');
    const todayValue = getTodayValue();

    if (!form.buyer_name.trim()) {
      setError('Vui lòng đăng nhập để tự lấy tên người mua.');
      setLoading(false);
      return;
    }
    if (!isValidPhone(normalizedBuyerPhone)) {
      setError('Số điện thoại người mua không đúng định dạng.');
      setLoading(false);
      return;
    }
    if (!isValidPhone(normalizedRecipientPhone)) {
      setError('Số điện thoại người nhận không đúng định dạng.');
      setLoading(false);
      return;
    }
    if (form.delivery_date < todayValue) {
      setError('Không thể chọn ngày giao hàng trong quá khứ.');
      setLoading(false);
      return;
    }

    try {
      const recipientAddress = [form.street_address, form.ward, form.district, form.province].filter(Boolean).join(', ');
      const payload = {
        buyer_name: form.buyer_name,
        buyer_phone: normalizedBuyerPhone,
        recipient_name: form.recipient_name,
        recipient_phone: normalizedRecipientPhone,
        recipient_address: recipientAddress,
        delivery_date: form.delivery_date,
        delivery_time_slot: form.delivery_time_slot,
        card_message: form.card_message,
        items: items.map((item) => ({ product_id: item.id, quantity: item.quantity })),
      };
      console.log(
        JSON.stringify(payload, null, 2)
      );
      const data = await orderApi.createOrder(payload);
      setOrderCode(data.order?.order_code || data.order_code || '');
      clearCart();
      setSuccessOpen(true);
    } catch (err) {
      console.error('CREATE ORDER ERROR', err);
      setError(err instanceof Error ? err.message : 'Tạo đơn hàng thất bại');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header cartCount={items.reduce((sum, item) => sum + item.quantity, 0)} />
      <main className="bg-[#fbf7f1] py-12">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8f877d]">Checkout</p>
            <h1 className="mt-2 font-serif text-4xl font-light text-foreground">Thanh toán đơn hàng</h1>
          </div>

          {items.length === 0 ? (
            <div className="rounded-[2rem] border border-[#e6ddd3] bg-white px-6 py-20 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-[#8f877d]" />
              <h2 className="mt-4 font-serif text-3xl font-light text-foreground">Giỏ hàng đang trống</h2>
              <a href="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-950 px-6 py-3 text-sm font-medium text-white">
                Tiếp tục mua sắm <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
              <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] border border-[#e6ddd3] bg-white p-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)]">
                {message ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}{orderCode ? ` - Mã đơn: ${orderCode}` : ''}</div> : null}
                {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-foreground">Họ và tên người mua</span>
                    <div className="flex items-center gap-3 rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3"><UserRound className="h-5 w-5 text-[#8f877d]" />
                    <input
  required
  value={form.buyer_name}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      buyer_name: e.target.value,
    }))
  }
  
  className="w-full bg-transparent outline-none"
/></div>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-foreground">Số điện thoại người mua</span>
                    <div className="flex items-center gap-3 rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3"><Phone className="h-5 w-5 text-[#8f877d]" /><input required value={form.buyer_phone} onChange={(e) => setForm((prev) => ({ ...prev, buyer_phone: e.target.value }))} placeholder="VD: 0912345678 hoặc +84912345678" className="w-full bg-transparent outline-none" /></div>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-foreground">Tên người nhận</span>
                    <div className="flex items-center gap-3 rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3"><UserRound className="h-5 w-5 text-[#8f877d]" /><input required value={form.recipient_name} onChange={(e) => setForm((prev) => ({ ...prev, recipient_name: e.target.value }))} className="w-full bg-transparent outline-none" /></div>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-foreground">Số điện thoại người nhận</span>
                    <div className="flex items-center gap-3 rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3"><Phone className="h-5 w-5 text-[#8f877d]" /><input required value={form.recipient_phone} onChange={(e) => setForm((prev) => ({ ...prev, recipient_phone: e.target.value }))} className="w-full bg-transparent outline-none" /></div>
                  </label>
                </div>

                
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-foreground">Số nhà, tên đường</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3">
                    <MapPin className="h-5 w-5 text-[#8f877d]" />
                    <input required value={form.street_address} onChange={(e) => setForm((prev) => ({ ...prev, street_address: e.target.value }))} className="w-full bg-transparent outline-none" placeholder="Nhập số nhà, tên đường" />
                  </div>
                  {selectedWard ? <p className="mt-2 text-xs text-[#8f877d]">Đã chọn: {form.ward}, {form.district}, {form.province}</p> : null}
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-foreground">Ngày giao</span>
                    <div className="flex items-center gap-3 rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3"><Clock3 className="h-5 w-5 text-[#8f877d]" /><input required min={getTodayValue()} type="date" value={form.delivery_date} onChange={(e) => setForm((prev) => ({ ...prev, delivery_date: e.target.value }))} className="w-full bg-transparent outline-none" /></div>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-foreground">Khung giờ giao</span>
                    <select value={form.delivery_time_slot} onChange={(e) => setForm((prev) => ({ ...prev, delivery_time_slot: e.target.value }))} className="w-full rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3 outline-none">
                      {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-foreground">Thiệp / lời nhắn</span>
                  <textarea value={form.card_message} onChange={(e) => setForm((prev) => ({ ...prev, card_message: e.target.value }))} rows={4} className="w-full rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3 outline-none" />
                </label>

                <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-950 px-5 py-4 text-sm font-medium text-white transition hover:bg-emerald-900 disabled:opacity-60">
                  {loading ? 'Đang xử lý...' : 'Đặt hàng'} <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <aside className="h-fit rounded-[2rem] border border-[#e6ddd3] bg-white p-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)]">
                <p className="text-xs uppercase tracking-[0.35em] text-[#8f877d]">Đơn hàng của bạn</p>
                <div className="mt-4 space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 border-b border-[#eee4d8] pb-4">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-[#6f665d]">SL: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-foreground">{item.price}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-[#eee4d8] pt-4">
                  <div className="flex items-center justify-between text-sm"><span>Tạm tính</span><span className="font-medium">{formatCurrency(subtotal)}</span></div>
                  <div className="mt-2 flex items-center justify-between text-lg font-semibold"><span>Thành tiền</span><span>{formatCurrency(subtotal)}</span></div>
                </div>
              </aside>
            </div>
          )}
        </section>
      </main>
      <CheckoutSuccessDialog open={successOpen} orderCode={orderCode} onClose={() => setSuccessOpen(false)} />
      <Footer />
    </>
  );
}
