import { proxyStudyRequest } from "@/lib/server/study-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "0";
  const size = searchParams.get("size") ?? "6";

  return proxyStudyRequest(
    `/api/study/sessions?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`,
  );
}
