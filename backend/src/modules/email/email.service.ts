// // src/services/email/email.service.ts
// import nodemailer from "nodemailer";
// import { logger } from "patal-log";
// import { SendEmailPayload } from "./email.types";

// /* ============================================================================
//    ENV VALIDATION
//    Fail fast on startup if any required var is missing.
//    ============================================================================ */

// const REQUIRED_ENV_VARS = [
//   "EMAIL_HOST",
//   "EMAIL_PORT",
//   "EMAIL_USER",
//   "EMAIL_PASS",
// ] as const

// for (const key of REQUIRED_ENV_VARS) {
//   if (!process.env[key]) {
//     throw new Error(
//       `[EmailService] Missing required environment variable: ${key}`
//     )
//   }
// }

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: Number(process.env.EMAIL_PORT),
//   secure: process.env.EMAIL_SECURE === "true", // "true" → true, "false" → false
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   // Silence nodemailer's internal logger — we use `patal-log` instead
//   logger: false,
//   debug: false,
// })

// /* ============================================================================
//    STARTUP VERIFICATION
//    Runs once when the module is first imported. Logs success/failure so you
//    can see immediately whether SMTP creds are valid.
//    ============================================================================ */

// transporter.verify((error) => {
//   if (error) {
//     const smtpError = error instanceof Error ? error : new Error(String(error))

//     logger.error("[EmailService] SMTP connection failed at startup", {
//       functionName: "EmailService.init",
//       error: smtpError,
//       metadata: {
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         user: process.env.EMAIL_USER,
//         passLength: process.env.EMAIL_PASS,
//       },
//     })
//   } else {
//     logger.info("[EmailService] SMTP connection verified", {
//       functionName: "EmailService.init",
//       metadata: {
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         user: process.env.EMAIL_USER,
//       },
//     })
//   }
// })

// /* ============================================================================
//    SERVICE
//    ============================================================================ */

// export class EmailService {
//   static async send({ to, subject, html }: SendEmailPayload) {
//     logger.info("[EmailService] Attempting to send email", {
//       functionName: "EmailService.send",
//       metadata: {
//         to,
//         subject,
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         user: process.env.EMAIL_USER,
//         passLength: process.env.EMAIL_PASS,
//       },
//     })

//     try {
//       const info = await transporter.sendMail({
//         from: `"Chronify" <${process.env.EMAIL_USER}>`,
//         to,
//         subject,
//         html,
//       })

//       logger.info("[EmailService] Email sent successfully", {
//         functionName: "EmailService.send",
//         metadata: {
//           to,
//           subject,
//           messageId: info.messageId,
//           response: info.response,
//         },
//       })

//       return info
//     } catch (error: any) {
//       logger.error("[EmailService] Email sending failed", {
//         functionName: "EmailService.send",
//         error: error instanceof Error ? error : new Error(String(error)),
//         metadata: {
//           to,
//           subject,
//           code: error?.code,
//           responseCode: error?.responseCode,
//           response: error?.response,
//           command: error?.command,
//         },
//       })

//       throw error
//     }
//   }
// }







// src/services/email/email.service.ts
import nodemailer from "nodemailer";
import { logger } from "patal-log";
import { SendEmailPayload } from "./email.types";

/* ============================================================================
   ENV VALIDATION
   ============================================================================ */

const REQUIRED_ENV_VARS = [
  "EMAIL_HOST",
  "EMAIL_PORT",
  "EMAIL_USER",
  "EMAIL_PASS",
] as const;

for (const key of REQUIRED_ENV_VARS) {
  if (!process.env[key]) {
    throw new Error(
      `[EmailService] Missing required environment variable: ${key}`
    );
  }
}

/* ============================================================================
   PASSWORD CLEANUP
   Gmail App Passwords look like "abcd efgh ijkl mnop" — strip whitespace.
   ============================================================================ */

const rawPassword = process.env.EMAIL_PASS ?? "";
const cleanPassword = rawPassword.replace(/\s+/g, "");

if (cleanPassword.length !== 16) {
  logger.warn(
    "[EmailService] EMAIL_PASS length is not 16 — may not be a valid Gmail App Password",
    {
      functionName: "EmailService.init",
      metadata: { length: cleanPassword.length },
    }
  );
}

/* ============================================================================
   TRANSPORTER
   ============================================================================ */

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: cleanPassword,
  },
  logger: false,
  debug: false,
});

