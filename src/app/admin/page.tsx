"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    fetch('/api/admin-check')
      .then(async (res) => {
        if (res.status === 200) {
          setAuthorized(true);
        } else if (res.status === 401) {
          router.replace('/login');
        } else {
          router.replace('/'); // Chuyển về trang chủ nếu không đủ quyền
        }
        setLoading(false);
      })
      .catch(() => {
        router.replace('/'); // Chuyển về trang chủ nếu lỗi
        setLoading(false);
      });
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (!authorized) return null;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Bạn có quyền truy cập trang quản trị.</p>
    </div>
  );
} 