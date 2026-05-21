"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLayout } from "@/context/LayoutContext";
import { Maximize2, Minimize2, Play, Pause, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransition, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export function Topbar() {
  const { isFullscreen, toggleFullscreen, isPresentationMode, setPresentationMode, userRole } = useLayout();
  const [isPending, startTransition] = useTransition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = useCallback(async () => {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  }, [router]);

  const navLinks = [
    { href: "/cne", label: "Estrategia" },
    { href: "/listening", label: "Listening" },
  ];

  return (
    <>
      <header className="h-16 px-6 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between w-full flex-shrink-0 transition-all duration-300">

        {/* Logo y Navegación */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Hamburger - solo móvil */}
          <button
            className="sm:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Image
            src="/Logo-Actores-Electorales.png"
            alt="Logo Actores Electorales"
            width={150}
            height={30}
            priority
            className="h-6 md:h-7 w-auto object-contain"
          />
          <div className="h-6 w-px bg-slate-200 hidden md:block" />
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs md:text-sm font-black uppercase tracking-widest transition-colors",
                  pathname === link.href
                    ? "bg-[#003893] text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-[#003893]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Espacio derecho: Controles, Usuario y Logout */}
        <div className="flex items-center space-x-2">

          {/* Presentation Mode Button */}
          <button
            onClick={() => setPresentationMode(!isPresentationMode)}
            className={cn(
              "p-2 rounded-xl transition-all duration-200 flex items-center gap-2",
              isPresentationMode
                ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                : "text-slate-400 hover:text-[#003893] hover:bg-slate-50"
            )}
            title={isPresentationMode ? "Detener Presentación" : "Iniciar Presentación"}
          >
            {isPresentationMode ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          <div className="h-8 w-px bg-slate-100 mx-1" />

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-400 hover:text-[#003893] hover:bg-slate-50 rounded-xl transition-all duration-200"
            title={isFullscreen ? "Salir de Pantalla Completa" : "Pantalla Completa"}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          <div className="h-8 w-px bg-slate-100 mx-1" />

          <div className="hidden md:flex items-center gap-3">
            <div className="rounded-full p-1 shadow-sm border border-slate-100 bg-white">
              <div className={cn(
                "px-3 h-7 rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-tight",
                userRole === 'viewer' ? "text-amber-700 bg-amber-50" : "text-[#003893] bg-slate-50"
              )}>
                {userRole === 'viewer' ? "MODO LECTURA" : "MODO ADMIN"}
              </div>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-100 mx-1" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
            title="Cerrar Sesión"
            aria-label="Cerrar Sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop oscuro */}
          <div
            className="sm:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Panel del menú */}
          <div className="sm:hidden fixed top-16 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-colors",
                    pathname === link.href
                      ? "bg-[#003893] text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-[#003893]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 pt-2 border-t border-slate-100">
                <div className={cn(
                  "px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-tight text-center",
                  userRole === 'viewer' ? "text-amber-700 bg-amber-50" : "text-[#003893] bg-blue-50"
                )}>
                  {userRole === 'viewer' ? "MODO LECTURA" : "MODO ADMIN"}
                </div>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
