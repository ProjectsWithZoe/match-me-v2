const apiBaseUrl = import.meta.env.VITE_API_URL ?? "";
const url = (path: string) => `${apiBaseUrl}${path}`;

export type SessionUser = { id?: string; email?: string };
export type SavedCv = { id?: string; rawText?: string; parsedSkills?: string[] };
export type AnalysisResult = {
  "Matching Skills": string[];
  "Missing Skills": string[];
  "Similar Job Titles": string[];
  "Upskilling Resources": string[];
};

export async function fetchProfile(): Promise<SessionUser | null> {
  const res = await fetch(url("/api/me"), { credentials: "include" });
  if (!res.ok) return null;
  const data = (await res.json()) as { user?: SessionUser };
  return data.user ?? null;
}

export async function fetchCv(): Promise<SavedCv | null> {
  const res = await fetch(url("/api/cv"), { credentials: "include" });
  if (!res.ok) return null;
  const data = (await res.json()) as { cv?: SavedCv };
  return data.cv ?? null;
}

export async function uploadCv(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("cv", file);
  const res = await fetch(url("/api/upload-cv"), {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const data = (await res.json()) as { message?: string; error?: string };
  if (!res.ok) throw new Error(data.error ?? "Failed to save CV");
  return data.message ?? "CV saved";
}

export async function signUp(name: string, email: string, password: string): Promise<void> {
  const res = await fetch(url("/api/auth/sign-up/email"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });
  const data = (await res.json()) as { message?: string };
  if (!res.ok) throw new Error(data.message ?? "Sign up failed");
}

export async function signIn(email: string, password: string): Promise<void> {
  const res = await fetch(url("/api/auth/sign-in/email"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = (await res.json()) as { message?: string };
  if (!res.ok) throw new Error(data.message ?? "Login failed");
}

export async function signOut(): Promise<void> {
  const res = await fetch(url("/api/auth/sign-out"), {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Logout failed");
}

export async function demoAnalyze(jobDescription: string): Promise<AnalysisResult> {
  const res = await fetch(url("/api/demo/analyze"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobDescription }),
  });
  const data = (await res.json()) as AnalysisResult | { error?: string };
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Failed to analyze");
  return data as AnalysisResult;
}

export async function analyzeJob(jobDescription: string): Promise<AnalysisResult> {
  const res = await fetch(url("/api/analyze"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ jobDescription }),
  });
  const data = (await res.json()) as AnalysisResult | { error?: string };
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Failed to analyze");
  return data as AnalysisResult;
}
