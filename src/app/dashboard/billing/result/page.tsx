import type { Metadata } from "next";
import { Suspense } from "react";

import ResultContent from "../../_components/ResultContent";

export const metadata: Metadata = {
  title: "نتیجه پرداخت",
};

export default function ResultPage() {
  return (
    <Suspense fallback={<div>در حال بررسی نتیجه پرداخت...</div>}>
      <ResultContent />
    </Suspense>
  );
}
