"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  storesAPI,
  llmProvidersAPI,
  LlmProvider,
  LlmProviderModel,
  LlmProviderProtocol,
} from "@/lib/api";
import { logoutAction } from "../../_actions/auth";
import { useAuth } from "@/contexts/AuthContext";

type Store = {
  store_id: string;
  name: string;
  welcome_message: string;
  plan: string;
  product_source_type: string;
  message_count: number;
  monthly_message_count: number;
  monthly_limit: number | null;
  total_prompt_tokens: number;
  total_output_tokens: number;
  last_used_at: string | null;
  created_at: string;
};

const PLANS = ["free", "starter", "business", "pro"] as const;

const planBadge: Record<string, string> = {
  free: "bg-slate-100 text-slate-600",
  starter: "bg-[#00E5FF]/10 text-[#00879C]",
  business: "bg-[#6C5CE7]/10 text-[#6C5CE7]",
  pro: "bg-amber-50 text-amber-700",
};

const PYTHON_SERVICE_URL =
  process.env.NEXT_PUBLIC_PYTHON_API_URL || "https://api.pytino.com";

function buildEmbedCode(store: Store): string {
  return (
    `<script src="${PYTHON_SERVICE_URL}/widget.js" ` +
    `data-api="${PYTHON_SERVICE_URL}/chat" ` +
    `data-store="${store.store_id}" ` +
    `data-welcome="${store.welcome_message}"></script>`
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
      className="shrink-0 rounded-lg bg-[#6C5CE7] px-4 py-2 text-xs font-semibold text-white
                 transition-opacity hover:opacity-90"
    >
      {copied ? "کپی شد ✓" : "کپی کد"}
    </button>
  );
}

