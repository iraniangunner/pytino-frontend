"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerStore, type RegisterState } from "../../_actions/store";

const initialState: RegisterState = { status: "idle" };

const inputClass =
  "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 " +
  "placeholder:text-slate-400 focus:border-[#6C5CE7] focus:outline-none focus:ring-2 " +
  "focus:ring-[#6C5CE7]/20";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-gradient-to-l from-[#6C5CE7] to-[#8B7CF0] py-3.5 text-sm
                 font-semibold text-white shadow-md shadow-[#6C5CE7]/25
                 transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "در حال ساختن دستیار…" : "دستیار من را بساز"}
    </button>
  );
}

export default function NewStoreForm() {
  const [state, formAction] = useFormState(registerStore, initialState);
  const [sourceType, setSourceType] = useState<"api_url" | "sample_json">(
    "api_url",
  );
  const router = useRouter();

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            ✓
          </span>
          <h1 className="text-xl font-bold text-slate-900">
            دستیار فروشگاهت آماده‌ست
          </h1>
        </div>
        <button
          onClick={() => router.push("/dashboard/stores")}
          className="w-full rounded-xl bg-gradient-to-l from-[#6C5CE7] to-[#8B7CF0] py-3 text-sm
                     font-semibold text-white shadow-md shadow-[#6C5CE7]/25"
        >
          رفتن به داشبورد و دیدن کد نصب
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <span className="text-xs font-semibold tracking-wide text-[#6C5CE7]">
          پایتینو
        </span>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          فروشگاه جدید بساز
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          فقط اسم فروشگاه و آدرس محصولاتت رو بده — خودش بقیه رو می‌فهمه.
        </p>
      </div>

      <form action={formAction} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            اسم فروشگاه
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="مثلاً فروشگاه پترا"
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="welcome_message"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            پیام خوش‌آمدگویی <span className="text-slate-400">(اختیاری)</span>
          </label>
          <input
            id="welcome_message"
            name="welcome_message"
            type="text"
            placeholder="سلام! چطور می‌تونم کمکتون کنم؟"
            className={inputClass}
          />
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-slate-700">
            محصولاتت رو از کجا بخونیم؟
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSourceType("api_url")}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                sourceType === "api_url"
                  ? "border-[#6C5CE7] bg-[#6C5CE7]/5 text-[#6C5CE7]"
                  : "border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            >
              آدرس API دارم
            </button>
            <button
              type="button"
              onClick={() => setSourceType("sample_json")}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                sourceType === "sample_json"
                  ? "border-[#6C5CE7] bg-[#6C5CE7]/5 text-[#6C5CE7]"
                  : "border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            >
              نمونه JSON دارم
            </button>
          </div>
          <input type="hidden" name="source_type" value={sourceType} />
        </div>

        {sourceType === "api_url" ? (
          <div>
            <label
              htmlFor="api_url"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              آدرس API محصولات
            </label>
            <input
              id="api_url"
              name="api_url"
              type="url"
              dir="ltr"
              placeholder="https://yourstore.com/wp-json/wc/store/v1/products"
              className={`${inputClass} text-left`}
            />
          </div>
        ) : (
          <div>
            <label
              htmlFor="sample_json"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              نمونه JSON محصولات
            </label>
            <textarea
              id="sample_json"
              name="sample_json"
              rows={6}
              dir="ltr"
              placeholder='{"data": [{"name": "...", "price": ...}]}'
              className={`${inputClass} text-left font-mono text-xs`}
            />
          </div>
        )}

        {state.status === "error" && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {state.error}
          </p>
        )}

        <SubmitButton />
      </form>
    </div>
  );
}
