"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { conversationsAPI } from "@/lib/api";

type SessionSummary = {
  session_id: string;
  message_count: number;
  last_message_at: string;
  started_at: string;
};

type Message = {
  id: number;
  session_id: string;
  user_message: string;
  assistant_message: string;
  created_at: string;
};

export default function ConversationsContent() {
  const params = useParams();
  const storeId = params.storeId as string;

  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSession, setOpenSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  useEffect(() => {
    conversationsAPI
      .getSessions(storeId)
      .then((res) => setSessions(res.data.sessions.data))
      .catch(() =>
        setError(
          "دریافت مکالمات ناموفق بود. شاید این فروشگاه پلن Business/Pro نداره.",
        ),
      )
      .finally(() => setLoading(false));
  }, [storeId]);

  async function handleOpenSession(sessionId: string) {
    if (openSession === sessionId) {
      setOpenSession(null);
      return;
    }
    setOpenSession(sessionId);
    setMessagesLoading(true);
    try {
      const res = await conversationsAPI.getMessages(storeId, sessionId);
      setMessages(res.data.messages);
    } finally {
      setMessagesLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 text-xl font-bold text-slate-900">
        تاریخچه‌ی مکالمات
      </h1>
      <p className="mb-8 text-sm text-slate-500">
        مکالمات مشتری‌ها با دستیار این فروشگاه (فقط پلن Business و Pro).
      </p>

      {loading && <p className="text-sm text-slate-500">در حال بارگذاری…</p>}
      {error && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </p>
      )}

      {!loading && !error && sessions.length === 0 && (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          هنوز هیچ مکالمه‌ای ثبت نشده.
        </p>
      )}

      {!loading && !error && sessions.length > 0 && (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.session_id}
              className="rounded-2xl border border-slate-200 bg-white"
            >
              <button
                type="button"
                onClick={() => handleOpenSession(session.session_id)}
                className="flex w-full items-center justify-between px-5 py-4 text-right"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {session.message_count} پیام
                  </p>
                  <p className="text-xs text-slate-400">
                    آخرین پیام:{" "}
                    {new Date(session.last_message_at).toLocaleString("fa-IR")}
                  </p>
                </div>
                <span className="text-xs font-medium text-[#6C5CE7]">
                  {openSession === session.session_id ? "بستن" : "مشاهده"}
                </span>
              </button>

              {openSession === session.session_id && (
                <div className="border-t border-slate-100 px-5 py-4">
                  {messagesLoading ? (
                    <p className="text-sm text-slate-500">در حال بارگذاری…</p>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div key={msg.id} className="space-y-2">
                          <div className="flex justify-start">
                            <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-[#6C5CE7]/10 px-4 py-2 text-sm text-slate-800">
                              {msg.user_message}
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-slate-100 px-4 py-2 text-sm text-slate-800">
                              {msg.assistant_message}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
