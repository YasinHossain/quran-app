export interface IHttpClient {
  get<T>(url: string, options?: RequestInit): Promise<T>;
  post<T>(url: string, data?: any, options?: RequestInit): Promise<T>;
  put<T>(url: string, data?: any, options?: RequestInit): Promise<T>;
  delete<T>(url: string, options?: RequestInit): Promise<T>;
}

export interface HttpError extends Error {
  status: number;
  statusText: string;
  url: string;
}
