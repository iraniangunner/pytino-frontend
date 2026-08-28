import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "قیمت گذاری",
};

const PLANS = [
  {
    name: "Free",
    price: "رایگان",
    period: "",
    description: "برای امتحان کردن و فروشگاه‌های خیلی کوچیک",
    features: [
      "۱ فروشگاه",
      "۱۰۰ پیام در ماه",
      "چت پایه با محصولات",
      "حداکثر ۱۵۰ محصول در پرامپت",
    ],
    highlighted: false,
  },
  {
    name: "Starter",
    price: "۸,۰۰۰,۰۰۰",
    period: "تومان / ماه",
    description: "برای فروشگاه‌هایی که می‌خوان جستجوی هوشمند داشته باشن",
    features: [
      "۱ فروشگاه",
      "۲,۰۰۰ پیام در ماه",
      "جستجوی معنایی (RAG)",
      "فقط محصولات مرتبط در هر پاسخ",
    ],
    highlighted: false,
  },
  {
    name: "Business",
    price: "۴۰,۰۰۰,۰۰۰",
    period: "تومان / ماه",
    description: "برای فروشگاه‌هایی که مکالمه‌ی پیوسته می‌خوان",
    features: [
      "تا ۳ فروشگاه",
      "۱۰,۰۰۰ پیام در ماه",
      "همه‌ی امکانات Starter",
      "حافظه‌ی مکالمه (تا ۶ رفت‌وبرگشت)",
    ],
    highlighted: true,
  },
  {
    name: "Pro",
    price: "۱۰۰,۰۰۰,۰۰۰",
    period: "تومان / ماه",
    description: "برای فروشگاه‌هایی که می‌خوان دستیار واقعاً کار انجام بده",
    features: [
      "فروشگاه نامحدود",
      "پیام نامحدود",
      "همه‌ی امکانات Business",
      "Tool Calling و Agent (محاسبه‌ی سفارش و بیشتر)",
    ],
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden px-6 py-20 md:py-28">
      <div
        className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[28rem] w-[28rem]
                   rounded-full bg-[#6C5CE7]/10 blur-[110px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-3xl text-center">
        <span
          className="mb-4 inline-flex items-center gap-1.5 rounded-full border
                          border-[#6C5CE7]/20 bg-[#6C5CE7]/5 px-4 py-1.5 text-xs font-semibold
                          text-[#6C5CE7]"
        >
          قیمت‌گذاری
        </span>
        <h1 className="text-3xl font-bold text-slate-900 md:text-5xl">
          پلنی متناسب با فروشگاهت
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-600 md:text-lg">
          هر وقت خواستی می‌تونی پلنت رو ارتقا بدی — بدون قرارداد بلندمدت.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-4">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl border p-6 ${
              plan.highlighted
                ? "border-[#6C5CE7] bg-white shadow-xl shadow-[#6C5CE7]/10 md:-translate-y-2"
                : "border-slate-200 bg-white"
            }`}
          >
            {plan.highlighted && (
              <span
                className="absolute -top-3 right-6 rounded-full bg-gradient-to-l
                                from-[#6C5CE7] to-[#8B7CF0] px-3 py-1 text-xs font-semibold text-white"
              >
                محبوب‌ترین
              </span>
            )}

            <h2 className="text-lg font-bold text-slate-900">{plan.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{plan.description}</p>

            <div className="mt-6">
              <span className="text-2xl font-bold text-slate-900">
                {plan.price}
              </span>
              {plan.period && (
                <span className="mr-1 text-sm text-slate-500">
                  {plan.period}
                </span>
              )}
            </div>

            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <span className="mt-0.5 text-[#6C5CE7]">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/login"
              className={`mt-8 rounded-xl px-4 py-3 text-center text-sm font-semibold transition-transform hover:scale-[1.02] ${
                plan.highlighted
                  ? "bg-gradient-to-l from-[#6C5CE7] to-[#8B7CF0] text-white shadow-md shadow-[#6C5CE7]/25"
                  : "border border-slate-300 text-slate-700 hover:border-slate-400"
              }`}
            >
              {plan.name === "Free" ? "شروع رایگان" : "انتخاب این پلن"}
            </Link>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-lg text-center text-xs text-slate-400">
        برای ارتقای پلن، اول وارد حسابت شو یا فروشگاهت رو بساز — بعد از داشبورد
        می‌تونی پلنت رو تغییر بدی.
      </p>
    </div>
  );
}
