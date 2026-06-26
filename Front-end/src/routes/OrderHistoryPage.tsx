import { ArrowLeft, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { customerOrdersApi, type CustomerOrderItem, type CustomerWorkshopBooking, } from '../services/customerOrders';


const statusStyles: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  processing: 'bg-purple-50 text-purple-700 border-purple-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export default function OrderHistoryPage() {
  const [items, setItems] = useState<CustomerOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  async function loadData() {
    setLoading(true);
    setError('');

    try {
      const [ordersRes, bookingsRes] =
        await Promise.all([
          customerOrdersApi.list(),
          customerOrdersApi.getMyBookings(),
        ]);

      setItems(ordersRes.orders || []);
      setBookings(bookingsRes.bookings || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không tải được dữ liệu'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);
  const [tab, setTab] = useState<'orders' | 'workshops'>(
    'orders'
  );

  const [bookings, setBookings] = useState<
    CustomerWorkshopBooking[]
  >([]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((item) => [item.order_code, item.buyer_name, item.recipient_name, item.recipient_address, item.status, item.payment_status].some((field) => String(field || '').toLowerCase().includes(keyword)));
  }, [items, search]);

  return (
    <>
      <Header cartCount={0} />
      <main className="min-h-screen bg-[#f6f7fb] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <a href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-[#6f7b8b] hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Quay lại trang chủ
          </a>

          <div className="rounded-[2rem] border border-[#e8edf3] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>


                <h1 className="mt-2 font-serif text-3xl font-light text-foreground">
                  Lịch sử của tôi
                </h1>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setTab('orders')}
                    className={`rounded-full px-5 py-2 text-sm transition ${tab === 'orders'
                      ? 'bg-emerald-950 text-white'
                      : 'bg-[#f6f7fb] text-[#6f7b8b]'
                      }`}
                  >
                    Đơn hàng
                  </button>

                  <button
                    onClick={() => setTab('workshops')}
                    className={`rounded-full px-5 py-2 text-sm transition ${tab === 'workshops'
                      ? 'bg-emerald-950 text-white'
                      : 'bg-[#f6f7fb] text-[#6f7b8b]'
                      }`}
                  >
                    Workshop
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#e8edf3] bg-[#f6f7fb] px-4 py-2">
                <Search className="h-4 w-4 text-[#8f9bb3]" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm outline-none" placeholder="Tìm mã đơn, tên..." />
              </div>
            </div>

            {error ? <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

            {loading ? (
              <div className="rounded-2xl border border-[#e8edf3] bg-[#f6f7fb] p-6 text-sm text-[#6f7b8b]">
                Đang tải...
              </div>
            ) : tab === 'orders' ? (
              <div className="space-y-4">
                {filtered.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#d8e1ea] bg-[#f6f7fb] p-10 text-center text-sm text-[#6f7b8b]">
                    Bạn chưa có đơn hàng nào.
                  </div>
                ) : (
                  filtered.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[1.5rem] border border-[#e8edf3] bg-white p-5 shadow-[0_10px_25px_rgba(15,23,42,0.03)]"
                    >
                      <div>


                        <div className="mt-3 space-y-1 text-sm">
                          <p>
                            <span className="font-medium">
                              Người nhận:
                            </span>{' '}
                            {item.recipient_name}
                          </p>

                          <p className="text-[#6f7b8b]">
                            <span className="font-medium text-foreground">
                              Địa chỉ:
                            </span>{' '}
                            {item.recipient_address}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl bg-[#f6f7fb] p-4">
  <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#8f9bb3]">
    Sản phẩm đã đặt ({item.items?.length || 0})
  </p>

  <div className="space-y-3">
    {item.items?.map((product) => (
      <div
        key={product.id}
        className="flex items-center gap-4 rounded-xl bg-white p-3"
      >
        <div className="flex-1">
          <p className="font-medium text-foreground">
            {product.product_name}
          </p>

          <p className="mt-1 text-sm text-[#6f7b8b]">
            Đơn giá:{' '}
            {Number(product.price).toLocaleString(
              'vi-VN'
            )}
            đ
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold">
            x{product.quantity}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

                      <div className="mt-4 flex flex-wrap items-center justify-between border-t border-[#edf0f5] pt-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-[#8f9bb3]">
                            Ngày giao
                          </p>

                          <p className="mt-1">
                            {new Date(
                              item.delivery_date
                            ).toLocaleDateString('vi-VN')}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs uppercase tracking-[0.25em] text-[#8f9bb3]">
                            Tổng tiền
                          </p>

                          <p className="mt-1 text-lg font-semibold text-emerald-800">
                            {Number(item.total_price).toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#d8e1ea] bg-[#f6f7fb] p-10 text-center text-sm text-[#6f7b8b]">
                    Bạn chưa đăng ký workshop nào.
                  </div>
                ) : (
                  bookings.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[1.5rem] border border-[#e8edf3] bg-white p-5 shadow-[0_10px_25px_rgba(15,23,42,0.03)]"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>

                          <h2 className="mt-2 text-xl font-medium text-foreground">
                            {item.workshop?.title}
                          </h2>



                          <p className="mt-1 text-sm text-[#6f7b8b]">
                            Số chỗ: {item.seats_booked}
                          </p>
                        </div>

                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs ${statusStyles[item.status] ||
                            'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-4">
                        <Info
                          label="Tổng tiền"
                          value={item.total_price.toLocaleString('vi-VN')}
                        />

                        <Info
                          label="Đặt cọc"
                          value={item.deposit_amount.toLocaleString('vi-VN')}
                        />

                        <Info
                          label="Đã thanh toán"
                          value={item.paid_amount.toLocaleString('vi-VN')}
                        />

                        <Info
                          label="Còn lại"
                          value={item.remaining_amount.toLocaleString('vi-VN')}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#e8edf3] bg-[#f6f7fb] p-4">
      <p className="text-xs uppercase tracking-[0.28em] text-[#8f9bb3]">{label}</p>
      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