function EmbedCodeModal({
  store,
  onClose,
}: {
  store: Store;
  onClose: () => void;
}) {
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">کد نصب ویجت</h2>
            <p className="mt-1 text-sm text-slate-500">فروشگاه: {store.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <div className="rounded-xl bg-slate-900 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              این کد را قبل از {"</body>"} سایت بگذارید
            </span>
            <CopyButton text={buildEmbedCode(store)} />
          </div>
          <pre
            className="overflow-x-auto text-left text-xs leading-relaxed text-emerald-300"
            dir="ltr"
          >
            <code>{buildEmbedCode(store)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

function PlanEditor({
  store,
  onSaved,
}: {
  store: Store;
  onSaved: (storeId: string, newPlan: string) => void;
}) {
  const [selected, setSelected] = useState(store.plan);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSave() {
    setSaving(true);
    setStatus("idle");
    try {
      await storesAPI.updatePlan(store.store_id, selected);
      onSaved(store.store_id, selected);
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 2000);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700"
      >
        {PLANS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleSave}
        disabled={saving || selected === store.plan}
        className="rounded-lg bg-[#6C5CE7] px-3 py-1 text-xs font-semibold text-white
                   transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {saving ? "..." : "ذخیره"}
      </button>
      {status === "success" && (
        <span className="text-xs text-emerald-600">✓</span>
      )}
      {status === "error" && <span className="text-xs text-rose-600">خطا</span>}
    </div>
  );
}

const PLAN_OPTIONS = ["free", "starter", "business", "pro"] as const;

function ProviderPlanCheckboxes({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (plans: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {PLAN_OPTIONS.map((plan) => {
        const checked = selected.includes(plan);
        return (
          <label
            key={plan}
            className={`cursor-pointer rounded-lg border px-2 py-1 text-xs font-medium transition-colors ${
              checked
                ? "border-[#6C5CE7] bg-[#6C5CE7]/10 text-[#6C5CE7]"
                : "border-slate-300 text-slate-500"
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() =>
                onChange(
                  checked
                    ? selected.filter((p) => p !== plan)
                    : [...selected, plan],
                )
              }
              className="ml-1 align-middle"
            />
            {plan}
          </label>
        );
      })}
    </div>
  );
}

const PROTOCOL_OPTIONS: { value: LlmProviderProtocol; label: string }[] = [
  { value: "gemini", label: "Gemini" },
  { value: "anthropic", label: "Claude / Anthropic" },
  { value: "openai_compatible", label: "OpenAI یا سازگار با آن (مثلاً Grok)" },
];

function AddProviderForm({ onAdded }: { onAdded: (p: LlmProvider) => void }) {
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [protocol, setProtocol] =
    useState<LlmProviderProtocol>("openai_compatible");
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [defaultModel, setDefaultModel] = useState("");
  const [embeddingModel, setEmbeddingModel] = useState("");
  const [plans, setPlans] = useState<string[]>(["business", "pro"]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleAdd() {
    if (!key.trim() || !name.trim()) {
      setError("کلید و اسم Provider الزامی‌ست.");
      return;
    }
    if (!apiKey.trim()) {
      setError("کلید API الزامی‌ست — بدون آن این Provider قابل‌استفاده نیست.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await llmProvidersAPI.create({
        key: key.trim().toLowerCase(),
        name: name.trim(),
        protocol,
        api_key: apiKey.trim(),
        base_url: baseUrl.trim() || undefined,
        default_model: defaultModel.trim() || undefined,
        embedding_model: embeddingModel.trim() || undefined,
        allowed_plans: plans,
        is_active: true,
      });
      onAdded(res.data.provider);
      setKey("");
      setName("");
      setApiKey("");
      setBaseUrl("");
      setDefaultModel("");
      setEmbeddingModel("");
      setPlans(["business", "pro"]);
    } catch (err: any) {
      setError(
        err?.response?.data?.errors?.key?.[0] ||
          err?.response?.data?.error ||
          "ثبت Provider جدید ناموفق بود.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-4">
      <p className="mb-3 text-sm font-semibold text-slate-700">
        + افزودن Provider جدید
      </p>
      <div className="grid gap-2 sm:grid-cols-3">
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="کلید یکتا (مثلاً grok)"
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
          dir="ltr"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسم نمایشی (مثلاً Grok)"
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
        />
        <select
          value={protocol}
          onChange={(e) => setProtocol(e.target.value as LlmProviderProtocol)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm"
        >
          {PROTOCOL_OPTIONS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="کلید API (الزامی)"
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
          dir="ltr"
        />
        <input
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="آدرس پایه (فقط برای Gateway سازگار با OpenAI، مثل Grok)"
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
          dir="ltr"
        />
      </div>

      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <input
          value={defaultModel}
          onChange={(e) => setDefaultModel(e.target.value)}
          placeholder="مدل پیش‌فرض چت (اختیاری)"
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
          dir="ltr"
        />
        <input
          value={embeddingModel}
          onChange={(e) => setEmbeddingModel(e.target.value)}
          placeholder="مدل پیش‌فرض Embedding (اختیاری)"
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
          dir="ltr"
        />
      </div>

      <div className="mt-3">
        <p className="mb-1.5 text-xs text-slate-500">در دسترس برای پلن‌ها:</p>
        <ProviderPlanCheckboxes selected={plans} onChange={setPlans} />
      </div>
      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
      <button
        type="button"
        onClick={handleAdd}
        disabled={saving}
        className="mt-3 rounded-lg bg-[#6C5CE7] px-4 py-1.5 text-xs font-semibold text-white
                   transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "در حال ثبت…" : "افزودن"}
      </button>
    </div>
  );
}

function ProviderModelManager({
  provider,
  onProviderUpdated,
}: {
  provider: LlmProvider;
  onProviderUpdated: (p: LlmProvider) => void;
}) {
  const [modelKey, setModelKey] = useState("");
  const [label, setLabel] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  // محافظ دفاعی: حتی اگه یه مسیر دیگه‌ی Backend یه‌روزی models رو ناقص
  // برگردونه، این کامپوننت دیگه کرش نمی‌کنه
  const models = provider.models ?? [];

  function replaceModel(updated: LlmProviderModel) {
    onProviderUpdated({
      ...provider,
      models: models.map((m) => (m.id === updated.id ? updated : m)),
    });
  }

  function removeModelLocally(id: number) {
    onProviderUpdated({
      ...provider,
      models: models.filter((m) => m.id !== id),
    });
  }

  async function handleAddModel() {
    if (!modelKey.trim() || !label.trim()) {
      setError("کلید و اسم مدل الزامی‌ست.");
      return;
    }
    setAdding(true);
    setError("");
    try {
      const res = await llmProvidersAPI.createModel(provider.id, {
        model_key: modelKey.trim(),
        label: label.trim(),
        is_active: true,
      });
      onProviderUpdated({
        ...provider,
        models: [...models, res.data.model],
      });
      setModelKey("");
      setLabel("");
    } catch (err: any) {
      setError(err?.response?.data?.error || "اضافه‌کردن مدل جدید ناموفق بود.");
    } finally {
      setAdding(false);
    }
  }

  async function toggleModelActive(model: LlmProviderModel) {
    const res = await llmProvidersAPI.updateModel(model.id, {
      is_active: !model.is_active,
    });
    replaceModel(res.data.model);
  }

  async function handleDeleteModel(model: LlmProviderModel) {
    if (!confirm(`مدل «${model.label}» حذف بشه؟`)) return;
    await llmProvidersAPI.removeModel(model.id);
    removeModelLocally(model.id);
  }

  return (
    <div className="mt-3 border-t border-dashed border-slate-200 pt-3">
      <p className="mb-2 text-xs font-semibold text-slate-600">
        مدل‌های این Provider
      </p>

      {models.length === 0 && (
        <p className="mb-2 text-xs text-slate-400">
          هنوز مدلی ثبت نشده — فروشگاه‌ها فقط Provider رو می‌بینن، نه مدل خاصی.
        </p>
      )}

      <div className="mb-2 space-y-1.5">
        {models.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5"
          >
            <div>
              <span className="text-xs font-medium text-slate-700">
                {m.label}
              </span>
              <span
                className="mr-2 font-mono text-[11px] text-slate-400"
                dir="ltr"
              >
                {m.model_key}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex cursor-pointer items-center gap-1 text-[11px]">
                <input
                  type="checkbox"
                  checked={m.is_active}
                  onChange={() => toggleModelActive(m)}
                />
                فعال
              </label>
              <button
                type="button"
                onClick={() => handleDeleteModel(m)}
                className="text-[11px] font-medium text-rose-600 underline"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        <input
          value={modelKey}
          onChange={(e) => setModelKey(e.target.value)}
          placeholder="کلید مدل (مثلاً gemini-2.5-pro)"
          className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
          dir="ltr"
        />
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="اسم نمایشی"
          className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
        />
        <button
          type="button"
          onClick={handleAddModel}
          disabled={adding}
          className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-semibold text-white
                     transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {adding ? "..." : "+ افزودن مدل"}
        </button>
      </div>
      {error && <p className="mt-1 text-[11px] text-rose-600">{error}</p>}
    </div>
  );
}

function ProviderRow({
  provider,
  onUpdated,
  onDeleted,
}: {
  provider: LlmProvider;
  onUpdated: (p: LlmProvider) => void;
  onDeleted: (id: number) => void;
}) {
  const [plans, setPlans] = useState(provider.allowed_plans);
  const [savingPlans, setSavingPlans] = useState(false);
  const [newApiKey, setNewApiKey] = useState("");
  const [savingKey, setSavingKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  async function toggleActive() {
    const res = await llmProvidersAPI.update(provider.id, {
      is_active: !provider.is_active,
    });
    onUpdated(res.data.provider);
  }

  async function savePlans() {
    setSavingPlans(true);
    try {
      const res = await llmProvidersAPI.update(provider.id, {
        allowed_plans: plans,
      });
      onUpdated(res.data.provider);
    } finally {
      setSavingPlans(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Provider «${provider.name}» حذف بشه؟`)) return;
    await llmProvidersAPI.remove(provider.id);
    onDeleted(provider.id);
  }

  async function handleSaveKey() {
    if (!newApiKey.trim()) return;
    setSavingKey(true);
    setKeySaved(false);
    try {
      const res = await llmProvidersAPI.update(provider.id, {
        api_key: newApiKey.trim(),
      });
      onUpdated(res.data.provider);
      setNewApiKey("");
      setKeySaved(true);
      setTimeout(() => setKeySaved(false), 2000);
    } finally {
      setSavingKey(false);
    }
  }

  async function handleSetDefaultChat() {
    const res = await llmProvidersAPI.update(provider.id, {
      is_default_chat: true,
    });
    onUpdated(res.data.provider);
  }

  async function handleSetDefaultEmbedding() {
    const res = await llmProvidersAPI.update(provider.id, {
      is_default_embedding: true,
    });
    onUpdated(res.data.provider);
  }

  const plansChanged =
    JSON.stringify([...plans].sort()) !==
    JSON.stringify([...provider.allowed_plans].sort());

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <span className="font-semibold text-slate-900">{provider.name}</span>
          <span className="mr-2 font-mono text-xs text-slate-400" dir="ltr">
            {provider.key}
          </span>
          <span className="mr-2 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">
            {provider.protocol}
          </span>
          {provider.is_default_chat && (
            <span className="mr-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700">
              پیش‌فرض چت
            </span>
          )}
          {provider.is_default_embedding && (
            <span className="mr-1 rounded bg-sky-50 px-1.5 py-0.5 text-[11px] font-medium text-sky-700">
              پیش‌فرض Embedding
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium">
            <input
              type="checkbox"
              checked={provider.is_active}
              onChange={toggleActive}
            />
            فعال (شارژ)
          </label>
          <button
            type="button"
            onClick={handleDelete}
            className="text-xs font-medium text-rose-600 underline"
          >
            حذف
          </button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2 border-b border-dashed border-slate-200 pb-3">
        <span
          className={`text-xs ${
            provider.has_api_key ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {provider.has_api_key ? "کلید API ثبت شده ✓" : "کلید API ثبت نشده ✗"}
        </span>
        <input
          type="password"
          value={newApiKey}
          onChange={(e) => setNewApiKey(e.target.value)}
          placeholder={
            provider.has_api_key ? "جایگزینی کلید (اختیاری)" : "کلید API"
          }
          className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
          dir="ltr"
        />
        <button
          type="button"
          onClick={handleSaveKey}
          disabled={!newApiKey.trim() || savingKey}
          className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-semibold text-white
                     transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {savingKey ? "..." : keySaved ? "ذخیره شد ✓" : "ذخیره کلید"}
        </button>

        {!provider.is_default_chat && (
          <button
            type="button"
            onClick={handleSetDefaultChat}
            className="rounded-lg border border-slate-300 px-2 py-1 text-[11px] font-medium text-slate-600 hover:border-emerald-400 hover:text-emerald-700"
          >
            پیش‌فرض چت کن
          </button>
        )}
        {!provider.is_default_embedding && (
          <button
            type="button"
            onClick={handleSetDefaultEmbedding}
            className="rounded-lg border border-slate-300 px-2 py-1 text-[11px] font-medium text-slate-600 hover:border-sky-400 hover:text-sky-700"
          >
            پیش‌فرض Embedding کن
          </button>
        )}
      </div>

      <p className="mb-1.5 text-xs text-slate-500">در دسترس برای پلن‌ها:</p>
      <div className="flex flex-wrap items-center gap-2">
        <ProviderPlanCheckboxes selected={plans} onChange={setPlans} />
        {plansChanged && (
          <button
            type="button"
            onClick={savePlans}
            disabled={savingPlans}
            className="rounded-lg bg-[#6C5CE7] px-3 py-1 text-xs font-semibold text-white
                       transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {savingPlans ? "..." : "ذخیره"}
          </button>
        )}
      </div>

      <ProviderModelManager provider={provider} onProviderUpdated={onUpdated} />
    </div>
  );
}

function LlmProviderManager() {
  const [providers, setProviders] = useState<LlmProvider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    llmProvidersAPI
      .getAll()
      .then((res) => setProviders(res.data.providers))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="mb-1 text-base font-bold text-slate-900">
        ارائه‌دهندگان هوش مصنوعی
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        خاموش/روشن‌کردن یا اضافه‌کردن Provider جدید، بدون نیاز به تغییر .env یا
        Restart سرور — بلافاصله روی فروشگاه‌ها اثر می‌گذارد.
      </p>

      {loading && <p className="text-sm text-slate-500">در حال بارگذاری…</p>}

      {!loading && (
        <div className="space-y-3">
          {providers.map((p) => (
            <ProviderRow
              key={p.id}
              provider={p}
              onUpdated={(updated) =>
                setProviders((prev) =>
                  prev.map((x) => (x.id === updated.id ? updated : x)),
                )
              }
              onDeleted={(id) =>
                setProviders((prev) => prev.filter((x) => x.id !== id))
              }
            />
          ))}
        </div>
      )}

      <div className="mt-4">
        <AddProviderForm
          onAdded={(p) => setProviders((prev) => [...prev, p])}
        />
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { refetch } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalStore, setModalStore] = useState<Store | null>(null);

  useEffect(() => {
    function handleLogout() {
      router.push("/login");
    }
    window.addEventListener("auth:logout", handleLogout);

    storesAPI
      .getAll()
      .then((res) => setStores(res.data.stores))
      .catch(() => setError("دریافت لیست فروشگاه‌ها ناموفق بود."))
      .finally(() => setLoading(false));

    return () => window.removeEventListener("auth:logout", handleLogout);
  }, [router]);

  function handlePlanSaved(storeId: string, newPlan: string) {
    setStores((prev) =>
      prev.map((s) => (s.store_id === storeId ? { ...s, plan: newPlan } : s)),
    );
  }

  return (
    <div className="bg-[#FAFAF8] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold tracking-wide text-[#6C5CE7]">
              پایتینو ادمین
            </span>
            <h1 className="mt-1 text-xl font-bold text-slate-900">
              فروشگاه‌های ثبت‌شده
            </h1>
          </div>
          <span className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm">
            {stores.length} فروشگاه
          </span>
        </div>

        <LlmProviderManager />

        {!loading && !error && stores.length > 0 && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-400">
                مجموع توکن ورودی از ابتدا (کل فروشگاه‌ها، همه‌ی Providerها)
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stores
                  .reduce((sum, s) => sum + s.total_prompt_tokens, 0)
                  .toLocaleString("fa-IR")}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-400">
                مجموع توکن خروجی از ابتدا (کل فروشگاه‌ها، همه‌ی Providerها)
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stores
                  .reduce((sum, s) => sum + s.total_output_tokens, 0)
                  .toLocaleString("fa-IR")}
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={async () => {
            await logoutAction();
            refetch();
            router.push("/login");
          }}
          className="mb-6 text-sm text-slate-500 underline hover:text-slate-700"
        >
          خروج از حساب
        </button>

        {loading && <p className="text-sm text-slate-500">در حال بارگذاری…</p>}
        {error && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-right font-medium">
                      اسم فروشگاه
                    </th>
                    <th className="px-4 py-3 text-right font-medium">پلن</th>
                    <th className="px-4 py-3 text-right font-medium">
                      مصرف این ماه
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      توکن مصرفی (ورودی/خروجی)
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      آخرین استفاده
                    </th>
                    <th className="px-4 py-3 text-right font-medium">کد نصب</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store) => (
                    <tr
                      key={store.store_id}
                      className="border-t border-slate-100"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">
                          {store.name}
                        </div>
                        <div className="font-mono text-xs text-slate-400">
                          {store.store_id}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <PlanEditor store={store} onSaved={handlePlanSaved} />
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {store.monthly_message_count} /{" "}
                        {store.monthly_limit ?? "∞"}
                      </td>
                      <td
                        className="px-4 py-3 text-xs text-slate-500"
                        dir="ltr"
                      >
                        {store.total_prompt_tokens.toLocaleString("fa-IR")} /{" "}
                        {store.total_output_tokens.toLocaleString("fa-IR")}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {store.last_used_at
                          ? new Date(store.last_used_at).toLocaleDateString(
                              "fa-IR",
                            )
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setModalStore(store)}
                          className="text-xs font-medium text-[#6C5CE7] underline"
                        >
                          نمایش کد
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {modalStore && (
        <EmbedCodeModal
          store={modalStore}
          onClose={() => setModalStore(null)}
        />
      )}
    </div>
  );
}
