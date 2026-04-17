import { InputClientPage } from "@/components/client-pages";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";

export default function InputPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Daily Input"
        title="Enter one full service in under two minutes."
        description="Large tap targets, dropdowns, and repeated dish cards keep the workflow quick and predictable on a phone."
      />
      <SectionCard title="End-of-Day Entry" subtitle="Save multiple dishes for one date in a single action.">
        <InputClientPage />
      </SectionCard>
    </div>
  );
}
