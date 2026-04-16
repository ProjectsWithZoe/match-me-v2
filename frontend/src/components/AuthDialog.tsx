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
import type { SessionUser } from "@/lib/api";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    const ok = await onSignUp(name, email, password);
    if (ok) onOpenChange(false);
  };

  const handleSignIn = async () => {
    const ok = await onSignIn(email, password);
    if (ok) onOpenChange(false);
  };

  const handleSignOut = async () => {
    await onSignOut();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
          <DialogDescription>Sign up or log in to save your CV and run analyses.</DialogDescription>
        </DialogHeader>

        {user && (
          <div className="border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700">
            Signed in as <span className="font-semibold">{user.email ?? "Unknown"}</span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {!user && (
            <div className="grid gap-2">
              <Label htmlFor="auth-name">Full name</Label>
              <Input
                id="auth-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                autoComplete="name"
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              autoComplete="email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="auth-password">Password</Label>
            <Input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {!user ? (
            <>
              <Button
                onClick={handleSignUp}
                disabled={isAuthLoading}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isAuthLoading ? "Please wait…" : "Create account"}
              </Button>
              <Button variant="outline" onClick={handleSignIn} disabled={isAuthLoading}>
                Sign in
              </Button>
            </>
          ) : (
            <>
              <Separator />
              <Button variant="outline" onClick={handleSignOut} disabled={isAuthLoading}>
                Sign out
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
