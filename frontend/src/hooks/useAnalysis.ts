import { useState } from "react";
import { toast } from "sonner";
import { analyzeCv, type AnalysisResult } from "@/lib/api";

const emptyAnalysis: AnalysisResult = {
  "Matching Skills": [],
  "Missing Skills": [],
  "Similar Job Titles": [],
  "Upskilling Resources": [],
};

export function useAnalysis() {
  const [analysis, setAnalysis] = useState<AnalysisResult>(emptyAnalysis);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const matchScore = (() => {
    const matching = analysis["Matching Skills"].length;
    const missing = analysis["Missing Skills"].length;
    const total = matching + missing;
    return total === 0 ? 0 : Math.round((matching / total) * 100);
  })();

  const hasAnalysis = Object.values(analysis).some((items) => items.length > 0);

  const onAnalyze = async (jobDescription: string, cvFile: File | null) => {
    if (!jobDescription.trim()) {
      toast.error("Paste a job description first.");
      return;
    }
    if (!cvFile) {
      toast.error("Upload your CV first.");
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await analyzeCv(cvFile, jobDescription);
      setAnalysis(result);
      toast.success("Analysis complete.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to analyze");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => setAnalysis(emptyAnalysis);

  return {
    analysis,
    matchScore,
    hasAnalysis,
    isAnalyzing,
    onAnalyze,
    resetAnalysis,
  };
}
