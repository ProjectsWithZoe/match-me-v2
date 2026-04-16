import { useState } from "react";
import { toast } from "sonner";
import { fetchProfile, signIn, signOut, signUp, type SessionUser } from "@/lib/api";

export function useAuth() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const loadProfile = async () => {
    const profile = await fetchProfile();
    setUser(profile);
    return profile;
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Name, email, and password are required.");
      return false;
    }
    setIsAuthLoading(true);
    try {
      await signUp(name.trim(), email.trim(), password);
      await loadProfile();
      toast.success("Account created and signed in.");
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign up failed");
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      toast.error("Email and password are required.");
      return false;
    }
    setIsAuthLoading(true);
    try {
      await signIn(email.trim(), password);
      await loadProfile();
      toast.success("Signed in successfully.");
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsAuthLoading(true);
    try {
      await signOut();
      setUser(null);
      toast.success("Signed out.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Logout failed");
    } finally {
      setIsAuthLoading(false);
    }
  };

  return {
    user,
    setUser,
    isAuthLoading,
    loadProfile,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
}
