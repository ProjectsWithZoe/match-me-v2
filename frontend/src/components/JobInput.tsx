import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { SavedCv } from "@/lib/api";

type Props = {
  jobDescription: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  savedCv: SavedCv | null;
  onOpenProfile: () => void;
};

export function JobInput({
  jobDescription,
  onChange,
  onAnalyze,
  isAnalyzing,
  savedCv,
  onOpenProfile,
}: Props) {
  const hasCv = savedCv !== null;

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100">
          <FileText className="h-4.5 w-4.5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">Job Description</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Paste a role to compare against your saved CV.
          </p>
        </div>
      </div>

      <Textarea
        id="job-desc"
        value={jobDescription}
        onChange={(e) => onChange(e.target.value)}
        rows={14}
        placeholder={"Paste the full job description here…\n\ne.g. We're looking for a Senior Backend Engineer to design microservices, deploy on Kubernetes, and build GraphQL APIs at scale…"}
        className="resize-none rounded-xl border-slate-200 bg-slate-50 text-sm leading-relaxed text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
      />

      {hasCv ? (
        <Button
          onClick={onAnalyze}
          disabled={isAnalyzing || !jobDescription.trim()}
          className="h-11 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
              </svg>
              Analyzing…
            </span>
          ) : (
            "Analyze Match →"
          )}
        </Button>
      ) : (
        <button
          type="button"
          onClick={onOpenProfile}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 px-4 py-4 text-sm font-medium text-blue-600 transition-colors hover:border-blue-300 hover:bg-blue-100"
        >
          <Upload className="h-4 w-4" />
          Upload your CV to get started →
        </button>
      )}
    </div>
  );
}
