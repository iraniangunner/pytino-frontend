import type { Metadata } from "next";
import ConversationsContent from "@/app/dashboard/_components/ConversationsContent";

export const metadata: Metadata = {
  title: "تاریخچه ی مکالمات",
};

export default function ConversationsPage() {
  return <ConversationsContent />;
}
