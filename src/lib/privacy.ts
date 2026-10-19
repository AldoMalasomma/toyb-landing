export const PRIVACY_VERSION = "2026-04-08";
export const PRIVACY_PATH = "/privacy";

export const getPrivacyHref = (): string =>
  `${PRIVACY_PATH}?v=${encodeURIComponent(PRIVACY_VERSION)}`;
