"use client";

import { useEffect, useRef, useState } from "react";

const DEMO_STORE_ID = process.env.NEXT_PUBLIC_DEMO_STORE_ID || "";
const PYTHON_SERVICE_URL =
  process.env.NEXT_PUBLIC_PYTHON_API_URL || "https://api.pytino.com";

type Message = { role: "user" | "assistant"; content: string };

const WELCOME_MESSAGE =
  "سلام! این یه دموی زنده‌ست — هر سوالی درباره‌ی محصولات داری بپرس.";

export default function DemoSection() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionIdRef = useRef<string>("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionIdRef.current = crypto.randomUUID();
  }, []);

  useEffect(() => {
    // عمداً scrollIntoView استفاده نمی‌کنیم چون کل صفحه رو اسکرول می‌کنه؛
    // فقط همین باکس چت رو مستقیم به پایین می‌بریم
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  if (!DEMO_STORE_ID) {
    return null;
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${PYTHON_SERVICE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          store_id: DEMO_STORE_ID,
          session_id: sessionIdRef.current,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || data.error_message || "پاسخی دریافت نشد.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "اتصال به دستیار برقرار نشد. لطفاً دوباره امتحان کنید.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="demo"
      dir="rtl"
      className="relative overflow-hidden bg-slate-50 px-6 py-20"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-4 text-sm font-semibold text-[#6C5CE7]">
          بدون نیاز به ثبت‌نام
        </p>
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
          همین الان امتحانش کن
        </h2>
        <p className="mt-4 text-base leading-8 text-slate-600">
          این یه فروشگاه واقعیه که پایتینو روش نصب شده — همینجا، زنده، باهاش چت
          کن.
        </p>
      </div>

      <div
        className="mx-auto mt-10 flex max-w-lg flex-col overflow-hidden rounded-2xl border
                       border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-center gap-2 bg-[#6C5CE7] px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-sm font-semibold text-white">
            دستیار فروشگاه پترا — آنلاین
          </span>
        </div>

        <div
          ref={messagesContainerRef}
          className="flex h-80 flex-col gap-3 overflow-y-auto bg-white px-4 py-4"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-6 ${
                  msg.role === "user"
                    ? "rounded-bl-sm bg-[#6C5CE7] text-white"
                    : "rounded-br-sm bg-slate-100 text-slate-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-end">
              <div className="rounded-2xl rounded-br-sm bg-slate-100 px-4 py-2 text-sm text-slate-500">
                در حال تایپ…
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={sendMessage}
          className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="مثلاً: یه گردنبند زیر ۱۰ میلیون تومان می‌خوام"
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm
                       text-slate-900 placeholder:text-slate-400 focus:border-[#6C5CE7]
                       focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-[#6C5CE7] px-5 py-2.5 text-sm font-semibold text-white
                       transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ارسال
          </button>
        </form>
      </div>
    </section>
  );
}
