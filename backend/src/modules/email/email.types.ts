// src/services/email/email.types.ts

/* ============================================================================
   SEND EMAIL PAYLOAD
   Used by EmailService.send() and EmailService.sendVerificationEmail()
   ============================================================================ */

export type SendEmailPayload = {
  /** Recipient email address (required) */
  to: string;

  /** Email subject line (required) */
  subject: string;

  /** HTML body (required) */
  html: string;

  /**
   * Plain-text fallback (optional).
   * Improves deliverability and renders in email clients that block HTML.
   */
  text?: string;

  /** Carbon-copy recipients (optional) */
  cc?: string | string[];

  /** Blind carbon-copy recipients (optional) */
  bcc?: string | string[];

  /** Reply-to address (optional). Defaults to EMAIL_USER. */
  replyTo?: string;

  /** File attachments (optional) */
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    path?: string;
    contentType?: string;
  }>;
};

/* ============================================================================
   OTHER EMAIL PAYLOAD TYPES (optional — use if needed elsewhere)
   ============================================================================ */

export type VerificationEmailPayload = {
  to: string;
  name?: string;
  verificationUrl: string;
  expiresInHours?: number;
};

export type ResetPasswordEmailPayload = {
  to: string;
  name?: string;
  resetUrl: string;
  expiresInMinutes?: number;
};

export type NotificationEmailPayload = {
  to: string;
  title: string;
  message: string;
  ctaText?: string;
  ctaUrl?: string;
};