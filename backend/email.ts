import { Resend } from "resend";

const FROM_ADDRESS = process.env.RESEND_FROM ?? "MatchMe <onboarding@resend.dev>";

export async function sendResetPasswordEmail(to: string, resetLink: string): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is required to send password reset emails");
  }

  const resend = new Resend(resendApiKey);

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
