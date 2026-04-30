import { useState } from "react";
import { toast } from "sonner";
import type { SavedCv } from "@/lib/api";

export function useCV() {
  const [savedCv, setSavedCv] = useState<SavedCv | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSavingCv, setIsSavingCv] = useState(false);

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
      setCvFile(file);
      setSavedCv({ id: file.name, fileName: file.name });
      toast.success("CV ready.");
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save CV");
      return false;
    } finally {
      setIsSavingCv(false);
    }
  };

  const deleteCv = async () => {
    setCvFile(null);
    setSavedCv(null);
    toast.success("CV removed.");
  };

  return { savedCv, cvFile, isSavingCv, saveCv, deleteCv };
}
