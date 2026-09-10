"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import AuthShell from "@/components/AuthShell";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
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
    <AuthShell mode="register">
      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="mb-2 block text-[10px] font-semibold tracking-[0.15em] text-[#716f68]">
            NAME
          </label>

          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="h-12 w-full border border-[#c9c5bc] bg-[#faf9f5] px-4 text-sm outline-none placeholder:text-[#aaa69d] focus:border-[#193d32]"
          />
        </div>

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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="h-12 w-full border border-[#c9c5bc] bg-[#faf9f5] px-4 text-sm outline-none placeholder:text-[#aaa69d] focus:border-[#193d32]"
          />
        </div>

        {error && (
          <div className="border border-[#dfcaca] bg-[#f7eeee] px-4 py-3 text-sm text-[#8b3939]">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating workspace..." : "Create account"}

          {!loading && <ArrowRight size={15} />}
        </button>
      </form>
    </AuthShell>
  );
}
