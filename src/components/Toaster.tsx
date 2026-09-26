"use client";

import { Toaster as SonnerToaster } from "sonner";

export default function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      theme="dark"
      richColors={false}
      toastOptions={{
        style: {
          background: "#15171e",
          border: "1px solid rgba(63, 63, 70, 0.6)",
          color: "#ffffff",
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
          borderRadius: "12px",
          padding: "12px 16px",
        },
        classNames: {
          title: "font-medium text-sm text-white",
          description: "text-xs text-zinc-400",
          actionButton: "bg-[#bef264] text-black font-semibold text-xs px-3 py-1.5 rounded-md hover:bg-[#a6d83b]",
          cancelButton: "bg-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-md hover:bg-zinc-700",
        },
      }}
    />
  );
}
