import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError, ApiRequest, ApiRequestOptions } from "../../services/apiRequest";
import { useApi } from "../apiContext";
import { DemoSession, loadDemoSession } from "./sessionApi";

export const useDemoSession = (shouldRestore: boolean) => {
  const { request: apiRequest } = useApi();
  const [session, setSession] = useState<DemoSession | null>(null);
  const current = useRef<DemoSession | null>(null);
  const generation = useRef(0);
  const [restoring, setRestoring] = useState(shouldRestore);
  const [attemptedRestore, setAttemptedRestore] = useState(false);
  const [opening, setOpening] = useState(false);
  const [closing, setClosing] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionNotice, setSessionNotice] = useState("");
  const restoration = useRef<AbortController | null>(null);
  const entry = useRef<AbortController | null>(null);
  const exit = useRef<AbortController | null>(null);
  const entryPromise = useRef<Promise<void> | null>(null);
  const exitPromise = useRef<Promise<void> | null>(null);

  const commit = useCallback((value: DemoSession | null) => {
    current.current = value;
    setSession(value);
  }, []);

  const expire = useCallback(() => {
    generation.current += 1;
    restoration.current?.abort();
    commit(null);
    setAttemptedRestore(true);
    setRestoring(false);
    setSessionError(null);
    setSessionNotice("Your demo session has ended. Explore the demo to continue.");
  }, [commit]);

  const restoreSession = useCallback(async (signal?: AbortSignal) => {
    if (!shouldRestore || exit.current) return;
    restoration.current?.abort();
    const controller = new AbortController();
    restoration.current = controller;
    const cancel = () => controller.abort();
    signal?.addEventListener("abort", cancel, { once: true });
    if (signal?.aborted) controller.abort();
    const version = generation.current;
    setRestoring(true);
    try {
      const restored = await loadDemoSession(apiRequest, "refresh", controller.signal);
      if (!controller.signal.aborted && version === generation.current) {
        commit(restored);
        setSessionError(null);
        setSessionNotice("");
      }
    } catch (error) {
      if (!controller.signal.aborted && version === generation.current) {
        if (error instanceof ApiError && error.status === 401) expire();
        else setSessionError("Could not restore the demo session. Please try again.");
      }
    } finally {
      signal?.removeEventListener("abort", cancel);
      if (restoration.current === controller) {
        restoration.current = null;
        setRestoring(false);
        setAttemptedRestore(true);
      }
    }
  }, [apiRequest, commit, expire, shouldRestore]);

  useEffect(() => {
    if (!shouldRestore) {
      generation.current += 1;
      restoration.current?.abort();
      restoration.current = null;
      setRestoring(false);
      setAttemptedRestore(false);
      return;
    }
    if (current.current) return;
    const controller = new AbortController();
    void restoreSession(controller.signal);
    return () => controller.abort();
  }, [shouldRestore, restoreSession]);

  useEffect(() => {
    if (!session?.accessToken || !shouldRestore || closing) return;
    const controller = new AbortController();
    const timer = window.setInterval(() => { void restoreSession(controller.signal); }, 12 * 60 * 1000);
    return () => { controller.abort(); window.clearInterval(timer); };
  }, [session?.accessToken, restoreSession, shouldRestore, closing]);

  useEffect(() => () => {
    generation.current += 1;
    const controllers = [restoration.current, entry.current, exit.current];
    restoration.current = null;
    entry.current = null;
    exit.current = null;
    entryPromise.current = null;
    exitPromise.current = null;
    controllers.forEach((controller) => controller?.abort());
  }, []);

  const instantLogin = useCallback(() => {
    if (entryPromise.current) return entryPromise.current;
    const controller = new AbortController();
    entry.current = controller;
    const version = ++generation.current;
    setOpening(true);
    setSessionNotice("");
    entryPromise.current = (async () => {
      try {
        const opened = await loadDemoSession(apiRequest, "instant-login", controller.signal);
        if (!controller.signal.aborted && version === generation.current) {
          commit(opened);
          setSessionError(null);
        }
      } finally {
        if (entry.current === controller) {
          entry.current = null;
          entryPromise.current = null;
          setOpening(false);
        }
      }
    })();
    return entryPromise.current;
  }, [apiRequest, commit]);

  const logout = useCallback(() => {
    if (exitPromise.current) return exitPromise.current;
    const controller = new AbortController();
    exit.current = controller;
    generation.current += 1;
    restoration.current?.abort();
    setClosing(true);
    exitPromise.current = (async () => {
      try {
        await apiRequest("/auth/logout", {
          method: "POST", signal: controller.signal,
          errorMessage: "Could not sign out. Please try again.",
        });
        if (!controller.signal.aborted) {
          generation.current += 1;
          restoration.current?.abort();
          commit(null);
          setSessionError(null);
          setSessionNotice("");
        }
      } finally {
        if (exit.current === controller) {
          exit.current = null;
          exitPromise.current = null;
          setClosing(false);
        }
      }
    })();
    return exitPromise.current;
  }, [apiRequest, commit]);

  const request: ApiRequest = useCallback(async <T>(path: string, options: ApiRequestOptions = {}) => {
    const token = current.current?.accessToken;
    if (!token) throw new ApiError(401, "Your demo session has ended. Explore the demo to continue.");
    try {
      return await apiRequest<T>(path, { ...options, token });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401 && current.current?.accessToken === token) expire();
      throw error;
    }
  }, [apiRequest, expire]);

  return {
    user: session?.user ?? null,
    accessToken: session?.accessToken ?? null,
    loading: opening || (!session && (restoring || (shouldRestore && !attemptedRestore))),
    restoring, closing, sessionError, sessionNotice,
    instantLogin, logout, retrySession: restoreSession, request,
  };
};
