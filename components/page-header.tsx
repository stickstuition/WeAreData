export function PageHeader({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5">
      <div className="text-sm font-medium uppercase tracking-[0.18em] text-slate">{eyebrow}</div>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm text-slate">{description}</p>
    </div>
  );
}
