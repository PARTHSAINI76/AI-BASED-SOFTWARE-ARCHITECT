"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthShell({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "login" | "register";
}) {
  const isLogin = mode === "login";

  return (
    <main className="paper-grid min-h-screen bg-[#f5f3ee] text-[#171714]">
      <header className="border-b border-[#d7d3ca]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center bg-[#193d32] text-white">
              <Sparkles size={15} />
            </div>

            <span className="text-sm font-semibold tracking-[0.08em]">
              PROJECT ARCHITECT
            </span>
          </Link>

          <Link
            href={isLogin ? "/register" : "/login"}
            className="text-xs font-medium text-[#716f68] hover:text-[#193d32]"
          >
            {isLogin ? "Create an account →" : "Already have an account? →"}
          </Link>
        </div>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl lg:grid-cols-[1fr_420px]">
        {/* LEFT SIDE */}

        <section className="hidden border-r border-[#d7d3ca] px-12 py-16 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.2em] text-[#193d32]">
              <span className="h-px w-8 bg-[#193d32]" />
              AI SOFTWARE ENGINEERING
            </p>

            <h1 className="editorial-heading mt-8 max-w-xl text-6xl leading-[0.92]">
              Plan first.
              <br />
              <i>Build better.</i>
            </h1>

            <p className="mt-7 max-w-lg text-sm leading-7 text-[#716f68]">
              Turn a rough software idea into a clear, implementation-ready
              architecture with the help of AI.
            </p>
          </div>

          <div>
            <div className="border-t border-[#d7d3ca] pt-5">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-[#8b887f]">
                THE ARCHITECT WORKFLOW
              </p>

              <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-4">
                {[
                  ["01", "Understand"],
                  ["02", "Define"],
                  ["03", "Design"],
                  ["04", "Engineer"],
                ].map(([number, title]) => (
                  <div key={number} className="flex gap-3">
                    <span className="font-mono text-[10px] text-[#9a978f]">
                      {number}
                    </span>

                    <span className="text-sm">{title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FORM */}

        <section className="flex items-center px-6 py-16 sm:px-10">
          <div className="w-full max-w-sm">
            <div className="mb-10">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[#193d32]">
                {isLogin ? "WELCOME BACK" : "GET STARTED"}
              </p>

              <h2 className="editorial-heading mt-3 text-4xl">
                {isLogin ? "Continue building." : "Create your workspace."}
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#716f68]">
                {isLogin
                  ? "Sign in to access your project architectures."
                  : "Create an account to save your project architectures."}
              </p>
            </div>

            {children}

            <div className="mt-8 border-t border-[#d7d3ca] pt-5 text-center text-xs text-[#716f68]">
              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-[#193d32] hover:underline"
                  >
                    Create one
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-[#193d32] hover:underline"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
