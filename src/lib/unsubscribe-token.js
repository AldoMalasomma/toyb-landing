export const UNSUBSCRIBE_TTL_SECONDS = 7 * 24 * 60 * 60;
const ALLOWED_SCOPES = new Set(["all", "marketing"]);
const textEncoder = new TextEncoder();

const cleanString = (value) => (typeof value === "string" ? value.trim() : "");

const normalizeEmail = (value) => cleanString(value).toLowerCase();

const normalizeScope = (value) => {
  const normalized = cleanString(value).toLowerCase();
  return ALLOWED_SCOPES.has(normalized) ? normalized : "";
};

const parseUnixSeconds = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  if (!Number.isInteger(parsed)) return null;
  if (parsed <= 0) return null;
  return parsed;
};

const normalizeSecret = (value) => cleanString(value);

const signaturePayload = (email, scope, ts) => `${email}|${scope}|${ts}`;

const bytesToHex = (bytes) =>
  [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");

const importHmacKey = async (secret) =>
  crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

const hmacSha256Hex = async (secret, payload) => {
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    textEncoder.encode(payload),
  );
  return bytesToHex(new Uint8Array(signature));
};

const bytesToBase64Url = (bytes) => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/u, "");
};

const base64UrlToBytes = (value) => {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const importEncryptionKey = async (secret, usages) => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    textEncoder.encode(secret),
  );
  return crypto.subtle.importKey(
    "raw",
    digest,
    { name: "AES-GCM" },
    false,
    usages,
  );
};

const createOpaqueToken = async ({ secret, email, scope, ts }) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await importEncryptionKey(secret, ["encrypt"]);
  const payload = JSON.stringify({ email, scope, ts });
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    textEncoder.encode(payload),
  );
  return `v1.${bytesToBase64Url(iv)}.${bytesToBase64Url(new Uint8Array(ciphertext))}`;
};

const decryptOpaqueToken = async (secret, token) => {
  const parts = cleanString(token).split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return null;

  try {
    const iv = base64UrlToBytes(parts[1]);
    const ciphertext = base64UrlToBytes(parts[2]);
    if (iv.length !== 12 || ciphertext.length < 16) return null;
    const key = await importEncryptionKey(secret, ["decrypt"]);
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext,
    );
    return JSON.parse(new TextDecoder().decode(plaintext));
  } catch {
    return null;
  }
};

export const signUnsubscribeToken = async ({ secret, email, scope, ts }) => {
  const normalizedSecret = normalizeSecret(secret);
  const normalizedEmail = normalizeEmail(email);
  const normalizedScope = normalizeScope(scope);
  const parsedTs = parseUnixSeconds(ts);

  if (
    !normalizedSecret ||
    !normalizedEmail ||
    !normalizedScope ||
    parsedTs === null
  ) {
    throw new Error("invalid_unsubscribe_signature_input");
  }

  return hmacSha256Hex(
    normalizedSecret,
    signaturePayload(normalizedEmail, normalizedScope, parsedTs),
  );
};

const isHexSignature = (value) => /^[0-9a-f]{64}$/.test(value);

// Security decision: use a constant-time comparison for signature checks.
export const timingSafeHexEqual = (expectedHex, providedHex) => {
  const expected = cleanString(expectedHex).toLowerCase();
  const provided = cleanString(providedHex).toLowerCase();

  if (!isHexSignature(expected) || !isHexSignature(provided)) {
    return false;
  }

  let diff = 0;
  for (let index = 0; index < expected.length; index += 1) {
    diff |= expected.charCodeAt(index) ^ provided.charCodeAt(index);
  }

  return diff === 0;
};

export const verifyUnsubscribeToken = async ({
  secret,
  token,
  email,
  scope,
  ts,
  sig,
  nowSeconds = Math.floor(Date.now() / 1000),
  ttlSeconds = UNSUBSCRIBE_TTL_SECONDS,
}) => {
  const normalizedSecret = normalizeSecret(secret);
  const opaquePayload = token
    ? await decryptOpaqueToken(normalizedSecret, token)
    : null;
  const normalizedEmail = normalizeEmail(opaquePayload?.email ?? email);
  const normalizedScope = normalizeScope(opaquePayload?.scope ?? scope);
  const parsedTs = parseUnixSeconds(opaquePayload?.ts ?? ts);
  const parsedNow = parseUnixSeconds(nowSeconds);

  if (
    !normalizedSecret ||
    !normalizedEmail ||
    !normalizedScope ||
    parsedTs === null ||
    parsedNow === null
  ) {
    return { ok: false, reason: "invalid" };
  }

  if (parsedTs > parsedNow + 300) {
    return { ok: false, reason: "invalid" };
  }

  if (parsedNow - parsedTs > ttlSeconds) {
    return { ok: false, reason: "expired" };
  }

  if (opaquePayload) {
    return {
      ok: true,
      email: normalizedEmail,
      scope: normalizedScope,
      ts: parsedTs,
    };
  }

  let expected;
  try {
    expected = await signUnsubscribeToken({
      secret: normalizedSecret,
      email: normalizedEmail,
      scope: normalizedScope,
      ts: parsedTs,
    });
  } catch {
    return { ok: false, reason: "invalid" };
  }

  if (!timingSafeHexEqual(expected, sig)) {
    return { ok: false, reason: "invalid" };
  }

  return {
    ok: true,
    email: normalizedEmail,
    scope: normalizedScope,
    ts: parsedTs,
  };
};

export const buildSignedUnsubscribeUrl = async ({
  baseUrl,
  secret,
  email,
  scope = "marketing",
  ts = Math.floor(Date.now() / 1000),
}) => {
  const normalizedSecret = normalizeSecret(secret);
  const normalizedEmail = normalizeEmail(email);
  const normalizedScope = normalizeScope(scope);

  if (!normalizedEmail || !normalizedScope) {
    throw new Error("invalid_unsubscribe_url_input");
  }

  const token = await createOpaqueToken({
    secret: normalizedSecret,
    email: normalizedEmail,
    scope: normalizedScope,
    ts,
  });

  const url = new URL("/unsubscribe", baseUrl);
  url.searchParams.set("token", token);
  return url.toString();
};
