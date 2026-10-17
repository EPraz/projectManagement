import { ApiError, ApiRequest } from "../../services/apiRequest";
import { User } from "../../types/models/User";

export interface DemoSession {
  accessToken: string;
  user: User;
}

export const loadDemoSession = async (
  request: ApiRequest,
  action: "instant-login" | "refresh",
  signal?: AbortSignal,
): Promise<DemoSession> => {
  const credentials = await request<{ accessToken: string }>(`/auth/${action}`, {
    method: "POST",
    body: action === "instant-login" ? {} : undefined,
    signal,
    errorMessage: action === "instant-login"
      ? "Could not open the demo. Please try again shortly."
      : "Could not restore the demo session. Please try again.",
  });
  if (typeof credentials?.accessToken !== "string" || !credentials.accessToken) {
    throw new ApiError(502, "The server returned an unexpected demo session. Please try again.");
  }
  const user = await request<User>("/auth/checkAuth", {
    token: credentials.accessToken,
    signal,
    errorMessage: "Could not load the demo session. Please try again.",
  });
  if (!user || typeof user.id !== "string" || typeof user.email !== "string" || typeof user.name !== "string") {
    throw new ApiError(502, "The server returned an unexpected demo identity. Please try again.");
  }
  return { accessToken: credentials.accessToken, user: { ...user, projects: user.projects ?? [] } };
};
