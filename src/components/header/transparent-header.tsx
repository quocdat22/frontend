"use client";


import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from '@/utils/supabase/client'
import { useRouter } from "next/navigation";
import { useAuth } from '../../contexts/AuthContext';

interface TransparentHeaderProps {
  logo?: React.ReactNode;
  menuItems?: {
    label: string;
    href: string;
  }[];
}

export function TransparentHeader({
  logo,
  menuItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Phim', href: '/movies' },
    { label: 'Giới thiệu', href: '/about' },
  ],
}: TransparentHeaderProps) {
  const { user, isAdmin, isModerator } = useAuth()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            {logo || (
              <Link href="/" className="text-xl font-bold text-white">
                Movie Web
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white/80 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {(isAdmin || isModerator) && (
              <Link
                href="/admin"
                className="text-white/80 hover:text-white transition-colors"
              >
                Quản trị
              </Link>
            )}
            {/* Quốc gia Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="text-white/80 hover:text-white transition-colors cursor-pointer flex items-center font-normal px-0" style={{fontSize: 'inherit', lineHeight: 'inherit'}}>
                  Quốc gia
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {/* Top 10 quốc gia phổ biến, có thể chỉnh sửa danh sách này */}
                {[
                  { code: 'US', name: 'Mỹ' },
                  { code: 'KR', name: 'Hàn Quốc' },
                  { code: 'JP', name: 'Nhật Bản' },
                  { code: 'CN', name: 'Trung Quốc' },
                  { code: 'VN', name: 'Việt Nam' },
                  { code: 'GB', name: 'Anh' },
                  { code: 'FR', name: 'Pháp' },
                  { code: 'DE', name: 'Đức' },
                  { code: 'IT', name: 'Ý' },
                  { code: 'CA', name: 'Canada' },
                ].map((country) => (
                  <DropdownMenuItem key={country.code} asChild>
                    <Link href={`/movies/country?country=${country.code}`}>{country.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              className="text-white hover:bg-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </Button>
          </div>

          {/* Theme Toggle and Search */}
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10" asChild>
              <Link href="/search" aria-label="Tìm kiếm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </Link>
            </Button>
            <ThemeToggle />
            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/profile" className="w-full">
                      Hồ sơ
                    </Link>
                  </DropdownMenuItem>
                  {(isAdmin || isModerator) && (
                    <DropdownMenuItem>
                      <Link href="/admin" className="w-full">
                        Quản trị
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <button
                      className="w-full text-left text-destructive"
                      onClick={async () => {
                        await supabase.auth.signOut();
                        window.location.href = "/";
                      }}
                    >
                      Đăng xuất
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" className="ml-2 text-white border-white/40 hover:bg-white/10" asChild>
                <Link href="/login">Đăng nhập</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-white/20">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white/80 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {(isAdmin || isModerator) && (
                <Link
                  href="/admin"
                  className="text-white/80 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Quản trị
                </Link>
              )}
              {/* Quốc gia Dropdown cho mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <span className="text-white/80 hover:text-white transition-colors cursor-pointer flex items-center font-normal px-0 w-full justify-start" style={{fontSize: 'inherit', lineHeight: 'inherit'}}>
                    Quốc gia
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {[
                    { code: 'US', name: 'Mỹ' },
                    { code: 'KR', name: 'Hàn Quốc' },
                    { code: 'JP', name: 'Nhật Bản' },
                    { code: 'CN', name: 'Trung Quốc' },
                    { code: 'IN', name: 'Ấn Độ' },
                    { code: 'GB', name: 'Anh' },
                    { code: 'FR', name: 'Pháp' },
                    { code: 'DE', name: 'Đức' },
                    { code: 'IT', name: 'Ý' },
                    { code: 'CA', name: 'Canada' },
                  ].map((country) => (
                    <DropdownMenuItem key={country.code} asChild>
                      <Link href={`/movies/country?country=${country.code}`}>{country.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                href="/search"
                className="text-white/80 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tìm kiếm
              </Link>
              <Link
                href="/profile"
                className="text-white/80 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hồ sơ
              </Link>
              {(isAdmin || isModerator) && (
                <Link
                  href="/admin"
                  className="text-white/80 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Quản trị
                </Link>
              )}
              <button className="text-left text-destructive">
                Đăng xuất
              </button>
              <div className="pt-2">
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}