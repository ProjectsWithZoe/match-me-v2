import { useState } from "react";
import { toast } from "sonner";
import { fetchProfile, forgotPassword, resetPassword, signIn, signOut, signUp, type SessionUser } from "@/lib/api";

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
      const msg = err instanceof Error ? err.message : "Sign up failed";
      toast.error(msg);
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
      if (err instanceof TypeError) {
        toast.error("Something went wrong, please try again.");
      } else {
        toast.error("Invalid email or password.");
      }
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

  const handleForgotPassword = async (email: string) => {
    if (!email.trim()) {
      toast.error("Email is required.");
      return false;
    }
    setIsAuthLoading(true);
    try {
      await forgotPassword(email.trim());
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong, please try again.");
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleResetPassword = async (token: string, newPassword: string) => {
    setIsAuthLoading(true);
    try {
      await resetPassword(token, newPassword);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong, please try again.";
      toast.error(msg);
      return false;
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
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
  };
}
