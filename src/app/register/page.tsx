"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
//import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from '@/utils/supabase/client'
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterPage() {
  //const router = useRouter();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setFormLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    setFormLoading(false);
    if (signUpError) {
      setError(signUpError.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } else {
      setSuccess("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  useEffect(() => {
    if (!loading && user) {
      window.location.replace('/');
    }
  }, [user, loading]);
  if (loading) return <div>Loading...</div>;
  if (user) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-muted/40 py-12 px-4">
      <div className="w-full max-w-md bg-background rounded-xl shadow-xl p-8 border border-border">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký tài khoản mới</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Nhập email của bạn"
            autoComplete="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={formLoading}
          />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Nhập mật khẩu"
            autoComplete="new-password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={formLoading}
          />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Xác nhận mật khẩu"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={formLoading}
          />
          {error && <div className="text-destructive text-sm text-center">{error}</div>}
          {success && <div className="text-success text-sm text-center">{success}</div>}
          <Button type="submit" className="w-full mt-2" disabled={formLoading}>
            {formLoading ? "Đang đăng ký..." : "Đăng ký"}
          </Button>
        </form>
        <div className="flex justify-between items-center mt-6 text-sm">
          <Link href="/login" className="text-primary hover:underline">Đã có tài khoản? Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
} 