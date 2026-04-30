import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CVUpload } from "@/components/CVUpload";
import type { SavedCv } from "@/lib/api";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedCv: SavedCv | null;
  isSavingCv: boolean;
  onSaveCv: (file: File) => Promise<boolean>;
  onDeleteCv: () => Promise<void>;
};

export function ProfileSheet({
  open,
  onOpenChange,
  savedCv,
  isSavingCv,
  onSaveCv,
  onDeleteCv,
}: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeletingCv, setIsDeletingCv] = useState(false);

  const handleDeleteClick = () => setConfirmDelete(true);

  const handleConfirmDelete = async () => {
    setIsDeletingCv(true);
    try {
      await onDeleteCv();
    } finally {
      setIsDeletingCv(false);
      setConfirmDelete(false);
    }
  };

  const handleCancelDelete = () => setConfirmDelete(false);

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) setConfirmDelete(false);
        onOpenChange(next);
      }}
    >
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your CV</SheetTitle>
          <SheetDescription>Upload a CV for this analysis session.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-6">
          <div>
            <h3 className="mb-1 text-sm font-semibold text-zinc-900">Your CV</h3>
            <p className="mb-3 text-xs text-zinc-500">
              Stored locally in this browser tab and sent only when you run an analysis.
            </p>
            <CVUpload
              onSave={onSaveCv}
              isSaving={isSavingCv}
              hasExistingCv={!!savedCv}
            />
            {savedCv?.fileName && (
              <p className="mt-3 truncate text-xs text-zinc-500">
                Current file: <span className="font-medium text-zinc-700">{savedCv.fileName}</span>
              </p>
            )}
          </div>

          {savedCv && (
            <>
              <Separator />
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="text-left text-xs text-zinc-400 transition-colors hover:text-red-600"
                >
                  Remove CV
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-red-600">
                    Remove this CV from the current session?
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleConfirmDelete}
                      disabled={isDeletingCv}
                      className="h-7 text-xs"
                    >
                      {isDeletingCv ? "Removing..." : "Yes, remove"}
                    </Button>
                    <button
                      type="button"
                      onClick={handleCancelDelete}
                      className="text-xs text-zinc-500 hover:text-zinc-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
