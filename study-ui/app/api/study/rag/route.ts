import { proxyStudyRequest } from "@/lib/server/study-api";

export async function POST(request: Request) {
  const formData = await request.formData();

  return proxyStudyRequest("/api/study/rag", {
    method: "POST",
    body: formData,
  });
}
