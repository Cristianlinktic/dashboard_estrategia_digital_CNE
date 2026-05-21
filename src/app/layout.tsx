import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LayoutProvider } from "@/context/LayoutContext";
import { Suspense } from "react";
import { headers } from "next/headers";
import StyledJsxRegistry from "./registry";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Estrategia Digital - Dashboard",
  description: "Plataforma de métricas de estrategia digital para actores electorales",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const role = headersList.get("x-user-role") ?? "viewer";
  const isLoginPage = pathname === "/login";

  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen antialiased bg-[var(--background)] text-[var(--foreground)] overflow-hidden`}>
        <StyledJsxRegistry>
          {isLoginPage ? (
            children
          ) : (
            <LayoutProvider initialRole={role}>
              <Suspense fallback={<div className="h-screen w-screen bg-[#f8fafc] flex items-center justify-center">Cargando dashboard...</div>}>
                <DashboardLayout>
                  {children}
                </DashboardLayout>
              </Suspense>
            </LayoutProvider>
          )}
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
