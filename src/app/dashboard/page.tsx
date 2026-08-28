import type { Metadata } from "next";
import OverviewContent from "./_components/OverviewContent";

export const metadata: Metadata = {
  title: "داشبورد",
};

export default function DashboardOverviewPage() {
  return <OverviewContent />;
}
