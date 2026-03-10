//email.template.ts
export const emailTemplates = {
  verifyEmail: (link: string) => ({
    subject: "Verify your email",
    html: `
      <h2>Verify your account</h2>
      <p>Click the button below to verify your email:</p>
      <a href="${link}" style="padding:10px 16px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:6px;">
        Verify Email
      </a>
      <p>This link is valid for 24 hours.</p>
    `,
  }),

  resetPassword: (link: string) => ({
    subject: "Reset your password",
    html: `
      <h2>Password Reset</h2>
      <p>You requested to reset your password.</p>
      <a href="${link}" style="padding:10px 16px;background:#dc2626;color:#fff;text-decoration:none;border-radius:6px;">
        Reset Password
      </a>
      <p>This link is valid for 10 minutes.</p>
    `,
  }),

  notification: (title: string, message: string) => ({
    subject: title,
    html: `<p>${message}</p>`,
  }),
};
