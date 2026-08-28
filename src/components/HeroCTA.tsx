"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function HeroCTA() {
  const { isLoggedIn } = useAuth();
  const href = isLoggedIn ? "/dashboard/stores/new" : "/login";
  const label = isLoggedIn ? "ساخت فروشگاه جدید ←" : "شروع رایگان ←";

  return (
    <Link
      href={href}
      className="rounded-xl bg-[#6c5ce7] px-7 py-3.5 text-sm font-semibold text-white
                 shadow-lg shadow-[#6c5ce7]/20 transition-transform hover:scale-[1.03]"
    >
      {label}
    </Link>
  );
}
