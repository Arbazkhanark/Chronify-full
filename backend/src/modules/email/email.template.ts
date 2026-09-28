// src/services/email/email.template.ts

/* ============================================================================
   APP CONFIG
   ============================================================================ */

const APP_NAME = "Chronify";
const APP_TAGLINE = "Plan. Focus. Achieve.";
const APP_URL = process.env.APP_URL ?? "https://chronify-frontend.vercel.app";
const SUPPORT_EMAIL =
  process.env.SUPPORT_EMAIL ?? process.env.EMAIL_USER ?? "support@chronify.app";
const YEAR = new Date().getFullYear();

/* ============================================================================
   BASE LAYOUT
   Wraps any content in the Chronify branded email chrome.
   ============================================================================ */

interface BaseLayoutOptions {
  preheader?: string;
  heading: string;
  bodyHtml: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaColor?: string;
  ctaColorEnd?: string;
  footerNote?: string;
}

function renderBaseLayout({
  preheader = "",
  heading,
  bodyHtml,
  ctaText,
  ctaUrl,
  ctaColor = "#4F46E5",
  ctaColorEnd = "#7C3AED",
  footerNote,
}: BaseLayoutOptions): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${APP_NAME}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0; padding:0; background-color:#f4f5f7; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;">

  <div style="display:none; font-size:1px; color:#f4f5f7; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
    ${preheader}
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f5f7; padding:40px 16px;">
    <tr>
      <td align="center">

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(15, 23, 42, 0.06);">

          <tr>
            <td style="background:linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%); padding:36px 40px 32px; text-align:center;">
              <div style="display:inline-block; padding:8px 16px; border-radius:999px; background:rgba(255,255,255,0.15); margin-bottom:14px;">
                <span style="color:#ffffff; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase;">
                  ${APP_TAGLINE}
                </span>
              </div>
              <h1 style="margin:0; color:#ffffff; font-size:30px; font-weight:800; letter-spacing:-0.5px;">
                ${APP_NAME}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:40px 40px 24px; color:#1f2937;">
              <h2 style="margin:0 0 20px; font-size:22px; font-weight:700; color:#111827; line-height:1.3;">
                ${heading}
              </h2>

              ${bodyHtml}

              ${
                ctaText && ctaUrl
                  ? `
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:32px auto 8px;">
                  <tr>
                    <td align="center" style="border-radius:10px; background:linear-gradient(135deg, ${ctaColor} 0%, ${ctaColorEnd} 100%);">
                      <a href="${ctaUrl}"
                         target="_blank"
                         style="display:inline-block; padding:16px 40px; color:#ffffff; text-decoration:none; font-size:15px; font-weight:700; border-radius:10px; letter-spacing:0.3px;">
                        ${ctaText} &nbsp;&rarr;
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin:24px 0 0; font-size:12px; color:#6b7280; text-align:center; line-height:1.6;">
                  Button not working? Copy and paste this link into your browser:<br />
                  <a href="${ctaUrl}" style="color:#4F46E5; word-break:break-all; text-decoration:underline;">${ctaUrl}</a>
                </p>
                `
                  : ""
              }
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px; background-color:#e5e7eb;"></div>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 40px 36px;">
              ${
                footerNote
                  ? `<p style="margin:0 0 16px; font-size:13px; color:#6b7280; line-height:1.6; text-align:center;">${footerNote}</p>`
                  : ""
              }

              <p style="margin:0 0 12px; font-size:13px; color:#4b5563; line-height:1.6; text-align:center; font-weight:600;">
                About ${APP_NAME}
              </p>
              <p style="margin:0 0 24px; font-size:12px; color:#6b7280; line-height:1.7; text-align:center;">
                ${APP_NAME} is a smart time-management companion that helps students and professionals
                plan their day, build lasting study streaks, track progress across goals, and stay consistent —
                all in one place. Whether you're prepping for exams, leveling up a skill, or building a daily
                habit, ${APP_NAME} keeps you focused and accountable.
              </p>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 20px;">
                <tr>
                  <td style="padding:0 8px;">
                    <a href="${APP_URL}" style="font-size:12px; color:#4F46E5; text-decoration:none; font-weight:600;">Website</a>
                  </td>
                  <td style="color:#d1d5db;">•</td>
                  <td style="padding:0 8px;">
                    <a href="${APP_URL}/dashboard" style="font-size:12px; color:#4F46E5; text-decoration:none; font-weight:600;">Dashboard</a>
                  </td>
                  <td style="color:#d1d5db;">•</td>
                  <td style="padding:0 8px;">
                    <a href="mailto:${SUPPORT_EMAIL}" style="font-size:12px; color:#4F46E5; text-decoration:none; font-weight:600;">Support</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0; font-size:11px; color:#9ca3af; text-align:center; line-height:1.7;">
                © ${YEAR} ${APP_NAME}. All rights reserved.<br />
                You're receiving this email because you have a ${APP_NAME} account.<br />
                If this wasn't you, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}

