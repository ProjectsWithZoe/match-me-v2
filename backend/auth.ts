import "dotenv/config";
import { betterAuth } from "better-auth";
import {dash} from "@better-auth/infra"
import { pool } from "./db.js";
import { sendResetPasswordEmail } from "./email.js";

const authSecret = process.env.BETTER_AUTH_SECRET;
const authBaseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:4000";
const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

if (!authSecret) {
  throw new Error("BETTER_AUTH_SECRET is required");
}

export const auth = betterAuth({
  secret: authSecret,
  baseURL: authBaseUrl,
  trustedOrigins: [clientOrigin],
  database: pool,
  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },
  emailAndPassword: {
    enabled: true,
    resetPasswordTokenExpiresIn: 3600,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail(user.email, url);
    },
  },
  plugins: [dash()],
});
