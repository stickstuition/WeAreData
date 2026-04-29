import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  subtitle,
  className,
  children
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-lg border border-white/70 bg-white/90 p-5 shadow-soft", className)}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}
