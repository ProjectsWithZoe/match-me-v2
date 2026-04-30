export async function sendResetPasswordEmail(to: string, resetLink: string): Promise<void> {
  console.info(
    `Password reset requested for ${to}. Email delivery is disabled; reset link: ${resetLink}`,
  );
}
