import assert from "node:assert/strict";
import test from "node:test";
import { consumeDistributedRateLimit } from "../src/lib/distributed-rate-limit.js";

const makeKv = () => {
  const values = new Map();
  return {
    values,
    async get(key) {
      const value = values.get(key);
      return value ? JSON.parse(value) : null;
    },
    async put(key, value) {
      values.set(key, value);
    },
  };
};

test("KV rate limiter shares a fixed-window counter", async () => {
  const kv = makeKv();
  const input = {
    kv,
    key: "ip-hash",
    required: "true",
    fallbackStore: new Map(),
    maxRequests: 2,
    windowMs: 60_000,
  };

  assert.deepEqual(await consumeDistributedRateLimit(input), {
    available: true,
    limited: false,
  });
  assert.deepEqual(await consumeDistributedRateLimit(input), {
    available: true,
    limited: false,
  });
  assert.deepEqual(await consumeDistributedRateLimit(input), {
    available: true,
    limited: true,
  });
});

test("production-required KV fails closed when the Pages binding is absent", async () => {
  const result = await consumeDistributedRateLimit({
    kv: undefined,
    key: "ip-hash",
    required: "true",
    fallbackStore: new Map(),
    maxRequests: 2,
    windowMs: 60_000,
  });

  assert.deepEqual(result, { available: false, limited: false });
});
