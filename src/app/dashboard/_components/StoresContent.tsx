"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { storesAPI } from "@/lib/api";

type Store = {
  store_id: string;
  name: string;
  welcome_message: string;
  plan: string;
  monthly_message_count: number;
  monthly_limit: number | null;
  created_at: string;
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

function UsageBar({ used, limit }: { used: number; limit: number | null }) {
  if (limit === null) {
    return (
      <div className="rounded-xl bg-slate-50 px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">مصرف پیام این ماه</span>
          <span className="text-slate-500">
            {used.toLocaleString("fa-IR")} پیام
          </span>
        </div>
        <p className="mt-1 text-xs text-emerald-600">
          پلن نامحدود — سقفی نداری
        </p>
      </div>
    );
  }

  const remaining = Math.max(0, limit - used);
  const percentUsed = Math.min(100, Math.round((used / limit) * 100));
  const barColor =
    percentUsed >= 90
      ? "bg-rose-500"
      : percentUsed >= 70
        ? "bg-amber-500"
        : "bg-[#6C5CE7]";

  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">مصرف پیام این ماه</span>
        <span className="text-slate-500">
          {used.toLocaleString("fa-IR")} از {limit.toLocaleString("fa-IR")}
        </span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${percentUsed}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-slate-500">
        {remaining.toLocaleString("fa-IR")} پیام باقی‌مانده
        {percentUsed >= 90 && (
          <span className="mr-1 font-medium text-rose-600">— نزدیک سقف!</span>
        )}
      </p>
    </div>
  );
}

export default function StoresContent() {
  const [stores, setStores] = useState<Store[]>([]);
  const [canCreateStore, setCanCreateStore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storesAPI
      .getMyStores()
      .then((res) => {
        setStores(res.data.stores);
        setCanCreateStore(res.data.can_create_store);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-xl font-bold text-slate-900">فروشگاه‌های من</h1>

      {loading && <p className="text-sm text-slate-500">در حال بارگذاری…</p>}

      {!loading && stores.length === 0 && (
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
      )}

      {!loading && stores.length > 0 && (
        <div className="space-y-4">
          {stores.map((store) => (
            <div
              key={store.store_id}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="mb-4">
                <h2 className="font-bold text-slate-900">{store.name}</h2>
                <span className="text-xs text-slate-400">
                  پلن:{" "}
                  <span className="font-medium text-[#6C5CE7]">
                    {store.plan}
                  </span>
                </span>
              </div>

              <div className="mb-4">
                <UsageBar
                  used={store.monthly_message_count}
                  limit={store.monthly_limit}
                />
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    کد نصب ویجت
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
          ))}

          {canCreateStore && (
            <Link
              href="/dashboard/stores/new"
              className="block rounded-2xl border border-dashed border-slate-300 bg-white p-6
                         text-center text-sm font-medium text-[#6C5CE7] hover:border-[#6C5CE7]"
            >
              + ساخت فروشگاه جدید
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
