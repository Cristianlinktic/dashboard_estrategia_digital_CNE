"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface LayoutContextType {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isPresentationMode: boolean;
  setPresentationMode: (isActive: boolean) => void;
  userRole: string;
  setUserRole: (role: string) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children, initialRole = "viewer" }: { children: React.ReactNode, initialRole?: string }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPresentationMode, setPresentationMode] = useState(false);
  const [userRole, setUserRole] = useState(initialRole);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <LayoutContext.Provider
      value={{
        isSidebarOpen,
        setSidebarOpen,
        isFullscreen,
        toggleFullscreen,
        isPresentationMode,
        setPresentationMode,
        userRole,
        setUserRole,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
