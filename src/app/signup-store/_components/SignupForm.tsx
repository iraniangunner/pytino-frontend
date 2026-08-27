"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { registerStore, type RegisterState } from "../../_actions/store";

const initialState: RegisterState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
    className="w-full rounded-xl bg-[#6c5ce7] py-3.5 text-sm font-semibold text-white
           transition-colors hover:bg-[#5b4bd6] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "در حال ساختن دستیار…" : "دستیار من را بساز"}
    </button>
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
      className="shrink-0 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium
                 text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
    >
      {copied ? "کپی شد ✓" : "کپی کد"}
    </button>
  );
}

export default function SignupForm() {
  const [state, formAction] = useFormState(registerStore, initialState);
  const [sourceType, setSourceType] = useState<"api_url" | "sample_json">(
    "api_url",
  );

  if (state.status === "success") {
    return (
      <>
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            ✓
          </span>
          <h1 className="text-xl font-bold text-slate-900">
            دستیار فروشگاهت آماده‌ست
          </h1>
        </div>

        <p className="mb-6 text-sm leading-7 text-slate-600">
          همین کد رو کپی کن و درست قبل از{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
            {"</body>"}
          </code>{" "}
          سایتت بذار — از همون لحظه دستیار روی سایتت زنده می‌شه.
        </p>

        <div className="mb-6 rounded-2xl bg-slate-900 p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">کد نصب</span>
            <CopyButton text={state.embedCode ?? ""} />
          </div>
          <pre
            className="overflow-x-auto text-left text-xs leading-relaxed text-emerald-300"
            dir="ltr"
          >
            <code>{state.embedCode}</code>
          </pre>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
          شناسه‌ی فروشگاهت:{" "}
          <span className="font-mono text-slate-700">{state.storeId}</span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-10">
        {/* <span className="text-xs font-semibold tracking-wide text-indigo-600">
          PYTINO
        </span> */}
        {/* <Image src={pytino} width={200} height={200} alt="" /> */}
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          دستیار فروشگاهت رو بساز
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          فقط اسم فروشگاه و آدرس محصولاتت رو بده — خودش بقیه رو می‌فهمه، بدون
          هیچ تنظیم دستی.
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
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900
                       placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none
                       focus:ring-2 focus:ring-indigo-100"
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
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900
                       placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none
                       focus:ring-2 focus:ring-indigo-100"
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
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
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
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
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
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-left text-sm text-slate-900
                         placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none
                         focus:ring-2 focus:ring-indigo-100"
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
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-left font-mono text-xs
                         text-slate-900 placeholder:text-slate-400
                         focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
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
    </>
  );
}
