import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  onSave: (file: File) => Promise<boolean>;
  isSaving: boolean;
  hasExistingCv?: boolean;
};

export function CVUpload({ onSave, isSaving, hasExistingCv = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [confirmReplace, setConfirmReplace] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const accept = (file: File) => {
    setSelectedFile(file);
    setConfirmReplace(false);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) accept(file);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) accept(file);
    e.target.value = "";
  };

  const handleSaveClick = () => {
    if (!selectedFile) return;
    if (hasExistingCv && !confirmReplace) {
      setConfirmReplace(true);
      return;
    }
    void handleSave();
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    const success = await onSave(selectedFile);
    if (success) {
      setSelectedFile(null);
      setConfirmReplace(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setConfirmReplace(false);
  };

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "cursor-pointer border-2 border-dashed px-6 py-8 text-center transition-colors",
          isDragging
            ? "border-indigo-600 bg-indigo-50"
            : "border-zinc-300 hover:border-indigo-400 hover:bg-zinc-50",
        )}
      >
        <UploadCloud className="mx-auto mb-2 h-8 w-8 text-zinc-400" />
        <p className="text-sm font-medium text-zinc-900">
          {hasExistingCv ? "Drop a new CV to replace" : "Drop your CV here"}
        </p>
        <p className="mt-1 text-xs text-zinc-500">PDF or DOCX · click to browse</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={onChange}
        className="hidden"
      />

      {selectedFile && (
        <div className="space-y-2">
          <div className="flex items-center justify-between border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm">
            <span className="truncate text-zinc-900">{selectedFile.name}</span>
            <div className="ml-3 flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="text-xs text-zinc-400 hover:text-zinc-600"
              >
                Cancel
              </button>
              <Button
                size="sm"
                onClick={handleSaveClick}
                disabled={isSaving}
                className={cn(
                  "bg-indigo-600 hover:bg-indigo-700",
                  confirmReplace && "bg-amber-600 hover:bg-amber-700",
                )}
              >
                {isSaving ? "Saving…" : confirmReplace ? "Confirm replace" : hasExistingCv ? "Replace CV" : "Save CV"}
              </Button>
            </div>
          </div>
          {confirmReplace && (
            <p className="text-xs text-amber-700">
              This will permanently replace your existing CV and extracted skills.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
