"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { SparklesIcon } from "@/components/icons";
import {
  askStudyAgent,
  generateStudyMaterial,
  generateStudyMaterialFromRag,
} from "@/lib/client-api";
import type { StudyMaterialView, StudyMode } from "@/types/study";

const RESULT_STORAGE_KEY = "ai-study-assistant:latest-material";
const DEFAULT_DIFFICULTY = "intermediate";

export function NewStudyForm() {
  const router = useRouter();
  const [mode, setMode] = useState<StudyMode>("standard");

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [ragTopic, setRagTopic] = useState("");
  const [ragDifficulty, setRagDifficulty] = useState("");
  const [ragFiles, setRagFiles] = useState<File[]>([]);
  const [agentMessage, setAgentMessage] = useState("");
  const [agentDifficulty, setAgentDifficulty] = useState("");
  const [agentDocumentId, setAgentDocumentId] = useState(() => readStoredDocumentId());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    setIsSubmitting(true);

    try {
      let material: StudyMaterialView;

      if (mode === "standard") {
        const request = {
          topic: topic.trim(),
          difficulty: difficulty.trim(),
        };

        if (!request.topic || !request.difficulty) {
          setError("Add both a topic and a difficulty level to continue.");
          return;
        }

        const response = await generateStudyMaterial(request);
        material = { ...request, ...response, mode };
      } else if (mode === "rag") {
        if (ragFiles.length === 0) {
          setError("Upload at least one file to generate from your notes.");
          return;
        }

        const request = {
          files: ragFiles,
          topic: ragTopic.trim() || undefined,
          difficulty: ragDifficulty.trim() || undefined,
        };

        const response = await generateStudyMaterialFromRag(request);
        const resolvedTopic = request.topic ?? deriveTopicFromFiles(ragFiles);
        const resolvedDifficulty = request.difficulty ?? DEFAULT_DIFFICULTY;

        material = {
          topic: resolvedTopic,
          difficulty: resolvedDifficulty,
          ...response,
          mode,
          documentId: response.documentId,
        };
        setAgentDocumentId(response.documentId);
      } else {
        const request = {
          message: agentMessage.trim(),
          difficulty: agentDifficulty.trim() || undefined,
          documentId: agentDocumentId.trim() || undefined,
        };

        if (!request.message) {
          setError("Add a question for the study agent to answer.");
          return;
        }

        const response = await askStudyAgent(request);
        material = {
          topic: request.message,
          difficulty: request.difficulty ?? DEFAULT_DIFFICULTY,
          ...response,
          mode,
          documentId: request.documentId,
        };
      }

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
      <div className="mb-6 grid gap-2 sm:grid-cols-3">
        <ModeButton
          label="Standard"
          description="Topic + difficulty"
          isActive={mode === "standard"}
          onClick={() => setMode("standard")}
        />
        <ModeButton
          label="RAG"
          description="Upload notes/files"
          isActive={mode === "rag"}
          onClick={() => setMode("rag")}
        />
        <ModeButton
          label="Agent"
          description="Tool-using assistant"
          isActive={mode === "agent"}
          onClick={() => setMode("agent")}
        />
      </div>

      <div className="grid gap-6">
        {mode === "standard" ? (
          <>
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
          </>
        ) : null}

        {mode === "rag" ? (
          <>
            <label className="grid gap-2" htmlFor="ragFiles">
              <span className="text-sm font-bold">Source files</span>
              <span className="text-sm text-black/55">Upload notes, slides, docs, or PDFs for grounded generation.</span>
              <input
                id="ragFiles"
                name="ragFiles"
                type="file"
                multiple
                required
                onChange={(event) => setRagFiles(Array.from(event.target.files ?? []))}
                className="text-input py-2"
              />
            </label>

            <label className="grid gap-2" htmlFor="ragTopic">
              <span className="text-sm font-bold">Topic (optional)</span>
              <span className="text-sm text-black/55">Leave blank to let the backend infer the main concept from your files.</span>
              <input
                id="ragTopic"
                name="ragTopic"
                type="text"
                value={ragTopic}
                onChange={(event) => setRagTopic(event.target.value)}
                placeholder="e.g. CAP theorem in my distributed systems notes"
                maxLength={255}
                className="text-input"
              />
            </label>

            <label className="grid gap-2" htmlFor="ragDifficulty">
              <span className="text-sm font-bold">Difficulty (optional)</span>
              <span className="text-sm text-black/55">Defaults to intermediate when omitted.</span>
              <input
                id="ragDifficulty"
                name="ragDifficulty"
                type="text"
                value={ragDifficulty}
                onChange={(event) => setRagDifficulty(event.target.value)}
                placeholder="e.g. Beginner, Mid-level, Interview prep"
                maxLength={50}
                className="text-input"
              />
            </label>
          </>
        ) : null}

        {mode === "agent" ? (
          <>
            <label className="grid gap-2" htmlFor="agentMessage">
              <span className="text-sm font-bold">Question</span>
              <span className="text-sm text-black/55">Ask anything and the agent can decide whether to use tools.</span>
              <textarea
                id="agentMessage"
                name="agentMessage"
                value={agentMessage}
                onChange={(event) => setAgentMessage(event.target.value)}
                placeholder="e.g. Explain eventual consistency and compare it with strong consistency"
                maxLength={2000}
                required
                className="text-input min-h-36 resize-y"
              />
            </label>

            <label className="grid gap-2" htmlFor="agentDocumentId">
              <span className="text-sm font-bold">Document ID (optional)</span>
              <span className="text-sm text-black/55">Use a documentId returned by RAG mode so the agent can search those notes.</span>
              <input
                id="agentDocumentId"
                name="agentDocumentId"
                type="text"
                value={agentDocumentId}
                onChange={(event) => setAgentDocumentId(event.target.value)}
                placeholder="Auto-filled after a RAG run"
                className="text-input"
              />
            </label>

            <label className="grid gap-2" htmlFor="agentDifficulty">
              <span className="text-sm font-bold">Difficulty (optional)</span>
              <span className="text-sm text-black/55">Defaults to intermediate when omitted.</span>
              <input
                id="agentDifficulty"
                name="agentDifficulty"
                type="text"
                value={agentDifficulty}
                onChange={(event) => setAgentDifficulty(event.target.value)}
                placeholder="e.g. Beginner, College-level, Senior interview"
                maxLength={50}
                className="text-input"
              />
            </label>
          </>
        ) : null}
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
        {isSubmitting ? "Generating your study guide..." : labelForMode(mode)}
      </button>
    </form>
  );
}

function labelForMode(mode: StudyMode): string {
  if (mode === "rag") return "Generate from uploaded notes";
  if (mode === "agent") return "Ask study agent";
  return "Generate study material";
}

function deriveTopicFromFiles(files: File[]): string {
  const joined = files.map((file) => file.name || "uploaded notes").join(", ");

  if (!joined) {
    return "uploaded notes";
  }

  return joined.length > 255 ? joined.slice(0, 255) : joined;
}

function readStoredDocumentId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const stored = sessionStorage.getItem(RESULT_STORAGE_KEY);
  if (!stored) {
    return "";
  }

  try {
    const parsed = JSON.parse(stored) as Partial<StudyMaterialView>;
    return parsed.documentId ?? "";
  } catch {
    return "";
  }
}

function ModeButton({
  label,
  description,
  isActive,
  onClick,
}: {
  label: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-left transition ${
        isActive
          ? "border-[var(--blue-strong)] bg-[var(--blue)]/35"
          : "border-black/15 bg-[var(--nav)] hover:border-black/30"
      }`}
      aria-pressed={isActive}
    >
      <span className="block text-sm font-bold">{label}</span>
      <span className="block text-xs text-black/60">{description}</span>
    </button>
  );
}

export { RESULT_STORAGE_KEY };
