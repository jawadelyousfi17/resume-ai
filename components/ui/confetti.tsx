"use client";

// Paper in the air, for the two moments worth marking: the early-supporter
// thank-you, and a first resume going out the door.

import { useEffect, useRef } from "react";

/**
 * Paper in the air: two bursts from the lower corners, then gravity.
 *
 * Canvas rather than DOM nodes — a hundred and fifty absolutely positioned
 * divs being transformed every frame is what makes this kind of thing stutter.
 * It sits above the dialog and ignores the pointer, so nothing here can get
 * between a user and the button they came to press. Anyone who has asked for
 * less motion gets none of it.
 */
export function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // The page's own accents, plus enough warmth that it reads as a party
    // rather than a UI. Whatever theme is on, the confetti belongs to it.
    const styles = getComputedStyle(document.documentElement);
    const themed = ["--color-brand", "--color-navy"]
      .map((name) => styles.getPropertyValue(name).trim())
      .filter(Boolean);
    const colors = [...themed, "#f5b53d", "#ef6f6c", "#3ec9a7", "#7c6cf0"];

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    interface Piece {
      x: number;
      y: number;
      vx: number;
      vy: number;
      w: number;
      h: number;
      spin: number;
      angle: number;
      color: string;
    }

    const pieces: Piece[] = [];

    /** One burst, thrown up and inward from a corner. */
    const burst = (fromLeft: boolean) => {
      const originX = fromLeft ? 0 : width;
      for (let i = 0; i < 55; i++) {
        // Roughly 20°–70° above the horizon, aimed across the screen. Thrown
        // hard, so most of it is past the dialog rather than hanging over the
        // words somebody is trying to read.
        const angle = (Math.PI / 9) * (1 + Math.random() * 2.5);
        const speed = 15 + Math.random() * 13;
        pieces.push({
          x: originX,
          y: height * (0.85 + Math.random() * 0.1),
          vx: Math.cos(angle) * speed * (fromLeft ? 1 : -1),
          vy: -Math.sin(angle) * speed,
          w: 6 + Math.random() * 5,
          h: 9 + Math.random() * 7,
          spin: (Math.random() - 0.5) * 0.3,
          angle: Math.random() * Math.PI,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    burst(true);
    burst(false);
    // A second pair, once the first is at the top of its arc — one throw looks
    // like a glitch, two looks like a celebration.
    const again = window.setTimeout(() => {
      burst(true);
      burst(false);
    }, 420);

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      // Normalised to 60fps, so a 120Hz screen doesn't play it twice as fast.
      const step = Math.min((now - last) / 16.67, 3);
      last = now;

      ctx.clearRect(0, 0, width, height);

      for (const p of pieces) {
        p.vy += 0.32 * step; // gravity
        p.vx *= 0.994 ** step; // drag, so the throw loses its sideways push
        p.x += p.vx * step;
        p.y += p.vy * step;
        p.angle += p.spin * step;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        // Scaled by the cosine of its own spin: a flat rectangle turning edge
        // on is what makes it read as paper rather than a brick.
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.angle)));
        ctx.restore();
      }

      // Everything has fallen past the bottom: stop, rather than burn a frame
      // a second forever on an empty canvas.
      if (pieces.every((p) => p.y - p.h > height)) {
        ctx.clearRect(0, 0, width, height);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      window.clearTimeout(again);
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  );
}
