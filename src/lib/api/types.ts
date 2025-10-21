export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export class ApiClientError extends Error {
  public status: number;
  public code?: string;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiClientError';
    this.status = error.status;
    this.code = error.code;
  }
}

export interface RequestConfig {
  timeout?: number;
  headers?: Record<string, string>;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
}

export interface ConversationIdRequest {
  title: string;
}

export interface ConversationIdResponse {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
}

export interface CloudFileResponse {
  id: number;
  userId: number;
  name: string;
  s3Key: string;
  createdAt: string;
  updatedAt: string;
  size: number;
  tags: string;
}

export interface CloudFileContentResponse {
  content: string;
}

export interface CloudCreateFileRequest {
  name: string;
  content: string;
}

export interface CloudCreateFileResponse {
  message: string;
  noteId: number;
}
