import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyRateLimit from "@fastify/rate-limit";
import mammoth from "mammoth";
import { analyzeCvAgainstJobDescription } from "./ai.js";
import { allowedOrigins } from "./origins.js";

const app = Fastify({ logger: true });

type UploadedCvFile = {
  filename: string;
  mimetype: string;
  fields?: Record<string, unknown>;
  toBuffer: () => Promise<Buffer>;
};

type CvTextResult =
  | { rawText: string }
  | { error: string; status: 400 | 415 };

const getMultipartFieldValue = (fields: Record<string, unknown> | undefined, name: string) => {
  const field = fields?.[name];
  const firstField = Array.isArray(field) ? field[0] : field;

  if (
    firstField &&
    typeof firstField === "object" &&
    "value" in firstField &&
    typeof firstField.value === "string"
  ) {
    return firstField.value.trim();
  }

  return "";
};

const extractCvTextFromFile = async (file: UploadedCvFile): Promise<CvTextResult> => {
  const filename = file.filename.toLowerCase();
  const isPdf = file.mimetype === "application/pdf" || filename.endsWith(".pdf");
  const isDocx =
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    filename.endsWith(".docx");

  if (!isPdf && !isDocx) {
    return { error: "Only PDF and DOCX files are supported", status: 415 };
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
    return { error: "Could not extract text from file", status: 400 };
  }

  return { rawText };
};

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

    callback(null, false);
  },
  credentials: false,
});

await app.register(fastifyMultipart);

app.get("/health", async () => {
  return { status: "ok" };
});

const DEMO_CV_TEXT = `
Jane Okafor
Software Engineer | 4 years experience

Skills: JavaScript, TypeScript, React, Node.js, PostgreSQL,
        REST APIs, Git, Docker, Jest, Agile/Scrum

Experience:
- Software Engineer, FinPay Ltd (2021-present)
  Built React + TypeScript web apps serving 50k users
  Developed Node.js REST APIs with PostgreSQL
  Set up Docker-based CI/CD pipelines

- Junior Developer, LaunchPad Studio (2020-2021)
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
  },
);

app.post(
  "/api/analyze",
  {
    config: {
      rateLimit: { max: 10, timeWindow: "1 hour" },
    },
  },
  async (request, reply) => {
    const file = await request.file();
    if (!file) {
      return reply.status(400).send({ error: "A CV file is required" });
    }

    const jobDescription = getMultipartFieldValue(file.fields, "jobDescription");
    if (!jobDescription) {
      return reply.status(400).send({ error: "jobDescription is required" });
    }

    const cvText = await extractCvTextFromFile(file);
    if ("error" in cvText) {
      return reply.status(cvText.status).send({ error: cvText.error });
    }

    const analysis = await analyzeCvAgainstJobDescription(cvText.rawText, jobDescription);
    return reply.send(analysis);
  },
);

export { app };
