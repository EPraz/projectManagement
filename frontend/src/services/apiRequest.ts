export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiRequestOptions
  extends Omit<RequestInit, "body" | "credentials"> {
  body?: unknown;
  token?: string | null;
  errorMessage?: string;
}

export type ApiRequest = <T>(
  path: string,
  options?: ApiRequestOptions
) => Promise<T>;

export const createApiRequest =
  (apiUrl: string): ApiRequest =>
  async <T>(path: string, options: ApiRequestOptions = {}): Promise<T> => {
    const {
      token,
      body,
      errorMessage = "The request could not be completed. Please try again.",
      ...init
    } = options;
    const headers = new Headers(init.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (body !== undefined) headers.set("Content-Type", "application/json");
    let response: Response;
    try {
      response = await fetch(
        `${apiUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`,
        {
          ...init,
          headers,
          body: body === undefined ? undefined : JSON.stringify(body),
          credentials: "include"
        }
      );
    } catch (error) {
      if (init.signal?.aborted) throw error;
      throw new ApiError(0, errorMessage);
    }
    if (!response.ok) {
      let message = errorMessage;
      if ([400, 404, 409, 422].includes(response.status)) {
        try {
          const error: { message?: unknown } = await response.json();
          const details = Array.isArray(error.message)
            ? error.message
            : [error.message];
          if (
            details.length &&
            details.every(
              (value) => typeof value === "string" && value.length <= 300
            )
          ) {
            message = details.slice(0, 4).join(". ");
          }
        } catch {
          // Preserve the safe fallback for HTML, empty and malformed error responses.
        }
      }
      throw new ApiError(response.status, message);
    }
    if (response.status === 204) return undefined as T;
    try {
      return (await response.json()) as T;
    } catch (error) {
      if (init.signal?.aborted) throw error;
      throw new ApiError(
        502,
        "The server returned an unexpected response. Please try again."
      );
    }
  };
