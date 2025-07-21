"use client";
import { useState, useEffect } from "react";
import AuthForm from "../components/AuthForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const { username, setAuth } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (username) {
      router.push("/dashboard");
    }
  }, [username, router]);

  const handleAuth = (token: string, username: string) => {
    setAuth(token, username);
    toast.success("Login successful!");
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  const handleSignupSuccess = () => {
    setMode("signin");
  };

  // Don't render if already authenticated
  if (username) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <AuthForm mode={mode} onAuth={handleAuth} onSignupSuccess={handleSignupSuccess} toast={toast} />
      <ToastContainer position="top-center" autoClose={2000} />
      <button
        className="mt-4 text-blue-600 hover:underline"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
      >
        {mode === "signin" ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
      </button>
    </div>
  );
}
