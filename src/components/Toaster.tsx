"use client";

import { Toaster as SonnerToaster } from "sonner";

export default function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      theme="dark"
      richColors={false}
      visibleToasts={4}
      expand={true}
      duration={1500}
      offset={100}
      mobileOffset={{ top: 75, bottom: 24, left: 16, right: 16 }}
      toastOptions={{
        style: {
          background: "#15171e",
          border: "1px solid rgba(190, 242, 100, 0.3)",
          color: "#ffffff",
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
          borderRadius: "12px",
          padding: "12px 16px",
          willChange: "transform, opacity",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          backdropFilter: "blur(8px)",
        },
        classNames: {
          title: "font-semibold text-xs sm:text-sm text-white",
          description: "text-xs text-zinc-400",
          actionButton:
            "bg-[#bef264] text-black font-semibold text-xs px-3 py-1.5 rounded-md hover:bg-[#a6d83b] transition-all duration-200 ease-out active:scale-95",
          cancelButton:
            "bg-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-md hover:bg-zinc-700 transition-all duration-200 ease-out active:scale-95",
        },
      }}
    />
  );
}