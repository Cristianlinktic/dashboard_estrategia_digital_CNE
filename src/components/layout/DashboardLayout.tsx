"use client";

import React, { Suspense } from "react";
import { Topbar } from "./Topbar";
import { usePathname, useRouter } from "next/navigation";
import { useLayout } from "@/context/LayoutContext";

export function DashboardLayout({ children, isAuthenticated }: { children: React.ReactNode, isAuthenticated?: boolean }) {
  const { isPresentationMode } = useLayout();
  const router = useRouter();
  const pathname = usePathname();

  // If we had login, we could return children only if not authenticated, etc.
  // For now, we assume it's always the dashboard view.

  return (
    <div className="flex flex-col bg-[#f8fafc] overflow-hidden" style={{ height: '100dvh' }}>
      <Topbar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
