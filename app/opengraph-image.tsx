// The default social card, for every page that doesn't set its own.
//
// Generated rather than shipped as a file so it can't drift from the product's
// own colours, and so the template count is read from the source instead of
// baked into a PNG somebody has to remember to re-export.
//
// Pages with a better image of their own — the template detail pages, which
// preview the actual template — override this by declaring openGraph.images.

import { ImageResponse } from "next/og";

import { TEMPLATES } from "@/lib/templates";

export const alt =
  "meniacv — free resume and CV builder with ATS-ready templates";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f1ea",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#1b1533",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            m
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, color: "#1b1533" }}>
            meniacv
          </div>
        </div>

        {/* Satori needs an explicit display on anything with more than one
            child — it implements a subset of flexbox and has no block layout
            to fall back on. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.08,
              color: "#1b1533",
              letterSpacing: "-0.02em",
            }}
          >
            Build a job-winning
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.08,
              color: "#1b1533",
              letterSpacing: "-0.02em",
            }}
          >
            resume for free
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 29,
              lineHeight: 1.4,
              color: "#4a4460",
              maxWidth: 900,
            }}
          >
            {TEMPLATES.length} ATS-ready templates · unlimited watermark-free
            PDFs · no card
          </div>
        </div>
      </div>
    ),
    size,
  );
}
