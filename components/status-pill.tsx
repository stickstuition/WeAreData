import { cn } from "@/lib/utils";

export function StatusPill({
  children,
  tone
}: {
  children: React.ReactNode;
  tone: "good" | "warning" | "neutral";
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        tone === "good" && "bg-sage/15 text-sage",
        tone === "warning" && "bg-coral/15 text-coral",
        tone === "neutral" && "bg-gold/15 text-amber-800"
      )}
    >
      {children}
    </span>
  );
}
