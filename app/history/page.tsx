import { HistoryClientPage } from "@/components/client-pages";
import { PageHeader } from "@/components/page-header";

export default function HistoryPage() {
  return (
    <div>
      <PageHeader
        eyebrow="History"
        title="Look back at service data without spreadsheet pain."
        description="Filter by dish, weekday, weather, or exam period to understand whether poor performance came from the menu choice or from the surrounding context."
      />
      <HistoryClientPage />
    </div>
  );
}