/* ============================================================================
   APP CONFIG (used by templates)
   ============================================================================ */

const APP_NAME = "Chronify";
const APP_TAGLINE = "Plan. Focus. Achieve.";
const FRONTEND_URL = process.env.FRONTEND_URL ?? "https://chronify-frontend.vercel.app/";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? process.env.EMAIL_USER!;
const YEAR = new Date().getFullYear();

/* ============================================================================
   BASE EMAIL LAYOUT
   Wraps any content in Chronify's branded email chrome.
   ============================================================================ */

interface BaseLayoutOptions {
  preheader?: string; // hidden preview text in inbox
  heading: string;
  bodyHtml: string;
  ctaText?: string;
  ctaUrl?: string;
  footerNote?: string;
}

function renderBaseLayout({
  preheader = "",
  heading,
  bodyHtml,
  ctaText,
  ctaUrl,
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

  <!-- Preheader: hidden text shown in inbox preview -->
  <div style="display:none; font-size:1px; color:#f4f5f7; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
    ${preheader}
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f5f7; padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(15, 23, 42, 0.06);">

          <!-- HEADER (branded gradient) -->
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

          <!-- BODY -->
          <tr>
            <td style="padding:40px 40px 24px; color:#1f2937;">
              <h2 style="margin:0 0 20px; font-size:22px; font-weight:700; color:#111827; line-height:1.3;">
                ${heading}
              </h2>

              ${bodyHtml}

              ${
                ctaText && ctaUrl
                  ? `
                <!-- CTA BUTTON -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:32px auto 8px;">
                  <tr>
                    <td align="center" style="border-radius:10px; background:linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);">
                      <a href="${ctaUrl}"
                         target="_blank"
                         style="display:inline-block; padding:16px 40px; color:#ffffff; text-decoration:none; font-size:15px; font-weight:700; border-radius:10px; letter-spacing:0.3px;">
                        ${ctaText} &nbsp;&rarr;
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Fallback URL -->
                <p style="margin:24px 0 0; font-size:12px; color:#6b7280; text-align:center; line-height:1.6;">
                  Button not working? Copy and paste this link into your browser:<br />
                  <a href="${ctaUrl}" style="color:#4F46E5; word-break:break-all; text-decoration:underline;">${ctaUrl}</a>
                </p>
                `
                  : ""
              }
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px; background-color:#e5e7eb;"></div>
            </td>
          </tr>

          <!-- FOOTER -->
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
                ${APP_NAME} is a smart time-management companion that helps students and professionals plan their day,
                build lasting study streaks, track progress across goals, and stay consistent — all in one place.
                Whether you're prepping for exams, leveling up a skill, or building a daily habit,
                ${APP_NAME} keeps you focused and accountable.
              </p>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 20px;">
                <tr>
                  <td style="padding:0 8px;">
                    <a href="${FRONTEND_URL}" style="font-size:12px; color:#4F46E5; text-decoration:none; font-weight:600;">Website</a>
                  </td>
                  <td style="color:#d1d5db;">•</td>
                  <td style="padding:0 8px;">
                    <a href="${FRONTEND_URL}/dashboard" style="font-size:12px; color:#4F46E5; text-decoration:none; font-weight:600;">Dashboard</a>
                  </td>
                  <td style="color:#d1d5db;">•</td>
                  <td style="padding:0 8px;">
                    <a href="mailto:${SUPPORT_EMAIL}" style="font-size:12px; color:#4F46E5; text-decoration:none; font-weight:600;">Support</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0; font-size:11px; color:#9ca3af; text-align:center; line-height:1.7;">
                © ${YEAR} ${APP_NAME}. All rights reserved.<br />
                You're receiving this email because you signed up for ${APP_NAME}.<br />
                If this wasn't you, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}

/* ============================================================================
   PLAIN TEXT FALLBACK
   For clients that don't render HTML, and for spam-filter scoring.
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
   VERIFICATION EMAIL BUILDER
   ============================================================================ */

export interface VerificationEmailInput {
  to: string;
  name?: string;
  verificationUrl: string;
  expiresInHours?: number;
}

function buildVerificationEmail({
  to,
  name,
  verificationUrl,
  expiresInHours = 24,
}: VerificationEmailInput): {
  to: string;
  subject: string;
  html: string;
  text: string;
} {
  const safeName = name?.trim() || to.split("@")[0];
  const firstName = safeName.split(/\s+/)[0];

  const subject = `Verify your email to activate your ${APP_NAME} account`;

  const bodyHtml = `
    <p style="margin:0 0 16px; font-size:15px; line-height:1.7; color:#374151;">
      Hi <strong style="color:#111827;">${firstName}</strong>,
    </p>

    <p style="margin:0 0 16px; font-size:15px; line-height:1.7; color:#374151;">
      Welcome to <strong>${APP_NAME}</strong>! 🎉 We're excited to have you on board.
    </p>

    <p style="margin:0 0 24px; font-size:15px; line-height:1.7; color:#374151;">
      Just one quick step to unlock everything — confirm your email address
      (<strong style="color:#111827;">${to}</strong>) by clicking the button below.
    </p>

    <!-- Info card -->
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
    ctaUrl: verificationUrl,
    footerNote: `Didn't create a ${APP_NAME} account? You can safely ignore this email — no account will be created.`,
  });

  const text = `
Hi ${firstName},

Welcome to ${APP_NAME}!

Confirm your email (${to}) by opening this link:
${verificationUrl}

This link expires in ${expiresInHours} hours.

About ${APP_NAME}:
${APP_NAME} helps you plan your day, build streaks, track progress, and stay consistent across your goals — a smart time-management companion for students and professionals.

Didn't sign up? Ignore this email.

© ${YEAR} ${APP_NAME}
${FRONTEND_URL}
  `.trim();

  return { to, subject, html, text };
}

