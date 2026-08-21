"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StudyMaterial } from "@/components/study-material";
import { getStudySession } from "@/lib/client-api";
import { formatStudyDate } from "@/lib/format";
import type { StudyRecord } from "@/types/study";

export function HistoryDetail({ id }: { id: string }) {
  const [record, setRecord] = useState<StudyRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    getStudySession(id)
      .then((response) => {
        if (isCurrent) setRecord(response);
      })
      .catch((caughtError: unknown) => {
        if (isCurrent) {
          setError(caughtError instanceof Error ? caughtError.message : "This study guide could not be loaded.");
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [id]);

  if (error) {
    return (
      <div className="surface-card mx-auto max-w-xl p-8 text-center" role="alert">
        <h1 className="text-2xl font-bold">Study guide unavailable</h1>
        <p className="mt-3 text-black/65">{error}</p>
        <Link href="/history" className="primary-button mt-6">Back to history</Link>
      </div>
    );
  }

  if (!record) {
    return <div className="h-96 animate-pulse rounded-2xl bg-black/5" aria-label="Loading study guide" />;
  }

  return (
    <>
      <p className="mb-5 text-sm text-black/55">Saved {formatStudyDate(record.createdAt)}</p>
      <StudyMaterial material={record} />
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/history" className="secondary-button">Back to history</Link>
        <Link href="/" className="primary-button">Start a new study</Link>
      </div>
    </>
  );
}
