"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { storesAPI, paymentsAPI } from "@/lib/api";

type Store = {
  store_id: string;
  name: string;
  plan: string;
};

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter",
  business: "Business",
  pro: "Pro",
};

export default function UpgradeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get("plan") as
    | "starter"
    | "business"
    | "pro"
    | null;

  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    storesAPI
      .getMyStores()
      .then((res) => {
        setStores(res.data.stores);
        if (res.data.stores.length > 0) {
          setSelectedStoreId(res.data.stores[0].store_id);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (!plan || !PLAN_LABELS[plan]) {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="text-sm text-rose-600">پلن نامعتبر است.</p>
      </div>
    );
  }

  async function handlePay() {
    if (!selectedStoreId) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await paymentsAPI.initiate(selectedStoreId, plan!);
      if (res.data.success && res.data.payment_url) {
        window.location.href = res.data.payment_url; // ریدایرکت واقعی به صفحه‌ی زرین‌پال
      } else {
        setError("خطا در اتصال به درگاه پرداخت.");
        setSubmitting(false);
      }
    } catch {
      setError("خطا در اتصال به درگاه پرداخت. لطفاً دوباره تلاش کنید.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-1 text-xl font-bold text-slate-900">
        ارتقا به پلن {PLAN_LABELS[plan]}
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        کدوم فروشگاه رو می‌خوای ارتقا بدی؟
      </p>

      {loading ? (
        <p className="text-sm text-slate-500">در حال بارگذاری…</p>
      ) : stores.length === 0 ? (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          هنوز هیچ فروشگاهی نساختی. اول باید یه فروشگاه بسازی.
        </p>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="space-y-2">
            {stores.map((store) => (
              <label
                key={store.store_id}
                className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm ${
                  selectedStoreId === store.store_id
                    ? "border-[#6C5CE7] bg-[#6C5CE7]/5"
                    : "border-slate-200"
                }`}
              >
                <span>
                  {store.name}
                  <span className="mr-2 text-xs text-slate-400">
                    (پلن فعلی: {store.plan})
                  </span>
                </span>
                <input
                  type="radio"
                  name="store"
                  value={store.store_id}
                  checked={selectedStoreId === store.store_id}
                  onChange={() => setSelectedStoreId(store.store_id)}
                />
              </label>
            ))}
          </div>

          {(() => {
            const PLAN_ORDER = ["free", "starter", "business", "pro"];
            const selectedStore = stores.find(
              (s) => s.store_id === selectedStoreId,
            );
            const currentRank = selectedStore
              ? PLAN_ORDER.indexOf(selectedStore.plan)
              : -1;
            const targetRank = PLAN_ORDER.indexOf(plan!);
            const notAnUpgrade = selectedStore
              ? targetRank <= currentRank
              : false;

            return (
              <>
                {notAnUpgrade && (
                  <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {selectedStore?.plan === plan
                      ? `این فروشگاه از قبل روی همین پلن (${PLAN_LABELS[plan!]}) هست.`
                      : "فقط ارتقا به پلن بالاتر ممکنه. برای تغییر به پلن پایین‌تر، صبر کن پلن فعلی منقضی بشه."}
                  </p>
                )}

                {error && (
                  <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handlePay}
                  disabled={submitting || notAnUpgrade}
                  className="mt-6 w-full rounded-xl bg-gradient-to-l from-[#6C5CE7] to-[#8B7CF0] py-3
                             text-sm font-semibold text-white shadow-md shadow-[#6C5CE7]/25
                             disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? "در حال اتصال به درگاه…" : "پرداخت و ارتقا"}
                </button>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
