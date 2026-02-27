export type HttpRequestConfig = {
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

/**
 * HttpClient
 * Porta (interface) para acesso HTTP.
 */
export interface HttpClient {
  get<T>(url: string, config?: HttpRequestConfig): Promise<T>;
}