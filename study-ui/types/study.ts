export interface StudyRequest {
  topic: string;
  difficulty: string;
}

export interface AgentRequest {
  message: string;
  documentId?: string;
  difficulty?: string;
}

export type StudyMode = "standard" | "rag" | "agent";

export interface StudyResponse {
  explanation: string;
  example: string;
  commonMistake: string;
  interviewQuestion: string;
}

export interface RagStudyResponse extends StudyResponse {
  documentId: string;
}

export interface StudyRecord extends StudyRequest, StudyResponse {
  id: number;
  createdAt: string;
}

export interface StudyMaterialView extends StudyRequest, StudyResponse {
  mode?: StudyMode;
  documentId?: string;
}

export interface PageResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ApiError {
  message?: string;
  detail?: string;
  error?: string;
}
