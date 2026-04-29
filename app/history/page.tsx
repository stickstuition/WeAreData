import { HistoryClientPage } from "@/components/client-pages";
import { PageHeader } from "@/components/page-header";

export default function HistoryPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Data Analytics Zone"
        title="History"
        description="Store and review operational history: people, sales, revenue, P.O. trends per dish, overtime impact, and dish type performance."
      />
      <HistoryClientPage />
    </div>
  );
}
