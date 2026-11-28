"use client";

import { SessionProvider } from "next-auth/react";
import OfflineSupport from "@/components/OfflineSupport";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <OfflineSupport />
      {children}
    </SessionProvider>
  );
}
