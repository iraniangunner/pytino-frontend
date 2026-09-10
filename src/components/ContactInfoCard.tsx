// components/ContactInfoCard.tsx
"use client";

import { useState } from "react";

type ContactInfoCardProps = {
  icon: string;
  label: string;
  value: string;
  href: string;
};

export default function ContactInfoCard({
  icon,
  label,
  value,
  href,
}: ContactInfoCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // اگر کپی موفق نبود، همچنان لینک قابل کلیک است
    }
  };

  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-background/50 p-6 text-center transition-colors hover:border-brand">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-2xl">
        {icon}
      </div>
      <p className="text-sm font-semibold text-muted-foreground">{label}</p>
      <a
        href={href}
        className="mt-1 text-base font-bold text-foreground transition-colors hover:text-brand"
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {value}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-3 rounded-lg border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-brand hover:text-brand"
      >
        {copied ? "کپی شد ✓" : "کپی کردن"}
      </button>
    </div>
  );
}
