import type { Metadata } from "next";
import NewStoreForm from "../../_components/NewStoreForm";

export const metadata: Metadata = {
  title: "ساخت فروشگاه جدید",
};

export default function NewStorePage() {
  return (
    <div className="mx-auto max-w-lg">
      <NewStoreForm />
    </div>
  );
}