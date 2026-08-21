import { NextResponse } from "next/server";

const DEFAULT_API_URL = "http://localhost:8080";
const REQUEST_TIMEOUT_MS = 90_000;

function backendUrl(path: string): string {
  const baseUrl = (process.env.SPRING_API_URL ?? DEFAULT_API_URL).replace(
    /\/$/,
    "",
  );

  return `${baseUrl}${path}`;
}

export async function proxyStudyRequest(
  path: string,
  init?: RequestInit,
): Promise<NextResponse> {
  try {
    const response = await fetch(backendUrl(path), {
      ...init,
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const body = await response.text();
    const contentType = response.headers.get("content-type");

    return new NextResponse(body || null, {
      status: response.status,
      headers: contentType ? { "Content-Type": contentType } : undefined,
    });
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";

    return NextResponse.json(
      {
        message: timedOut
          ? "The study service took too long to respond. Please try again."
          : "The study service is unavailable. Make sure the Spring Boot backend is running.",
      },
      { status: timedOut ? 504 : 502 },
    );
  }
}
