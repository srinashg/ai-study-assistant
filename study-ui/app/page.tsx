import { NewStudyForm } from "@/components/new-study-form";
import { PageHeading } from "@/components/page-heading";

export default function Home() {
  return (
    <main className="page-container">
      <PageHeading
        eyebrow="Focused learning, on demand"
        title="What do you want to study?"
        description="Choose standard mode, upload notes for RAG grounding, or ask the study agent to decide when to use tools for a better answer."
        centered
      />
      <div className="mx-auto max-w-4xl">
        <NewStudyForm />
      </div>
    </main>
  );
}
