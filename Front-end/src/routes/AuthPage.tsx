import { ArrowRight, Eye, EyeOff, Flower2, Mail, Lock, UserRound, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { authApi } from '../services/auth';
import flowerImage from '../assets/VI005425.jpg';
import {
  GoogleLogin,
  useGoogleLogin,
} from '@react-oauth/google';

import type {
  CredentialResponse,
} from '@react-oauth/google';
type Mode = 'login' | 'register' | 'forgot' | 'verify' | 'reset';

type AuthPageProps = {
  initialMode?: Mode;
  imageUrl?: string;
};

function AuthIllustration({ imageUrl }: { imageUrl?: string }) {
  return (
    <div className="relative flex h-full min-h-[760px] overflow-hidden rounded-[2rem] border border-[#e6ddd3] bg-[#f3ece3] shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
      {imageUrl ? (
        <img src={imageUrl} alt="Auth visual" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#fbf7f1_0%,#f3ece3_55%,#e8dccf_100%)]" />
      )}
      <div className="absolute inset-0 bg-black/5" />
    </div>
  );
}

export default function AuthPage({ initialMode = 'login' }: AuthPageProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ full_name: '', username: '', email: '', password: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirm, setResetConfirm] = useState('');

  const title = useMemo(() => (mode === 'register' ? 'Tạo tài khoản' : mode === 'forgot' ? 'Quên mật khẩu' : mode === 'verify' ? 'Xác minh mã' : mode === 'reset' ? 'Đặt lại mật khẩu' : 'Đăng nhập'), [mode]);
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
    },
  });
  const handleGoogleLogin = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      if (!credentialResponse.credential) {
        setError('Không nhận được token Google');
        return;
      }

      const data = await authApi.googleLogin({
        credential:
          credentialResponse.credential,
      });

      localStorage.setItem(
        'peonia_token',
        data.token
      );

      localStorage.setItem(
        'peonia_user',
        JSON.stringify(data.user)
      );

      window.dispatchEvent(
        new Event('peonia-auth-updated')
      );

      window.location.href = '/';
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Đăng nhập Google thất bại'
      );
    }
  };
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const data = await authApi.login(loginForm);
      localStorage.setItem('peonia_token', data.token);
      localStorage.setItem('peonia_user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('peonia-auth-updated'));
      const role = data.user?.role;
      if (role === 'customer') {
        localStorage.removeItem('peonia_cart_guest');
        localStorage.setItem(`peonia_cart_user_${data.user?.id || data.user?.username || 'unknown'}`, JSON.stringify([]));
      }
      window.location.href = role === 'super_admin' ? '/admin' : role === 'staff' ? '/staff' : '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const data = await authApi.register(registerForm);
      localStorage.setItem('peonia_token', data.token);
      localStorage.setItem('peonia_user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('peonia-auth-updated'));
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await authApi.forgotPassword({ email: forgotEmail });
      setMessage('Đã gửi mã xác minh về email của bạn. Vui lòng kiểm tra hộp thư.');
      setMode('verify');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không gửi được mã khôi phục');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await authApi.verifyResetCode({ email: forgotEmail, code: resetCode });
      setMessage('Xác minh thành công. Hãy nhập mật khẩu mới.');
      setMode('reset');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xác minh mã thất bại');
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    if (resetPassword !== resetConfirm) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      setLoading(false);
      return;
    }
    try {
      await authApi.resetPassword({ email: forgotEmail, code: resetCode, new_password: resetPassword });
      setMessage('Đặt lại mật khẩu thành công. Bạn có thể đăng nhập lại ngay.');
      setMode('login');
      setForgotEmail('');
      setResetCode('');
      setResetPassword('');
      setResetConfirm('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đặt lại mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header cartCount={0} />
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fbf7f1_0%,_#f3ece3_45%,_#efe6da_100%)] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-[#e6ddd3] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.08)] lg:grid-cols-2 lg:min-h-[650px]">       <div className="hidden lg:block"><AuthIllustration imageUrl={flowerImage} /></div>
          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-16">
            <div className="w-full max-w-[460px]">
              <div className="mb-8 lg:hidden">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3ece3] text-[#1c1c1c]"><Flower2 className="h-6 w-6" /></div>
                  <div>
                    <p className="font-serif text-2xl font-light text-foreground">Peonia</p>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#8f877d]">Hoa tươi & quà tặng</p>
                  </div>
                </div>
              </div>

              <div className="mb-8 flex rounded-full border border-[#eadfd4] bg-[#fbf7f1] p-1">
                {(['login', 'register', 'forgot'] as Mode[]).map((item) => (
                  <button key={item} onClick={() => setMode(item)} className={`relative flex-1 overflow-hidden rounded-full px-4 py-3 text-sm uppercase tracking-[0.22em] transition-colors duration-300 ${mode === item ? 'bg-[#1c1c1c] text-white shadow-sm' : 'text-[#6f665d] hover:bg-white'}`}>
                    <span className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-500 ${mode === item ? 'translate-x-0' : '-translate-x-full'}`} />
                    <span className="relative z-10">{item === 'login' ? 'Đăng nhập' : item === 'register' ? 'Đăng ký' : 'Quên mật khẩu'}</span>
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.35em] text-[#8f877d]">{title}</p>
                <h1 className="mt-3 font-serif text-4xl font-light text-foreground md:text-5xl">{mode === 'login' ? 'Chào mừng trở lại' : mode === 'register' ? '' : mode === 'forgot' ? 'Khôi phục mật khẩu' : mode === 'verify' ? 'Nhập mã đã gửi' : 'Tạo mật khẩu mới'}</h1>
              </div>

              {message ? <div className="mb-4 rounded-2xl border border-[#d9cabb] bg-[#fbf7f1] px-4 py-3 text-sm text-[#6f665d]">{message}</div> : null}
              {error ? <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

              {mode === 'login' && (
                <form
                  onSubmit={handleLogin}
                  className="space-y-4"
                >
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-foreground">
                      Tên đăng nhập
                    </span>

                    <div className="flex items-center gap-3 rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3">
                      <UserRound className="h-5 w-5 text-[#8f877d]" />

                      <input
                        value={loginForm.username}
                        onChange={(e) =>
                          setLoginForm((p) => ({
                            ...p,
                            username: e.target.value,
                          }))
                        }
                        className="w-full bg-transparent text-sm outline-none"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-foreground">
                      Mật khẩu
                    </span>

                    <div className="flex items-center gap-3 rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3">
                      <Lock className="h-5 w-5 text-[#8f877d]" />

                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm((p) => ({
                            ...p,
                            password: e.target.value,
                          }))
                        }
                        className="w-full bg-transparent text-sm outline-none"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((s) => !s)
                        }
                        className="text-[#8f877d]"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </label>

                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[#8f877d]"
                    >
                      Quên mật khẩu?
                    </button>

                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-[#8f877d]"
                    >
                      Chưa có tài khoản?
                    </button>
                  </div>

                  <button
  disabled={loading}
  className="
    flex
    w-full
    cursor-pointer
    items-center
    justify-center
    gap-2
    rounded-full
    bg-[#1c1c1c]
    px-5
    py-4
    text-sm
    uppercase
    tracking-[0.25em]
    text-white
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-[0_10px_25px_rgba(0,0,0,0.15)]
    disabled:opacity-60
  "
>
                    {loading
                      ? 'Đang xử lý...'
                      : 'Đăng nhập'}

                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {/* Divider */}
                  {/* Divider */}
                  <div className="flex items-center gap-3 py-1">
                    <div className="h-px flex-1 bg-[#e6ddd3]" />

                    <span className="text-xs uppercase tracking-[0.25em] text-[#8f877d]">
                      Hoặc đăng nhập bằng Google
                    </span>

                    <div className="h-px flex-1 bg-[#e6ddd3]" />
                  </div>
                  <div
  className="
    rounded-full
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]
  "
>
  <GoogleLogin
    onSuccess={handleGoogleLogin}
    onError={() => {
      setError('Đăng nhập Google thất bại');
    }}
    theme="outline"
    size="large"
    shape="pill"
  />
</div>
                </form>
              )}

              {mode === 'register' && <form onSubmit={handleRegister} className="space-y-4"><label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Họ và tên</span><input value={registerForm.full_name} onChange={(e) => setRegisterForm((p) => ({ ...p, full_name: e.target.value }))} className="w-full rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3 text-sm outline-none" /></label><label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Tên đăng nhập</span><input value={registerForm.username} onChange={(e) => setRegisterForm((p) => ({ ...p, username: e.target.value }))} className="w-full rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3 text-sm outline-none" /></label><label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Email</span><input value={registerForm.email} onChange={(e) => setRegisterForm((p) => ({ ...p, email: e.target.value }))} className="w-full rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3 text-sm outline-none" /></label><label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Mật khẩu</span><input type={showPassword ? 'text' : 'password'} value={registerForm.password} onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))} className="w-full rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3 text-sm outline-none" /></label>
              <button disabled={loading} className="
    flex
    w-full
    cursor-pointer
    items-center
    justify-center
    gap-2
    rounded-full
    bg-[#1c1c1c]
    px-5
    py-4
    text-sm
    uppercase
    tracking-[0.25em]
    text-white
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-[0_10px_25px_rgba(0,0,0,0.15)]
    disabled:opacity-60
  ">
                {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}<ArrowRight className="h-4 w-4" />
              </button></form>}

              {mode === 'forgot' && <form onSubmit={handleForgot} className="space-y-4"><label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Email</span><div className="flex items-center gap-3 rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3"><Mail className="h-5 w-5 text-[#8f877d]" /><input value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Nhập email của bạn" /></div></label><button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1c1c1c] px-5 py-4 text-sm uppercase tracking-[0.25em] text-white disabled:opacity-60">{loading ? 'Đang gửi...' : 'Gửi mã về email'}<ArrowRight className="h-4 w-4" /></button></form>}

              {mode === 'verify' && <form onSubmit={handleVerify} className="space-y-4"><label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Email</span><input value={forgotEmail} disabled className="w-full rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3 text-sm outline-none" /></label><label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Mã xác minh 6 ký tự</span><input value={resetCode} onChange={(e) => setResetCode(e.target.value)} className="w-full rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3 text-sm uppercase outline-none" placeholder="VD: A1B2C3" /></label><button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1c1c1c] px-5 py-4 text-sm uppercase tracking-[0.25em] text-white disabled:opacity-60">{loading ? 'Đang xác minh...' : 'Xác minh mã'}<ArrowRight className="h-4 w-4" /></button></form>}

              {mode === 'reset' && <form onSubmit={handleReset} className="space-y-4"><label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Mật khẩu mới</span><input type={showPassword ? 'text' : 'password'} value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} className="w-full rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3 text-sm outline-none" /></label><label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Xác nhận mật khẩu mới</span><input type={showPassword ? 'text' : 'password'} value={resetConfirm} onChange={(e) => setResetConfirm(e.target.value)} className="w-full rounded-2xl border border-[#e6ddd3] bg-[#fbf7f1] px-4 py-3 text-sm outline-none" /></label><button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1c1c1c] px-5 py-4 text-sm uppercase tracking-[0.25em] text-white disabled:opacity-60">{loading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}<ArrowRight className="h-4 w-4" /></button></form>}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
