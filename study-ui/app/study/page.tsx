import type { Metadata } from "next";
import { LatestStudy } from "@/components/latest-study";

export const metadata: Metadata = { title: "Study guide" };

export default function StudyPage() {
  return (
    <main className="page-container">
      <LatestStudy />
    </main>
  );
}
