import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceso · Estrategia Digital",
  description: "Ingresa tu contraseña para acceder al dashboard",
};

// This layout intentionally omits DashboardLayout so the login
// page renders full-screen without sidebar/topbar.
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
