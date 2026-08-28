"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!; // مثلاً https://app.pytino.com/api

export type RegisterState = {
  status: "idle" | "success" | "error";
  error?: string;
  storeId?: string;
  embedCode?: string;
};

export async function registerStore(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const name = ((formData.get("name") as string) || "").trim();
  const welcomeMessage = (
    (formData.get("welcome_message") as string) || ""
  ).trim();
  const sourceType = formData.get("source_type") as "api_url" | "sample_json";
  const apiUrl = ((formData.get("api_url") as string) || "").trim();
  const sampleJson = ((formData.get("sample_json") as string) || "").trim();

  if (!name) return { status: "error", error: "اسم فروشگاه را وارد کنید." };
  if (sourceType === "api_url" && !apiUrl)
    return { status: "error", error: "آدرس API را وارد کنید." };
  if (sourceType === "sample_json" && !sampleJson)
    return { status: "error", error: "نمونه JSON را وارد کنید." };

  // چون این یک Server Action است (نه کد مرورگر)، توکن را مستقیم از کوکی می‌خوانیم
  // و خودمان به هدر اضافه می‌کنیم — نه از طریق axios interceptor که فقط سمت مرورگر کار می‌کند
  const c = await cookies();
  const accessToken = c.get("access_token")?.value;

  if (!accessToken) {
    return { status: "error", error: "لطفاً ابتدا وارد حساب کاربری خود شوید." };
  }

  try {
    const res = await fetch(`${API_URL}/stores/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name,
        welcome_message: welcomeMessage || undefined,
        source_type: sourceType,
        api_url: sourceType === "api_url" ? apiUrl : undefined,
        sample_json: sourceType === "sample_json" ? sampleJson : undefined,
      }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success) {
      return {
        status: "error",
        error: data.error || "ثبت‌نام ناموفق بود. لطفاً دوباره تلاش کنید.",
      };
    }

    return {
      status: "success",
      storeId: data.store_id,
      embedCode: data.embed_code,
    };
  } catch {
    return { status: "error", error: "خطا در برقراری ارتباط با سرور." };
  }
}
