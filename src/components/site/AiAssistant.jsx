import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, X, Sparkles, Send, Loader2, LogIn } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { askAssistant } from "@/lib/server-fns";

const SUGGESTIONS = [
  "কীভাবে অনুদান দেব?",
  "চলমান প্রকল্পগুলো কী কী?",
  "আমাদের মোট খরচ কত?",
  "সদস্য হতে কী লাগবে?",
];

export default function AiAssistant() {
  const { isAuthenticated, navigateToLogin } = useAuth();
  const ask = useServerFn(askAssistant);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "আসসালামু আলাইকুম! আমি আল আহসান সাথী — অনুদান, কার্যক্রম, সদস্যপদ বা হিসাব সম্পর্কে যেকোনো প্রশ্ন করুন।",
    },
  ]);
  const endRef = useRef(null);

  const send = async (text) => {
    const message = (text || input).trim();
    if (!message || busy) return;
    if (!isAuthenticated) {
      navigateToLogin();
      return;
    }
    setMessages((m) => [...m, { role: "user", text: message }]);
    setInput("");
    setBusy(true);
    try {
      const result = await ask({ data: { message } });
      setMessages((m) => [...m, { role: "assistant", text: result.reply }]);
    } catch (error) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "দুঃখিত, উত্তর আনতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।" },
      ]);
    } finally {
      setBusy(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 60);
    }
  };

  return (
    <>
      <button
        data-color-key="site-assistant-toggle" data-color-global="true" data-color-label="সহকারী বাটন"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-24 right-4 z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-primary text-accent shadow-[0_18px_40px_-12px_hsl(var(--shade)/0.8)] transition-transform hover:scale-105 lg:bottom-6 lg:right-8 lg:h-14 lg:w-14"
        aria-label="AI সহকারী"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-accent animate-breath" />}
      </button>

      {open && (
        <div data-color-key="site-assistant-panel" data-color-global="true" data-visual-readonly="true" className="fixed bottom-[168px] right-3 z-40 flex max-h-[68vh] w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[0_40px_100px_-40px_hsl(var(--shade)/0.45)] lg:bottom-24 lg:right-8 lg:w-[390px]">
          <div className="flex items-center gap-3 bg-primary px-5 py-4 text-primary-foreground">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="font-heading text-[14px] font-semibold">আল আহসান সাথী</p>
              <p className="text-[11px] text-white/55">AI সহকারী · বাংলায় প্রশ্ন করুন</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground/85"
                }`}
              >
                {m.text}
              </div>
            ))}
            {busy && (
              <div className="flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-[13px] text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> ভাবছি…
              </div>
            )}
            <div ref={endRef} />
          </div>

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 px-4 pb-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border px-3 py-1.5 text-[11.5px] text-foreground/70 hover:border-primary hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-border p-3">
            {!isAuthenticated && (
              <button
                onClick={() => navigateToLogin()}
                className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-2 text-[12.5px] font-medium text-primary"
              >
                <LogIn className="h-3.5 w-3.5" /> AI সহকারী ব্যবহারে লগইন করুন
              </button>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="আপনার প্রশ্ন লিখুন…"
                className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-[13.5px] outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={busy}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}