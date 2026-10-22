const cleanString = (value) => (typeof value === "string" ? value.trim() : "");

const isEnabled = (value) => cleanString(value).toLowerCase() === "true";

const consumeLocalLimit = ({
  store,
  key,
  maxRequests,
  windowMs,
  now = Date.now(),
}) => {
  for (const [entryKey, entryValue] of store.entries()) {
    if (entryValue.resetAt <= now) store.delete(entryKey);
  }

  const existing = store.get(key);
  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (existing.count >= maxRequests) return true;
  existing.count += 1;
  return false;
};

export const consumeDistributedRateLimit = async ({
  kv,
  key,
  required,
  fallbackStore,
  maxRequests,
  windowMs,
}) => {
  if (kv && typeof kv.get === "function" && typeof kv.put === "function") {
    try {
      const bucket = Math.floor(Date.now() / windowMs);
      const storageKey = `rl:${key}:${bucket}`;
      const existing = await kv.get(storageKey, "json");
      const count = Number(existing?.count ?? 0);

      if (count >= maxRequests) {
        return { available: true, limited: true };
      }

      await kv.put(storageKey, JSON.stringify({ count: count + 1 }), {
        expirationTtl: Math.ceil(windowMs / 1000) + 60,
      });
      return { available: true, limited: false };
    } catch {
      return { available: false, limited: false };
    }
  }

  if (isEnabled(required)) {
    return { available: false, limited: false };
  }

  return {
    available: true,
    limited: consumeLocalLimit({
      store: fallbackStore,
      key,
      maxRequests,
      windowMs,
    }),
  };
};
