"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import AuthShell from "@/components/AuthShell";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell mode="login">
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="mb-2 block text-[10px] font-semibold tracking-[0.15em] text-[#716f68]">
            EMAIL
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-12 w-full border border-[#c9c5bc] bg-[#faf9f5] px-4 text-sm outline-none placeholder:text-[#aaa69d] focus:border-[#193d32]"
          />
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-semibold tracking-[0.15em] text-[#716f68]">
            PASSWORD
          </label>

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-12 w-full border border-[#c9c5bc] bg-[#faf9f5] px-4 text-sm outline-none placeholder:text-[#aaa69d] focus:border-[#193d32]"
          />
        </div>

        {error && (
          <div className="border border-[#dfcaca] bg-[#f7eeee] px-4 py-3 text-sm text-[#8b3939]">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Signing in..." : "Sign in"}

          {!loading && <ArrowRight size={15} />}
        </button>
      </form>
    </AuthShell>
  );
}
