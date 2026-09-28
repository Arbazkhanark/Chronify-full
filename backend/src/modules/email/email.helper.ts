// src/services/email/email.helper.ts
import { EmailService } from "./email.service";
import { emailTemplates } from "./email.template";

/* ============================================================================
   CONFIG
   ============================================================================ */

const FRONTEND_URL =
  process.env.FRONTEND_URL ??
  process.env.APP_URL ??
  "http://localhost:3000";

/* ============================================================================
   TYPES
   ============================================================================ */

interface SendVerificationEmailInput {
  email: string;
  token: string;
  name?: string;
  expiresInHours?: number;
}

interface SendResetPasswordEmailInput {
  email: string;
  token: string;
  name?: string;
  expiresInMinutes?: number;
}

interface SendNotificationEmailInput {
  email: string;
  title: string;
  message: string;
  ctaText?: string;
  ctaUrl?: string;
}

/* ============================================================================
   SEND VERIFICATION EMAIL
   Accepts BOTH:
     sendVerificationEmail(email, token)                 // old style
     sendVerificationEmail({ email, token, name })       // new style
   ============================================================================ */

export const sendVerificationEmail = async (
  emailOrOptions: string | SendVerificationEmailInput,
  token?: string
): Promise<void> => {
  const opts: SendVerificationEmailInput =
    typeof emailOrOptions === "string"
      ? { email: emailOrOptions, token: token ?? "" }
      : emailOrOptions;

  if (!opts.email) {
    throw new Error("[sendVerificationEmail] email is required");
  }
  if (!opts.token) {
    throw new Error("[sendVerificationEmail] token is required");
  }

  // const link = `${FRONTEND_URL}/auth/verify-email?token=${verificationToken}`
  const link = `${FRONTEND_URL}/auth/verify-email?token=${encodeURIComponent(opts.token)
}`;

  const template = emailTemplates.verifyEmail({
    link,
    name: opts.name,
    email: opts.email,
    expiresInHours: opts.expiresInHours ?? 24,
  });

  await EmailService.send({
    to: opts.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
};

/* ============================================================================
   SEND RESET PASSWORD EMAIL
   Accepts BOTH:
     sendResetPasswordEmail(email, token)                // old style
     sendResetPasswordEmail({ email, token, name })      // new style
   ============================================================================ */

export const sendResetPasswordEmail = async (
  emailOrOptions: string | SendResetPasswordEmailInput,
  token?: string
): Promise<void> => {
  const opts: SendResetPasswordEmailInput =
    typeof emailOrOptions === "string"
      ? { email: emailOrOptions, token: token ?? "" }
      : emailOrOptions;

  if (!opts.email) {
    throw new Error("[sendResetPasswordEmail] email is required");
  }
  if (!opts.token) {
    throw new Error("[sendResetPasswordEmail] token is required");
  }

  const link = `${FRONTEND_URL}/reset-password?token=${encodeURIComponent(
    opts.token
  )}`;

  const template = emailTemplates.resetPassword({
    link,
    name: opts.name,
    email: opts.email,
    expiresInMinutes: opts.expiresInMinutes ?? 10,
  });

  await EmailService.send({
    to: opts.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
};

/* ============================================================================
   SEND NOTIFICATION EMAIL
   Accepts BOTH:
     sendNotificationEmail(email, title, message)              // old style
     sendNotificationEmail({ email, title, message, ctaText }) // new style
   ============================================================================ */

export const sendNotificationEmail = async (
  emailOrOptions: string | SendNotificationEmailInput,
  title?: string,
  message?: string
): Promise<void> => {
  const opts: SendNotificationEmailInput =
    typeof emailOrOptions === "string"
      ? {
          email: emailOrOptions,
          title: title ?? "",
          message: message ?? "",
        }
      : emailOrOptions;

  if (!opts.email) {
    throw new Error("[sendNotificationEmail] email is required");
  }
  if (!opts.title) {
    throw new Error("[sendNotificationEmail] title is required");
  }
  if (!opts.message) {
    throw new Error("[sendNotificationEmail] message is required");
  }

  const template = emailTemplates.notification({
    title: opts.title,
    message: opts.message,
    ctaText: opts.ctaText,
    ctaUrl: opts.ctaUrl,
  });

  await EmailService.send({
    to: opts.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
};