import { Clock3, Users, X, UploadCloud } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { api, type WorkshopDto } from '../services/api';
import { bookingApi } from '../services/booking';
import CheckoutSuccessDialog from '../components/CheckoutSuccessDialog';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

type BookingFormState = {
  workshopTitle: string;
  customer_name: string;
  customer_phone: string;
  seats: number;
  note: string;
};


type BookingStep = 'form' | 'payment' | 'upload';

function WorkshopCard({ workshop, onRegister }: { workshop: WorkshopDto; onRegister: (workshop: WorkshopDto) => void }) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-[#e7dfd3] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={workshop.image_url} alt={workshop.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-emerald-950/90 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white">
          Quy mô tối đa: {workshop.max_slots} người
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-serif text-2xl leading-tight text-foreground">{workshop.title}</h3>
        <p className="mt-4 text-sm leading-7 text-[#6f665d]">{workshop.description}</p>

        <div className="mt-6 border-t border-[#eee4d8] pt-5">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#8f877d]">Thời gian tổ chức</p>
              <div className="mt-1 flex items-center gap-2 text-foreground">
                <Clock3 className="h-4 w-4 text-[#e38b67]" />
                <span className="font-medium">{formatDateTime(workshop.event_date)}</span>
              </div>
            </div>
            <div>
              <p className="text-[#8f877d]">Học phí trọn gói</p>
              <div className="mt-1 font-serif text-xl font-semibold text-foreground">{formatCurrency(workshop.price)}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#f7f3ec] px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8f877d]">Số chỗ còn trống</p>
            <p className="mt-1 flex items-center gap-2 text-base font-semibold text-emerald-700">
              <Users className="h-4 w-4" />
              {workshop.available_slots} / {workshop.max_slots} chỗ trống
            </p>
          </div>
          <button onClick={() => onRegister(workshop)} className="rounded-full bg-emerald-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-900">
            Đăng Ký Ngay
          </button>
        </div>
      </div>
    </article>
  );
}

