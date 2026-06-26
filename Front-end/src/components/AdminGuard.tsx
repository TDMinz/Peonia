import { useEffect, useState } from 'react';

function getCurrentUser() {
  const raw = localStorage.getItem('peonia_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { role?: string };
  } catch {
    return null;
  }
}

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    const token = localStorage.getItem('peonia_token');
    const isAdmin = Boolean(token) && user?.role === 'super_admin';
    setAllowed(isAdmin);
    if (!isAdmin) {
      window.location.href = '/dang-nhap';
    }
  }, []);

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb] text-[#6f7b8b]">
        Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  return <>{children}</>;
}
