import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import Header from '../components/Header';
import { authApi } from '../services/auth';

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword({ current_password: currentPassword, new_password: newPassword });
      setMessage('Đổi mật khẩu thành công.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header cartCount={0} />
      <main className="min-h-screen bg-[#f6f7fb] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <a href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-[#6f7b8b] hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Quay lại trang chủ
          </a>

          <div className="rounded-[2rem] border border-[#e8edf3] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8f9bb3]">Tài khoản</p>
            <h1 className="mt-2 font-serif text-3xl font-light text-foreground">Đổi mật khẩu</h1>
            <p className="mt-2 text-sm text-[#6f7b8b]">Cập nhật mật khẩu đăng nhập của bạn.</p>

            {message ? (
              <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <CheckCircle2 className="h-4 w-4" />
                {message}
              </div>
            ) : null}
            {error ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <PasswordField label="Mật khẩu hiện tại" value={currentPassword} onChange={setCurrentPassword} show={showCurrent} toggle={() => setShowCurrent((s) => !s)} />
              <PasswordField label="Mật khẩu mới" value={newPassword} onChange={setNewPassword} show={showNew} toggle={() => setShowNew((s) => !s)} />
              <PasswordField label="Xác nhận mật khẩu mới" value={confirmPassword} onChange={setConfirmPassword} show={showConfirm} toggle={() => setShowConfirm((s) => !s)} />

              <button disabled={loading} className="w-full rounded-full bg-[#111827] px-5 py-4 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60">
                {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

function PasswordField({ label, value, onChange, show, toggle }: { label: string; value: string; onChange: (value: string) => void; show: boolean; toggle: () => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-[#e8edf3] bg-[#f6f7fb] px-4 py-3">
        <Lock className="h-5 w-5 text-[#8f877d]" />
        <input type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent text-sm outline-none" />
        <button type="button" onClick={toggle} className="text-[#8f877d]">{show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
      </div>
    </label>
  );
}
