import { InsightsClientPage } from "@/components/client-pages";
import { PageHeader } from "@/components/page-header";

export default function InsightsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Insights"
        title="See the patterns behind good and bad menu days."
        description="This view turns history into explainable trends: weekday strength, context effects, and a ranking of dishes by cost efficiency and consistency."
      />
      <InsightsClientPage />
    </div>
  );
}
