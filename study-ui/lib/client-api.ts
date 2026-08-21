import type {
  ApiError,
  PageResponse,
  StudyRecord,
  StudyRequest,
  StudyResponse,
} from "@/types/study";

async function readResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  let error: ApiError = {};
  try {
    error = (await response.json()) as ApiError;
  } catch {
    // The fallback below is more useful than a JSON parsing failure.
  }

  throw new Error(
    error.message ??
      error.detail ??
      error.error ??
      "Something went wrong. Please try again.",
  );
}

export async function generateStudyMaterial(
  request: StudyRequest,
): Promise<StudyResponse> {
  const response = await fetch("/api/study", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  return readResponse<StudyResponse>(response);
}

export async function getStudySessions(
  page: number,
  size = 6,
): Promise<PageResponse<StudyRecord>> {
  const response = await fetch(
    `/api/study/sessions?page=${page}&size=${size}`,
    { cache: "no-store" },
  );

  return readResponse<PageResponse<StudyRecord>>(response);
}

export async function getStudySession(id: string): Promise<StudyRecord> {
  const response = await fetch(`/api/study/sessions/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });

  return readResponse<StudyRecord>(response);
}
