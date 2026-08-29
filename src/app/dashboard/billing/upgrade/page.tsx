import type { Metadata } from "next";
import { Suspense } from "react";

import UpgradeContent from "../../_components/UpgradeContent";

export const metadata: Metadata = {
  title: "ارتقای پلن",
};

export default function UpgradePage() {
  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <UpgradeContent />
    </Suspense>
  );
}
