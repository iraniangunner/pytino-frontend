"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!; // مثلاً https://app.pytino.com/api

const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

// باید دقیقاً با Passport::refreshTokensExpireIn توی AppServiceProvider یکی باشد
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 14; // ۱۴ روز

async function setAuthCookies(data: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}) {
  const c = await cookies();
  c.set("access_token", data.access_token, {
    ...cookieBase,
    maxAge: data.expires_in,
  });
  c.set("refresh_token", data.refresh_token, {
    ...cookieBase,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

export type OtpState = {
  status: "idle" | "sent" | "error";
  error?: string;
  channel?: "email" | "mobile";
  receiver?: string;
};

export type VerifyState = {
  isSuccess: boolean;
  error?: string;
  role?: string;
};

// ========================
// قدم ۱: ارسال کد
// ========================
export async function sendOtpAction(
  _prevState: OtpState,
  formData: FormData,
): Promise<OtpState> {
  const channel = formData.get("channel") as "email" | "mobile";
  const receiver = ((formData.get("receiver") as string) || "").trim();

  if (!receiver) {
    return {
      status: "error",
      error:
        channel === "email"
          ? "ایمیل را وارد کنید."
          : "شماره موبایل را وارد کنید.",
    };
  }

  try {
    const res = await fetch(`${API_URL}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        channel === "email" ? { email: receiver } : { mobile: receiver },
      ),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errors = data.errors;
      return {
        status: "error",
        error: errors
          ? Object.values(errors).flat().join(" - ")
          : data.message || "خطا در ارسال کد.",
      };
    }

    return { status: "sent", channel, receiver };
  } catch {
    return { status: "error", error: "خطا در برقراری ارتباط با سرور." };
  }
}

// ========================
// قدم ۲: تأیید کد
// ========================
export async function verifyOtpAction(
  _prevState: VerifyState,
  formData: FormData,
): Promise<VerifyState> {
  const channel = formData.get("channel") as "email" | "mobile";
  const receiver = formData.get("receiver") as string;
  const code = ((formData.get("code") as string) || "").trim();

  if (!code) {
    return { isSuccess: false, error: "کد تأیید را وارد کنید." };
  }

  try {
    const res = await fetch(`${API_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        channel === "email"
          ? { email: receiver, code }
          : { mobile: receiver, code },
      ),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        isSuccess: false,
        error: data.message || "کد وارد‌شده اشتباه یا منقضی‌شده است.",
      };
    }

    await setAuthCookies(data);
    return { isSuccess: true, role: data.user?.role };
  } catch {
    return { isSuccess: false, error: "خطا در برقراری ارتباط با سرور." };
  }
}

// ========================
// Logout
// ========================
export async function logoutAction(): Promise<void> {
  const c = await cookies();
  const accessToken = c.get("access_token")?.value;

  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      cache: "no-store",
    });
  } catch {
    // حتی اگر این درخواست شکست بخورد، کاربر را سمت Next.js خارج می‌کنیم
  }

  c.delete("access_token");
  c.delete("refresh_token");
  // عمداً اینجا redirect نمی‌کنیم — کامپوننت صداکننده باید بعد از این، هم
  // AuthContext رو رفرش کنه هم خودش مسیر رو عوض کنه، تا هدر هم درست به‌روز بشه
}
