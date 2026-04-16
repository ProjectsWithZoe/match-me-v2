CREATE TABLE IF NOT EXISTS "User" (
  "id" text PRIMARY KEY,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "CV" (
  "id" text PRIMARY KEY,
  "userId" text UNIQUE NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "rawText" text,
  "parsedSkills" text[]
);

CREATE TABLE IF NOT EXISTS "JobAnalysis" (
  "id" text PRIMARY KEY,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "jobDescription" text NOT NULL,
  "result" jsonb NOT NULL,
  "createdAt" timestamp DEFAULT now()
);
