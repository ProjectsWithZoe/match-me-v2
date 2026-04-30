import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header";
import { AuthDialog } from "@/components/AuthDialog";
import { ProfileSheet } from "@/components/ProfileSheet";
import { JobInput } from "@/components/JobInput";
import { ResultsPanel } from "@/components/ResultsPanel";
import { useAuth } from "@/hooks/useAuth";
import { useCV } from "@/hooks/useCV";
import { useAnalysis } from "@/hooks/useAnalysis";

function App() {
  const { user, isAuthLoading, loadProfile, signUp, signIn, signOut, forgotPassword } = useAuth();
  const { savedCv, isSavingCv, loadCv, saveCv, deleteCv, clearCv } = useCV();
  const { analysis, matchScore, hasAnalysis, isAnalyzing, onAnalyze, resetAnalysis } = useAnalysis();

  const [jobDescription, setJobDescription] = useState("");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Load profile + CV in parallel on mount
  useEffect(() => {
    void Promise.all([loadProfile(), loadCv()]);
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    const ok = await signIn(email, password);
    if (ok) await loadCv();
    return ok;
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    const ok = await signUp(name, email, password);
    if (ok) await loadCv();
    return ok;
  };

  const handleSignOut = async () => {
    await signOut();
    clearCv();
    resetAnalysis();
  };

  const handleAnalyze = () => void onAnalyze(jobDescription);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <Header
          user={user}
          savedCv={savedCv}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Two-panel layout: job input left, results right */}
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

      <AuthDialog
        open={isAuthOpen}
        onOpenChange={setIsAuthOpen}
        user={user}
        isAuthLoading={isAuthLoading}
        onSignUp={handleSignUp}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onForgotPassword={forgotPassword}
      />

      <ProfileSheet
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        user={user}
        savedCv={savedCv}
        isSavingCv={isSavingCv}
        isAuthLoading={isAuthLoading}
        onSaveCv={saveCv}
        onDeleteCv={deleteCv}
        onSignOut={handleSignOut}
      />

      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;
