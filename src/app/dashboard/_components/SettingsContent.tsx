"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function SettingsContent() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-xl font-bold text-slate-900">تنظیمات حساب</h1>

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <div>
          <p className="text-xs text-slate-400">نام</p>
          <p className="mt-1 text-sm text-slate-900">{user?.name || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">ایمیل</p>
          <p className="mt-1 text-sm text-slate-900" dir="ltr">
            {user?.email || "—"}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        امکان ویرایش اطلاعات حساب به‌زودی اضافه می‌شود.
      </p>
    </div>
  );
}
