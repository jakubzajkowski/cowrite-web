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
        throw new ApiClientError({
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        });
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

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
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
