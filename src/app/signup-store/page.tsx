import type { Metadata } from "next";
import SignupForm from "./_components/SignupForm";

export const metadata: Metadata = {
  title: "ثبت نام دستیار فروشگاهی",
};

export default function SignupPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#FAFAF8] px-6 py-16">
      <div className="mx-auto max-w-lg">
        <SignupForm />
      </div>
    </main>
  );
}
