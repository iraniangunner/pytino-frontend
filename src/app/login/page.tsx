"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction, type AuthState } from "../_actions/auth";

const initialState: AuthState = { isSuccess: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-indigo-700 py-3 text-sm font-semibold text-white
                 transition-colors hover:bg-indigo-600 disabled:opacity-60"
    >
      {pending ? "در حال ورود…" : "ورود"}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.isSuccess) {
      router.push("/admin/dashboard");
    }
  }, [state.isSuccess, router]);

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#FAFAF8] px-6"
    >
      <form
        action={formAction}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <span className="text-xs font-semibold tracking-wide text-indigo-600">
          PYTINO ADMIN
        </span>
        <h1 className="mt-2 mb-6 text-xl font-bold text-slate-900">
          ورود به پنل مدیریت
        </h1>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            ایمیل
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm
                       focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            رمز عبور
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm
                       focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {!state.isSuccess && state.error && (
          <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {state.error}
          </p>
        )}

        <SubmitButton />
      </form>
    </main>
  );
}
