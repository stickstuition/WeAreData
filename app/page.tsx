import { DashboardClientPage } from "@/components/client-pages";
import { PageHeader } from "@/components/page-header";

export default function HomePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Dashboard"
        title="A clear read on waste, demand, and menu quality."
        description="This home view gives Suzanna a fast end-of-day summary: how much was made, how much sold, where waste is building up, and which dishes look safe or risky for future planning."
      />
      <DashboardClientPage />
    </div>
  );
}
