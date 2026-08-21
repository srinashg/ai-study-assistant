import { NewStudyForm } from "@/components/new-study-form";
import { PageHeading } from "@/components/page-heading";

export default function Home() {
  return (
    <main className="page-container">
      <PageHeading
        eyebrow="Focused learning, on demand"
        title="What do you want to study?"
        description="Generate a clear explanation, a practical example, a common pitfall, and an interview-ready question for any topic."
        centered
      />
      <div className="mx-auto max-w-4xl">
        <NewStudyForm />
      </div>
    </main>
  );
}
