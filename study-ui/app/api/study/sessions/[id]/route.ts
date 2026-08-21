import { proxyStudyRequest } from "@/lib/server/study-api";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  return proxyStudyRequest(`/api/study/sessions/${encodeURIComponent(id)}`);
}
