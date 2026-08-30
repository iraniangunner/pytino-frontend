"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storesAPI, geminiUsageAPI } from "@/lib/api";
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
  total_prompt_tokens: number;
  total_output_tokens: number;
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

function UsageMetric({
  label,
  current,
  limit,
  unit,
}: {
  label: string;
  current: number;
  limit: number | null;
  unit: string;
}) {
  if (limit === null) {
    return (
      <div>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-600">{label}</span>
          <span className="text-slate-400">
            {current.toLocaleString("fa-IR")} (نامحدود)
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-100" />
      </div>
    );
  }

  const ratio = current / limit;
  const barColor =
    ratio >= 0.9
      ? "bg-rose-500"
      : ratio >= 0.7
        ? "bg-amber-500"
        : "bg-[#6C5CE7]";

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="text-slate-500">
          {current.toLocaleString("fa-IR")} / {limit.toLocaleString("fa-IR")}{" "}
          {unit}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${Math.min(100, ratio * 100)}%` }}
        />
      </div>
    </div>
  );
}

function GeminiUsageCard({
  title,
  usage,
}: {
  title: string;
  usage: GeminiCategoryUsage;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="mb-3 text-sm font-semibold text-slate-900">{title}</p>
      <div className="space-y-3">
        <UsageMetric
          label="درخواست/دقیقه (RPM)"
          current={usage.current_rpm}
          limit={usage.rpm_limit}
          unit=""
        />
        <UsageMetric
          label="توکن/دقیقه (TPM)"
          current={usage.current_tpm}
          limit={usage.tpm_limit}
          unit=""
        />
        <UsageMetric
          label="درخواست/روز (RPD)"
          current={usage.current_rpd}
          limit={usage.rpd_limit}
          unit=""
        />
      </div>
    </div>
  );
}

type GeminiCategoryUsage = {
  current_rpm: number;
  rpm_limit: number;
  current_tpm: number;
  tpm_limit: number;
  current_rpd: number;
  rpd_limit: number | null;
};

export default function AdminPage() {
  const router = useRouter();
  const { refetch } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalStore, setModalStore] = useState<Store | null>(null);
  const [geminiUsage, setGeminiUsage] = useState<{
    chat: GeminiCategoryUsage;
    embedding: GeminiCategoryUsage;
  } | null>(null);

  function fetchGeminiUsage() {
    geminiUsageAPI
      .get()
      .then((res) => setGeminiUsage(res.data.usage))
      .catch(() => {});
  }

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

    fetchGeminiUsage();

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

        {geminiUsage && (
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              مصرف زنده‌ی Gemini (نسبت به سقف واقعی Tier 1 — هر مدل جدا)
            </span>
            <button
              type="button"
              onClick={fetchGeminiUsage}
              className="text-xs font-medium text-[#6C5CE7] underline"
            >
              به‌روزرسانی
            </button>
          </div>
        )}

        {geminiUsage && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <GeminiUsageCard
              title="مدل چت (Gemini 3.6 Flash)"
              usage={geminiUsage.chat}
            />
            <GeminiUsageCard
              title="مدل Embedding (جستجوی معنایی)"
              usage={geminiUsage.embedding}
            />
          </div>
        )}

        {!loading && !error && stores.length > 0 && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-400">
                مجموع توکن ورودی Gemini از ابتدا (کل فروشگاه‌ها)
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stores
                  .reduce((sum, s) => sum + s.total_prompt_tokens, 0)
                  .toLocaleString("fa-IR")}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-400">
                مجموع توکن خروجی Gemini از ابتدا (کل فروشگاه‌ها)
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stores
                  .reduce((sum, s) => sum + s.total_output_tokens, 0)
                  .toLocaleString("fa-IR")}
              </p>
            </div>
          </div>
        )}

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
          <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
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
                      توکن Gemini (ورودی/خروجی)
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
                      <td
                        className="px-4 py-3 text-xs text-slate-500"
                        dir="ltr"
                      >
                        {store.total_prompt_tokens.toLocaleString("fa-IR")} /{" "}
                        {store.total_output_tokens.toLocaleString("fa-IR")}
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
