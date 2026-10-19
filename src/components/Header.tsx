"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, Menu, X, BookOpen, Calendar, LayoutDashboard, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/src/lib/utils";
import { createClient } from "@/src/utils/supabase/client";
import { logout } from "@/src/app/auth/actions";

import NotificationBell from "./NotificationBell";

const NAV_LINKS = [
  { name: "Khám phá", href: "/explore", icon: Search },
  { name: "Lịch học", href: "/schedule", icon: Calendar },
  { name: "Cộng đồng", href: "/community", icon: BookOpen },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-8">
          {/* Brand Zone */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap">
              SkillSwap
            </span>
          </Link>

          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600 whitespace-nowrap",
                  pathname === link.href ? "text-blue-600" : "text-slate-600"
                )}
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <Link
                href="/dashboard"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600 whitespace-nowrap",
                  pathname.startsWith("/dashboard") ? "text-blue-600" : "text-slate-600"
                )}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Action Zone */}
          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <div className="flex items-center gap-2">
                <NotificationBell />
                <Link 
                  href="/dashboard/settings"
                  className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <User size={18} />
                  Hồ sơ
                </Link>
                <form action={logout}>
                   <button type="submit" className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                      <LogOut size={20} />
                   </button>
                </form>
              </div>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md whitespace-nowrap shrink-0"
                >
                  Bắt đầu ngay
                </Link>
              </>
            )}
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white p-4 space-y-2 animate-in slide-in-from-top-4 duration-200">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors",
                pathname === link.href ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <link.icon size={18} />
              {link.name}
            </Link>
          ))}
          {user && (
             <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors",
                pathname.startsWith("/dashboard") ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          )}
          <div className="pt-2 border-t border-slate-100 mt-2">
            {user ? (
              <form action={logout}>
                <button
                  type="submit"
                  className="flex items-center gap-3 p-3 w-full rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut size={18} />
                  Đăng xuất
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={18} />
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
