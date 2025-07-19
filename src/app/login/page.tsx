"use client";
import { useState } from "react";
import AuthForm from "../components/AuthForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  console.log("🚀 ~ LoginPage ~ mode:", mode)


  const handleAuth = (token: string, username: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  const handleSignupSuccess = () => {
    setMode("signin");
  };

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
