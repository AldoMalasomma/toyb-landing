import { createClient } from "@supabase/supabase-js";
import type { APIContext, APIRoute } from "astro";
import { handleUnsubscribeRequest } from "../../lib/unsubscribe-service.js";
import { consumeDistributedRateLimit } from "../../lib/distributed-rate-limit.js";
import { getCloudflareEnv } from "../../lib/cloudflare-env.js";

export const prerender = false;

interface UnsubscribeRuntimeEnv {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  WAITLIST_IP_SALT?: string;
  WAITLIST_UNSUBSCRIBE_SECRET?: string;
  WAITLIST_RATE_LIMITER_REQUIRED?: string;
  TOYB_RATE_LIMIT_KV?: {
    get?: (key: string, type: "json") => Promise<{ count?: number } | null>;
    put?: (
      key: string,
      value: string,
      options: { expirationTtl: number },
    ) => Promise<void>;
  };
}

const cleanString = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const toParamString = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
};

const json = (body: Record<string, unknown>, status: number): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

const getRuntimeEnv = async (
  context: APIContext,
): Promise<UnsubscribeRuntimeEnv> =>
  getCloudflareEnv(
    context,
    import.meta.env as unknown as UnsubscribeRuntimeEnv,
  );

const getClientIp = (request: Request): string => {
  const cfIp = cleanString(request.headers.get("cf-connecting-ip"));
  if (cfIp) return cfIp;

  const forwarded = cleanString(request.headers.get("x-forwarded-for"));
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return "unknown";
};

const parseBodyWithLimit = async (
  request: Request,
  maxBytes: number,
): Promise<string | null> => {
  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;

    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const merged = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder().decode(merged);
};

const MAX_BODY_BYTES = 2 * 1024;

const runUnsubscribe = async (
  context: APIContext,
  payload: {
    token?: string;
    email?: string;
    scope?: string;
    ts?: string;
    sig?: string;
  },
): Promise<Response> => {
  const env = await getRuntimeEnv(context);
  const supabaseUrl = cleanString(env.SUPABASE_URL);
  const supabaseAnonKey = cleanString(env.SUPABASE_ANON_KEY);

  if (!supabaseUrl || !supabaseAnonKey) {
    return json({ status: "error", error: "server_error" }, 500);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const invalidAttemptStore =
    (
      globalThis as {
        __toybUnsubscribeRateStore?: Map<
          string,
          { count: number; resetAt: number }
        >;
      }
    ).__toybUnsubscribeRateStore ??
    new Map<string, { count: number; resetAt: number }>();
  (
    globalThis as {
      __toybUnsubscribeRateStore?: Map<
        string,
        { count: number; resetAt: number }
      >;
    }
  ).__toybUnsubscribeRateStore = invalidAttemptStore;

  const result = await handleUnsubscribeRequest({
    query: payload,
    requestMeta: {
      ip: getClientIp(context.request),
    },
    env,
    deps: {
      invalidAttemptStore,
      consumeRateLimit: (key) =>
        consumeDistributedRateLimit({
          kv: env.TOYB_RATE_LIMIT_KV,
          key: `unsubscribe:${key}`,
          required: env.WAITLIST_RATE_LIMITER_REQUIRED,
          fallbackStore: invalidAttemptStore,
          maxRequests: 12,
          windowMs: 10 * 60 * 1000,
        }),
      applyUnsubscribe: async (input) => {
        const { error } = await supabase.rpc("waitlist_apply_unsubscribe", {
          p_email: input.email,
          p_scope: input.scope,
        });

        if (error) {
          throw error;
        }
      },
    },
  });

  return json(result.body, result.status);
};

export const GET: APIRoute = async (context) => {
  const url = new URL(context.request.url);
  return runUnsubscribe(context, {
    token: url.searchParams.get("token") ?? undefined,
    email: url.searchParams.get("email") ?? undefined,
    scope: url.searchParams.get("scope") ?? undefined,
    ts: url.searchParams.get("ts") ?? undefined,
    sig: url.searchParams.get("sig") ?? undefined,
  });
};

export const POST: APIRoute = async (context) => {
  const contentType = cleanString(
    context.request.headers.get("content-type"),
  ).toLowerCase();
  if (!contentType.startsWith("application/json")) {
    return json({ status: "error", error: "invalid_signature" }, 400);
  }

  const bodyText = await parseBodyWithLimit(context.request, MAX_BODY_BYTES);
  if (bodyText === null || !bodyText) {
    return json({ status: "error", error: "invalid_signature" }, 400);
  }

  let payload: {
    token?: unknown;
    email?: unknown;
    scope?: unknown;
    ts?: unknown;
    sig?: unknown;
  };
  try {
    payload = JSON.parse(bodyText) as {
      token?: unknown;
      email?: unknown;
      scope?: unknown;
      ts?: unknown;
      sig?: unknown;
    };
  } catch {
    return json({ status: "error", error: "invalid_signature" }, 400);
  }

  return runUnsubscribe(context, {
    token: toParamString(payload.token) || undefined,
    email: toParamString(payload.email) || undefined,
    scope: toParamString(payload.scope) || undefined,
    ts: toParamString(payload.ts) || undefined,
    sig: toParamString(payload.sig) || undefined,
  });
};

export const ALL: APIRoute = async () =>
  json(
    {
      status: "error",
      code: "invalid_request",
    },
    405,
  );
