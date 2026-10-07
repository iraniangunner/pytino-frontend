import type { Metadata } from "next";
import StoreStatsContent from "@/app/dashboard/_components/StoreStatsContent";

export const metadata: Metadata = {
  title: "آمار و گزارش",
};

// مسیر: app/dashboard/stores/[storeId]/stats/page.tsx
export default function StoreStatsPage() {
  return <StoreStatsContent />;
}
