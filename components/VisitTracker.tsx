"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    fetch("/api/track/visit", { method: "POST" }).catch(() => {
      // si falla, no pasa nada — solo es analítica interna
    });
  }, [pathname]);

  return null;
}
