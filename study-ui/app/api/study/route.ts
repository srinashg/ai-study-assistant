import { proxyStudyRequest } from "@/lib/server/study-api";

export async function POST(request: Request) {
  const body = await request.text();

  return proxyStudyRequest("/api/study", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
