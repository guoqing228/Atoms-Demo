import { cn } from "@/lib/utils";

export function Kbd({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded border border-line bg-ink/[0.05] px-1 font-mono text-[10px] leading-none text-faint",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

/** Editorial section label, e.g. "01 / RECENT PROJECTS" */
export function Eyebrow({
  index,
  children,
  className,
}: {
  index?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint",
        className,
      )}
    >
      {index ? <span className="text-lime/80">{index}</span> : null}
      {index ? <span className="h-px w-3 bg-ink/15" /> : null}
      <span>{children}</span>
    </div>
  );
}
