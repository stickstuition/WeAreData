import { RecommendationsClientPage } from "@/components/client-pages";
import { PageHeader } from "@/components/page-header";

export default function RecommendationsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Recommendations"
        title="Explainable next-step advice for future menu planning."
        description="The recommendation engine stays rule-based and demo-friendly so stakeholders can understand why the app suggests a dish, flags waste, or warns about poor pairing choices."
      />
      <RecommendationsClientPage />
    </div>
  );
}
