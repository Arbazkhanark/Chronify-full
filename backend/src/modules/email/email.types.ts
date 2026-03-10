//email.types.ts
export type SendEmailPayload = {
  to: string;
  subject: string;
  html: string;
};
