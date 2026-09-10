// app/contact/page.tsx
import type { Metadata } from "next";
import ContactInfoCard from "@/components/ContactInfoCard";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: "راه‌های ارتباط با تیم پایتینو.",
};

const contactItems = [
  {
    icon: "✉️",
    label: "ایمیل",
    value: "info@pytino.com",
    href: "mailto:info@pytino.com",
  },
  {
    icon: "📞",
    label: "شماره تماس",
    value: "۰۹۱۴۵۱۴۵۳۸۳",
    href: "tel:+989145145383",
  },
];

export default function ContactPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen overflow-x-hidden bg-background text-foreground"
    >
      <section className="relative overflow-hidden px-6 py-20 md:py-28">
        <div
          className="pointer-events-none absolute -left-32 top-10 -z-10 h-96 w-96 rounded-full bg-accent/10 blur-[100px]"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-sm font-semibold text-brand">تماس با ما</p>
          <h1 className="text-balance text-3xl font-bold leading-tight text-foreground md:text-4xl">
            سوالی دارید؟ <span className="text-brand">در کنارتان هستیم</span>
          </h1>
          <p className="mt-6 text-base leading-8 text-muted-foreground md:text-lg">
            از هر کدام از راه‌های زیر می‌توانید با تیم پایتینو در ارتباط باشید.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl gap-6 sm:grid-cols-3">
          {contactItems.map((item) => (
            <ContactInfoCard key={item.label} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
}
