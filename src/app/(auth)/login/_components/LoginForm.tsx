"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef, useState } from "react";
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

const OTP_LENGTH = 6;

// فارسی/عربی → انگلیسی، چون کیبورد فارسی معمولاً همین ارقام رو تولید می‌کنه
function toEnglishDigits(input: string): string {
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  return input.replace(/[۰-۹٠-٩]/g, (d) => {
    const pi = persian.indexOf(d);
    if (pi !== -1) return String(pi);
    const ai = arabic.indexOf(d);
    return ai !== -1 ? String(ai) : d;
  });
}

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

function VerifyButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="w-full rounded-xl bg-gradient-to-l from-[#6C5CE7] to-[#8B7CF0] py-3 text-sm
                 font-semibold text-white shadow-md shadow-[#6C5CE7]/25 disabled:cursor-not-allowed
                 disabled:opacity-40"
    >
      {pending ? "در حال بررسی…" : "ورود"}
    </button>
  );
}

// ---- ورودی کد تأیید: ۶ خانه‌ی جدا، حرکت خودکار فوکوس، پیست کامل کد، تبدیل رقم فارسی ----
function OtpBoxes({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const digits = value.padEnd(OTP_LENGTH, " ").split("").slice(0, OTP_LENGTH);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  function setDigitAt(index: number, raw: string) {
    const converted = toEnglishDigits(raw).replace(/[^0-9]/g, "");

    if (!converted) {
      const next = value.split("");
      next[index] = "";
      onChange(next.join("").slice(0, OTP_LENGTH));
      return;
    }

    // اگر چند رقم یک‌جا وارد شد (مثلاً پیست کل کد)، پخششون کن روی خانه‌های بعدی
    const next = value.split("");
    let i = index;
    for (const ch of converted) {
      if (i >= OTP_LENGTH) break;
      next[i] = ch;
      i++;
    }
    const joined = next.join("").slice(0, OTP_LENGTH);
    onChange(joined);

    const focusIndex = Math.min(i, OTP_LENGTH - 1);
    requestAnimationFrame(() => inputsRef.current[focusIndex]?.focus());
  }

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === "Backspace" && !digits[index]?.trim() && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    if (e.key === "ArrowRight" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  return (
    <div dir="ltr" className="flex justify-center gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          value={d.trim()}
          onChange={(e) => setDigitAt(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          inputMode="numeric"
          autoComplete="one-time-code"
          className="h-12 w-11 rounded-xl border border-slate-300 text-center text-lg font-semibold
                     text-slate-900 focus:border-[#6C5CE7] focus:outline-none focus:ring-2
                     focus:ring-[#6C5CE7]/20 sm:h-14 sm:w-12"
        />
      ))}
    </div>
  );
}

export default function LoginForm() {
  const [channel, setChannel] = useState<"email" | "mobile">("email");
  const [receiver, setReceiver] = useState("");
  const [code, setCode] = useState("");
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
            value={receiver}
            onChange={(e) =>
              setReceiver(
                channel === "mobile"
                  ? toEnglishDigits(e.target.value)
                  : e.target.value,
              )
            }
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
          <input type="hidden" name="code" value={code} />

          <p className="text-center text-sm text-slate-500">
            کد ارسال‌شده به{" "}
            <span dir="ltr" className="font-medium text-slate-700">
              {otpState.receiver}
            </span>{" "}
            رو وارد کن.
          </p>

          <OtpBoxes value={code} onChange={setCode} />

          {!verifyState.isSuccess && verifyState.error && (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {verifyState.error}
            </p>
          )}

          <VerifyButton disabled={code.length < OTP_LENGTH} />

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
