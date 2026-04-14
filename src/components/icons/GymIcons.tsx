import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/**
 * Custom icon set for GymCris — blueprint/technical outline style.
 * All icons use 24x24 viewBox, stroke 2, currentColor.
 * Paths kept intentionally bold and simple so they read at small sizes.
 */
const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Dumbbell seen from the side — two stacked plates on each end + grip */
export function Dumbbell(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      {/* Grip */}
      <path d="M7 12h10" />
      {/* Left weights */}
      <path d="M5 7v10" strokeWidth="2.5" />
      <path d="M2 9v6" strokeWidth="2.5" />
      {/* Right weights */}
      <path d="M19 7v10" strokeWidth="2.5" />
      <path d="M22 9v6" strokeWidth="2.5" />
    </svg>
  );
}

/** IWF olympic plate — concentric rings with weight mark */
export function IWFPlate(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2.5" />
      <path d="M12 18.5V21" />
      <path d="M3 12h2.5" />
      <path d="M18.5 12H21" />
    </svg>
  );
}

/** Clipboard with lines — routine sheet */
export function Clipboard(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <rect x="5" y="4" width="14" height="17" rx="1.5" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 10h6" />
      <path d="M9 14h6" />
      <path d="M9 18h4" />
    </svg>
  );
}

/** Heart with pulse line across it — cardio */
export function HeartPulse(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M20.5 13.5c.9-1.3 1.5-2.8 1.5-4.3 0-3-2.5-5.2-5-5.2-1.6 0-3 .8-4 2-1-1.2-2.4-2-4-2C6.5 4 4 6.2 4 9.2c0 5.3 8 11 8 11s3-2.2 5.5-5" />
      <path d="M3 14h3l1.5-2.5L10 15l1.5-3 1 2H14" />
    </svg>
  );
}

/** Kettlebell — domed top with D-handle */
export function Kettlebell(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      {/* Handle */}
      <path d="M9 6a3 3 0 0 1 6 0" />
      <path d="M9 6v1.5" />
      <path d="M15 6v1.5" />
      {/* Neck */}
      <path d="M8 7.5h8" />
      {/* Bell body */}
      <path d="M7 8.5c-2 1-3.5 3.5-3.5 6.5 0 3.5 3 6 8.5 6s8.5-2.5 8.5-6c0-3-1.5-5.5-3.5-6.5" />
    </svg>
  );
}

/** Weight bench — seat + legs + backrest */
export function Bench(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      {/* Seat */}
      <rect x="3" y="10" width="18" height="3" rx="0.5" />
      {/* Backrest (inclined) */}
      <path d="M14 10V6" strokeWidth="2.5" />
      {/* Front legs */}
      <path d="M5 13v7" />
      <path d="M19 13v7" />
      {/* Feet */}
      <path d="M3 20h4" />
      <path d="M17 20h4" />
    </svg>
  );
}

/** Power rack — two vertical posts with crossbar and J-hooks */
export function Rack(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      {/* Left post */}
      <path d="M5 3v18" strokeWidth="2.5" />
      {/* Right post */}
      <path d="M19 3v18" strokeWidth="2.5" />
      {/* Top crossbar */}
      <path d="M5 5h14" />
      {/* Middle bar (safety) */}
      <path d="M5 12h14" />
      {/* Base feet */}
      <path d="M3 21h5" />
      <path d="M16 21h5" />
    </svg>
  );
}

/** Long-form olympic bar seen from the side — used in large displays only */
export function OlympicBar(props: IconProps) {
  return (
    <svg
      {...base}
      viewBox="0 0 48 24"
      width={48}
      height={24}
      aria-hidden
      {...props}
    >
      <circle cx="6" cy="12" r="4.5" strokeWidth="2" />
      <circle cx="42" cy="12" r="4.5" strokeWidth="2" />
      <path d="M10.5 12h27" strokeWidth="2.5" />
    </svg>
  );
}

/** Chronometer — classic stopwatch with top button */
export function Chronometer(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <circle cx="12" cy="14" r="7" />
      <path d="M12 11v3.5l2 2" />
      <path d="M10 3h4" />
      <path d="M12 3v2" />
      <path d="M18.5 6.5l1-1" />
    </svg>
  );
}

/** Map pin — location marker */
export function MapPin(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M12 22s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

/** Instagram — squircle frame with circle and dot */
export function Instagram(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Facebook — squircle frame with 'f' */
export function Facebook(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M14.5 8h-1.5a1.5 1.5 0 0 0-1.5 1.5V12m0 0v5.5M11.5 12H9.5m2 0h3" />
    </svg>
  );
}

/** User — head and shoulders */
export function User(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

/** Lock — closed padlock */
export function Lock(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Arrow right — straight shaft with chevron head */
export function ArrowRight(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M5 12h14" strokeWidth="2.25" />
      <path d="M13 6l6 6-6 6" strokeWidth="2.25" />
    </svg>
  );
}

/** Chalk block — cube for magnesium */
export function Chalk(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M7 5l10 3-3 11-10-3z" />
      <path d="M7 5l3 11" />
      <path d="M17 8l-3 11" />
      <path d="M7 5l4-2 10 3-4 2" />
    </svg>
  );
}

/** Close — X */
export function Close(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

/** Phone / WhatsApp — classic handset silhouette */
export function Phone(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M4 5a2 2 0 0 1 2-2h2.5a1 1 0 0 1 .97.76l1.1 4.4a1 1 0 0 1-.27.95l-1.9 1.9a14 14 0 0 0 6.6 6.6l1.9-1.9a1 1 0 0 1 .95-.27l4.4 1.1a1 1 0 0 1 .76.97V19a2 2 0 0 1-2 2h-1C10.4 21 3 13.6 3 5V5z" />
    </svg>
  );
}
