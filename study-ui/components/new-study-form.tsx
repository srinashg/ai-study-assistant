"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { SparklesIcon } from "@/components/icons";
import { generateStudyMaterial } from "@/lib/client-api";
import type { StudyMaterialView } from "@/types/study";

const RESULT_STORAGE_KEY = "ai-study-assistant:latest-material";

export function NewStudyForm() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const request = {
      topic: topic.trim(),
      difficulty: difficulty.trim(),
    };

    if (!request.topic || !request.difficulty) {
      setError("Add both a topic and a difficulty level to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await generateStudyMaterial(request);
      const material: StudyMaterialView = { ...request, ...response };
      sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(material));
      router.push("/study");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Study material could not be generated. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card mt-10 p-5 sm:p-8 lg:p-10">
      <div className="grid gap-6">
        <label className="grid gap-2" htmlFor="topic">
          <span className="text-sm font-bold">Topic</span>
          <span className="text-sm text-black/55">What would you like to understand better?</span>
          <input
            id="topic"
            name="topic"
            type="text"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="e.g. Java HashMap, REST APIs, Binary Search"
            maxLength={255}
            required
            autoFocus
            className="text-input"
          />
        </label>

        <label className="grid gap-2" htmlFor="difficulty">
          <span className="text-sm font-bold">Difficulty</span>
          <span className="text-sm text-black/55">Set the depth and audience for your material.</span>
          <input
            id="difficulty"
            name="difficulty"
            type="text"
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            placeholder="e.g. Beginner, College-level, SWE interview prep"
            maxLength={50}
            required
            className="text-input"
          />
        </label>
      </div>

      {error ? (
        <p className="mt-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-950" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="primary-button mt-7 w-full sm:w-auto"
      >
        <SparklesIcon className={`size-5 ${isSubmitting ? "animate-pulse" : ""}`} />
        {isSubmitting ? "Generating your study guide…" : "Generate study material"}
      </button>
    </form>
  );
}

export { RESULT_STORAGE_KEY };
