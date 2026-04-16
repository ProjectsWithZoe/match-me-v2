import "dotenv/config";
import { betterAuth } from "better-auth";
import {dash} from "@better-auth/infra"
import { pool } from "./db.js";

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
  emailAndPassword: {
    enabled: true,
  },
  plugins: [dash()],
});
