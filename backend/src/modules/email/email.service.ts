//email.service.ts
import nodemailer from "nodemailer";
import { logger } from "patal-log";
import { SendEmailPayload } from "./email.types";

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'arbaaazkhanark23@gmail.com',
    pass: 'jimalbwqdzgykatm',
  },
});

export class EmailService {
  static async send({ to, subject, html }: SendEmailPayload) {
    console.log(process.env.SMTP_HOST,"HOST")
    console.log(process.env.SMTP_PORT,"SMTP_PORT")
    console.log(process.env.SMTP_USER,"SMTP_USER")
    console.log(process.env.SMTP_PASS,"SMTP_PASS")

    try {
      const isSent = await transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html,
      });

      console.log(isSent,"mail sent successfully")

      logger.info("Email sent successfully", {
        functionName: "EmailService.send",
        metadata: { to, subject },
      });
    } catch (error: any) {
      logger.error("Email sending failed", {
        functionName: "EmailService.send",
        error: error,
      });

      throw error;
    }
  }
}
