import { InsightClientPage } from "@/components/client-pages";
import { PageHeader } from "@/components/page-header";

export default function InsightPage() {
  return (
    <div>
      <PageHeader
        title="Insights"
      />
      <InsightClientPage />
    </div>
  );
}
