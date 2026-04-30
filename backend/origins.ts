const splitOrigins = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

export const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

export const allowedOrigins = new Set([
  clientOrigin,
  ...splitOrigins(process.env.CLIENT_ORIGINS),
]);

export const trustedOrigins = Array.from(allowedOrigins);

