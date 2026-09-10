// app/faq/page.tsx
import type { Metadata } from "next";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "سوالات متداول",
  description: "پاسخ سوالات رایج درباره پایتینو.",
};

const faqs = [
  {
    question: "پایتینو دقیقاً چیکار می‌کند؟",
    answer:
      "پایتینو یک دستیار هوش مصنوعی است که مستقیم به کاتالوگ محصولات فروشگاه شما وصل می‌شود و به سوالات مشتری‌ها درباره‌ی قیمت، موجودی و مشخصات محصولات جواب می‌دهد.",
  },
  {
    question: "راه‌اندازی چقدر طول می‌کشد؟",
    answer:
      "فقط کافی است آدرس داده‌ی محصولات سایتتان را در اختیار ما بگذارید — پایتینو خودش ساختار آن را تشخیص می‌دهد و در چند دقیقه آماده می‌شود.",
  },
  {
    question: "اگر پلتفرم فروشگاهم وردپرس نباشد چه؟",
    answer:
      "مشکلی نیست. پایتینو با هر پلتفرمی که بتواند لیست محصولات را به‌صورت JSON ارائه دهد کار می‌کند. اگر مطمئن نیستید، کافیست از برنامه‌نویس سایتتان بخواهید این آدرس را برایتان پیدا کند.",
  },
  {
    question: "آیا پایتینو ممکن است اطلاعات نادرست به مشتری بدهد؟",
    answer:
      "پایتینو فقط بر اساس اطلاعات واقعی ثبت‌شده در فروشگاه شما جواب می‌دهد. اگر چیزی (مثل گارانتی یا زمان ارسال) در سیستم ثبت نشده باشد، صادقانه اعلام می‌کند که اطلاعاتی ندارد.",
  },
  {
    question: "آیا پلن رایگان واقعاً رایگان است؟",
    answer:
      "بله. پلن رایگان بدون نیاز به کارت اعتباری یا تعهد است و می‌توانید هر وقت خواستید پلن خود را ارتقا دهید.",
  },
  {
    question: "چطور می‌توانم پلنم را تغییر بدهم؟",
    answer:
      "از داخل داشبورد حساب کاربری‌تان، در هر لحظه می‌توانید پلن خود را ارتقا یا تغییر دهید — بدون قرارداد بلندمدت.",
  },
];

export default function FaqPage() {
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
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-sm font-semibold text-brand">سوالات متداول</p>
          <h1 className="text-balance text-3xl font-bold leading-tight text-foreground md:text-4xl">
            هر چیزی که باید <span className="text-brand">بدانید</span>
          </h1>
        </div>

        <div className="mx-auto mt-16 max-w-2xl">
          <FaqAccordion items={faqs} />
        </div>
      </section>
    </div>
  );
}
