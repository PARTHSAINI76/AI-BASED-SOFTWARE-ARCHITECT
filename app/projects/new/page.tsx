"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Command, Lightbulb, Sparkles } from "lucide-react";

import AIProcessing from "@/components/AIProcessing";

export default function NewProjectPage() {
  const router = useRouter();

  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);

  async function createProject() {
    if (!idea.trim()) return;

    setLoading(true);

    try {
      const projectResponse = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea,
        }),
      });

      const projectData = await projectResponse.json();

      if (!projectResponse.ok) {
        throw new Error(projectData.error || "Failed to create project");
      }

      const projectId = projectData.projectId;

      const architectResponse = await fetch("/api/architect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
        }),
      });

      const architectData = await architectResponse.json();

      if (!architectResponse.ok) {
        throw new Error(architectData.error || "Failed to analyze project");
      }

      router.push(`/projects/${projectId}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");

      setLoading(false);
    }
  }

  if (loading) {
    return (
      <AIProcessing
        title="Thinking about your project"
        stages={[
          "Thinking",
          "Understanding",
          "Analyzing",
          "Preparing questions",
        ]}
      />
    );
  }

  return (
    <main className="paper-grid min-h-screen">
      <header className="border-b border-[#d7d3ca] bg-[#f5f3ee]/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center bg-[#193d32] text-white">
              <Sparkles size={15} />
            </div>

            <span className="text-sm font-semibold tracking-wide">
              PROJECT ARCHITECT
            </span>
          </div>

          <div className="hidden items-center gap-6 text-[10px] font-semibold tracking-[0.18em] text-[#716f68] sm:flex">
            <span>DISCOVERY</span>
            <span>ARCHITECTURE</span>
            <span>ENGINEERING</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-[1fr_320px]">
          <section className="flex max-w-4xl flex-col justify-center py-20 lg:pr-20">
            <div className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.2em] text-[#193d32]">
              <span className="h-px w-8 bg-[#193d32]" />
              NEW PROJECT
            </div>

            <h1 className="editorial-heading mt-7 max-w-4xl text-6xl leading-[0.94] sm:text-7xl lg:text-8xl">
              Turn an idea
              <br />
              into a <i>system.</i>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-7 text-[#716f68] sm:text-lg">
              Start with a rough description. The architect will understand the
              problem, ask four important questions, then build the complete
              technical plan.
            </p>

            <div className="mt-12 border border-[#c9c5bc] bg-[#faf9f5]">
              <div className="flex items-center justify-between border-b border-[#d7d3ca] px-5 py-3">
                <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] text-[#716f68]">
                  <Lightbulb size={13} />
                  PROJECT IDEA
                </div>

                <span className="text-[10px] text-[#9a978f]">
                  {idea.length}/2000
                </span>
              </div>

              <textarea
                autoFocus
                value={idea}
                maxLength={2000}
                onChange={(e) => setIdea(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    createProject();
                  }
                }}
                placeholder="Describe what you want to build..."
                className="min-h-52 w-full resize-none bg-transparent p-5 text-[16px] leading-7 outline-none placeholder:text-[#aaa69d]"
              />

              <div className="flex items-center justify-between border-t border-[#d7d3ca] px-5 py-4">
                <div className="flex items-center gap-2 text-xs text-[#8b887f]">
                  <Command size={12} />
                  <span>⌘ + Enter</span>
                </div>

                <button
                  type="button"
                  onClick={createProject}
                  disabled={!idea.trim()}
                  className="btn-primary group"
                >
                  Begin architecture
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-[10px] font-semibold tracking-[0.16em] text-[#8b887f]">
              <span>04 QUESTIONS</span>
              <span>COMPLETE ARCHITECTURE</span>
              <span>3 STACK OPTIONS</span>
              <span>EDITABLE</span>
            </div>
          </section>

          <aside className="hidden border-l border-[#d7d3ca] py-20 pl-10 lg:block">
            <div className="sticky top-10">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[#8b887f]">
                WHAT YOU GET
              </p>

              <div className="mt-8 space-y-0">
                {[
                  ["01", "Requirements"],
                  ["02", "Project Scope"],
                  ["03", "Architecture"],
                  ["04", "Technology Stack"],
                  ["05", "Database Design"],
                  ["06", "Project Structure"],
                  ["07", "Development Roadmap"],
                  ["08", "SRS"],
                ].map(([number, title]) => (
                  <div
                    key={number}
                    className="flex items-center gap-4 border-t border-[#d7d3ca] py-4"
                  >
                    <span className="font-mono text-[10px] text-[#9a978f]">
                      {number}
                    </span>

                    <span className="text-sm">{title}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 border-l-2 border-[#193d32] pl-4">
                <p className="text-sm leading-6 text-[#716f68]">
                  You don't need to know the technical details. The architect
                  handles the planning decisions.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
