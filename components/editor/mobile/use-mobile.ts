"use client";

import { useEffect, useState } from "react";

import { MOBILE_QUERY } from "@/lib/device";

/**
 * True on a phone-sized screen. Seeded with what the server guessed from the
 * User-Agent so the first paint is already the right layout, then corrected
 * against the real viewport on mount — a narrow window on a laptop counts,
 * a phone held in landscape stops counting.
 */
export function useIsMobile(initial: boolean) {
  const [mobile, setMobile] = useState(initial);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return mobile;
}
