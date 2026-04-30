import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/api";

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

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const strength = getPasswordStrength(password);
  const canSubmit = password.length >= 8 && password === confirmPassword && !isLoading;

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg border border-zinc-200 p-8 max-w-sm w-full text-center space-y-4">
          <h1 className="text-lg font-semibold text-zinc-900">Invalid link</h1>
          <p className="text-sm text-zinc-600">This reset link is missing required information.</p>
          <Button variant="outline" onClick={() => navigate("/app")} className="w-full">
            Back to app
          </Button>
        </div>
        <Toaster richColors position="top-right" />
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg border border-zinc-200 p-8 max-w-sm w-full text-center space-y-4">
          <h1 className="text-lg font-semibold text-zinc-900">Link expired</h1>
          <p className="text-sm text-zinc-600">
            This reset link has expired or already been used. Request a new one from the sign-in screen.
          </p>
          <Button onClick={() => navigate("/app")} className="bg-indigo-600 hover:bg-indigo-700 w-full">
            Back to sign in
          </Button>
        </div>
        <Toaster richColors position="top-right" />
      </div>
    );
  }

  const handleSubmit = async () => {
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(token, password);
      toast.success("Password updated. You can now sign in.");
      navigate("/app");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      if (msg.toLowerCase().includes("expired") || msg.toLowerCase().includes("invalid")) {
        setIsExpired(true);
      } else {
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg border border-zinc-200 p-8 max-w-sm w-full space-y-5">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">Set a new password</h1>
          <p className="text-sm text-zinc-500 mt-1">Choose a password of at least 8 characters.</p>
        </div>

        <div className="space-y-4"
          onKeyDown={(e) => { if (e.key === "Enter" && canSubmit) void handleSubmit(); }}
        >
          <div className="grid gap-1.5">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              autoFocus
            />
            {password.length > 0 && (
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
            {password.length > 0 && password.length < 8 && (
              <p className="text-xs text-red-500">Minimum 8 characters</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="bg-indigo-600 hover:bg-indigo-700 w-full"
        >
          {isLoading ? "Please wait…" : "Update password"}
        </Button>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
