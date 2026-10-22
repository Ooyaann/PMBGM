import { Suspense } from "react";
import { NavData, NavDataDasar } from "@/components/data-terbuka/nav-data";

export default function LayoutData({ children }: LayoutProps<"/data">) {
  return (
    <div className="kontainer space-y-6 py-8 sm:py-10">
      <Suspense fallback={<NavDataDasar />}>
        <NavData />
      </Suspense>
      {children}
    </div>
  );
}
