"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import pytino from "../../public/images/pytino_logo.png";

const NAV_LINKS = [
  { href: "/", label: "خانه" },
  { href: "/#features", label: "ویژگی‌ها" },
  { href: "/#resources", label: "منابع" },
  { href: "/#about", label: "درباره ما" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="پایتینو، صفحه اصلی"
          onClick={closeMenu}
        >
          <Image src={pytino} alt="پایتینو" width={100} height={100} />
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="ناوبری اصلی"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/signup-store"
            className="hidden rounded-xl bg-[#6c5ce7] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#6c5ce7]/20 transition-transform hover:scale-[1.03] sm:inline-flex"
          >
            درخواست دمو
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted md:hidden"
            aria-label={isOpen ? "بستن منو" : "باز کردن منو"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-border/70 px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-3" aria-label="ناوبری موبایل">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/signup-store"
              onClick={closeMenu}
              className="mt-2 rounded-xl bg-[#6c5ce7] px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-[#6c5ce7]/20"
            >
              درخواست دمو
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
