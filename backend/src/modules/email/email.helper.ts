//email.helper.ts
import { EmailService } from "./email.service";
import { emailTemplates } from "./email.template";
// import dotenv from "dotenv";

// dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL!;

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const link = `${FRONTEND_URL}/verify-email?token=${token}`;

  const template = emailTemplates.verifyEmail(link);

  await EmailService.send({
    to: email,
    subject: template.subject,
    html: template.html,
  });
};

export const sendResetPasswordEmail = async (
  email: string,
  token: string
) => {
  const link = `${FRONTEND_URL}/reset-password?token=${token}`;

  const template = emailTemplates.resetPassword(link);

  await EmailService.send({
    to: email,
    subject: template.subject,
    html: template.html,
  });
};

export const sendNotificationEmail = async (
  email: string,
  title: string,
  message: string
) => {
  const template = emailTemplates.notification(title, message);

  await EmailService.send({
    to: email,
    subject: template.subject,
    html: template.html,
  });
};