/* ============================================================================
   PLAIN TEXT FALLBACK
   ============================================================================ */

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&rarr;/g, "→")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/* ============================================================================
   HELPERS
   ============================================================================ */

function getFirstName(nameOrEmail?: string): string {
  if (!nameOrEmail) return "there";
  const base = nameOrEmail.includes("@")
    ? nameOrEmail.split("@")[0]
    : nameOrEmail;
  const first = base.split(/[\s._-]+/)[0];
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : "there";
}

/* ============================================================================
   INPUT TYPES
   ============================================================================ */

export interface VerificationEmailOptions {
  link: string;
  name?: string;
  email?: string;
  expiresInHours?: number;
}

export interface ResetPasswordEmailOptions {
  link: string;
  name?: string;
  email?: string;
  expiresInMinutes?: number;
}

export interface NotificationEmailOptions {
  title: string;
  message: string;
  ctaText?: string;
  ctaUrl?: string;
}

/* ============================================================================
   NORMALIZERS
   Accept BOTH old (string) and new (object) input styles.
   ============================================================================ */

function normalizeVerificationInput(
  input: string | VerificationEmailOptions
): VerificationEmailOptions {
  if (typeof input === "string") {
    return { link: input };
  }
  return input;
}

function normalizeResetInput(
  input: string | ResetPasswordEmailOptions
): ResetPasswordEmailOptions {
  if (typeof input === "string") {
    return { link: input };
  }
  return input;
}

/* ============================================================================
   TEMPLATE OUTPUT TYPE
   ============================================================================ */

export interface EmailTemplateOutput {
  subject: string;
  html: string;
  text: string;
}

/* ============================================================================
   EMAIL TEMPLATES
   ============================================================================ */

