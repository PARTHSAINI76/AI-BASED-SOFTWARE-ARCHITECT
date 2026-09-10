"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  Database,
  FileCode2,
  Layers3,
  ListChecks,
  Map,
  Menu,
  Network,
  Sparkles,
  X,
} from "lucide-react";

import AIProcessing from "@/components/AIProcessing";

type Section =
  | "overview"
  | "requirements"
  | "scope"
  | "architecture"
  | "stack"
  | "database"
  | "files"
  | "roadmap"
  | "srs";

const sections: {
  id: Section;
  label: string;
  icon: React.ElementType;
}[] = [
  {
    id: "overview",
    label: "Overview",
    icon: Layers3,
  },
  {
    id: "requirements",
    label: "Requirements",
    icon: ListChecks,
  },
  {
    id: "scope",
    label: "Scope",
    icon: Map,
  },
  {
    id: "architecture",
    label: "Architecture",
    icon: Network,
  },
  {
    id: "stack",
    label: "Technology",
    icon: FileCode2,
  },
  {
    id: "database",
    label: "Database",
    icon: Database,
  },
  {
    id: "files",
    label: "Files",
    icon: FileCode2,
  },
  {
    id: "roadmap",
    label: "Roadmap",
    icon: Map,
  },
  {
    id: "srs",
    label: "SRS",
    icon: FileCode2,
  },
];

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [projectId, setProjectId] = useState("");

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [project, setProject] = useState<any>(null);
  const [discovery, setDiscovery] = useState<any>(null);
  const [architecture, setArchitecture] = useState<any>(null);

  const [activeSection, setActiveSection] = useState<Section>("overview");

  const [command, setCommand] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    params.then(({ id }) => {
      setProjectId(id);
      loadProject(id);
    });
  }, [params]);

  async function loadProject(id: string) {
    try {
      const response = await fetch(`/api/projects/${id}`);

      if (!response.ok) {
        throw new Error("Failed to load project");
      }

      const data = await response.json();

      console.log("PROJECT FROM API:", data.project);
      console.log("PROJECT DATA:", data.project?.data);
      console.log("DISCOVERY:", data.project?.data?.discovery);
      console.log("ARCHITECTURE:", data.project?.data?.architecture);

      setProject(data.project);
      setDiscovery(data.project?.data?.discovery);
      setArchitecture(data.project?.data?.architecture);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  /*
  async function loadProject(id: string) {
    try {
      const response = await fetch(`/api/projects/${id}`);

      if (!response.ok) {
        throw new Error("Failed to load project");
      }

      const data = await response.json();

      setProject(data.project);
      setDiscovery(data.project.data?.discovery);
      setArchitecture(data.project.data?.architecture);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }*/

  async function generateArchitecture(answers: Record<string, string>) {
    setGenerating(true);

    try {
      const response = await fetch("/api/architect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          answers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to build architecture");
      }

      setArchitecture(data.result);
      setDiscovery(null);
    } catch (error) {
      console.error(error);
    } finally {
      setGenerating(false);
    }
  }

  async function editArchitecture() {
    if (!command.trim()) return;

    setGenerating(true);

    try {
      const response = await fetch("/api/architect", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          command,
          architecture,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update architecture");
      }

      setArchitecture(data.result);
      setCommand("");
    } catch (error) {
      console.error(error);
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <AIProcessing
        title="Opening your project"
        stages={["Loading", "Reading architecture", "Preparing workspace"]}
      />
    );
  }

  if (generating) {
    return (
      <AIProcessing
        title="Updating your architecture"
        stages={[
          "Reading",
          "Understanding",
          "Designing",
          "Engineering",
          "Checking",
          "Finalizing",
        ]}
      />
    );
  }

  if (!architecture && discovery) {
    return (
      <DiscoveryView discovery={discovery} onComplete={generateArchitecture} />
    );
  }

  if (!architecture) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-[#716f68]">No architecture found.</p>
      </main>
    );
  }

  return (
    <main className="paper-grid min-h-screen bg-[#f5f3ee] text-[#171714]">
      {/* HEADER */}

      <header className="sticky top-0 z-40 border-b border-[#d7d3ca] bg-[#f5f3ee]/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-5 lg:px-7">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em]"
            >
              <div className="flex h-8 w-8 items-center justify-center bg-[#193d32] text-white">
                <Sparkles size={15} />
              </div>

              <span className="hidden sm:block">PROJECT ARCHITECT</span>
            </Link>

            <ChevronRight size={14} className="text-[#aaa69d]" />

            <span className="max-w-45 truncate text-xs text-[#716f68]">
              {architecture.projectName}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenu(true)}
            className="btn-ghost lg:hidden"
          >
            <Menu size={16} />
          </button>

          <Link href="/" className="btn-ghost hidden lg:inline-flex">
            <ArrowLeft size={14} />
            Projects
          </Link>
        </div>
      </header>

      {/* MOBILE NAV */}

      {mobileMenu && (
        <div className="fixed inset-0 z-50 bg-[#f5f3ee] lg:hidden">
          <div className="flex h-16 items-center justify-between border-b border-[#d7d3ca] px-5">
            <span className="text-xs font-semibold tracking-[0.1em]">
              PROJECT SECTIONS
            </span>

            <button
              type="button"
              onClick={() => setMobileMenu(false)}
              className="btn-ghost"
            >
              <X size={16} />
            </button>
          </div>

          <nav className="p-5">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => {
                  setActiveSection(section.id);
                  setMobileMenu(false);
                }}
                className="flex w-full items-center gap-3 border-b border-[#d7d3ca] py-4 text-left text-sm"
              >
                <section.icon size={15} />
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      <div className="flex">
        {/* SIDEBAR */}

        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-64 shrink-0 border-r border-[#d7d3ca] bg-[#f5f3ee] lg:block">
          <div className="flex h-full flex-col">
            <div className="px-6 py-7">
              <p className="text-[9px] font-semibold tracking-[0.2em] text-[#8b887f]">
                PROJECT
              </p>

              <h2 className="editorial-heading mt-2 line-clamp-2 text-2xl">
                {architecture.projectName}
              </h2>

              <p className="mt-2 text-xs leading-5 text-[#716f68]">
                Software architecture
              </p>
            </div>

            <nav className="px-3">
              {sections.map((section) => {
                const Icon = section.icon;
                const active = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs ${
                      active
                        ? "bg-[#ebe8e0] font-semibold text-[#193d32]"
                        : "text-[#716f68] hover:bg-[#ebe8e0]/60 hover:text-[#171714]"
                    }`}
                  >
                    <Icon size={14} />

                    <span>{section.label}</span>

                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 bg-[#193d32]" />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-[#d7d3ca] p-5">
              <p className="text-[9px] font-semibold tracking-[0.18em] text-[#8b887f]">
                AI ARCHITECT
              </p>

              <p className="mt-2 text-xs leading-5 text-[#716f68]">
                Ask the architect to change any part of the project.
              </p>
            </div>
          </div>
        </aside>

        {/* CONTENT */}

        <section className="min-w-0 flex-1">
          <div className="mx-auto max-w-6xl px-5 py-8 pb-40 sm:px-8 lg:px-12">
            {/* PROJECT HEADER */}

            <div className="border-b border-[#d7d3ca] pb-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-[9px] font-semibold tracking-[0.2em] text-[#193d32]">
                    SOFTWARE ARCHITECTURE
                  </p>

                  <h1 className="editorial-heading mt-3 text-5xl leading-[0.95] sm:text-6xl">
                    {architecture.projectName}
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-6 text-[#716f68]">
                    {architecture.summary}
                  </p>
                </div>

                <div className="hidden text-right sm:block">
                  <p className="font-mono text-[9px] text-[#9a978f]">
                    PROJECT STATUS
                  </p>

                  <p className="mt-2 flex items-center justify-end gap-2 text-xs font-semibold text-[#193d32]">
                    <span className="h-1.5 w-1.5 bg-[#193d32]" />
                    READY
                  </p>
                </div>
              </div>

              {/* QUICK STATS */}

              <div className="mt-8 grid border border-[#d7d3ca] sm:grid-cols-3">
                <Stat
                  label="REQUIREMENTS"
                  value={architecture.requirements?.length ?? 0}
                />

                <Stat
                  label="TECH STACKS"
                  value={architecture.techStacks?.length ?? 0}
                />

                <Stat
                  label="ROADMAP"
                  value={architecture.roadmap?.length ?? 0}
                />
              </div>
            </div>

            {/* ACTIVE SECTION */}

            <div className="pt-10">
              {activeSection === "overview" && (
                <Overview architecture={architecture} />
              )}

              {activeSection === "requirements" && (
                <Requirements requirements={architecture.requirements} />
              )}

              {activeSection === "scope" && (
                <Scope scope={architecture.scope} />
              )}

              {activeSection === "architecture" && (
                <Architecture data={architecture.architecture} />
              )}

              {activeSection === "stack" && (
                <Technology stacks={architecture.techStacks} />
              )}

              {activeSection === "database" && (
                <DatabaseSection database={architecture.database} />
              )}

              {activeSection === "files" && (
                <FilesSection structure={architecture.projectStructure} />
              )}

              {activeSection === "roadmap" && (
                <Roadmap roadmap={architecture.roadmap} />
              )}

              {activeSection === "srs" && <SRS srs={architecture.srs} />}
            </div>
          </div>
        </section>
      </div>

      {/* AI COMMAND BAR */}

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#d7d3ca] bg-[#f5f3ee]/95 px-4 py-3 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-4xl items-center gap-3 border border-[#c9c5bc] bg-[#faf9f5] px-3 py-2">
          <Sparkles size={16} className="shrink-0 text-[#193d32]" />

          <input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                editArchitecture();
              }
            }}
            placeholder="Tell the architect what to change..."
            className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none placeholder:text-[#aaa69d]"
          />

          <button
            type="button"
            onClick={editArchitecture}
            disabled={!command.trim()}
            className="btn-primary shrink-0"
          >
            Update
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border-b border-[#d7d3ca] p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <p className="text-[9px] font-semibold tracking-[0.18em] text-[#8b887f]">
        {label}
      </p>

      <p className="editorial-heading mt-2 text-3xl">{value}</p>
    </div>
  );
}

function SectionHeading({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] text-[#9a978f]">{number}</span>

        <span className="h-px w-8 bg-[#193d32]" />
      </div>

      <h2 className="editorial-heading mt-3 text-4xl">{title}</h2>

      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#716f68]">
          {description}
        </p>
      )}
    </div>
  );
}

function Overview({ architecture }: { architecture: any }) {
  return (
    <div>
      <SectionHeading
        number="01"
        title="Overview"
        description="A high-level view of the proposed software system."
      />

      <div className="grid gap-px border border-[#d7d3ca] bg-[#d7d3ca] md:grid-cols-2">
        <InfoBlock title="Summary" content={architecture.summary} />

        <InfoBlock
          title="Why this approach"
          content={
            architecture.architecture?.reason ||
            "Selected based on the project requirements and constraints."
          }
        />
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <ListCard title="Facts" items={architecture.facts} />

        <ListCard title="Assumptions" items={architecture.assumptions} />
      </div>
    </div>
  );
}

function Requirements({
  requirements,
}: {
  requirements: {
    functional?: any[];
    nonFunctional?: any[];
  };
}) {
  const functional = requirements?.functional || [];
  const nonFunctional = requirements?.nonFunctional || [];

  return (
    <div>
      <SectionHeading
        number="02"
        title="Requirements"
        description="What the system must do and the constraints it must satisfy."
      />

      <div className="space-y-8">
        <RequirementGroup
          title="Functional Requirements"
          items={functional}
          prefix="FR"
        />

        <RequirementGroup
          title="Non-Functional Requirements"
          items={nonFunctional}
          prefix="NFR"
        />
      </div>
    </div>
  );
}

function RequirementGroup({
  title,
  items,
  prefix,
}: {
  title: string;
  items: any[];
  prefix: string;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <span className="h-px w-6 bg-[#193d32]" />

        <h3 className="text-[10px] font-semibold tracking-[0.18em] text-[#193d32]">
          {title.toUpperCase()}
        </h3>
      </div>

      <div className="border border-[#d7d3ca] bg-[#faf9f5]">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={item.id || index}
              className="grid gap-4 border-b border-[#d7d3ca] p-5 last:border-b-0 sm:grid-cols-[80px_1fr]"
            >
              <span className="font-mono text-[10px] text-[#193d32]">
                {item.id || `${prefix}-${String(index + 1).padStart(2, "0")}`}
              </span>

              <div>
                <h4 className="text-sm font-semibold">{item.requirement}</h4>

                {item.reason && (
                  <p className="mt-2 text-xs leading-5 text-[#716f68]">
                    {item.reason}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="p-5 text-xs text-[#9a978f]">None specified.</p>
        )}
      </div>
    </section>
  );
}

function Scope({ scope }: { scope: any }) {
  return (
    <div>
      <SectionHeading
        number="03"
        title="Scope"
        description="A realistic boundary for the first version of the product."
      />

      <div className="grid gap-px border border-[#d7d3ca] bg-[#d7d3ca] md:grid-cols-3">
        <ScopeColumn title="V1" accent items={scope?.v1 || []} />

        <ScopeColumn title="V2" items={scope?.v2 || []} />

        <ScopeColumn title="V3" items={scope?.v3 || []} />
      </div>
    </div>
  );
}

function ScopeColumn({
  title,
  items = [],
  accent = false,
}: {
  title: string;
  items: string[];
  accent?: boolean;
}) {
  return (
    <div className="bg-[#faf9f5] p-6">
      <div className="flex items-center justify-between">
        <h3 className="editorial-heading text-2xl">{title}</h3>

        {accent && (
          <span className="text-[9px] font-semibold tracking-[0.15em] text-[#193d32]">
            RECOMMENDED
          </span>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex gap-3 text-sm leading-5 text-[#716f68]"
          >
            <Check size={14} className="mt-0.5 shrink-0 text-[#193d32]" />

            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function Architecture({ data }: { data: any }) {
  return (
    <div>
      <SectionHeading
        number="04"
        title="Architecture"
        description="The recommended system design and the reasoning behind it."
      />

      <div className="border border-[#d7d3ca] bg-[#faf9f5]">
        <div className="border-b border-[#d7d3ca] bg-[#ebe8e0] px-6 py-4">
          <p className="text-[9px] font-semibold tracking-[0.18em] text-[#193d32]">
            RECOMMENDED ARCHITECTURE
          </p>

          <h3 className="editorial-heading mt-2 text-2xl">
            {data?.type || "System Architecture"}
          </h3>
        </div>

        <div className="p-6">
          <p className="text-sm leading-7 text-[#716f68]">
            {data?.description || data?.reason}
          </p>
        </div>
      </div>

      {data?.components && (
        <div className="mt-6 grid gap-px border border-[#d7d3ca] bg-[#d7d3ca] md:grid-cols-2">
          {data.components.map((component: any, index: number) => (
            <div key={index} className="bg-[#faf9f5] p-6">
              <span className="font-mono text-[10px] text-[#9a978f]">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="mt-4 text-sm font-semibold">{component.name}</h3>

              <p className="mt-2 text-sm leading-6 text-[#716f68]">
                {component.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Technology({ stacks = [] }: { stacks: any[] }) {
  return (
    <div>
      <SectionHeading
        number="05"
        title="Technology"
        description="Three suitable stacks, ranked by fit for this project."
      />

      <div className="space-y-4">
        {stacks.map((stack, index) => (
          <div
            key={index}
            className={`border bg-[#faf9f5] p-6 ${
              index === 0 ? "border-[#193d32]" : "border-[#d7d3ca]"
            }`}
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div className="flex gap-5">
                <span className="font-mono text-[10px] text-[#193d32]">
                  #{index + 1}
                </span>

                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="editorial-heading text-2xl">{stack.name}</h3>

                    {index === 0 && (
                      <span className="border border-[#193d32] px-2 py-1 text-[8px] font-semibold tracking-[0.15em] text-[#193d32]">
                        BEST FIT
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-[#716f68]">
                    {stack.reason}
                  </p>
                </div>
              </div>

              <ArrowUpRight size={17} className="text-[#9a978f]" />
            </div>

            {stack.technologies && (
              <div className="mt-6 flex flex-wrap gap-2 border-t border-[#d7d3ca] pt-5">
                {stack.technologies.map((technology: string) => (
                  <span
                    key={technology}
                    className="bg-[#ebe8e0] px-3 py-1.5 font-mono text-[10px]"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DatabaseSection({ database }: { database: any }) {
  return (
    <div>
      <SectionHeading
        number="06"
        title="Database"
        description="The data model required by the application."
      />

      <div className="grid gap-px border border-[#d7d3ca] bg-[#d7d3ca] md:grid-cols-2">
        {database?.entities?.map((entity: any, index: number) => (
          <div key={index} className="bg-[#faf9f5] p-6">
            <div className="flex items-center gap-3">
              <Database size={15} className="text-[#193d32]" />

              <h3 className="font-semibold">{entity.name}</h3>
            </div>

            <p className="mt-2 text-sm text-[#716f68]">{entity.description}</p>

            {entity.fields && (
              <div className="mt-5 border-t border-[#d7d3ca] pt-4">
                {entity.fields.map((field: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between border-b border-[#ebe8e0] py-2 text-xs last:border-0"
                  >
                    <span>{field.name}</span>

                    <span className="font-mono text-[#9a978f]">
                      {field.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FilesSection({ structure }: { structure: any }) {
  return (
    <div>
      <SectionHeading
        number="07"
        title="Project Structure"
        description="A practical starting structure for implementation."
      />

      <div className="border border-[#d7d3ca] bg-[#171714] p-6 text-[#f5f3ee]">
        <pre className="overflow-x-auto font-mono text-xs leading-7">
          {typeof structure === "string"
            ? structure
            : JSON.stringify(structure, null, 2)}
        </pre>
      </div>
    </div>
  );
}

function Roadmap({ roadmap = [] }: { roadmap: any[] }) {
  return (
    <div>
      <SectionHeading
        number="08"
        title="Development Roadmap"
        description="An ordered path from an empty repository to a working product."
      />

      <div className="relative">
        <div className="absolute bottom-0 left-4.75 top-0 w-px bg-[#d7d3ca]" />

        <div className="space-y-8">
          {roadmap.map((phase, index) => (
            <div key={index} className="relative flex gap-6">
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center border border-[#193d32] bg-[#f5f3ee] font-mono text-[10px] text-[#193d32]">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="flex-1 border border-[#d7d3ca] bg-[#faf9f5] p-6">
                <h3 className="editorial-heading text-2xl">{phase.phase}</h3>

                <div className="mt-5 space-y-2">
                  {phase.tasks?.map((task: string, i: number) => (
                    <div key={i} className="flex gap-3 text-sm text-[#716f68]">
                      <span className="text-[#193d32]">→</span>

                      {task}
                    </div>
                  ))}
                </div>

                <div className="mt-5 border-t border-[#d7d3ca] pt-4">
                  <p className="text-[9px] font-semibold tracking-[0.16em] text-[#8b887f]">
                    DONE WHEN
                  </p>

                  <p className="mt-2 text-sm">{phase.doneWhen}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SRS({ srs }: { srs: any }) {
  return (
    <div>
      <SectionHeading
        number="09"
        title="Software Requirements Specification"
        description="The compact specification generated from the architecture."
      />

      <div className="space-y-4">
        {Object.entries(srs || {}).map(([key, value]) => (
          <div key={key} className="border border-[#d7d3ca] bg-[#faf9f5] p-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#193d32]">
              {key.replace(/([A-Z])/g, " $1")}
            </p>

            <div className="mt-3 text-sm leading-7 text-[#716f68]">
              {typeof value === "string"
                ? value
                : JSON.stringify(value, null, 2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoBlock({ title, content }: { title: string; content?: string }) {
  return (
    <div className="bg-[#faf9f5] p-6">
      <p className="text-[9px] font-semibold tracking-[0.18em] text-[#8b887f]">
        {title}
      </p>

      <p className="mt-4 text-sm leading-7 text-[#716f68]">
        {content || "Not specified."}
      </p>
    </div>
  );
}

function ListCard({ title, items = [] }: { title: string; items?: string[] }) {
  return (
    <div className="border border-[#d7d3ca] bg-[#faf9f5] p-6">
      <p className="text-[9px] font-semibold tracking-[0.18em] text-[#8b887f]">
        {title}
      </p>

      <div className="mt-5 space-y-3">
        {items?.map((item, index) => (
          <div
            key={index}
            className="flex gap-3 text-sm leading-6 text-[#716f68]"
          >
            <span className="font-mono text-[10px] text-[#193d32]">
              {String(index + 1).padStart(2, "0")}
            </span>

            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function DiscoveryView({
  discovery,
  onComplete,
}: {
  discovery: {
    summary: string;
    facts: string[];
    assumptions: string[];
    unknowns: string[];
    questions: {
      id: string;
      question: string;
      reason: string;
    }[];
  };
  onComplete: (answers: Record<string, string>) => Promise<void>;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  return (
    <main className="paper-grid min-h-screen bg-[#f5f3ee] text-[#171714]">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:px-12">
        <SectionHeading
          number="01"
          title="Let's define the project"
          description="Answer these four questions. The architect will use your answers to build the complete project plan."
        />

        <div className="border border-[#d7d3ca] bg-[#faf9f5] p-6">
          <p className="text-sm leading-7 text-[#4f4d47]">
            {discovery.summary}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <DiscoveryColumn title="Facts" items={discovery.facts} />

          <DiscoveryColumn title="Assumptions" items={discovery.assumptions} />

          <DiscoveryColumn title="Unknowns" items={discovery.unknowns} />
        </div>

        <section className="mt-12">
          <SectionHeading
            number="02"
            title="Four questions"
            description="These are the only questions you'll answer during project creation."
          />

          <div className="space-y-5">
            {discovery.questions.map((item, index) => (
              <div
                key={item.id}
                className="border border-[#d7d3ca] bg-[#faf9f5] p-6"
              >
                <div className="flex gap-5">
                  <span className="font-mono text-xs text-[#193d32]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-6">
                      {item.question}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-[#716f68]">
                      {item.reason}
                    </p>

                    <textarea
                      value={answers[item.id] || ""}
                      onChange={(e) =>
                        setAnswers((current) => ({
                          ...current,
                          [item.id]: e.target.value,
                        }))
                      }
                      placeholder="Your answer..."
                      rows={3}
                      className="mt-5 w-full resize-none border border-[#c9c5bc] bg-[#f5f3ee] p-4 text-sm outline-none focus:border-[#193d32]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => onComplete(answers)}
              disabled={discovery.questions.some(
                (question) => !answers[question.id]?.trim(),
              )}
              className="btn-primary"
            >
              Build Architecture
              <ArrowUpRight size={14} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function DiscoveryColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border border-[#d7d3ca] bg-[#faf9f5]">
      <div className="border-b border-[#d7d3ca] px-5 py-4">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-[#193d32]">
          {title.toUpperCase()}
        </p>
      </div>

      <div className="p-5">
        {items?.length ? (
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li
                key={index}
                className="flex gap-3 text-xs leading-5 text-[#5f5d57]"
              >
                <span className="mt-2 h-1 w-1 shrink-0 bg-[#193d32]" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-[#9a978f]">None identified.</p>
        )}
      </div>
    </div>
  );
}
