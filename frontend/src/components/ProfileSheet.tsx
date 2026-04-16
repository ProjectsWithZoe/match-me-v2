import { Badge } from "@/components/ui/badge";
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
import type { SavedCv, SessionUser } from "@/lib/api";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: SessionUser | null;
  savedCv: SavedCv | null;
  isSavingCv: boolean;
  isAuthLoading: boolean;
  onSaveCv: (file: File) => Promise<boolean>;
  onSignOut: () => Promise<void>;
};

export function ProfileSheet({
  open,
  onOpenChange,
  user,
  savedCv,
  isSavingCv,
  isAuthLoading,
  onSaveCv,
  onSignOut,
}: Props) {
  const handleSignOut = async () => {
    await onSignOut();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Profile</SheetTitle>
          <SheetDescription>Manage your account and CV.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-6">
          {/* Account info */}
          <div className="border border-zinc-200 bg-zinc-50 p-4">
            {user ? (
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium text-zinc-900">Email</span>{" "}
                  <span className="text-zinc-500">{user.email ?? "—"}</span>
                </p>
                <p>
                  <span className="font-medium text-zinc-900">User ID</span>{" "}
                  <span className="font-mono text-xs text-zinc-500">{user.id ?? "—"}</span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">Sign in to view your profile.</p>
            )}
          </div>

          <Separator />

          {/* CV upload */}
          <div>
            <h3 className="mb-1 text-sm font-semibold text-zinc-900">Your CV</h3>
            <p className="mb-3 text-xs text-zinc-500">
              Saved once — replace any time. Used for all analyses.
            </p>
            <CVUpload onSave={onSaveCv} isSaving={isSavingCv} />
          </div>

          {/* Extracted skills */}
          {savedCv?.parsedSkills && savedCv.parsedSkills.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  Extracted Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {savedCv.parsedSkills.map((skill) => (
                    <Badge key={skill} className="border-0 bg-zinc-100 text-zinc-800 hover:bg-zinc-200">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Sign out */}
          {user && (
            <>
              <Separator />
              <Button
                variant="outline"
                onClick={handleSignOut}
                disabled={isAuthLoading}
                className="w-full"
              >
                Sign out
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
