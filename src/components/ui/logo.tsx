import { cn } from "@/lib/utils";

/**
 * Brand mark: a notched square (a "block of material") with a lime
 * four-point spark — the forge. Kept as inline SVG so it stays crisp and
 * themable.
 */
export function LogoMark({ size = 26, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M8 3.5h16a4.5 4.5 0 0 1 4.5 4.5v12L23 25.5H8A4.5 4.5 0 0 1 3.5 21V8A4.5 4.5 0 0 1 8 3.5Z"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1.4"
      />
      <path
        d="M25.5 20.5v-3.2"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="1.4"
      />
      <path
        d="M16 8.6c.5 3.2 2.1 4.8 5.3 5.3-3.2.5-4.8 2.1-5.3 5.3-.5-3.2-2.1-4.8-5.3-5.3 3.2-.5 4.8-2.1 5.3-5.3Z"
        fill="var(--lime)"
      />
      <circle cx="9.4" cy="9.4" r="1.15" fill="currentColor" fillOpacity="0.45" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="text-ink" />
      <div className="flex items-baseline gap-1.5">
        <span className="text-[13.5px] font-semibold uppercase tracking-[0.14em] text-ink">
          VibeForge
        </span>
        <span className="rounded border border-lime/25 bg-lime/[0.08] px-1 py-px font-mono text-[8.5px] uppercase tracking-[0.12em] text-lime/90">
          alpha
        </span>
      </div>
    </div>
  );
}
