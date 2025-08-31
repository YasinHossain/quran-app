import { injectable } from 'inversify';
import { IHttpClient, HttpError } from './IHttpClient';

// // @injectable()
export class FetchHttpClient implements IHttpClient {
  private createHttpError(response: Response, url: string): HttpError {
    const error = new Error(`HTTP Error: ${response.status} ${response.statusText}`) as HttpError;
    error.status = response.status;
    error.statusText = response.statusText;
    error.url = url;
    return error;
  }

  async get<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw this.createHttpError(response, url);
    }

    return response.json();
  }

  async post<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw this.createHttpError(response, url);
    }

    return response.json();
  }

  async put<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw this.createHttpError(response, url);
    }

    return response.json();
  }

  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw this.createHttpError(response, url);
    }

    return response.json();
  }
}
