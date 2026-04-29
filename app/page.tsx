import { DashboardClientPage } from "@/components/client-pages";
import { PageHeader } from "@/components/page-header";

export default function HomePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Operation Zone"
        title="Dashboard"
        description="Build the Day 1-5 weekly plan by food category. The chosen dishes become the data source for DailyItemLab without duplicating the planning UI."
      />
      <DashboardClientPage />
    </div>
  );
}