/* ============================================================================
   STARTUP VERIFICATION
   ============================================================================ */

transporter.verify((error) => {
  if (error) {
    const smtpError = error instanceof Error ? error : new Error(String(error));

    logger.error("[EmailService] SMTP connection failed at startup", {
      functionName: "EmailService.init",
      error: smtpError,
      metadata: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        passLength: cleanPassword.length, // length only, never the value
      },
    });
  } else {
    logger.info("[EmailService] SMTP connection verified", {
      functionName: "EmailService.init",
      metadata: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
      },
    });
  }
});

/* ============================================================================
   SERVICE
   ============================================================================ */

export class EmailService {
  /**
   * Generic HTML email sender.
   * Prefer the specific helpers (sendVerificationEmail) when possible —
   * they enforce branding and provide a plain-text fallback.
   */
  static async send({ to, subject, html }: SendEmailPayload) {
    logger.info("[EmailService] Attempting to send email", {
      functionName: "EmailService.send",
      metadata: {
        to,
        subject,
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        passLength: cleanPassword.length,
      },
    });

    try {
      const info = await transporter.sendMail({
        from: `"${APP_NAME}" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        // Best-effort plain-text fallback
        text: stripHtml(html),
      });

      logger.info("[EmailService] Email sent successfully", {
        functionName: "EmailService.send",
        metadata: {
          to,
          subject,
          messageId: info.messageId,
          response: info.response,
        },
      });

      return info;
    } catch (error: any) {
      logger.error("[EmailService] Email sending failed", {
        functionName: "EmailService.send",
        error: error instanceof Error ? error : new Error(String(error)),
        metadata: {
          to,
          subject,
          code: error?.code,
          responseCode: error?.responseCode,
          response: error?.response,
          command: error?.command,
        },
      });

      throw error;
    }
  }

  /**
   * Sends the branded verification email.
   *
   * @example
   *   await EmailService.sendVerificationEmail({
   *     to: user.email,
   *     name: user.name,
   *     verificationUrl: `https://app.chronify.app/verify?token=${token}`,
   *   })
   */
  static async sendVerificationEmail(input: VerificationEmailInput) {
    const { to, subject, html, text } = buildVerificationEmail(input);

    logger.info("[EmailService] Sending verification email", {
      functionName: "EmailService.sendVerificationEmail",
      metadata: { to, name: input.name },
    });

    try {
      const info = await transporter.sendMail({
        from: `"${APP_NAME}" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        text,
      });

      logger.info("[EmailService] Verification email sent", {
        functionName: "EmailService.sendVerificationEmail",
        metadata: {
          to,
          messageId: info.messageId,
          response: info.response,
        },
      });

      return info;
    } catch (error: any) {
      logger.error("[EmailService] Verification email failed", {
        functionName: "EmailService.sendVerificationEmail",
        error: error instanceof Error ? error : new Error(String(error)),
        metadata: {
          to,
          code: error?.code,
          responseCode: error?.responseCode,
          response: error?.response,
        },
      });

      throw error;
    }
  }
}