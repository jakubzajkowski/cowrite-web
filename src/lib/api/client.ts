import { ApiClientError } from './types';

export class ApiClient {
  private defaultHeaders: Record<string, string>;

  constructor(headers: Record<string, string> = {}) {
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      credentials: 'include',
    };

    try {
      const response = await fetch(endpoint, config);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorCode: number | undefined;

        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
          if (errorData.code) {
            errorCode = errorData.code;
          }
        } catch {
          console.warn('Failed to parse error response as JSON');
        }

        throw new ApiClientError({
          message: errorMessage,
          status: response.status,
          code: errorCode?.toString(),
        });
      }

      if (response.status === 204) {
        return undefined as T;
      }

      const data: T = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiClientError) throw error;

      throw new ApiClientError({
        message: error instanceof Error ? error.message : 'Network error',
        status: 0,
      });
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  setAuthToken(token: string): void {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
  }

  clearAuthToken(): void {
    delete this.defaultHeaders.Authorization;
  }
}

export const apiClient = new ApiClient();
