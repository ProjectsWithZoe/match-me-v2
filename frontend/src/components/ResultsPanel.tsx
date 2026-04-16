import { BarChart3 } from "lucide-react";
import { MatchRing } from "@/components/MatchRing";
import { ResultCard } from "@/components/ResultCard";
import type { AnalysisResult } from "@/lib/api";

type Props = {
  analysis: AnalysisResult;
  matchScore: number;
  hasAnalysis: boolean;
  isAnalyzing: boolean;
};

const CARDS: (keyof AnalysisResult)[] = [
  "Matching Skills",
  "Missing Skills",
  "Similar Job Titles",
  "Upskilling Resources",
];

export function ResultsPanel({ analysis, matchScore, hasAnalysis, isAnalyzing }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Score card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            CV Match Score
          </p>
        </div>
        <div className="flex items-center justify-center py-8">
          <MatchRing
            score={matchScore}
            matching={analysis["Matching Skills"].length}
            missing={analysis["Missing Skills"].length}
          />
        </div>
      </div>

      {/* Empty state */}
      {!isAnalyzing && !hasAnalysis && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">No analysis yet</p>
            <p className="mt-1 text-sm text-slate-400">
              Paste a job description and click Analyze to see your skill match.
            </p>
          </div>
        </div>
      )}

      {/* Result cards */}
      {(isAnalyzing || hasAnalysis) && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {CARDS.map((title) => (
            <ResultCard
              key={title}
              title={title}
              items={analysis[title]}
              isAnalyzing={isAnalyzing}
            />
          ))}
        </div>
      )}
    </div>
  );
}
