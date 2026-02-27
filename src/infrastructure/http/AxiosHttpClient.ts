import axios, { type AxiosInstance } from "axios";
import type { HttpClient, HttpRequestConfig } from "./HttpClient";

/**
 * AxiosHttpClient
 *
 * Implementação do `HttpClient` usando axios.
 */
export class AxiosHttpClient implements HttpClient {
  private readonly client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        Accept: "application/json",
      },
    });
  }

  async get<T>(url: string, config?: HttpRequestConfig): Promise<T> {
    const res = await this.client.get<T>(url, {
      params: config?.params,
      headers: config?.headers,
      signal: config?.signal,
    });

    return res.data;
  }
}