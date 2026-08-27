import Image from "next/image";
import Link from "next/link";
import pytino from "../../public/images/pytino_logo.png";

const FOOTER_LINKS = [
  {
    title: "محصول",
    links: [
      { href: "/#features", label: "ویژگی‌ها" },
      { href: "/#pricing", label: "قیمت‌گذاری" },
      { href: "/signup-store", label: "شروع رایگان" },
    ],
  },
//   {
//     title: "حساب کاربری",
//     links: [
//       { href: "/login", label: "ورود ادمین" },
//       { href: "/signup", label: "ثبت‌نام فروشگاه" },
//     ],
//   },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <Image src={pytino} alt="پایتینو" width={100} height={100} />
            </div>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              دستیار هوش مصنوعی فروشگاه‌های اینترنتی — محصولاتتان را می‌شناسد و
              به مشتری‌ها کمک می‌کند سریع‌تر جواب بگیرند و خرید کنند.
            </p>
          </div>
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} پایتینو. تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}
