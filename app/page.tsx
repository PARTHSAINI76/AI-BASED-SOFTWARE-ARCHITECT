import Link from "next/link";
import { ArrowUpRight, Plus, Sparkles, Layers3 } from "lucide-react";
import DeleteProjectButton from "@/components/DeleteProjectButton";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";
import LogoutButton from "@/components/LogoutButton";

export default async function Home() {
  const session = await getSession();

  if (!session) {
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

            <div className="flex items-center gap-2">
              <Link href="/login" className="btn-ghost">
                Log in
              </Link>

              <Link href="/register" className="btn-primary">
                Get started
              </Link>
            </div>
          </div>
        </header>

        <section className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl grid-cols-1 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col justify-center px-6 py-20 lg:pr-20">
            <div className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.22em] text-[#193d32]">
              <span className="h-px w-10 bg-[#193d32]" />
              AI SOFTWARE ENGINEERING
            </div>

            <h1 className="editorial-heading mt-7 max-w-4xl text-6xl leading-[0.9] sm:text-7xl lg:text-8xl">
              From idea
              <br />
              to <i>architecture.</i>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-7 text-[#716f68] sm:text-lg">
              A focused AI architect for turning vague software ideas into clear
              requirements, architecture, technology choices, database design
              and a practical development roadmap.
            </p>

            <Link href="/register" className="btn-primary group">
              Start architecting
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-semibold tracking-[0.16em] text-[#8b887f]">
              <span>04 QUESTIONS</span>
              <span>REQUIREMENTS</span>
              <span>ARCHITECTURE</span>
              <span>TECH STACK</span>
              <span>ROADMAP</span>
            </div>
          </div>

          <div className="hidden border-l border-[#d7d3ca] lg:block">
            <div className="flex h-full flex-col justify-center px-10">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[#8b887f]">
                THE PROCESS
              </p>

              <div className="mt-8">
                {[
                  ["01", "Describe", "Give the architect your idea."],
                  ["02", "Clarify", "Answer four important questions."],
                  ["03", "Architect", "Get the complete technical plan."],
                  ["04", "Refine", "Change it using natural language."],
                ].map(([number, title, description]) => (
                  <div key={number} className="border-t border-[#d7d3ca] py-5">
                    <div className="flex gap-4">
                      <span className="font-mono text-[10px] text-[#9a978f]">
                        {number}
                      </span>

                      <div>
                        <h3 className="font-medium">{title}</h3>

                        <p className="mt-1 text-sm leading-5 text-[#716f68]">
                          {description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-l-2 border-[#193d32] pl-4">
                <p className="text-sm leading-6 text-[#716f68]">
                  You describe the problem.
                  <br />
                  The architect handles the complexity.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  await connectDB();

  const user = await User.findById(session.userId).select("name").lean();

  const projects = await Project.find({
    userId: session.userId,
  })
    .sort({ updatedAt: -1 })
    .lean();

  return (
    <main className="paper-grid min-h-screen bg-[#f5f3ee] text-[#171714]">
      {/* HEADER */}

      <header className="sticky top-0 z-30 border-b border-[#d7d3ca] bg-[#f5f3ee]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center bg-[#193d32] text-white">
              <Sparkles size={15} />
            </div>

            <span className="text-sm font-semibold tracking-[0.08em]">
              PROJECT ARCHITECT
            </span>
          </Link>

          <div className="flex items-center gap-5">
            <span className="hidden text-xs text-[#716f68] sm:block">
              {user?.name}
            </span>

            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* HERO */}

        <section className="border-b border-[#d7d3ca] pb-10">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.2em] text-[#193d32]">
                <span className="h-px w-8 bg-[#193d32]" />
                WORKSPACE
              </div>

              <h1 className="editorial-heading mt-4 text-5xl leading-none sm:text-6xl">
                Welcome, {user?.name}.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-[#716f68]">
                Your software ideas, architecture decisions and development
                plans in one place.
              </p>
            </div>

            <Link href="/projects/new" className="btn-primary group">
              <Plus size={16} />
              New project
              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </section>

        {/* STATS */}

        <section className="grid border-b border-[#d7d3ca] sm:grid-cols-3">
          <div className="border-b border-[#d7d3ca] py-6 sm:border-b-0 sm:border-r sm:pr-8">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-[#8b887f]">
              PROJECTS
            </p>

            <p className="editorial-heading mt-2 text-4xl">{projects.length}</p>
          </div>

          <div className="border-b border-[#d7d3ca] py-6 sm:border-b-0 sm:border-r sm:px-8">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-[#8b887f]">
              ARCHITECTURE
            </p>

            <p className="mt-3 text-sm text-[#716f68]">
              Requirements → Stack → Database → Roadmap
            </p>
          </div>

          <div className="py-6 sm:pl-8">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-[#8b887f]">
              WORKFLOW
            </p>

            <p className="mt-3 text-sm text-[#716f68]">
              Idea → 4 questions → Complete plan
            </p>
          </div>
        </section>

        {/* PROJECTS */}

        <section className="py-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[#8b887f]">
                ARCHIVE
              </p>

              <h2 className="editorial-heading mt-2 text-3xl">Your projects</h2>
            </div>

            {projects.length > 0 && (
              <span className="font-mono text-xs text-[#8b887f]">
                {String(projects.length).padStart(2, "0")} TOTAL
              </span>
            )}
          </div>

          {projects.length === 0 ? (
            <div className="mt-8 border border-dashed border-[#c9c5bc] bg-[#faf9f5]">
              <div className="flex flex-col items-center px-6 py-20 text-center">
                <div className="flex h-12 w-12 items-center justify-center border border-[#c9c5bc]">
                  <Layers3 size={20} />
                </div>

                <h3 className="editorial-heading mt-5 text-2xl">
                  Your archive is empty.
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[#716f68]">
                  Create your first project and turn a rough idea into a
                  complete software architecture.
                </p>

                <Link
                  href="/projects/new"
                  className="mt-6 flex items-center gap-2 bg-[#193d32] px-5 py-3 text-sm text-white hover:bg-[#102e25]"
                >
                  <Plus size={16} />
                  Create project
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid gap-px border border-[#d7d3ca] bg-[#d7d3ca] md:grid-cols-2">
              {projects.map((project, index) => (
                <div
                  key={project._id.toString()}
                  className="group relative bg-[#faf9f5] p-6 hover:bg-white"
                >
                  <Link href={`/projects/${project._id}`} className="block">
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[10px] text-[#9a978f]">
                        PROJECT {String(index + 1).padStart(2, "0")}
                      </span>

                      <ArrowUpRight
                        size={16}
                        className="text-[#9a978f] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#193d32]"
                      />
                    </div>

                    <h3 className="editorial-heading mt-8 line-clamp-1 text-3xl">
                      {project.name}
                    </h3>

                    <p className="mt-3 line-clamp-3 max-w-lg text-sm leading-6 text-[#716f68]">
                      {project.idea}
                    </p>

                    <div className="mt-8 flex items-center justify-between border-t border-[#d7d3ca] pt-4">
                      <span className="text-[10px] font-semibold tracking-[0.12em] text-[#8b887f]">
                        ARCHITECTURE
                      </span>

                      <span className="font-mono text-[10px] text-[#9a978f]">
                        {new Date(project.updatedAt).toISOString().slice(0, 10)}
                      </span>
                    </div>
                  </Link>

                  <div className="absolute right-12 top-5">
                    <DeleteProjectButton projectId={project._id.toString()} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
