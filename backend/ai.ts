import "dotenv/config";

/* ================= TYPES ================= */

export type AnalysisResult = {
  "Matching Skills": string[];
  "Missing Skills": string[];
  "Similar Job Titles": string[];
  "Upskilling Resources": string[];
};

type CvSkillExtractionResult = {
  skills: string[];
};

/* ================= CONFIG ================= */

const CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY;
const CLAUDE_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

if (!CLAUDE_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is required");
}

/* ================= HELPERS ================= */

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isAnalysisResult = (value: unknown): value is AnalysisResult => {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;

  return (
    isStringArray(record["Matching Skills"]) &&
    isStringArray(record["Missing Skills"]) &&
    isStringArray(record["Similar Job Titles"]) &&
    isStringArray(record["Upskilling Resources"])
  );
};

/**
 * Extracts JSON safely from Claude responses
 */
function extractJSON(text: string) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const match = cleaned.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error("No valid JSON found in AI response");
  }

  return JSON.parse(match[0]);
}

/**
 * Retry wrapper for flaky LLM responses
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i === retries) break;
    }
  }

  throw lastError;
}

/**
 * Core Claude request
 */
async function callClaude(prompt: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CLAUDE_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1200,
      temperature: 0,
      system: `
You are a strict JSON generator.

Rules:
- Return ONLY valid JSON
- No markdown
- No backticks
- No explanations
- Output must start with { and end with }

If you break these rules, the response is invalid.
      `,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${errorText}`);
  }

  const payload = await response.json();

  const content = payload.content
    ?.filter((c: any) => c.type === "text")
    .map((c: any) => c.text)
    .join("")
    .trim();

  if (!content) {
    throw new Error("Empty response from Claude");
  }

  return content;
}

/* ================= CORE FUNCTIONS ================= */

/**
 * Analyze CV vs Job Description
 */
export async function analyzeCvAgainstJobDescription(
  cvText: string,
  jobDescription: string
): Promise<AnalysisResult> {
  return withRetry(async () => {
    const prompt = `
Compare this CV with the job description.

Return STRICT JSON:

{
  "Matching Skills": string[],
  "Missing Skills": string[],
  "Similar Job Titles": string[],
  "Upskilling Resources": string[]
}

Rules:
- No extra text
- No markdown
- No duplicates
- Be concise

CV:
${cvText}

Job Description:
${jobDescription}
`;

    const raw = await callClaude(prompt);
    const parsed = extractJSON(raw);

    if (!isAnalysisResult(parsed)) {
      throw new Error("Invalid AI response structure");
    }

    return parsed;
  });
}

/**
 * Extract skills from CV
 */
export async function extractSkillsFromCvWithAI(
  cvText: string
): Promise<string[]> {
  return withRetry(async () => {
    const prompt = `
Extract core professional skills from this CV.

Return STRICT JSON:

{
  "skills": string[]
}

Rules:
- No markdown
- No explanations
- No duplicates
- Normalize skills (e.g. JS → JavaScript)

CV:
${cvText}
`;

    const raw = await callClaude(prompt);
    const parsed = extractJSON(raw) as CvSkillExtractionResult;

    if (!parsed || !isStringArray(parsed.skills)) {
      throw new Error("Invalid skills response");
    }

    return parsed.skills;
  });
}