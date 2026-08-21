import type { Metadata } from "next";
import { HistoryDetail } from "@/components/history-detail";

export const metadata: Metadata = { title: "Saved study guide" };

interface HistoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function HistoryDetailPage({ params }: HistoryDetailPageProps) {
  const { id } = await params;

  return (
    <main className="page-container">
      <HistoryDetail id={id} />
    </main>
  );
}
