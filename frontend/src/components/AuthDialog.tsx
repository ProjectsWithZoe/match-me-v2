import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { SessionUser } from "@/lib/api";

type Mode = "sign-in" | "sign-up";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: SessionUser | null;
  isAuthLoading: boolean;
  onSignUp: (name: string, email: string, password: string) => Promise<boolean>;
  onSignIn: (email: string, password: string) => Promise<boolean>;
  onSignOut: () => Promise<void>;
};

export function AuthDialog({
  open,
  onOpenChange,
  user,
  isAuthLoading,
  onSignUp,
  onSignIn,
  onSignOut,
}: Props) {
  const [mode, setMode] = useState<Mode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    resetForm();
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    const ok = await onSignUp(name, email, password);
    if (ok) {
      resetForm();
      onOpenChange(false);
    }
  };

  const handleSignIn = async () => {
    const ok = await onSignIn(email, password);
    if (ok) {
      resetForm();
      onOpenChange(false);
    }
  };

  const handleSignOut = async () => {
    await onSignOut();
    resetForm();
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isAuthLoading) {
      if (mode === "sign-in") void handleSignIn();
      else void handleSignUp();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetForm();
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
          <DialogDescription>
            {user
              ? "Manage your account."
              : mode === "sign-in"
                ? "Sign in to save your CV and run analyses."
                : "Create an account to get started."}
          </DialogDescription>
        </DialogHeader>

        {user ? (
          <div className="flex flex-col gap-3">
            <div className="border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700">
              Signed in as <span className="font-semibold">{user.email ?? "Unknown"}</span>
            </div>
            <Separator />
            <Button variant="outline" onClick={handleSignOut} disabled={isAuthLoading}>
              {isAuthLoading ? "Please wait…" : "Sign out"}
            </Button>
          </div>
        ) : (
          <>
            {/* Tab switcher */}
            <div className="flex rounded-md border border-zinc-200 p-1 gap-1">
              <button
                type="button"
                onClick={() => switchMode("sign-in")}
                className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                  mode === "sign-in"
                    ? "bg-white shadow-sm text-zinc-900"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => switchMode("sign-up")}
                className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                  mode === "sign-up"
                    ? "bg-white shadow-sm text-zinc-900"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                Sign up
              </button>
            </div>

            <div className="flex flex-col gap-3" onKeyDown={handleKeyDown}>
              {mode === "sign-up" && (
                <div className="grid gap-1.5">
                  <Label htmlFor="auth-name">Full name</Label>
                  <Input
                    id="auth-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    autoComplete="name"
                    autoFocus
                  />
                </div>
              )}

              <div className="grid gap-1.5">
                <Label htmlFor="auth-email">Email</Label>
                <Input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  autoComplete="email"
                  autoFocus={mode === "sign-in"}
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="auth-password">Password</Label>
                <Input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                />
              </div>

              {mode === "sign-up" && (
                <div className="grid gap-1.5">
                  <Label htmlFor="auth-confirm-password">Confirm password</Label>
                  <Input
                    id="auth-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>
              )}
            </div>

            <Button
              onClick={mode === "sign-in" ? handleSignIn : handleSignUp}
              disabled={isAuthLoading}
              className="bg-indigo-600 hover:bg-indigo-700 w-full"
            >
              {isAuthLoading
                ? "Please wait…"
                : mode === "sign-in"
                  ? "Sign in"
                  : "Create account"}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
