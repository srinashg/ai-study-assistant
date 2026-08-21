import Link from "next/link";
import { HistoryIcon, SparklesIcon } from "@/components/icons";

export function Header() {
  return (
    <header className="border-b border-black/10 bg-[var(--nav)]">
      <div className="mx-auto flex min-h-20 max-w-7xl flex-col justify-center gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex w-fit items-center gap-3 rounded-xl text-lg font-bold tracking-[-0.03em] text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--blue-strong)] sm:text-xl"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-[var(--blue)] transition-transform group-hover:-rotate-6">
            <SparklesIcon className="size-5" />
          </span>
          AI Study Assistant
        </Link>

        <nav aria-label="Primary navigation" className="flex items-center gap-2">
          <Link className="button-link" href="/">
            <SparklesIcon className="size-4" />
            New study
          </Link>
          <Link className="button-link" href="/history">
            <HistoryIcon className="size-4" />
            History
          </Link>
        </nav>
      </div>
    </header>
  );
}
