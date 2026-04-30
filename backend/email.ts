import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = process.env.RESEND_FROM ?? "MatchMe <onboarding@resend.dev>";

export async function sendResetPasswordEmail(to: string, resetLink: string): Promise<void> {
  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Reset your MatchMe password",
    html: `
      <p>You requested a password reset for your MatchMe account.</p>
      <p>Click the link below to set a new password. This link expires in 1 hour.</p>
      <p><a href="${resetLink}">Reset my password</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  });
}
