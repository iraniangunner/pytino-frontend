import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "صورتحساب",
};

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-lg text-center">
      <h1 className="mb-4 text-xl font-bold text-slate-900">صورت‌حساب</h1>
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10">
        <p className="text-sm text-slate-500">
          تاریخچه‌ی پرداخت و صورت‌حساب به‌زودی اینجا نمایش داده می‌شود.
        </p>
      </div>
    </div>
  );
}
