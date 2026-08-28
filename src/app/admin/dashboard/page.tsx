"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storesAPI } from "@/lib/api";
import { logoutAction } from "../../_actions/auth";
import { useAuth } from "@/contexts/AuthContext";

type Store = {
  store_id: string;
  name: string;
  welcome_message: string;
  plan: string;
  product_source_type: string;
  message_count: number;
  monthly_message_count: number;
  monthly_limit: number | null;
  last_used_at: string | null;
  created_at: string;
};

const PLANS = ["free", "starter", "business", "pro"] as const;

const planBadge: Record<string, string> = {
  free: "bg-slate-100 text-slate-600",
  starter: "bg-[#00E5FF]/10 text-[#00879C]",
  business: "bg-[#6C5CE7]/10 text-[#6C5CE7]",
  pro: "bg-amber-50 text-amber-700",
};

const PYTHON_SERVICE_URL =
  process.env.NEXT_PUBLIC_PYTHON_API_URL || "https://api.pytino.com";

function buildEmbedCode(store: Store): string {
  return (
    `<script src="${PYTHON_SERVICE_URL}/widget.js" ` +
    `data-api="${PYTHON_SERVICE_URL}/chat" ` +
    `data-store="${store.store_id}" ` +
    `data-welcome="${store.welcome_message}"></script>`
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="shrink-0 rounded-lg bg-[#6C5CE7] px-4 py-2 text-xs font-semibold text-white
                 transition-opacity hover:opacity-90"
    >
      {copied ? "کپی شد ✓" : "کپی کد"}
    </button>
  );
}

function EmbedCodeModal({
  store,
  onClose,
}: {
  store: Store;
  onClose: () => void;
}) {
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">کد نصب ویجت</h2>
            <p className="mt-1 text-sm text-slate-500">فروشگاه: {store.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <div className="rounded-xl bg-slate-900 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              این کد را قبل از {"</body>"} سایت بگذارید
            </span>
            <CopyButton text={buildEmbedCode(store)} />
          </div>
          <pre
            className="overflow-x-auto text-left text-xs leading-relaxed text-emerald-300"
            dir="ltr"
          >
            <code>{buildEmbedCode(store)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

function PlanEditor({
  store,
  onSaved,
}: {
  store: Store;
  onSaved: (storeId: string, newPlan: string) => void;
}) {
  const [selected, setSelected] = useState(store.plan);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSave() {
    setSaving(true);
    setStatus("idle");
    try {
      await storesAPI.updatePlan(store.store_id, selected);
      onSaved(store.store_id, selected);
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 2000);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700"
      >
        {PLANS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleSave}
        disabled={saving || selected === store.plan}
        className="rounded-lg bg-[#6C5CE7] px-3 py-1 text-xs font-semibold text-white
                   transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {saving ? "..." : "ذخیره"}
      </button>
      {status === "success" && (
        <span className="text-xs text-emerald-600">✓</span>
      )}
      {status === "error" && <span className="text-xs text-rose-600">خطا</span>}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { refetch } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalStore, setModalStore] = useState<Store | null>(null);

  useEffect(() => {
    function handleLogout() {
      router.push("/login");
    }
    window.addEventListener("auth:logout", handleLogout);

    storesAPI
      .getAll()
      .then((res) => setStores(res.data.stores))
      .catch(() => setError("دریافت لیست فروشگاه‌ها ناموفق بود."))
      .finally(() => setLoading(false));

    return () => window.removeEventListener("auth:logout", handleLogout);
  }, [router]);

  function handlePlanSaved(storeId: string, newPlan: string) {
    setStores((prev) =>
      prev.map((s) => (s.store_id === storeId ? { ...s, plan: newPlan } : s)),
    );
  }

  return (
    <div className="bg-[#FAFAF8] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold tracking-wide text-[#6C5CE7]">
              پایتینو ادمین
            </span>
            <h1 className="mt-1 text-xl font-bold text-slate-900">
              فروشگاه‌های ثبت‌شده
            </h1>
          </div>
          <span className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm">
            {stores.length} فروشگاه
          </span>
        </div>

        <button
          type="button"
          onClick={async () => {
            await logoutAction();
            refetch();
            router.push("/login");
          }}
          className="mb-6 text-sm text-slate-500 underline hover:text-slate-700"
        >
          خروج از حساب
        </button>

        {loading && <p className="text-sm text-slate-500">در حال بارگذاری…</p>}
        {error && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-right font-medium">
                    اسم فروشگاه
                  </th>
                  <th className="px-4 py-3 text-right font-medium">پلن</th>
                  <th className="px-4 py-3 text-right font-medium">
                    مصرف این ماه
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    آخرین استفاده
                  </th>
                  <th className="px-4 py-3 text-right font-medium">کد نصب</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr
                    key={store.store_id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">
                        {store.name}
                      </div>
                      <div className="font-mono text-xs text-slate-400">
                        {store.store_id}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <PlanEditor store={store} onSaved={handlePlanSaved} />
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {store.monthly_message_count} /{" "}
                      {store.monthly_limit ?? "∞"}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {store.last_used_at
                        ? new Date(store.last_used_at).toLocaleDateString(
                            "fa-IR",
                          )
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setModalStore(store)}
                        className="text-xs font-medium text-[#6C5CE7] underline"
                      >
                        نمایش کد
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalStore && (
        <EmbedCodeModal
          store={modalStore}
          onClose={() => setModalStore(null)}
        />
      )}
    </div>
  );
}
