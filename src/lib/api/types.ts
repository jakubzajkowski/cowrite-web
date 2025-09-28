// Basic API Response types
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
}

// Error types
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

// Request configuration
export interface RequestConfig {
  timeout?: number;
  headers?: Record<string, string>;
}