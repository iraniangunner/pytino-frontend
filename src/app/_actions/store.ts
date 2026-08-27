"use server";

import { storesAPI } from "@/lib/api";

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

  try {
    const res = await storesAPI.register({
      name,
      welcome_message: welcomeMessage || undefined,
      source_type: sourceType,
      api_url: sourceType === "api_url" ? apiUrl : undefined,
      sample_json: sourceType === "sample_json" ? sampleJson : undefined,
    });

    return {
      status: "success",
      storeId: res.data.store_id,
      embedCode: res.data.embed_code,
    };
  } catch (err: any) {
    return {
      status: "error",
      error:
        err?.response?.data?.error ||
        "ثبت‌نام ناموفق بود. لطفاً دوباره تلاش کنید.",
    };
  }
}
