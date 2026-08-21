import type { ReactNode } from "react";

interface PageHeadingProps {
  eyebrow?: string;
  title: string;
  description: string;
  centered?: boolean;
  children?: ReactNode;
}

export function PageHeading({
  eyebrow,
  title,
  description,
  centered = false,
  children,
}: PageHeadingProps) {
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--blue-ink)]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-balance text-3xl font-bold tracking-[-0.045em] sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-pretty text-base leading-7 text-black/65 sm:text-lg">
        {description}
      </p>
      {children}
    </div>
  );
}
