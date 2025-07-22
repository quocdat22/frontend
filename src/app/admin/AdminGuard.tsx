"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    fetch("/api/admin-check")
      .then(async (res) => {
        if (res.status === 200) {
          setAuthorized(true);
        } else if (res.status === 401) {
          router.replace("/login");
        } else {
          router.replace("/");
        }
        setLoading(false);
      })
      .catch(() => {
        router.replace("/");
        setLoading(false);
      });
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (!authorized) return null;

  return <>{children}</>;
} 