export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiRequestOptions extends Omit<RequestInit, "body" | "credentials"> {
  body?: unknown;
  token?: string | null;
  errorMessage?: string;
}

export type ApiRequest = <T>(path: string, options?: ApiRequestOptions) => Promise<T>;

export const createApiRequest = (apiUrl: string): ApiRequest =>
  async <T>(path: string, options: ApiRequestOptions = {}): Promise<T> => {
    const { token, body, errorMessage = "The request could not be completed. Please try again.", ...init } = options;
    const headers = new Headers(init.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (body !== undefined) headers.set("Content-Type", "application/json");
    let response: Response;
    try {
      response = await fetch(`${apiUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`, {
        ...init,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        credentials: "include",
      });
    } catch (error) {
      if (init.signal?.aborted) throw error;
      throw new ApiError(0, errorMessage);
    }
    if (!response.ok) throw new ApiError(response.status, errorMessage);
    if (response.status === 204) return undefined as T;
    try {
      return await response.json() as T;
    } catch (error) {
      if (init.signal?.aborted) throw error;
      throw new ApiError(502, "The server returned an unexpected response. Please try again.");
    }
  };
