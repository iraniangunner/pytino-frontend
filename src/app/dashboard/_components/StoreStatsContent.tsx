"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { statsAPI } from "@/lib/api";

type Stats = {
  days: number;
  totals: {
    messages: number;
    sessions: number;
    answers_with_products: number;
    no_result: number;
    no_result_rate: number;
    errors: number;
    avg_latency_ms: number;
  };
  daily: { day: string; messages: number; sessions: number }[];
  intents: { intent: string; n: number }[];
  unanswered: { query: string; reason: string | null; n: number }[];
  top_products: { sku: string; label: string | null; n: number }[];
};

const REASON_LABELS: Record<string, string> = {
  hard_filter: "فیلتر دقیق نتیجه نداشت",
  nothing_displayed: "محصولی نمایش داده نشد",
  answer_says_missing: "ربات گفت موجود نیست",
};

const INTENT_LABELS: Record<string, string> = {
  product_search: "جستجوی محصول",
  product_detail: "جزئیات محصول",
  price_comparison: "مقایسه و فیلتر قیمت",
  similar_products: "محصولات مشابه",
  general: "سوال عمومی",
};

const fa = (n: number) => n.toLocaleString("fa-IR");

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <div className="text-xs font-medium text-slate-500">{title}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-slate-400">{hint}</div>}
    </div>
  );
}

function DailyBars({ data }: { data: Stats["daily"] }) {
  const max = Math.max(1, ...data.map((d) => d.messages));
  return (
    <div dir="ltr" className="flex h-32 items-end gap-0.5">
      {data.map((d) => (
        <div
          key={d.day}
          title={`${new Date(d.day).toLocaleDateString("fa-IR")}: ${d.messages.toLocaleString("fa-IR")} پیام`}
          className="flex-1 rounded-t bg-[#6C5CE7]/80 hover:bg-[#6C5CE7]"
          style={{
            height: `${(d.messages / max) * 100}%`,
            minHeight: d.messages ? 3 : 0,
          }}
        />
      ))}
    </div>
  );
}

function RankList({
  rows,
  empty,
}: {
  rows: { key: string; label: string; n: number }[];
  empty: string;
}) {
  if (!rows.length) {
    return <p className="text-sm text-slate-400">{empty}</p>;
  }
  return (
    <ul className="divide-y divide-slate-100">
      {rows.map((r) => (
        <li
          key={r.key}
          className="flex items-center justify-between gap-3 py-2 text-sm"
        >
          <span className="truncate text-slate-700">{r.label}</span>
          <span className="shrink-0 font-semibold text-slate-900">
            {fa(r.n)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-3 text-sm font-bold text-slate-900">{title}</h3>
      {children}
    </section>
  );
}

export default function StoreStatsContent() {
  // نام پارامتر باید با نام پوشه‌ی مسیر یکی باشد: app/dashboard/stores/[storeId]/stats
  const params = useParams<{ storeId: string }>();
  const storeId = params?.storeId;

  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    statsAPI
      .get(storeId, days)
      .then((res) => {
        if (!cancelled) setStats(res.data);
      })
      .catch((e) => {
        if (cancelled) return;
        setStats(null);
        setError(
          e?.response?.data?.error ??
            "دریافت آمار انجام نشد. دوباره امتحان کنید.",
        );
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [storeId, days]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/dashboard/stores"
            className="text-xs font-medium text-[#6C5CE7] underline"
          >
            ← فروشگاه‌های من
          </Link>
          <h1 className="mt-1 text-xl font-bold text-slate-900">
            آمار و گزارش چت‌بات
          </h1>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm"
        >
          <option value={7}>۷ روز اخیر</option>
          <option value={30}>۳۰ روز اخیر</option>
          <option value={90}>۹۰ روز اخیر</option>
        </select>
      </div>

      {loading && <p className="text-sm text-slate-500">در حال بارگذاری…</p>}

      {error && !loading && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      {stats && !loading && (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            <StatCard title="پیام‌ها" value={fa(stats.totals.messages)} />
            <StatCard
              title="گفتگوها"
              value={fa(stats.totals.sessions)}
              hint="تعداد مشتری‌های متفاوت"
            />
            <StatCard
              title="پاسخ همراه محصول"
              value={fa(stats.totals.answers_with_products)}
              hint="پیشنهاد محصول در پاسخ"
            />
            <StatCard
              title="سوال بی‌جواب"
              value={fa(stats.totals.no_result)}
              hint={`${fa(stats.totals.no_result_rate)}٪ از پیام‌ها`}
            />
            <StatCard
              title="میانگین زمان پاسخ"
              value={`${fa(Math.round(stats.totals.avg_latency_ms / 100) / 10)} ثانیه`}
            />
            <StatCard title="خطا" value={fa(stats.totals.errors)} />
          </div>

          <Panel title="پیام‌ها در هر روز">
            {stats.totals.messages === 0 ? (
              <p className="text-sm text-slate-400">
                هنوز داده‌ای ثبت نشده. بعد از اولین گفتگوها اینجا پر می‌شود.
              </p>
            ) : (
              <DailyBars data={stats.daily} />
            )}
          </Panel>

          <div className="grid gap-5 md:grid-cols-3">
            <Panel title="سوال‌هایی که جواب نگرفتند">
              <RankList
                rows={stats.unanswered.map((u) => ({
                  key: u.query,
                  label: REASON_LABELS[u.reason ?? ""]
                    ? `${u.query}  ·  ${REASON_LABELS[u.reason ?? ""]}`
                    : u.query,
                  n: u.n,
                }))}
                empty="موردی ثبت نشده"
              />
            </Panel>
            <Panel title="محصولاتی که بیشتر پیشنهاد شدند">
              <RankList
                rows={stats.top_products.map((p) => ({
                  key: p.sku,
                  label: p.label || p.sku,
                  n: p.n,
                }))}
                empty="هنوز محصولی ثبت نشده"
              />
            </Panel>
            <Panel title="نوع سوال‌ها">
              <RankList
                rows={stats.intents.map((i) => ({
                  key: i.intent,
                  label: INTENT_LABELS[i.intent] ?? i.intent,
                  n: i.n,
                }))}
                empty="داده‌ای نیست"
              />
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}