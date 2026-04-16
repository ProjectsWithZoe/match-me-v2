import { CheckCircle, UploadCloud, Zap } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { SavedCv, SessionUser } from "@/lib/api";

type Props = {
  user: SessionUser | null;
  savedCv: SavedCv | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
};

export function Header({ user, savedCv, onOpenAuth, onOpenProfile }: Props) {
  const initials = user?.email ? user.email[0].toUpperCase() : "?";

  return (
    <header className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3.5 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-bold tracking-tight text-slate-900">
          Match<span className="text-blue-600">Me</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* CV status */}
        {user && (
          <button
            type="button"
            onClick={onOpenProfile}
            className={[
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
              savedCv
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200",
            ].join(" ")}
          >
            {savedCv ? (
              <>
                <CheckCircle className="h-3.5 w-3.5" />
                CV Ready
              </>
            ) : (
              <>
                <UploadCloud className="h-3.5 w-3.5" />
                Upload CV
              </>
            )}
          </button>
        )}

        {/* Auth */}
        {user ? (
          <button
            type="button"
            onClick={onOpenProfile}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-full"
          >
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarFallback className="rounded-full bg-blue-600 text-xs font-bold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        ) : (
          <Button
            size="sm"
            onClick={onOpenAuth}
            className="rounded-lg bg-blue-600 px-4 text-sm font-semibold hover:bg-blue-700"
          >
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
