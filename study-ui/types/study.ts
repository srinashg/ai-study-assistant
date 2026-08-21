export interface StudyRequest {
  topic: string;
  difficulty: string;
}

export interface StudyResponse {
  explanation: string;
  example: string;
  commonMistake: string;
  interviewQuestion: string;
}

export interface StudyRecord extends StudyRequest, StudyResponse {
  id: number;
  createdAt: string;
}

export interface StudyMaterialView extends StudyRequest, StudyResponse {}

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
