"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { paymentsAPI } from "@/lib/api";

type Payment = {
  id: number;
  plan: string;
  amount: number; // به ریال
  status: "pending" | "paid" | "failed";
  ref_id: string | null;
  created_at: string;
  store: { name: string } | null;
};

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter",
  business: "Business",
  pro: "Pro",
};

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-rose-50 text-rose-700",
};

const STATUS_LABELS: Record<string, string> = {
  paid: "موفق",
  pending: "در انتظار",
  failed: "ناموفق",
};

export default function BillingContent() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentsAPI
      .getHistory()
      .then((res) => setPayments(res.data.payments))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 text-xl font-bold text-slate-900">صورت‌حساب</h1>
      <p className="mb-8 text-sm text-slate-500">
        تاریخچه‌ی کامل پرداخت‌های تو، روی همه‌ی فروشگاه‌هات.
      </p>

      {loading && <p className="text-sm text-slate-500">در حال بارگذاری…</p>}

      {!loading && payments.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="mb-4 text-sm text-slate-500">
            هنوز هیچ پرداختی ثبت نشده.
          </p>
          <Link
            href="/pricing"
            className="inline-block rounded-xl bg-gradient-to-l from-[#6C5CE7] to-[#8B7CF0]
                       px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#6C5CE7]/25"
          >
            مشاهده‌ی پلن‌ها
          </Link>
        </div>
      )}

      {!loading && payments.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-right font-medium">تاریخ</th>
                  <th className="px-4 py-3 text-right font-medium">فروشگاه</th>
                  <th className="px-4 py-3 text-right font-medium">پلن</th>
                  <th className="px-4 py-3 text-right font-medium">مبلغ</th>
                  <th className="px-4 py-3 text-right font-medium">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(payment.created_at).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="px-4 py-3 text-slate-900">
                      {payment.store?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-[#6C5CE7]">
                        {PLAN_LABELS[payment.plan] ?? payment.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {(payment.amount / 10).toLocaleString("fa-IR")} تومان
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[payment.status]}`}
                      >
                        {STATUS_LABELS[payment.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
