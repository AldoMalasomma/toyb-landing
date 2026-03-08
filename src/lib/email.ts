export interface WaitlistEmailEnv {
  RESEND_API_KEY?: string;
  WAITLIST_FROM?: string;
  EMAIL_PROVIDER?: string;
}

export type EmailProvider = "resend" | "mock";
export type EmailErrorCode = "misconfigured_email" | "resend_error";

export interface EmailSendResult {
  ok: boolean;
  provider: EmailProvider;
  error_code?: EmailErrorCode;
  provider_status?: number;
}

export interface SendWaitlistEmailInput {
  to: string;
  marketingConsent: boolean;
  unsubscribeUrl: string;
  env: WaitlistEmailEnv;
}

export interface SendCampaignEmailInput {
  to: string;
  subject: string;
  text: string;
  html: string;
  env: WaitlistEmailEnv;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cleanString = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const extractFromEmail = (value: string): string => {
  const match = value.match(/<([^<>]+)>/);
  return cleanString(match?.[1] ?? value).toLowerCase();
};

const isValidFromAddress = (value: string): boolean => {
  const email = extractFromEmail(value);
  if (!EMAIL_PATTERN.test(email)) return false;

  const domain = email.split("@")[1] ?? "";
  return (
    domain.length > 0 &&
    domain.includes(".") &&
    !domain.startsWith(".") &&
    !domain.endsWith(".")
  );
};

const isProductionRuntime = (): boolean => {
  const nodeEnv = (
    globalThis as { process?: { env?: { NODE_ENV?: string } } }
  ).process?.env?.NODE_ENV;
  return nodeEnv === "production";
};

export const getEmailProvider = (env: WaitlistEmailEnv): EmailProvider => {
  const provider = cleanString(env.EMAIL_PROVIDER).toLowerCase();
  if (provider === "mock") return "mock";
  if (provider === "resend") return "resend";
  if (cleanString(env.RESEND_API_KEY)) return "resend";
  return isProductionRuntime() ? "resend" : "mock";
};

const getEmailBody = (
  marketingConsent: boolean,
  unsubscribeUrl: string,
): { subject: string; text: string; html: string } => {
  // Legacy copy (rollback):
  // - Subject: "Toyb — early access confirmed"
  // - Plain body with short confirmation + Kickstarter context + unsubscribe line
  const websiteUrl = "https://toyb.space";
  const termsUrl = "https://toyb.space/terms/";
  const privacyUrl = "https://toyb.space/privacy/";
  const xUrl = "https://x.com/Toybspace";
  const headerImageUrl = `${websiteUrl}/images/assets/toyb-social-cover.png`;
  const preheader =
    "You're in. Early access updates and private beta news will land here first.";
  const subject = "You're on the Toyb early access list";

  const textLines = [
    preheader,
    "",
    "Hi,",
    "",
    "You're now on the Toyb early access list.",
    "",
    "Toyb is a narrative systems platform built to help creators manage complex worldbuilding projects as structured systems instead of scattered files.",
    "",
    "The project is currently in its first private release phase while core workflows and UX are being finalized.",
    "",
    "Early access members will be the first to:",
    "",
    "- test the private beta",
    "- share feedback on workflows and features",
    "- join the founding community",
    "- receive early access to the public launch",
    "",
    "Visit Toyb: https://toyb.space",
    "",
    "The public launch is planned on Kickstarter in the coming weeks.",
    "",
    "We'll send another update when the private beta opens.",
    "",
    "We'll only send occasional updates about early access and launch.",
    "",
    "Toyb is built by Aldo G. Malasomma, an independent developer with 15+ years of experience building web systems and creative tools.",
    "",
    "Thanks for joining early.",
    "",
    "Aldo G. Malasomma",
    "Founder, Toyb",
    "",
    "Website: https://toyb.space",
    "X (@Toybspace): https://x.com/Toybspace",
    "Privacy: https://toyb.space/privacy/",
    "Terms: https://toyb.space/terms/",
    "",
    `Unsubscribe from marketing updates: ${unsubscribeUrl}`,
  ];
  const htmlBody = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f4f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;visibility:hidden;">
      ${preheader}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#f4f7fb;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;border-collapse:collapse;">
            <tr>
              <td style="padding:0;">
                <img
                  src="${headerImageUrl}"
                  alt="Toyb early access header"
                  width="640"
                  style="display:block;width:100%;height:auto;border:0;outline:none;text-decoration:none;"
                />
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;padding:30px 30px 12px;line-height:1.65;font-size:16px;color:#111827;">
                <p style="margin:0 0 14px;">Hi,</p>
                <p style="margin:0 0 16px;font-size:22px;line-height:1.3;font-weight:700;color:#0f172a;">You're now on the Toyb early access list.</p>
                <p style="margin:0 0 14px;">Toyb is a narrative systems platform built to help creators manage complex worldbuilding projects as structured systems instead of scattered files.</p>
                <p style="margin:0 0 16px;">The project is currently in its first private release phase while core workflows and UX are being finalized.</p>
                <p style="margin:0 0 10px;">Early access members will be the first to:</p>
                <ul style="margin:0 0 18px 20px;padding:0;color:#111827;">
                  <li style="margin:0 0 7px;">test the private beta</li>
                  <li style="margin:0 0 7px;">share feedback on workflows and features</li>
                  <li style="margin:0 0 7px;">join the founding community</li>
                  <li style="margin:0 0 7px;">receive early access to the public launch</li>
                </ul>
                <p style="margin:0 0 18px;">
                  <a
                    href="${websiteUrl}"
                    style="display:inline-block;background:#07d3f3;color:#0b1020;text-decoration:none;font-weight:600;padding:10px 18px;border-radius:8px;"
                  >Visit toyb.space</a>
                </p>
                <p style="margin:0 0 10px;">The public launch is planned on Kickstarter in the coming weeks.</p>
                <p style="margin:0 0 16px;">We'll send another update when the private beta opens.</p>
                <p style="margin:0 0 20px;color:#4b5563;font-size:14px;">We'll only send occasional updates about early access and launch.</p>
                <div style="margin-top:4px;padding-top:16px;border-top:1px solid #e5e7eb;">
                  <p style="margin:0 0 10px;color:#374151;">Toyb is built by Aldo G. Malasomma, an independent developer with 15+ years of experience building web systems and creative tools.</p>
                  <p style="margin:0 0 2px;">Aldo G. Malasomma</p>
                  <p style="margin:0;color:#4b5563;">Founder, Toyb</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;padding:18px 30px 30px;border-top:1px solid #f1f5f9;">
                <p style="margin:0;font-size:14px;line-height:1.85;color:#6b7280;">
                  <a href="${websiteUrl}" style="color:#6b7280;text-decoration:underline;">Website</a>
                  &nbsp;•&nbsp;
                  <a href="${xUrl}" style="color:#6b7280;text-decoration:underline;">X (@Toybspace)</a>
                  &nbsp;•&nbsp;
                  <a href="${privacyUrl}" style="color:#6b7280;text-decoration:underline;">Privacy</a>
                  &nbsp;•&nbsp;
                  <a href="${termsUrl}" style="color:#6b7280;text-decoration:underline;">Terms</a>
                </p>
                <p style="margin:8px 0 0;font-size:14px;line-height:1.75;color:#6b7280;">
                  <a href="${unsubscribeUrl}" style="color:#6b7280;text-decoration:underline;">Unsubscribe from marketing updates</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  if (marketingConsent) {
    return {
      subject,
      text: textLines.join("\n"),
      html: htmlBody,
    };
  }

  return {
    subject,
    text: textLines.join("\n"),
    html: htmlBody,
  };
};

export async function sendWaitlistEmail(
  input: SendWaitlistEmailInput,
): Promise<EmailSendResult> {
  const body = getEmailBody(input.marketingConsent, input.unsubscribeUrl);
  return sendEmailMessage({
    to: input.to,
    subject: body.subject,
    text: body.text,
    html: body.html,
    env: input.env,
  });
}

export async function sendCampaignEmail(
  input: SendCampaignEmailInput,
): Promise<EmailSendResult> {
  return sendEmailMessage({
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
    env: input.env,
  });
}

async function sendEmailMessage({
  to,
  subject,
  text,
  html,
  env,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
  env: WaitlistEmailEnv;
}): Promise<EmailSendResult> {
  const provider = getEmailProvider(env);
  if (provider === "mock") {
    return { ok: true, provider: "mock" };
  }

  const apiKey = cleanString(env.RESEND_API_KEY);
  const from = cleanString(env.WAITLIST_FROM);

  if (!apiKey || !isValidFromAddress(from)) {
    return {
      ok: false,
      provider: "resend",
      error_code: "misconfigured_email",
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        html,
      }),
    });

    if (!response.ok) {
      return {
        ok: false,
        provider: "resend",
        error_code: "resend_error",
        provider_status: response.status,
      };
    }

    return { ok: true, provider: "resend" };
  } catch {
    return {
      ok: false,
      provider: "resend",
      error_code: "resend_error",
    };
  }
}
