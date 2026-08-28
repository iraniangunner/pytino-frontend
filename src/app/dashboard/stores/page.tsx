import type { Metadata } from "next";
import StoresContent from "../_components/StoresContent";

export const metadata: Metadata = {
  title: "فروشگاه های من",
};

export default function StoresPage() {
  return <StoresContent />;
}