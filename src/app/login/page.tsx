"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } else {
      router.push("/");
      router.refresh(); // Refresh the page to update session state
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message || "Không thể đăng nhập với Google.");
      setGoogleLoading(false);
    }
    // If successful, Supabase will redirect
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-[380px] gap-8">
          <div className="grid gap-3 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Đăng Nhập</h1>
            <p className="text-muted-foreground">
              Chào mừng trở lại! Nhập thông tin để tiếp tục.
            </p>
          </div>

          <div className="grid gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
            >
              {googleLoading ? (
                "Đang chuyển hướng..."
              ) : (
                <>
                  <svg
                    className="mr-2 h-4 w-4"
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_17_40)">
                      <path
                        d="M47.532 24.552c0-1.636-.146-3.2-.418-4.704H24.48v9.02h12.98c-.56 3.02-2.24 5.58-4.78 7.3v6.06h7.74c4.54-4.18 7.112-10.34 7.112-17.676z"
                        fill="#4285F4"
                      />
                      <path
                        d="M24.48 48c6.48 0 11.92-2.14 15.89-5.82l-7.74-6.06c-2.14 1.44-4.88 2.3-8.15 2.3-6.26 0-11.56-4.22-13.46-9.9H2.52v6.22C6.47 43.78 14.7 48 24.48 48z"
                        fill="#34A853"
                      />
                      <path
                        d="M11.02 28.52c-.48-1.44-.76-2.98-.76-4.52s.28-3.08.76-4.52v-6.22H2.52A23.97 23.97 0 000 24c0 3.98.96 7.76 2.52 11.22l8.5-6.7z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M24.48 9.5c3.52 0 6.64 1.22 9.12 3.62l6.82-6.82C36.4 2.14 30.96 0 24.48 0 14.7 0 6.47 4.22 2.52 10.78l8.5 6.22c1.9-5.68 7.2-9.9 13.46-9.9z"
                        fill="#EA4335"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_17_40">
                        <rect width="48" height="48" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  Đăng nhập với Google
                </>
              )}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Hoặc tiếp tục với
                </span>
              </div>
            </div>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ten@vi_du.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || googleLoading}
                autoComplete="email"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Mật khẩu</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || googleLoading}
                autoComplete="current-password"
              />
            </div>
            {error && (
              <div className="text-destructive text-sm font-medium text-center">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading || googleLoading}>
              {loading ? "Đang kiểm tra..." : "Đăng Nhập"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="underline">
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block h-screen">
        <Image
          src="https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Rạp chiếu phim"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.3]"
        />
      </div>
    </div>
  );
}