export default function WorkshopPage() {
  const [workshops, setWorkshops] = useState<WorkshopDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkshop, setSelectedWorkshop] = useState<WorkshopDto | null>(null);
  const [bookingStep, setBookingStep] = useState<BookingStep>('form');
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [, setUploadError] = useState('');
  const [bookingCode, setBookingCode] = useState('');
  const [billFile, setBillFile] = useState<File | null>(null);
  const [billPreview, setBillPreview] = useState('');
  const [bookingForm, setBookingForm] = useState<BookingFormState>({
    workshopTitle: '',
    customer_name: '',
    customer_phone: '',
    seats: 1,
    note: '',
  });
  const [showSuccessDialog, setShowSuccessDialog] =
  useState(false);
  const [showLoginNotice, setShowLoginNotice] =
    useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);
  useEffect(() => {
    let alive = true;
    api.workshops()
      .then((data) => {
        if (alive) setWorkshops(data.workshops || []);
      })
      .catch(() => {
        if (alive) setWorkshops([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  function openBooking(workshop: WorkshopDto) {
    const token = localStorage.getItem('peonia_token');

    if (!token) {
      setShowLoginNotice(true);
      return;
    }

    const user = JSON.parse(
      localStorage.getItem('peonia_user') || '{}'
    );

    setSelectedWorkshop(workshop);
    setBookingStep('form');
    setBillFile(null);
    setBillPreview('');
    setUploadMessage('');
    setUploadError('');

    setBookingForm({
      workshopTitle: workshop.title,
      customer_name: user.full_name || '',
      customer_phone: '',
      seats: 1,
      note: '',
    });
  }

  function closeBooking() {
    setSelectedWorkshop(null);
    setBookingStep('form');
    setBillFile(null);
    setBillPreview('');
    setUploadMessage('');
    setUploadError('');
  }

  async function handleSubmitBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedWorkshop) return;
    setUploading(true);
    setUploadError('');
    setUploadMessage('');
    try {
      const data = await bookingApi.createBooking({
        workshop_id: selectedWorkshop.id,
        customer_name: bookingForm.customer_name,
        customer_phone: bookingForm.customer_phone,
        seats_booked: bookingForm.seats,
      });
      setBookingCode(data.booking?.booking_code || data.booking_code || '');
      setBookingStep('payment');
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Tạo booking thất bại');
    } finally {
      setUploading(false);
    }
  }
  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalAmount = selectedWorkshop ? selectedWorkshop.price * bookingForm.seats : 0;
  const depositAmount = selectedWorkshop ? Math.round(totalAmount * 0.3) : 0;

  async function handleBillUpload() {
    if (!bookingCode || !billFile) return;

    setUploading(true);
    setUploadError('');
    setUploadMessage('');

    try {
      await bookingApi.uploadBill(
        bookingCode,
        billFile
      );

      setUploadMessage(
        'Đã gửi bill thành công.'
      );

      setShowBillPreview(false);

      // Hiện popup cảm ơn
      setShowSuccessDialog(true);

    } catch (err) {
      setUploadError(
        err instanceof Error
          ? err.message
          : 'Upload bill thất bại'
      );
    } finally {
      setUploading(false);
    }
  }
  
  return (
    <>
      <Header cartCount={0} />
      <main className="bg-[#fbf7f1]">
        <section className="border-b border-[#e7dfd3] bg-[linear-gradient(180deg,#fffaf4_0%,#fbf7f1_100%)] py-16">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-xs uppercase tracking-[0.45em] text-[#e38b67]">Atelier & Studio</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-foreground md:text-6xl">Không Gian Sáng Tạo Hoa</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6f665d] md:text-base">
              Nơi bạn đắm chìm vào thế giới hương sắc mộc mạc, tự tay thiết kế và gửi gắm tâm tình qua các buổi hướng dẫn tận tình từ florist của chúng tôi.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid gap-8 md:grid-cols-2">
              <div className="h-[560px] animate-pulse rounded-[1.75rem] bg-[#eee4d8]" />
              <div className="h-[560px] animate-pulse rounded-[1.75rem] bg-[#eee4d8]" />
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {workshops.map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} onRegister={openBooking} />
              ))}
            </div>
          )}
        </section>
      </main>

      {selectedWorkshop ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 backdrop-blur-sm" onClick={closeBooking}>
          <div className="w-full max-w-3xl overflow-hidden rounded-[2rem] border border-[#e6ddd3] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.2)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#eee4d8] px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#8f877d]">Đăng ký workshop</p>
                <h3 className="mt-2 font-serif text-3xl font-light text-foreground">{selectedWorkshop.title}</h3>
              </div>
              <button onClick={closeBooking} className="rounded-full p-2 text-[#8f877d] transition hover:bg-[#fbf7f1] hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {bookingStep === 'form' ? (
              <form onSubmit={handleSubmitBooking} className="grid gap-5 p-6 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-foreground">Workshop</span>
                  <input value={bookingForm.workshopTitle} disabled className="w-full rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3 text-sm outline-none" />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-foreground">Họ và tên</span>
                  <input
                    required
                    value={bookingForm.customer_name}
                    onChange={(e) => setBookingForm((prev) => ({ ...prev, customer_name: e.target.value }))}
                    className="w-full rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3 text-sm outline-none"
                    placeholder="Nhập họ tên"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-foreground">Số điện thoại</span>
                  <input
                    required
                    value={bookingForm.customer_phone}
                    onChange={(e) => setBookingForm((prev) => ({ ...prev, customer_phone: e.target.value }))}
                    className="w-full rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3 text-sm outline-none"
                    placeholder="Nhập số điện thoại"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-foreground">Số chỗ đăng ký</span>
                  <input
                    required
                    type="number"
                    min={1}
                    max={selectedWorkshop.max_slots}
                    value={bookingForm.seats}
                    onChange={(e) => setBookingForm((prev) => ({ ...prev, seats: Number(e.target.value) }))}
                    className="w-full rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3 text-sm outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-foreground">Tổng tiền</span>
                  <input
                    value={formatCurrency(totalAmount)}
                    disabled
                    className="h-[52px] w-full rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3 text-base font-semibold text-foreground outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-foreground">Tiền cọc giữ chỗ</span>
                  <input
                    value={formatCurrency(depositAmount)}
                    disabled
                    className="h-[52px] w-full rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3 text-base font-semibold text-emerald-800 outline-none"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-foreground">Ghi chú</span>
                  <textarea
                    value={bookingForm.note}
                    onChange={(e) => setBookingForm((prev) => ({ ...prev, note: e.target.value }))}
                    rows={4}
                    className="w-full rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3 text-sm outline-none"
                    placeholder="Yêu cầu thêm nếu có"
                  />
                </label>

                <div className="md:col-span-2 flex items-center justify-end gap-3 border-t border-[#eee4d8] pt-4">
                  <button type="button" onClick={closeBooking} className="rounded-full border border-[#e6ddd3] bg-white px-5 py-3 text-sm text-foreground transition hover:bg-[#fbf7f1]">
                    Hủy
                  </button>
                  <button type="submit" className="rounded-full bg-emerald-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-900">
                    Xác nhận đăng ký
                  </button>
                </div>
              </form>
            ) : bookingStep === 'payment' ? (
              <div className="grid gap-6 p-6 md:grid-cols-[1fr_0.9fr]">
                <div className="rounded-[1.5rem] border border-[#e6ddd3] bg-[#fbf7f1] p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-[#8f877d]">
                    Xác nhận đặt cọc
                  </p>

                  <h4 className="mt-3 font-serif text-2xl font-light text-foreground">
                    Thanh toán giữ chỗ workshop
                  </h4>

                  {/* Tổng tiền */}
                  <div className="mt-5 rounded-2xl bg-white p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#8f877d]">Tổng tiền</span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-[#8f877d]">Tiền cọc 30%</span>
                      <span className="font-semibold text-emerald-800">
                        {formatCurrency(depositAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Upload bill */}
                  <div className="mt-6">
                    <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#8f877d]">
                      Upload bill chuyển khoản
                    </p>

                    <div className="block cursor-pointer">
                      {billPreview ? (
                        <div
                          className="relative overflow-hidden rounded-2xl border border-[#e6ddd3] bg-white"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              setBillFile(null);
                              setBillPreview('');

                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow"
                          >
                            ✕
                          </button>

                          <img
                            src={billPreview}
                            alt="Bill preview"
                            onClick={() => setShowBillPreview(true)}
                            className="h-48 w-full cursor-zoom-in object-contain"
                          />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex h-48 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e6ddd3] bg-white transition hover:border-emerald-700"
                        >
                          <UploadCloud className="h-8 w-8 text-[#8f877d]" />

                          <span className="mt-2 text-sm font-medium text-[#6f665d]">
                            Chọn ảnh bill
                          </span>

                          <span className="mt-1 text-xs text-[#9a9188]">
                            JPG, PNG, WEBP
                          </span>
                        </button>
                      )}
                      {billPreview && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-3 w-full rounded-xl border border-[#e6ddd3] bg-white py-2 text-sm"
                        >
                          Chọn ảnh khác
                        </button>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;

                          if (!file) return;

                          const previewUrl = URL.createObjectURL(file);

                          setBillFile(file);
                          setBillPreview(previewUrl);
                        }}
                      />
                    </div>

                    <button
                      disabled={!billFile || uploading}
                      onClick={handleBillUpload}
                      className="mt-4 w-full rounded-full bg-emerald-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-900 disabled:opacity-60"
                    >
                      {uploading ? 'Đang gửi...' : 'Gửi bill xác nhận'}
                    </button>
                    {uploadMessage && (
                      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                        {uploadMessage}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col rounded-[1.5rem] border border-[#e6ddd3] bg-white p-6">
                  <p className="text-xs uppercase tracking-[0.35em] text-[#8f877d]">Mã QR thanh toán</p>
                  <div className="mt-4 rounded-3xl border border-[#e6ddd3] bg-[#fbf7f1] p-4">
                    <img src={`https://res.cloudinary.com/di4qsw8gl/image/upload/v1781609911/z7943328700830_f6a747870371178fbf4f6df54c8400c3_a7otqs.jpg`} alt="QR thanh toán" className="h-64 w-64 rounded-2xl object-cover" />
                  </div>
                  <div className="mt-auto pt-6 flex w-full">
                    <button
                      onClick={() => setBookingStep('form')}
                      className="w-full rounded-full border border-[#e6ddd3] bg-white px-5 py-3 text-sm text-foreground"
                    >
                      Quay lại
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
      {showLoginNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-3xl bg-white p-6">
            <h3 className="font-serif text-2xl text-foreground">
              Yêu cầu đăng nhập
            </h3>

            <p className="mt-3 text-sm text-[#6f665d]">
              Bạn cần đăng nhập để đăng ký
              workshop và tải bill thanh toán.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() =>
                  setShowLoginNotice(false)
                }
                className="rounded-full border px-5 py-3"
              >
                Đóng
              </button>

              <button
                onClick={() =>
                (window.location.href =
                  '/dang-nhap')
                }
                className="rounded-full bg-emerald-950 px-5 py-3 text-white"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      )}
      {showBillPreview && billPreview && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowBillPreview(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative"
          >
            <button
              type="button"
              className="absolute -right-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow"
              onClick={() => setShowBillPreview(false)}
            >
              ✕
            </button>

            <img
              src={billPreview}
              alt="Bill preview"
              className="max-h-[90vh] max-w-[90vw] rounded-2xl bg-white object-contain"
            />
          </div>
        </div>
      )}
      <Footer />
      <CheckoutSuccessDialog
  open={showSuccessDialog}
  onClose={() => {
    setShowSuccessDialog(false);
    window.location.href = '/';
  }}
  title="Đăng Ký Workshop Thành Công"
  description="Peonia đã nhận được bill thanh toán của bạn. Chúng tôi sẽ kiểm tra và xác nhận trong thời gian sớm nhất."
  note="🌿 Cảm ơn bạn đã đăng ký Workshop cùng Peonia. Chúng tôi rất mong được đồng hành cùng bạn trong buổi học sắp tới."
  buttonText="Về Trang Chủ"
  buttonHref="/"
/>
    </>
  );
}
