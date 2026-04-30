import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header";
import { ProfileSheet } from "@/components/ProfileSheet";
import { JobInput } from "@/components/JobInput";
import { ResultsPanel } from "@/components/ResultsPanel";
import { useCV } from "@/hooks/useCV";
import { useAnalysis } from "@/hooks/useAnalysis";

function App() {
  const { savedCv, cvFile, isSavingCv, saveCv, deleteCv } = useCV();
  const { analysis, matchScore, hasAnalysis, isAnalyzing, onAnalyze, resetAnalysis } = useAnalysis();

  const [jobDescription, setJobDescription] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleAnalyze = () => void onAnalyze(jobDescription, cvFile);

  const handleDeleteCv = async () => {
    await deleteCv();
    resetAnalysis();
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <Header
          savedCv={savedCv}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <JobInput
              jobDescription={jobDescription}
              onChange={setJobDescription}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              savedCv={savedCv}
              onOpenProfile={() => setIsProfileOpen(true)}
            />
          </div>
          <div className="lg:col-span-3">
            <ResultsPanel
              analysis={analysis}
              matchScore={matchScore}
              hasAnalysis={hasAnalysis}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>
      </div>

      <ProfileSheet
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        savedCv={savedCv}
        isSavingCv={isSavingCv}
        onSaveCv={saveCv}
        onDeleteCv={handleDeleteCv}
      />

      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;
