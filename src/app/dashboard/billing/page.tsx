import type { Metadata } from "next";
import BillingContent from "../_components/BillingContent";

export const metadata: Metadata = {
  title: "صورت حساب",
};

export default function BillingPage() {
  return <BillingContent />;
}
