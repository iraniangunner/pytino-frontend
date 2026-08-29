import Image from "next/image";
import Link from "next/link";
import pytino from "../../public/images/pytino_logo.png";

const FOOTER_COLUMNS = [
  {
    title: "محصول",
    links: [
      { href: "/#features", label: "ویژگی‌ها" },
      { href: "/#demo", label: "دمو" },
      { href: "/pricing", label: "قیمت‌گذاری" },
    ],
  },
  {
    title: "پشتیبانی",
    links: [
      { href: "/#faq", label: "سوالات متداول" },
      { href: "mailto:info@pytino.com", label: "تماس با ما" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/70">
      {/* فوتر اصلی */}
      <div className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
            <div className="col-span-2 md:col-span-2">
              <div className="mb-3 flex items-center gap-2">
                <Image src={pytino} alt="پایتینو" width={100} height={100} />
              </div>
              <p className="max-w-xs text-sm leading-6 text-slate-500">
                دستیار هوش مصنوعی فروشگاه‌های اینترنتی — محصولاتتان را می‌شناسد
                و به مشتری‌ها کمک می‌کند سریع‌تر جواب بگیرند و خرید کنند.
              </p>
            </div>

            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  {column.title}
                </h3>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-500 transition-colors hover:text-[#6C5CE7]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="mt-10 flex flex-col items-center justify-between gap-4 border-t
                          border-slate-200/70 pt-6 text-xs text-slate-400 sm:flex-row"
          >
            <span>
              © {new Date().getFullYear()} پایتینو. تمامی حقوق محفوظ است.
            </span>
            <a
              referrerPolicy="origin"
              target="_blank"
              href="https://trustseal.enamad.ir/?id=7520033&Code=XFijN0kMw8Ehx8dd3xPpGPAsZw2YdFqq"
            >
              <img
                referrerPolicy="origin"
                src="https://trustseal.enamad.ir/logo.aspx?id=7520033&Code=XFijN0kMw8Ehx8dd3xPpGPAsZw2YdFqq"
                alt="نماد اعتماد الکترونیکی"
                style={{ cursor: "pointer" }}
              />
            </a>
            <span>ساخته‌شده با ❤️ برای کسب‌وکارهای ایرانی</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
