export interface UnsubscribeQuery {
  token?: string;
  email?: string;
  scope?: string;
  ts?: string;
  sig?: string;
}

export interface UnsubscribeRequestMeta {
  ip?: string;
}

export interface UnsubscribeServiceEnv {
  WAITLIST_UNSUBSCRIBE_SECRET?: string;
  WAITLIST_IP_SALT?: string;
}

export interface UnsubscribeServiceDeps {
  applyUnsubscribe: (input: {
    email: string;
    scope: "all" | "marketing";
  }) => Promise<void>;
  invalidAttemptStore?: Map<string, { count: number; resetAt: number }>;
  consumeRateLimit?: (
    key: string,
  ) => Promise<{ available: boolean; limited: boolean }>;
}

export interface UnsubscribeServiceResult {
  status: number;
  body:
    | { status: "ok" }
    | {
        status: "error";
        error:
          | "invalid_signature"
          | "expired"
          | "server_error"
          | "rate_limited"
          | "rate_limiter_unavailable";
      };
}

export function handleUnsubscribeRequest(input: {
  query: UnsubscribeQuery;
  requestMeta: UnsubscribeRequestMeta;
  env: UnsubscribeServiceEnv;
  deps: UnsubscribeServiceDeps;
}): Promise<UnsubscribeServiceResult>;
