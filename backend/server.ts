import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyRateLimit from "@fastify/rate-limit";
import { randomUUID } from "node:crypto";
import mammoth from "mammoth";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth.js";
import { analyzeCvAgainstJobDescription, extractSkillsFromCvWithAI } from "./ai.js";
import { sql } from "./db.js";
import { requireAuth } from "./middleware.js";

const app = Fastify({ logger: true });
const port = Number(process.env.PORT ?? 4000);
const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";
const extraOrigins = (process.env.CLIENT_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = new Set([clientOrigin, ...extraOrigins]);

await app.register(fastifyRateLimit, {
  max: 100,
  timeWindow: "1 hour",
});

await app.register(fastifyCors, {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.has(origin) || origin.endsWith(".ngrok-free.dev")) {
      callback(null, true);
      return;
    }

    callback(new Error("CORS origin not allowed"), false);
  },
  credentials: true,
});
await app.register(fastifyMultipart);

app.get("/health", async () => {
  return { status: "ok" };
});

app.route({
  method: ["GET", "POST"],
  url: "/api/auth/*",
  async handler(request, reply) {
    try {
      const requestUrl = new URL(request.url, `http://${request.headers.host}`);
      const headers = fromNodeHeaders(request.headers);

      const authRequest = new Request(requestUrl.toString(), {
        method: request.method,
        headers,
        ...(request.body ? { body: JSON.stringify(request.body) } : {}),
      });

      const response = await auth.handler(authRequest);

      reply.status(response.status);
      response.headers.forEach((value, key) => {
        reply.header(key, value);
      });
      reply.send(response.body ? await response.text() : null);
    } catch (error) {
      app.log.error(error);
      reply.status(500).send({
        error: "Internal authentication error",
        code: "AUTH_FAILURE",
      });
    }
  },
});

app.get("/api/me", { preHandler: requireAuth }, async (request) => {
  return {
    user: request.user,
    session: request.session,
  };
});

app.get("/api/protected", { preHandler: requireAuth }, async () => {
  return { message: "Authenticated access granted" };
});

app.get("/api/cv", { preHandler: requireAuth }, async (request, reply) => {
  const userId = request.user?.id;
  if (typeof userId !== "string" || userId.length === 0) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  const cvRows = await sql`
    SELECT "id", "rawText", "parsedSkills"
    FROM "CV"
    WHERE "userId" = ${userId}
    LIMIT 1
  `;

  if (!cvRows[0]) {
    return reply.status(404).send({ error: "CV not found for user" });
  }

  return reply.send({ cv: cvRows[0] });
});

app.post("/api/upload-cv", { preHandler: requireAuth }, async (request, reply) => {
  const userId = request.user?.id;
  if (typeof userId !== "string" || userId.length === 0) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  const file = await request.file();
  if (!file) {
    return reply.status(400).send({ error: "A CV file is required" });
  }

  const filename = file.filename.toLowerCase();
  const isPdf = file.mimetype === "application/pdf" || filename.endsWith(".pdf");
  const isDocx =
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    filename.endsWith(".docx");

  if (!isPdf && !isDocx) {
    return reply
      .status(415)
      .send({ error: "Only PDF and DOCX files are supported" });
  }

  const buffer = await file.toBuffer();
  let rawText = "";

  if (isPdf) {
    const { extractText } = await import("unpdf");
    const { text } = await extractText(new Uint8Array(buffer), { mergePages: true });
    rawText = (text as string).trim();
  }

  if (isDocx) {
    const parsed = await mammoth.extractRawText({ buffer });
    rawText = parsed.value.trim();
  }

  if (!rawText) {
    return reply.status(400).send({ error: "Could not extract text from file" });
  }

  const parsedSkills = await extractSkillsFromCvWithAI(rawText);
  const parsedSkillsCsv = parsedSkills.join(",");

  let result: Array<Record<string, unknown>> = [];
  try {
    result = await sql`
      INSERT INTO "CV" ("id", "userId", "rawText", "parsedSkills")
      VALUES (${randomUUID()}, ${userId}, ${rawText}, string_to_array(${parsedSkillsCsv}, ','))
      ON CONFLICT ("userId")
      DO UPDATE SET
        "rawText" = EXCLUDED."rawText",
        "parsedSkills" = EXCLUDED."parsedSkills"
      RETURNING "id", "userId", "parsedSkills"
    `;
  } catch (error) {
    const dbError = error as { code?: string };
    if (dbError.code === "23503") {
      return reply.status(409).send({
        error:
          "User foreign key mismatch. Ensure CV.userId references Better Auth table \"user\".",
      });
    }
    throw error;
  }

  return reply.send({
    message: "CV saved",
    cv: result[0],
  });
});

const DEMO_CV_TEXT = `
Jane Okafor
Software Engineer | 4 years experience

Skills: JavaScript, TypeScript, React, Node.js, PostgreSQL,
        REST APIs, Git, Docker, Jest, Agile/Scrum

Experience:
- Software Engineer, FinPay Ltd (2021–present)
  Built React + TypeScript web apps serving 50k users
  Developed Node.js REST APIs with PostgreSQL
  Set up Docker-based CI/CD pipelines

- Junior Developer, LaunchPad Studio (2020–2021)
  Delivered frontend features in React
  Participated in agile sprints and code reviews

Education: BSc Computer Science, University of Nairobi, 2020
`;

app.post(
  "/api/demo/analyze",
  {
    config: {
      rateLimit: { max: 10, timeWindow: "1 hour" },
    },
  },
  async (request, reply) => {
    const body = (request.body ?? {}) as { jobDescription?: unknown };
    const jobDescription =
      typeof body.jobDescription === "string" ? body.jobDescription.trim() : "";
    if (!jobDescription) {
      return reply.status(400).send({ error: "jobDescription is required" });
    }
    const analysis = await analyzeCvAgainstJobDescription(DEMO_CV_TEXT, jobDescription);
    return reply.send(analysis);
  }
);

app.post("/api/analyze", { preHandler: requireAuth }, async (request, reply) => {
  const userId = request.user?.id;
  if (typeof userId !== "string" || userId.length === 0) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  const body = (request.body ?? {}) as { jobDescription?: unknown };
  const jobDescription =
    typeof body.jobDescription === "string" ? body.jobDescription.trim() : "";
  if (!jobDescription) {
    return reply.status(400).send({ error: "jobDescription is required" });
  }

  const cvRows = await sql`
    SELECT "rawText", "parsedSkills"
    FROM "CV"
    WHERE "userId" = ${userId}
    LIMIT 1
  `;

  if (!cvRows[0]) {
    return reply.status(404).send({ error: "CV not found for user" });
  }

  const cvText = typeof cvRows[0].rawText === "string" ? cvRows[0].rawText : "";
  const analysis = await analyzeCvAgainstJobDescription(cvText, jobDescription);

  try {
    await sql`
      INSERT INTO "JobAnalysis" ("id", "userId", "jobDescription", "result")
      VALUES (
        ${randomUUID()},
        ${userId},
        ${jobDescription},
        CAST(${JSON.stringify(analysis)} AS jsonb)
      )
    `;
  } catch (error) {
    const dbError = error as { code?: string };
    if (dbError.code === "23503") {
      return reply.status(409).send({
        error:
          "User foreign key mismatch. Ensure JobAnalysis.userId references Better Auth table \"user\".",
      });
    }
    throw error;
  }

  return reply.send(analysis);
});

const start = async () => {
  try {
    await app.listen({ host: "0.0.0.0", port });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();
