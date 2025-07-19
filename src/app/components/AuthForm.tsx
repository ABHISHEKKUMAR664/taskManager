"use client";
import { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";


export default function AuthForm({ mode, onAuth, onSignupSuccess, toast }: {
  mode: "signin" | "signup";
  onAuth: (token: string, username: string) => void;
  onSignupSuccess?: () => void;
  toast?: any;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      if (mode === "signup") {
        setSuccess("Signup successful! Please login now.");
        setUsername("");
        setPassword("");
        if (toast) toast.success("Signup successful! Please login now.");
        if (onSignupSuccess) onSignupSuccess();
      } else {
        if (toast) toast.success("Login successful!");
        onAuth(data.token, data.username);
      }
    } else {
      setError(data.error || "Unknown error");
      if (toast) toast.error(data.error || "Unknown error");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300, mx: "auto", mt: 8 }}>
      <Typography variant="h5" align="center">{mode === "signup" ? "Sign Up" : "Sign In"}</Typography>
      <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} required />
      <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      <Button type="submit" variant="contained">{mode === "signup" ? "Sign Up" : "Sign In"}</Button>
    </Box>
  );
}
