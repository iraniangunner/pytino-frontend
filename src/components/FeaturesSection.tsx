// components/FeaturesSection.tsx

const features = [
  {
    icon: "🎯",
    title: "فهم واقعی، نه فقط جستجوی کلمه‌ای",
    description:
      "وقتی مشتری می‌پرسه «گردنبند زیر ۵۰۰ تومن دارید؟»، پایتینو می‌فهمه گردنبند یعنی زنجیر و پلاک — نه اینکه فقط دنبال کلمه‌ی دقیق بگرده.",
  },
  {
    icon: "🧠",
    title: "تخصصی برای فروشگاه شما",
    description:
      "پایتینو مستقیم به کاتالوگ محصولاتتون وصل می‌شه و مفاهیمی که مشتری‌های واقعی به کار می‌برن رو یاد می‌گیره — بدون نیاز به طراحی پیچیده‌ی جریان مکالمه.",
  },
  {
    icon: "💬",
    title: "صادق، نه حدس‌زن",
    description:
      "اگه اطلاعاتی مثل گارانتی یا زمان ارسال ثبت نشده، پایتینو صادقانه می‌گه اطلاعات نداره — نه اینکه جواب الکی بسازه و اعتماد مشتری رو خراب کنه.",
  },
  {
    icon: "⚡",
    title: "راه‌اندازی در چند دقیقه",
    description:
      "فقط آدرس محصولات سایتتون رو بدید — پایتینو خودش ساختار داده‌تون رو تشخیص می‌ده و آماده می‌شه.",
  },
  {
    icon: "💰",
    title: "شروعی بدون هزینه و بدون ریسک",
    description:
      "از پلن رایگان شروع کنید، بدون نیاز به تعهد یا قرارداد بلندمدت.",
  },
  {
    icon: "🔍",
    title: "جستجوی هوشمند محصول",
    description:
      "فیلتر قیمت، دسته‌بندی و برند به‌صورت خودکار روی درخواست مشتری اعمال می‌شه تا دقیق‌ترین نتیجه نمایش داده بشه.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden px-6 py-20 md:py-28"
    >
      <div
        className="pointer-events-none absolute -left-32 top-10 -z-10 h-96 w-96 rounded-full bg-accent/10 blur-[100px]"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-sm font-semibold text-brand">چرا پایتینو</p>
          <h2 className="text-balance text-3xl font-bold leading-tight text-foreground md:text-4xl">
            دستیاری که واقعاً
            <br />
            <span className="text-brand">محصولاتتون را می‌شناسد</span>
          </h2>
          <p className="mt-6 text-base leading-8 text-muted-foreground md:text-lg">
            برخلاف چت‌بات‌های عمومی، پایتینو مستقیم روی کاتالوگ فروشگاه شما کار
            می‌کند — نه یک ابزار پشتیبانی عمومی که باید ساعت‌ها برایش جریان
            مکالمه طراحی کنید.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-border bg-background/50 p-6 transition-colors hover:border-brand"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-2xl">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
