/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SUPABASE_URL?: string;
  readonly SUPABASE_ANON_KEY?: string;
  readonly WAITLIST_ADMIN_TOKEN?: string;
  readonly ADMIN_ALLOWED_ORIGINS?: string;
  readonly WAITLIST_ALLOWED_ORIGINS?: string;
  readonly WAITLIST_IP_SALT?: string;
  readonly WAITLIST_UNSUBSCRIBE_SECRET?: string;
  readonly WAITLIST_UNSUBSCRIBE_BASE_URL?: string;
  readonly WAITLIST_FROM?: string;
  readonly EMAIL_PROVIDER?: string;
  readonly RESEND_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
