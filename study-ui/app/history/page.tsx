import type { Metadata } from "next";
import { HistoryList } from "@/components/history-list";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = { title: "Study history" };

export default function HistoryPage() {
  return (
    <main className="page-container">
      <PageHeading
        eyebrow="Saved study guides"
        title="Study history"
        description="Return to previously generated material and keep building on what you have learned."
      />
      <div className="mt-10">
        <HistoryList />
      </div>
    </main>
  );
}
