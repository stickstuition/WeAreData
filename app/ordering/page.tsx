import { OrderingClientPage } from "@/components/client-pages";
import { PageHeader } from "@/components/page-header";

export default function OrderingPage() {
  return (
    <div>
      <PageHeader title="Ordering" />
      <OrderingClientPage />
    </div>
  );
}
