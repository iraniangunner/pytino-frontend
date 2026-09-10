// app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "درباره ما",
  description:
    "پایتینو دستیار هوش مصنوعی فروشگاه‌های اینترنتی است که محصولات شما را می‌شناسد و به مشتری‌ها کمک می‌کند سریع‌تر جواب بگیرند و خرید کنند.",
};

const values = [
  {
    icon: "🎯",
    title: "دقت روی محصول",
    description:
      "ما باور داریم دستیار فروشگاهی باید واقعاً کاتالوگ شما را بفهمد، نه فقط جمله‌های آماده تکرار کند.",
  },
  {
    icon: "🤝",
    title: "شفافیت با مشتری",
    description:
      "پایتینو هیچ‌وقت چیزی را که در داده‌ی شما نیست حدس نمی‌زند یا ادعا نمی‌کند.",
  },
  {
    icon: "🚀",
    title: "سادگی در راه‌اندازی",
    description: "بدون نیاز به دانش فنی، فروشگاهتان در چند دقیقه آماده می‌شود.",
  },
];

export default function AboutPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen overflow-x-hidden bg-background text-foreground"
    >
      <section className="relative overflow-hidden px-6 py-20 md:py-28">
        <div
          className="pointer-events-none absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-brand/10 blur-[100px]"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold text-brand">درباره ما</p>
          <h1 className="text-balance text-3xl font-bold leading-tight text-foreground md:text-4xl">
            دستیاری که برای <span className="text-brand">کسب‌وکار واقعی</span>{" "}
            ساخته شده
          </h1>
          <p className="mt-6 text-base leading-8 text-muted-foreground md:text-lg">
            پایتینو از یک نیاز ساده شروع شد: فروشگاه‌های آنلاین باید بتوانند به
            مشتری‌هاشان سریع، دقیق و بدون وقفه جواب بدهند — بدون اینکه مجبور
            باشند ساعت‌ها وقت بگذارند یا هزینه‌ی سنگین بپردازند. ما یک دستیار
            هوش مصنوعی ساختیم که مستقیم روی کاتالوگ واقعی محصولات شما کار
            می‌کند، مفاهیمی که مشتری‌های واقعی به کار می‌برند را می‌فهمد و
            هیچ‌وقت چیزی را که نمی‌داند حدس نمی‌زند.
          </p>
        </div>
      </section>

      <section className="relative px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-border bg-background/50 p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-2xl">
                  {value.icon}
                </div>
                <h2 className="text-lg font-bold text-foreground">
                  {value.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
