"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter",
  business: "Business",
  pro: "Pro",
};

export default function ResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const plan = searchParams.get("plan");
  const message = searchParams.get("message");

  if (status === "success") {
    return (
      <div className="mx-auto max-w-md text-center">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8">
          <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
            ✓
          </span>
          <h1 className="text-lg font-bold text-emerald-900">
            پرداخت موفق بود!
          </h1>
          <p className="mt-2 text-sm text-emerald-800">
            فروشگاهت با موفقیت به پلن {plan ? (PLAN_LABELS[plan] ?? plan) : ""}{" "}
            ارتقا پیدا کرد.
          </p>
          <Link
            href="/dashboard/stores"
            className="mt-6 inline-block rounded-xl bg-gradient-to-l from-[#6C5CE7] to-[#8B7CF0]
                       px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#6C5CE7]/25"
          >
            رفتن به فروشگاه‌ها
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md text-center">
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8">
        <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-2xl text-rose-700">
          ✕
        </span>
        <h1 className="text-lg font-bold text-rose-900">پرداخت ناموفق بود</h1>
        <p className="mt-2 text-sm text-rose-800">
          {message
            ? decodeURIComponent(message)
            : "تراکنش تکمیل نشد. هیچ مبلغی از حسابت کم نشده."}
        </p>
        <Link
          href="/pricing"
          className="mt-6 inline-block rounded-xl border border-slate-300 px-6 py-3 text-sm
                     font-semibold text-slate-700"
        >
          بازگشت به قیمت‌گذاری
        </Link>
      </div>
    </div>
  );
}
