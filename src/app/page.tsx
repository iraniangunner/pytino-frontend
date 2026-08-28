import Image from "next/image";
import Link from "next/link";
import pytino from "../../public/images/pytino_logo.png";
import DemoSection from "@/components/DemoSection";
import HeroCTA from "@/components/HeroCTA";

export default function HomePage() {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden px-6 py-20 md:py-28">
        <div
          className="pointer-events-none absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-brand/10 blur-[100px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-32 top-40 -z-10 h-96 w-96 rounded-full bg-accent/10 blur-[100px]"
          aria-hidden="true"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-semibold text-brand">
              هوش مصنوعی برای کسب‌وکار شما
            </p>
            <h1 className="text-balance text-3xl font-bold leading-tight text-foreground md:text-5xl">
              دستیار هوشمند شما
              <br />
              برای <span className="text-brand">رشد کسب‌وکار</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-8 text-muted-foreground md:text-lg">
              پایتینو با قدرت هوش مصنوعی، فرآیندها را ساده می‌کند. تصمیم‌های
              بهتر می‌سازد و رشد شما را تضمین می‌کند.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <HeroCTA />
              <Link
                href="/#demo"
                className="rounded-xl border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-brand hover:text-brand"
              >
                مشاهده‌ی دمو
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div
              className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-brand/10 blur-[80px]"
              aria-hidden="true"
            />
            <Image
              src={pytino}
              alt="نشان پایتینو"
              width={320}
              height={320}
              className="w-64 drop-shadow-[0_0_45px_rgba(108,92,231,0.25)] md:w-80"
              priority
            />
          </div>
        </div>
      </section>

      <DemoSection />
    </div>
  );
}
