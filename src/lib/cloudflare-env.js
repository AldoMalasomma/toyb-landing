/**
 * Resolve runtime bindings for Cloudflare Workers while keeping local route
 * tests compatible with the legacy mocked context shape.
 */
export const getCloudflareEnv = async (context, staticEnv = {}) => {
  const legacyRuntime = context?.locals?.runtime?.env;
  if (legacyRuntime) return { ...staticEnv, ...legacyRuntime };

  try {
    const { env } = await import("cloudflare:workers");
    return { ...staticEnv, ...env };
  } catch {
    return { ...staticEnv };
  }
};
