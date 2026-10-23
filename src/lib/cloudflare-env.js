/**
 * Resolve runtime bindings for Cloudflare Workers while keeping local route
 * tests compatible with the legacy mocked context shape.
 */
export const getCloudflareEnv = async (context, staticEnv = {}) => {
  let legacyRuntime;
  try {
    legacyRuntime = context?.locals?.runtime?.env;
  } catch {
    legacyRuntime = undefined;
  }

  if (legacyRuntime && typeof legacyRuntime === "object") {
    return { ...staticEnv, ...legacyRuntime };
  }

  try {
    const { env } = await import("cloudflare:workers");
    return env && typeof env === "object"
      ? { ...staticEnv, ...env }
      : { ...staticEnv };
  } catch {
    return { ...staticEnv };
  }
};
