"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { getStudySessions } from "@/lib/client-api";
import { createSummary, formatStudyDate } from "@/lib/format";
import type { PageResponse, StudyRecord } from "@/types/study";

const PAGE_SIZE = 6;

export function HistoryList() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PageResponse<StudyRecord> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(async (requestedPage: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getStudySessions(requestedPage, PAGE_SIZE);
      setData(response);
      setPage(response.number);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Study history could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCurrent = true;

    getStudySessions(0, PAGE_SIZE)
      .then((response) => {
        if (!isCurrent) return;
        setData(response);
        setPage(response.number);
      })
      .catch((caughtError: unknown) => {
        if (!isCurrent) return;
        setError(caughtError instanceof Error ? caughtError.message : "Study history could not be loaded.");
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  if (isLoading && !data) {
    return <HistoryLoading />;
  }

  if (error && !data) {
    return <HistoryError message={error} onRetry={() => void loadPage(page)} />;
  }

  if (!data || data.empty) {
    return (
      <div className="surface-card p-8 text-center sm:p-12">
        <h2 className="text-xl font-bold">Your history is ready for its first topic</h2>
        <p className="mt-2 text-black/60">Generated study guides will appear here automatically.</p>
        <Link href="/" className="primary-button mt-6">Create a study guide</Link>
      </div>
    );
  }

  return (
    <div aria-busy={isLoading}>
      {error ? (
        <p className="mb-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-950" role="alert">
          {error}
        </p>
      ) : null}

      <div className={`grid gap-4 transition-opacity ${isLoading ? "opacity-50" : "opacity-100"}`}>
        {data.content.map((record) => (
          <article key={record.id} className="surface-card p-5 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-[-0.03em] sm:text-2xl">{record.topic}</h2>
                <time dateTime={record.createdAt} className="mt-1 block text-sm text-black/55">
                  {formatStudyDate(record.createdAt)}
                </time>
              </div>
              <span className="w-fit rounded-full bg-[var(--blue)] px-3 py-1.5 text-xs font-bold text-black">
                {record.difficulty}
              </span>
            </div>
            <p className="mt-5 max-w-4xl leading-7 text-black/65">{createSummary(record.explanation)}</p>
            <div className="mt-5 flex justify-end">
              <Link href={`/history/${record.id}`} className="button-link">
                View guide
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {data.totalPages > 1 ? (
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-3" aria-label="Study history pagination">
          <button
            type="button"
            className="secondary-button"
            disabled={data.first || isLoading}
            onClick={() => void loadPage(page - 1)}
          >
            Previous
          </button>
          <span className="px-2 text-sm font-semibold">
            Page {page + 1} of {data.totalPages}
          </span>
          <button
            type="button"
            className="secondary-button"
            disabled={data.last || isLoading}
            onClick={() => void loadPage(page + 1)}
          >
            Next
          </button>
        </nav>
      ) : null}
    </div>
  );
}

function HistoryLoading() {
  return (
    <div className="grid animate-pulse gap-4" aria-label="Loading study history">
      {[0, 1, 2].map((item) => <div key={item} className="h-48 rounded-2xl bg-black/5" />)}
    </div>
  );
}

function HistoryError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="surface-card p-8 text-center" role="alert">
      <h2 className="text-xl font-bold">History is unavailable</h2>
      <p className="mt-2 text-black/65">{message}</p>
      <button type="button" onClick={onRetry} className="primary-button mt-6">Try again</button>
    </div>
  );
}
