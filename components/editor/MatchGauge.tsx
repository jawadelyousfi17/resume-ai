"use client";

// The match score, drawn as a half-dial.
//
// A ring reads as "how much of something is done"; a dial reads as "where on a
// range this sits", which is what a fit score is. The band carries the whole
// range in colour — poor at the left, strong at the right — and the marker
// says where this resume landed on it, so the number has somewhere to stand
// rather than floating on its own.
//
// All geometry is in viewBox units, so the whole thing scales with its
// container and there is nothing to re-tune per breakpoint.

import { useId } from "react";

/** Centre of the dial, and the two radii the band runs between. */
const CX = 115;
const CY = 111;
const R_OUT = 106;
const R_IN = 84;
const R_MID = (R_OUT + R_IN) / 2;

/** Where the ticks fall — four of them, cutting the range into fifths. */
const TICKS = [0.2, 0.4, 0.6, 0.8];

/**
 * A point on the dial. `t` runs 0 (left, a score of nothing) to 1 (right, full
 * marks), sweeping over the top.
 */
function point(t: number, radius: number) {
  const angle = Math.PI * t;
  return {
    x: CX - radius * Math.cos(angle),
    y: CY - radius * Math.sin(angle),
  };
}

/** The band between two radii, from `from` to `to` along the dial. */
function segment(from: number, to: number) {
  const a = point(from, R_OUT);
  const b = point(to, R_OUT);
  const c = point(to, R_IN);
  const d = point(from, R_IN);
  return [
    `M ${a.x} ${a.y}`,
    `A ${R_OUT} ${R_OUT} 0 0 1 ${b.x} ${b.y}`,
    `L ${c.x} ${c.y}`,
    `A ${R_IN} ${R_IN} 0 0 0 ${d.x} ${d.y}`,
    "Z",
  ].join(" ");
}

export function MatchGauge({
  value,
  color,
}: {
  /** The score, 0–100. */
  value: number;
  /** The marker's fill — the band colour this score falls in. */
  color: string;
}) {
  // Ids have to be unique in the document, and this could render twice on a
  // wide screen one day.
  const uid = useId();
  const range = `range-${uid}`;
  const ticks = `ticks-${uid}`;
  const shadow = `shadow-${uid}`;

  const t = Math.min(1, Math.max(0, value / 100));
  const marker = point(t, R_MID);

  return (
    <svg
      // Margin on every side of the dial itself, which spans x 9–221 and y
      // 5–111: the marker overhangs the band by its own radius at both ends,
      // and its shadow overhangs that. Without the padding a score near 50
      // gets the top of its shadow cut off.
      viewBox="-5 -7 240 145"
      className="w-full"
      role="img"
      aria-label={`Match score: ${value} out of 100`}
    >
      <defs>
        {/* Left to right across the dial: a long way off, through nearly
            there, to a strong match. */}
        <linearGradient id={range} x1="9" y1="0" x2="221" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffd0d5" />
          <stop offset="0.5" stopColor="#fddb8c" />
          <stop offset="1" stopColor="#c6e4d2" />
        </linearGradient>
        <linearGradient id={ticks} x1="9" y1="0" x2="221" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fb4458" />
          <stop offset="0.5" stopColor="#cf760d" />
          <stop offset="1" stopColor="#339d5d" />
        </linearGradient>
        <filter id={shadow} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="3"
            floodColor="#202531"
            floodOpacity="0.18"
          />
        </filter>
      </defs>

      {/* The whole range, then the part beyond this score painted back out —
          cheaper than clipping a gradient, and the seam lands exactly on the
          marker either way. */}
      <path d={segment(0, 1)} fill={`url(#${range})`} />
      {t < 1 && (
        <path d={segment(t, 1)} className="fill-field" />
      )}

      {TICKS.map((tick) => {
        const from = point(tick, R_IN + 4);
        const to = point(tick, R_OUT - 4);
        return (
          <line
            key={tick}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            strokeWidth="3.5"
            strokeLinecap="round"
            // Ticks under the filled part take the range's own colour; the
            // rest go quiet, which is what makes the fill legible at a glance.
            stroke={tick <= t ? `url(#${ticks})` : "currentColor"}
            className={tick <= t ? undefined : "text-ink-faint/35"}
          />
        );
      })}

      <g filter={`url(#${shadow})`}>
        <circle cx={marker.x} cy={marker.y} r="15" className="fill-panel" />
        <circle cx={marker.x} cy={marker.y} r="10.5" fill={color} />
      </g>

      <text
        x={CX}
        y={86}
        textAnchor="middle"
        className="fill-ink"
        style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.04em" }}
      >
        {value}
        <tspan style={{ fontSize: 27, fontWeight: 600 }}>%</tspan>
      </text>
      <text
        x={CX}
        y={106}
        textAnchor="middle"
        className="fill-ink-faint"
        style={{ fontSize: 13, fontWeight: 600 }}
      >
        Your match score
      </text>
    </svg>
  );
}
