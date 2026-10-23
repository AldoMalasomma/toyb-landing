import assert from "node:assert/strict";
import test from "node:test";
import { getCloudflareEnv } from "../src/lib/cloudflare-env.js";

test("Cloudflare env resolution falls back without throwing on broken runtime locals", async () => {
  const context = {};
  Object.defineProperty(context, "locals", {
    get() {
      throw new Error("runtime locals unavailable");
    },
  });

  assert.deepEqual(await getCloudflareEnv(context, { STATIC_VALUE: "ok" }), {
    STATIC_VALUE: "ok",
  });
});
