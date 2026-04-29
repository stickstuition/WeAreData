import { InsightClientPage } from "@/components/client-pages";
import { PageHeader } from "@/components/page-header";

export default function InsightPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Data Analytics Zone"
        title="Insight"
        description="Compare costs, revenue, purchase order values, and unit pricing through the required analysis modules."
      />
      <InsightClientPage />
    </div>
  );
}
