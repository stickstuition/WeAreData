import { DailyItemLabClientPage } from "@/components/client-pages";
import { PageHeader } from "@/components/page-header";

export default function DailyItemLabPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Operation Zone"
        title="DailyItemLab"
        description="Prepare the selected Dashboard day with recipes, suppliers, forecasts, two-day purchasing logic, and digital variance notes."
      />
      <DailyItemLabClientPage />
    </div>
  );
}
