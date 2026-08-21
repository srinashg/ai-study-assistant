"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { RESULT_STORAGE_KEY } from "@/components/new-study-form";
import { StudyMaterial } from "@/components/study-material";
import type { StudyMaterialView } from "@/types/study";

export function LatestStudy() {
  const stored = useSyncExternalStore(
    subscribeToResult,
    readStoredResult,
    getServerResultSnapshot,
  );
  const material = parseStoredResult(stored);

  if (material === undefined) {
    return <StudyLoading />;
  }

  if (material === null) {
    return (
      <div className="surface-card mx-auto max-w-xl p-7 text-center sm:p-10">
        <h1 className="text-2xl font-bold tracking-[-0.04em]">No current study guide</h1>
        <p className="mt-3 leading-7 text-black/65">
          Generate a new topic or choose a saved guide from your study history.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="primary-button">
            Start a new study
            <ArrowRightIcon className="size-5" />
          </Link>
          <Link href="/history" className="secondary-button">View history</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <StudyMaterial material={material} />
      <div className="mt-8 flex justify-center">
        <Link href="/" className="primary-button">
          Generate another topic
          <ArrowRightIcon className="size-5" />
        </Link>
      </div>
    </>
  );
}

function subscribeToResult() {
  return () => undefined;
}

function readStoredResult(): string | null {
  return sessionStorage.getItem(RESULT_STORAGE_KEY);
}

function getServerResultSnapshot(): undefined {
  return undefined;
}

function parseStoredResult(
  stored: string | null | undefined,
): StudyMaterialView | null | undefined {
  if (stored === undefined) return undefined;
  if (stored === null) return null;

  try {
    return JSON.parse(stored) as StudyMaterialView;
  } catch {
    return null;
  }
}

function StudyLoading() {
  return (
    <div className="grid animate-pulse gap-5" aria-label="Loading study guide">
      <div className="h-20 rounded-2xl bg-black/5" />
      <div className="h-52 rounded-2xl bg-black/5" />
      <div className="h-52 rounded-2xl bg-black/5" />
    </div>
  );
}
