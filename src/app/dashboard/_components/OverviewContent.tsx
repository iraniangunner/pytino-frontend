"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { storesAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type Store = {
  store_id: string;
  name: string;
  plan: string;
  monthly_message_count: number;
  monthly_limit: number | null;
};

export default function OverviewContent() {
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storesAPI
      .getMyStores()
      .then((res) => setStores(res.data.stores))
      .finally(() => setLoading(false));
  }, []);

  const totalMessages = stores.reduce(
    (sum, s) => sum + s.monthly_message_count,
    0,
  );
  const hasUnlimited = stores.some((s) => s.monthly_limit === null);
  const totalLimit = hasUnlimited
    ? null
    : stores.reduce((sum, s) => sum + (s.monthly_limit || 0), 0);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 text-xl font-bold text-slate-900">
        سلام{user?.name ? `، ${user.name}` : ""} 👋
      </h1>
      <p className="mb-8 text-sm text-slate-500">
        این خلاصه‌ی وضعیت حساب توئه.
      </p>

      {loading ? (
        <p className="text-sm text-slate-500">در حال بارگذاری…</p>
      ) : stores.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="mb-4 text-sm text-slate-500">
            هنوز هیچ فروشگاهی نساختی.
          </p>
          <Link
            href="/dashboard/stores/new"
            className="inline-block rounded-xl bg-gradient-to-l from-[#6C5CE7] to-[#8B7CF0]
                       px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#6C5CE7]/25"
          >
            ساخت اولین فروشگاه
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-400">تعداد فروشگاه</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stores.length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-400">پیام مصرف‌شده این ماه</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {totalMessages.toLocaleString("fa-IR")}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-400">سقف مجموع پیام</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {totalLimit === null
                  ? "نامحدود"
                  : totalLimit.toLocaleString("fa-IR")}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/dashboard/stores"
              className="inline-block rounded-xl border border-slate-300 px-5 py-2.5 text-sm
                         font-semibold text-slate-700 hover:border-[#6C5CE7] hover:text-[#6C5CE7]"
            >
              مدیریت فروشگاه‌ها
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
