import { useState } from "react";
import { toast } from "sonner";
import { fetchCv, uploadCv, type SavedCv } from "@/lib/api";

export function useCV() {
  const [savedCv, setSavedCv] = useState<SavedCv | null>(null);
  const [isLoadingCv, setIsLoadingCv] = useState(false);
  const [isSavingCv, setIsSavingCv] = useState(false);

  const loadCv = async () => {
    setIsLoadingCv(true);
    try {
      const cv = await fetchCv();
      setSavedCv(cv);
      return cv;
    } catch {
      setSavedCv(null);
      return null;
    } finally {
      setIsLoadingCv(false);
    }
  };

  const saveCv = async (file: File) => {
    const lower = file.name.toLowerCase();
    const isPdf = file.type === "application/pdf" || lower.endsWith(".pdf");
    const isDocx =
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      lower.endsWith(".docx");
    if (!isPdf && !isDocx) {
      toast.error("Only PDF and DOCX files are supported.");
      return false;
    }
    setIsSavingCv(true);
    try {
      const message = await uploadCv(file);
      toast.success(message);
      await loadCv();
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save CV");
      return false;
    } finally {
      setIsSavingCv(false);
    }
  };

  const clearCv = () => setSavedCv(null);

  return { savedCv, isLoadingCv, isSavingCv, loadCv, saveCv, clearCv };
}
