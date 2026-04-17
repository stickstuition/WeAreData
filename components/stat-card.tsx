import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  helper,
  tone = "neutral"
}: {
  label: string;
  value: string;
  helper: string;
  tone?: "neutral" | "good" | "warning";
}) {
  return (
    <div
      className={cn(
        "rounded-[24px] border p-4",
        tone === "good" && "border-sage/30 bg-sage/10",
        tone === "warning" && "border-coral/30 bg-coral/10",
        tone === "neutral" && "border-slate-200 bg-mist"
      )}
    >
      <div className="text-sm text-slate">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-sm text-slate">{helper}</div>
    </div>
  );
}
