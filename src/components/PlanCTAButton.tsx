"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function PlanCTAButton({
  planKey,
  label,
  highlighted,
}: {
  planKey: "free" | "starter" | "business" | "pro";
  label: string;
  highlighted: boolean;
}) {
  const { isLoggedIn } = useAuth();

  // پلن رایگان: اگه لاگین باشی می‌ری مستقیم ساخت فروشگاه؛ اگه نه، اول ورود
  const href =
    planKey === "free"
      ? isLoggedIn
        ? "/dashboard/stores/new"
        : "/login"
      : isLoggedIn
        ? `/dashboard/billing/upgrade?plan=${planKey}`
        : "/login";

  return (
    <Link
      href={href}
      className={`mt-8 rounded-xl px-4 py-3 text-center text-sm font-semibold transition-transform hover:scale-[1.02] ${
        highlighted
          ? "bg-gradient-to-l from-[#6C5CE7] to-[#8B7CF0] text-white shadow-md shadow-[#6C5CE7]/25"
          : "border border-slate-300 text-slate-700 hover:border-slate-400"
      }`}
    >
      {label}
    </Link>
  );
}
