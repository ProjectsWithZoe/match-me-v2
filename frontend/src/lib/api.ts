const apiBaseUrl = import.meta.env.VITE_API_URL ?? "";
const url = (path: string) => `${apiBaseUrl}${path}`;

export type SavedCv = { id?: string; fileName?: string };
export type AnalysisResult = {
  "Matching Skills": string[];
  "Missing Skills": string[];
  "Similar Job Titles": string[];
  "Upskilling Resources": string[];
};

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

export async function analyzeCv(file: File, jobDescription: string): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("cv", file);

  const res = await fetch(url("/api/analyze"), {
    method: "POST",
    body: formData,
  });
  const data = (await res.json()) as AnalysisResult | { error?: string };
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Failed to analyze");
  return data as AnalysisResult;
}
