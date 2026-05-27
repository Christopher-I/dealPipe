import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  withWordmark?: boolean;
  className?: string;
};

const sizeMap = {
  sm: { disc: "w-9 h-9", text: "text-[15px]" },
  md: { disc: "w-11 h-11", text: "text-[18px]" },
  lg: { disc: "w-14 h-14", text: "text-[22px]" },
} as const;

export function Logo({ size = "md", withWordmark = true, className }: LogoProps) {
  const s = sizeMap[size];
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center",
          s.disc,
        )}
        style={{ backgroundColor: "var(--color-ink)" }}
      >
        <span
          className={cn("font-serif font-medium", s.text)}
          style={{ color: "var(--color-text-on-ink)" }}
        >
          №
        </span>
      </div>
      {withWordmark && (
        <div className="flex flex-col leading-tight">
          <span
            className="font-medium"
            style={{
              color: "var(--color-text)",
              fontSize: "var(--text-label)",
            }}
          >
            DealPipe
          </span>
          <span
            style={{
              color: "var(--color-text-muted)",
              fontSize: "var(--text-meta)",
            }}
          >
            CRE Pipeline
          </span>
        </div>
      )}
    </div>
  );
}
