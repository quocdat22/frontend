"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } else {
      router.push("/");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) {
      setError(error.message || "Không thể đăng nhập với Google.");
      setGoogleLoading(false);
    }
    // Nếu thành công, Supabase sẽ tự redirect
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-muted/40 py-12 px-4">
      <div className="w-full max-w-md bg-background rounded-xl shadow-xl p-8 border border-border">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập vào tài khoản</h2>
        {/* Google Login Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2 mb-6 border border-input bg-background text-foreground hover:bg-accent"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
        >
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_17_40)">
              <path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.704H24.48v9.02h12.98c-.56 3.02-2.24 5.58-4.78 7.3v6.06h7.74c4.54-4.18 7.112-10.34 7.112-17.676z" fill="#4285F4"/>
              <path d="M24.48 48c6.48 0 11.92-2.14 15.89-5.82l-7.74-6.06c-2.14 1.44-4.88 2.3-8.15 2.3-6.26 0-11.56-4.22-13.46-9.9H2.52v6.22C6.47 43.78 14.7 48 24.48 48z" fill="#34A853"/>
              <path d="M11.02 28.52c-.48-1.44-.76-2.98-.76-4.52s.28-3.08.76-4.52v-6.22H2.52A23.97 23.97 0 000 24c0 3.98.96 7.76 2.52 11.22l8.5-6.7z" fill="#FBBC05"/>
              <path d="M24.48 9.5c3.52 0 6.64 1.22 9.12 3.62l6.82-6.82C36.4 2.14 30.96 0 24.48 0 14.7 0 6.47 4.22 2.52 10.78l8.5 6.22c1.9-5.68 7.2-9.9 13.46-9.9z" fill="#EA4335"/>
            </g>
            <defs>
              <clipPath id="clip0_17_40">
                <rect width="48" height="48" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          {googleLoading ? "Đang chuyển hướng..." : "Đăng nhập với Google"}
        </Button>
        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-border" />
          <span className="mx-3 text-muted-foreground text-xs uppercase">hoặc</span>
          <div className="flex-1 h-px bg-border" />
        </div>
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
            disabled={loading}
          />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Nhập mật khẩu"
            autoComplete="current-password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
          {error && <div className="text-destructive text-sm text-center">{error}</div>}
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
        <div className="flex justify-between items-center mt-6 text-sm">
          <Link href="/forgot-password" className="text-primary hover:underline">Quên mật khẩu?</Link>
          <Link href="/register" className="text-primary hover:underline">Đăng ký tài khoản</Link>
        </div>
      </div>
    </div>
  );
} 