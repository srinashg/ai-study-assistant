import { AlertIcon, BookOpenIcon, CodeIcon, MessageIcon } from "@/components/icons";
import type { StudyMaterialView } from "@/types/study";

interface StudyMaterialProps {
  material: StudyMaterialView;
}

interface MaterialCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}

function MaterialCard({ icon, title, children, className = "" }: MaterialCardProps) {
  return (
    <section className={`surface-card p-5 sm:p-7 ${className}`}>
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--blue)] text-black">
          {icon}
        </span>
        <h2 className="text-lg font-bold tracking-[-0.025em] sm:text-xl">{title}</h2>
      </div>
      <div className="mt-5 whitespace-pre-wrap text-[0.95rem] leading-7 text-black/75 sm:text-base">
        {children}
      </div>
    </section>
  );
}

export function StudyMaterial({ material }: StudyMaterialProps) {
  return (
    <>
      <div className="mb-8 flex flex-col gap-3 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[var(--blue-ink)]">Your study guide</p>
          <h1 className="text-3xl font-bold tracking-[-0.045em] sm:text-4xl">{material.topic}</h1>
        </div>
        <span className="w-fit rounded-full bg-[var(--blue)] px-4 py-2 text-sm font-bold text-black">
          {material.difficulty}
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <MaterialCard
          title="Explanation"
          icon={<BookOpenIcon className="size-5" />}
          className="lg:col-span-2"
        >
          {material.explanation}
        </MaterialCard>
        <MaterialCard
          title="Example"
          icon={<CodeIcon className="size-5" />}
          className="lg:col-span-2"
        >
          <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-black/[0.04] p-4 font-mono text-sm leading-6 text-black sm:text-[0.95rem]">
            <code>{material.example}</code>
          </pre>
        </MaterialCard>
        <MaterialCard title="Common mistake" icon={<AlertIcon className="size-5" />}>
          {material.commonMistake}
        </MaterialCard>
        <MaterialCard title="Interview question" icon={<MessageIcon className="size-5" />}>
          {material.interviewQuestion}
        </MaterialCard>
      </div>
    </>
  );
}
