// import { useEffect, useState } from 'react';

// function getCurrentUser() {
//   const raw = localStorage.getItem('peonia_user');
//   if (!raw) return null;
//   try {
//     return JSON.parse(raw) as { role?: string };
//   } catch {
//     return null;
//   }
// }

// export default function StaffGuard({ children }: { children: React.ReactNode }) {
//   const [allowed, setAllowed] = useState(false);

//   useEffect(() => {
//     const user = getCurrentUser();
//     const token = localStorage.getItem('peonia_token');
//     const isStaff = Boolean(token) && user?.role === 'staff';
//     setAllowed(isStaff);
//     if (!isStaff) {
//       window.location.href = '/dang-nhap';
//     }
//   }, []);

//   if (!allowed) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb] text-[#6f7b8b]">
//         Đang kiểm tra quyền truy cập...
//       </div>
//     );
//   }

//   return <>{children}</>;
// }
