"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        router.replace('/login');
      }
      setLoading(false);
    };
    getUser();
  }, [router]);

  if (loading) {
    return <div className="text-center mt-10">Đang tải thông tin...</div>;
  }

  if (!user) {
    // Đã redirect, không render gì
    return null;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md">
      <div className="flex flex-col items-center">
        <img
          src={user.user_metadata?.avatar_url || '/file.svg'}
          alt="Avatar"
          className="w-24 h-24 rounded-full border-4 border-blue-500 mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">{user.user_metadata?.name || user.email}</h2>
        <p className="text-zinc-500 dark:text-zinc-300 mb-1">{user.email}</p>
        <p className="text-zinc-400 dark:text-zinc-400 text-sm">Thành viên từ: {new Date(user.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
