"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  sendOtpAction,
  verifyOtpAction,
  type OtpState,
  type VerifyState,
} from "../../../_actions/auth";
import { useAuth } from "@/contexts/AuthContext";

const initialOtpState: OtpState = { status: "idle" };
const initialVerifyState: VerifyState = { isSuccess: false };

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-gradient-to-l from-[#6C5CE7] to-[#8B7CF0] py-3 text-sm
                 font-semibold text-white shadow-md shadow-[#6C5CE7]/25 disabled:opacity-60"
    >
      {pending ? "در حال ارسال…" : "ارسال کد تأیید"}
    </button>
  );
}

function VerifyButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-gradient-to-l from-[#6C5CE7] to-[#8B7CF0] py-3 text-sm
                 font-semibold text-white shadow-md shadow-[#6C5CE7]/25 disabled:opacity-60"
    >
      {pending ? "در حال بررسی…" : "ورود"}
    </button>
  );
}

export default function LoginForm() {
  const [channel, setChannel] = useState<"email" | "mobile">("email");
  const [otpState, sendOtp] = useFormState(sendOtpAction, initialOtpState);
  const [verifyState, verifyOtp] = useFormState(
    verifyOtpAction,
    initialVerifyState,
  );
  const router = useRouter();
  const { refetch } = useAuth();

  useEffect(() => {
    if (verifyState.isSuccess) {
      refetch(); // به AuthContext بگو الان کوکی‌ها عوض شدن، دوباره وضعیت لاگین رو چک کن
      router.push(
        verifyState.role === "admin" ? "/admin/dashboard" : "/dashboard",
      );
    }
  }, [verifyState.isSuccess, verifyState.role, router, refetch]);

  const codeSent = otpState.status === "sent";

  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <span className="text-xs font-semibold tracking-wide text-[#6C5CE7]">
        پایتینو
      </span>
      <h1 className="mt-2 mb-6 text-xl font-bold text-slate-900">
        {codeSent ? "کد تأیید رو وارد کن" : "ورود به پایتینو"}
      </h1>

      {!codeSent ? (
        <form action={sendOtp} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setChannel("email")}
              className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                channel === "email"
                  ? "border-[#6C5CE7] bg-[#6C5CE7]/5 text-[#6C5CE7]"
                  : "border-slate-300 text-slate-600"
              }`}
            >
              ایمیل
            </button>
            <button
              type="button"
              onClick={() => setChannel("mobile")}
              className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                channel === "mobile"
                  ? "border-[#6C5CE7] bg-[#6C5CE7]/5 text-[#6C5CE7]"
                  : "border-slate-300 text-slate-600"
              }`}
            >
              موبایل
            </button>
          </div>
          <input type="hidden" name="channel" value={channel} />

          <input
            name="receiver"
            type={channel === "email" ? "email" : "tel"}
            required
            dir="ltr"
            placeholder={
              channel === "email" ? "you@example.com" : "09123456789"
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-left text-sm
                       focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20"
          />

          {otpState.status === "error" && (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {otpState.error}
            </p>
          )}

          <SendButton />
        </form>
      ) : (
        <form action={verifyOtp} className="space-y-4">
          <input type="hidden" name="channel" value={otpState.channel} />
          <input type="hidden" name="receiver" value={otpState.receiver} />

          <p className="text-sm text-slate-500">
            کد ارسال‌شده به{" "}
            <span dir="ltr" className="font-medium text-slate-700">
              {otpState.receiver}
            </span>{" "}
            رو وارد کن.
          </p>

          <input
            name="code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            required
            dir="ltr"
            placeholder="------"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-lg
                       tracking-[0.5em] focus:border-[#6C5CE7] focus:outline-none
                       focus:ring-2 focus:ring-[#6C5CE7]/20"
          />

          {!verifyState.isSuccess && verifyState.error && (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {verifyState.error}
            </p>
          )}

          <VerifyButton />

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full text-center text-sm text-slate-500 underline"
          >
            اصلاح ایمیل/موبایل
          </button>
        </form>
      )}
    </div>
  );
}
