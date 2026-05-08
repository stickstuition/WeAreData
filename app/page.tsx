import { DashboardClientPage } from "@/components/client-pages";
import { PageHeader } from "@/components/page-header";

export default function HomePage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
      />
      <DashboardClientPage />
    </div>
  );
}
