"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { logoutAction } from "../_actions/auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "داشبورد" },
  { href: "/dashboard/stores", label: "فروشگاه‌ها" },
  { href: "/dashboard/settings", label: "تنظیمات" },
  { href: "/dashboard/billing", label: "صورت‌حساب" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading: authLoading, refetch } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authLoading && user?.role === "admin") {
      router.replace("/admin/dashboard");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    function handleLogout() {
      router.push("/login");
    }
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, [router]);

  async function handleLogoutClick() {
    await logoutAction();
    refetch();
    router.push("/login");
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#FAFAF8]">
      {/* منوی کناری — فقط دسکتاپ */}
      <aside className="hidden w-60 shrink-0 border-l border-slate-200 bg-white p-6 md:block">
        <span className="mb-6 block text-xs font-semibold tracking-wide text-[#6C5CE7]">
          داشبورد من
        </span>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#6C5CE7]/10 text-[#6C5CE7]"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 space-y-2 border-t border-slate-200 pt-4">
          <Link
            href="/pricing"
            className="block rounded-lg border border-slate-300 px-3 py-2 text-center text-sm
                       font-semibold text-slate-700 hover:border-[#6C5CE7] hover:text-[#6C5CE7]"
          >
            ارتقای پلن
          </Link>
          <button
            type="button"
            onClick={handleLogoutClick}
            className="block w-full rounded-lg px-3 py-2 text-center text-sm text-slate-500 underline"
          >
            خروج
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* نوار موبایل — چون منوی کناری توی موبایل مخفیه */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <span className="text-sm font-semibold text-[#6C5CE7]">
            داشبورد من
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="text-xs font-semibold text-[#6C5CE7]"
            >
              ارتقای پلن
            </Link>
            <button
              type="button"
              onClick={handleLogoutClick}
              className="text-xs text-slate-500 underline"
            >
              خروج
            </button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 md:hidden">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
                  isActive ? "bg-[#6C5CE7]/10 text-[#6C5CE7]" : "text-slate-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="overflow-x-hidden p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
