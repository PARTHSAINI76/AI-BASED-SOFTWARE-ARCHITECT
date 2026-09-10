"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const defaultStages = [
  "Analyzing",
  "Designing",
  "Engineering",
  "Structuring",
  "Checking",
  "Finalizing",
];

export default function AIProcessing({
  title,
  stages = defaultStages,
}: {
  title: string;
  stages?: string[];
}) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((current) =>
        current < stages.length - 1 ? current + 1 : current,
      );
    }, 1800);

    return () => clearInterval(interval);
  }, [stages.length]);

  return (
    <main className="paper-grid flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        <div className="border border-[#c9c5bc] bg-[#faf9f5]">
          <div className="flex items-center justify-between border-b border-[#d7d3ca] px-5 py-3">
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em]">
              <Sparkles size={13} />
              PROJECT ARCHITECT
            </div>

            <span className="font-mono text-[10px] text-[#8b887f]">
              AI / WORKING
            </span>
          </div>

          <div className="px-8 py-14 sm:px-14 sm:py-20">
            <div className="flex items-center gap-4">
              <div className="relative flex h-11 w-11 items-center justify-center bg-[#193d32] text-white">
                <div className="absolute inset-0 ai-pulse border border-[#193d32]" />
                <Sparkles size={18} />
              </div>

              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] text-[#193d32]">
                  ARCHITECTURE ENGINE
                </p>

                <h1 className="editorial-heading mt-1 text-3xl sm:text-4xl">
                  {title}
                </h1>
              </div>
            </div>

            <p className="mt-8 max-w-lg text-sm leading-6 text-[#716f68]">
              Turning the project idea into a structured, implementation-ready
              plan.
            </p>

            <div className="mt-12 space-y-2">
              {[0, 1, 2, 3, 4].map((line) => (
                <div
                  key={line}
                  className="relative h-px overflow-hidden bg-[#d7d3ca]"
                >
                  <div
                    className="ai-scan absolute h-full w-1/4 bg-[#193d32]"
                    style={{
                      animationDuration: `${1.8 + line * 0.25}s`,
                      animationDelay: `${line * 0.15}s`,
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              {stages.map((item, index) => {
                const active = index === stage;
                const done = index < stage;

                return (
                  <div
                    key={item}
                    className={`border px-3 py-2 text-[10px] font-semibold tracking-[0.12em] transition-all ${
                      active
                        ? "border-[#193d32] bg-[#193d32] text-white"
                        : done
                          ? "border-[#c9c5bc] bg-[#ebe8e0] text-[#193d32]"
                          : "border-[#d7d3ca] text-[#aaa69d]"
                    }`}
                  >
                    {done ? "✓ " : ""}
                    {item.toUpperCase()}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#d7d3ca] px-5 py-3">
            <p className="font-mono text-[10px] text-[#9a978f]">
              PROCESSING REQUEST · PLEASE WAIT
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
