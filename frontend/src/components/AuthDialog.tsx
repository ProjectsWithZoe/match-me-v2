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

type Mode = "sign-in" | "sign-up" | "forgot-password" | "forgot-password-sent";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: SessionUser | null;
  isAuthLoading: boolean;
  onSignUp: (name: string, email: string, password: string) => Promise<boolean>;
  onSignIn: (email: string, password: string) => Promise<boolean>;
  onSignOut: () => Promise<void>;
  onForgotPassword: (email: string) => Promise<boolean>;
};

function getPasswordStrength(password: string): { label: string; color: string; width: string } {
  if (password.length === 0) return { label: "", color: "", width: "0%" };
  if (password.length < 8) return { label: "Too short", color: "bg-red-500", width: "25%" };
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const variety = [hasLetter, hasNumber, hasSymbol].filter(Boolean).length;
  if (password.length >= 12 && variety >= 2) return { label: "Strong", color: "bg-green-500", width: "100%" };
  if (password.length >= 8 && variety >= 2) return { label: "Fair", color: "bg-yellow-500", width: "66%" };
  return { label: "Weak", color: "bg-orange-500", width: "33%" };
}

export function AuthDialog({
  open,
  onOpenChange,
  user,
  isAuthLoading,
  onSignUp,
  onSignIn,
  onSignOut,
  onForgotPassword,
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
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
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

  const handleForgotPassword = async () => {
    const ok = await onForgotPassword(email);
    if (ok) {
      setMode("forgot-password-sent");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isAuthLoading) {
      if (mode === "sign-in") void handleSignIn();
      else if (mode === "sign-up") void handleSignUp();
      else if (mode === "forgot-password") void handleForgotPassword();
    }
  };

  const strength = getPasswordStrength(password);
  const signUpDisabled = isAuthLoading || password.length < 8;

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
                : mode === "sign-up"
                  ? "Create an account to get started."
                  : mode === "forgot-password"
                    ? "Enter your email to receive a reset link."
                    : "Check your inbox for the reset link."}
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
        ) : mode === "forgot-password-sent" ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-zinc-600">
              If an account exists for <span className="font-semibold">{email}</span>, you'll receive a reset link shortly.
            </p>
            <Button variant="outline" onClick={() => switchMode("sign-in")}>
              Back to sign in
            </Button>
          </div>
        ) : mode === "forgot-password" ? (
          <div className="flex flex-col gap-3" onKeyDown={handleKeyDown}>
            <div className="grid gap-1.5">
              <Label htmlFor="auth-email">Email</Label>
              <Input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                autoComplete="email"
                autoFocus
              />
            </div>
            <Button
              onClick={handleForgotPassword}
              disabled={isAuthLoading}
              className="bg-indigo-600 hover:bg-indigo-700 w-full"
            >
              {isAuthLoading ? "Please wait…" : "Send reset link"}
            </Button>
            <button
              type="button"
              onClick={() => switchMode("sign-in")}
              className="text-sm text-zinc-500 hover:text-zinc-700 text-center"
            >
              Back to sign in
            </button>
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
                {mode === "sign-up" && password.length > 0 && (
                  <div className="space-y-1">
                    <div className="h-1 w-full rounded-full bg-zinc-200">
                      <div
                        className={`h-1 rounded-full transition-all ${strength.color}`}
                        style={{ width: strength.width }}
                      />
                    </div>
                    <p className="text-xs text-zinc-500">{strength.label}</p>
                  </div>
                )}
                {mode === "sign-up" && password.length > 0 && password.length < 8 && (
                  <p className="text-xs text-red-500">Minimum 8 characters</p>
                )}
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

              {mode === "sign-in" && (
                <button
                  type="button"
                  onClick={() => switchMode("forgot-password")}
                  className="text-xs text-zinc-500 hover:text-zinc-700 text-right -mt-1"
                >
                  Forgot password?
                </button>
              )}
            </div>

            <Button
              onClick={mode === "sign-in" ? handleSignIn : handleSignUp}
              disabled={mode === "sign-up" ? signUpDisabled : isAuthLoading}
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
