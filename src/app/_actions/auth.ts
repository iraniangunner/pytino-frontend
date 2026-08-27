"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL!; // مثلاً https://app.pytino.com/api

const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

// باید دقیقاً با Passport::refreshTokensExpireIn توی AppServiceProvider
// سمت Laravel یکی باشد، وگرنه کوکی زودتر/دیرتر از توکن واقعی منقضی می‌شود.
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;

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

export type AuthState = { isSuccess: boolean; error?: string };

// ========================
// Login
// ========================
export async function loginAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { isSuccess: false, error: "ایمیل و رمز عبور را وارد کنید." };
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        isSuccess: false,
        error: data.message || "ایمیل یا رمز عبور اشتباه است.",
      };
    }

    await setAuthCookies(data);
    return { isSuccess: true };
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
  redirect("/login");
}