export const emailTemplates = {
  /* ------------------------------------------------------------------------
     VERIFY EMAIL
     ------------------------------------------------------------------------ */
  verifyEmail: (
    input: string | VerificationEmailOptions
  ): EmailTemplateOutput => {
    const { link, name, email, expiresInHours = 24 } =
      normalizeVerificationInput(input);

    const firstName = getFirstName(name ?? email);

    const bodyHtml = `
      <p style="margin:0 0 16px; font-size:15px; line-height:1.7; color:#374151;">
        Hi <strong style="color:#111827;">${firstName}</strong>,
      </p>

      <p style="margin:0 0 16px; font-size:15px; line-height:1.7; color:#374151;">
        Welcome to <strong>${APP_NAME}</strong>! 🎉 We're excited to have you on board.
      </p>

      <p style="margin:0 0 24px; font-size:15px; line-height:1.7; color:#374151;">
        Just one quick step to unlock everything — confirm your email address${
          email ? ` (<strong style="color:#111827;">${email}</strong>)` : ""
        } by clicking the button below.
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:24px 0; background-color:#f9fafb; border-left:4px solid #7C3AED; border-radius:8px;">
        <tr>
          <td style="padding:16px 20px;">
            <p style="margin:0 0 6px; font-size:13px; font-weight:700; color:#7C3AED; text-transform:uppercase; letter-spacing:0.5px;">
              ⏱️ Link expires in ${expiresInHours} hours
            </p>
            <p style="margin:0; font-size:13px; color:#6b7280; line-height:1.6;">
              For your security, this verification link will expire after ${expiresInHours} hours.
              If it expires, just request a new one from your dashboard.
            </p>
          </td>
        </tr>
      </table>
    `;

    const html = renderBaseLayout({
      preheader: `Confirm your email to activate your ${APP_NAME} account. Link expires in ${expiresInHours} hours.`,
      heading: "Confirm your email address",
      bodyHtml,
      ctaText: "Verify My Email",
      ctaUrl: link,
      footerNote: `Didn't create a ${APP_NAME} account? You can safely ignore this email — no account will be created.`,
    });

    const text = `
Hi ${firstName},

Welcome to ${APP_NAME}!

Confirm your email${email ? ` (${email})` : ""} by opening this link:
${link}

This link expires in ${expiresInHours} hours.

About ${APP_NAME}:
${APP_NAME} helps you plan your day, build streaks, track progress, and stay consistent across your goals — a smart time-management companion for students and professionals.

Didn't sign up? Ignore this email.

© ${YEAR} ${APP_NAME}
${APP_URL}
    `.trim();

    return {
      subject: `Verify your email to activate your ${APP_NAME} account`,
      html,
      text,
    };
  },

  /* ------------------------------------------------------------------------
     RESET PASSWORD
     ------------------------------------------------------------------------ */
  resetPassword: (
    input: string | ResetPasswordEmailOptions
  ): EmailTemplateOutput => {
    const { link, name, email, expiresInMinutes = 10 } =
      normalizeResetInput(input);

    const firstName = getFirstName(name ?? email);

    const bodyHtml = `
      <p style="margin:0 0 16px; font-size:15px; line-height:1.7; color:#374151;">
        Hi <strong style="color:#111827;">${firstName}</strong>,
      </p>

      <p style="margin:0 0 16px; font-size:15px; line-height:1.7; color:#374151;">
        We received a request to reset the password for your <strong>${APP_NAME}</strong> account${
          email ? ` (<strong style="color:#111827;">${email}</strong>)` : ""
        }.
      </p>

      <p style="margin:0 0 24px; font-size:15px; line-height:1.7; color:#374151;">
        Click the button below to choose a new password.
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:24px 0; background-color:#fef2f2; border-left:4px solid #DC2626; border-radius:8px;">
        <tr>
          <td style="padding:16px 20px;">
            <p style="margin:0 0 6px; font-size:13px; font-weight:700; color:#DC2626; text-transform:uppercase; letter-spacing:0.5px;">
              ⚠️ Link expires in ${expiresInMinutes} minutes
            </p>
            <p style="margin:0; font-size:13px; color:#7f1d1d; line-height:1.6;">
              If you didn't request a password reset, you can safely ignore this email.
              Your password will remain unchanged and your account is secure.
            </p>
          </td>
        </tr>
      </table>
    `;

    const html = renderBaseLayout({
      preheader: `Reset your ${APP_NAME} password. Link expires in ${expiresInMinutes} minutes.`,
      heading: "Reset your password",
      bodyHtml,
      ctaText: "Reset Password",
      ctaUrl: link,
      ctaColor: "#DC2626",
      ctaColorEnd: "#B91C1C",
      footerNote: `For your security, this password reset link can only be used once and expires in ${expiresInMinutes} minutes.`,
    });

    const text = `
Hi ${firstName},

We received a request to reset the password for your ${APP_NAME} account${email ? ` (${email})` : ""}.

Reset your password by opening this link:
${link}

This link expires in ${expiresInMinutes} minutes.

If you didn't request this, ignore this email — your password will not change.

© ${YEAR} ${APP_NAME}
${APP_URL}
    `.trim();

    return {
      subject: `Reset your ${APP_NAME} password`,
      html,
      text,
    };
  },

  /* ------------------------------------------------------------------------
     GENERIC NOTIFICATION
     Accepts BOTH:
       notification(title, message)              // old style
       notification({ title, message, ctaText }) // new style
     ------------------------------------------------------------------------ */
  notification: (
    titleOrOptions: string | NotificationEmailOptions,
    message?: string
  ): EmailTemplateOutput => {
    const opts: NotificationEmailOptions =
      typeof titleOrOptions === "string"
        ? { title: titleOrOptions, message: message ?? "" }
        : titleOrOptions;

    const bodyHtml = `
      <p style="margin:0 0 16px; font-size:15px; line-height:1.7; color:#374151;">
        ${opts.message}
      </p>
    `;

    const html = renderBaseLayout({
      preheader: opts.message.slice(0, 100),
      heading: opts.title,
      bodyHtml,
      ctaText: opts.ctaText,
      ctaUrl: opts.ctaUrl,
    });

    const text = `
${opts.title}

${opts.message}

© ${YEAR} ${APP_NAME}
${APP_URL}
    `.trim();

    return {
      subject: opts.title,
      html,
      text,
    };
  },
};

/* ============================================================================
   EXPORT HELPER FOR CALLERS THAT WANT stripHtml
   ============================================================================ */

export { stripHtml };