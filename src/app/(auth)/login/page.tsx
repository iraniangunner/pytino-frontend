import type { Metadata } from "next";
import LoginForm from "./_components/LoginForm";

export const metadata: Metadata = {
  title: "ورود",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-[#FAFAF8] px-6 py-16">
      <LoginForm />
    </div>
  );
}
