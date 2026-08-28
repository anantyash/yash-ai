import React, { useState } from "react";
import { portfolioData, Project } from "../data/portfolioData";
import { Code2, Github, Check, ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "../lib/utils";

export const FeaturedProjects: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "ai" | "fullstack">("all");

  const filteredProjects = portfolioData.projects.filter((p) => {
    if (filter === "all") return true;
    return p.category === filter;
  });

  return (
    <section
      id="projects"
      className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-14">
        {/* Section Header & Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2.5">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider">
              <Code2 className="size-3.5" />
              Featured Case Studies
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-white">
              AI Engineering{" "}
              <span className="text-gradient-cyan">Projects</span>
            </h2>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-white/10 text-xs font-mono">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg transition-all",
                filter === "all"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                  : "text-slate-400 hover:text-slate-200",
              )}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter("ai")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg transition-all",
                filter === "ai"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold"
                  : "text-slate-400 hover:text-slate-200",
              )}
            >
              Generative AI
            </button>
            <button
              onClick={() => setFilter("fullstack")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg transition-all",
                filter === "fullstack"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold"
                  : "text-slate-400 hover:text-slate-200",
              )}
            >
              Full-Stack
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project: Project) => (
            <div
              key={project.id}
              className="glass-panel rounded-3xl overflow-hidden border border-white/10 flex flex-col group hover:border-cyan-500/40 transition-all duration-300"
            >
              {/* Project Image Banner */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d121e] via-[#0d121e]/40 to-transparent" />

                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-900/90 border border-white/10 text-cyan-300 text-[11px] font-mono backdrop-blur-md">
                  {project.badge}
                </span>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {project.tagline}
                  </p>
                </div>
              </div>

              {/* Project Details */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between gap-6">
                {/* Pipeline Flow */}
                {project.pipeline && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Execution Flow:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-200">
                      {project.pipeline.map((step, sIdx) => (
                        <React.Fragment key={sIdx}>
                          <span
                            className={cn(
                              "px-2 py-1 rounded-md border text-[11px]",
                              sIdx === project.pipeline!.length - 1
                                ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-300"
                                : "bg-slate-900 border-slate-800",
                            )}
                          >
                            {step}
                          </span>
                          {sIdx < project.pipeline!.length - 1 && (
                            <ArrowRight className="size-3 text-slate-500" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3 Impact Bullets */}
                <div className="flex flex-col gap-2">
                  {project.impact.map((point, pIdx) => (
                    <div
                      key={pIdx}
                      className="flex items-start gap-2.5 text-xs text-slate-300 font-light"
                    >
                      <Check className="size-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Pills & GitHub Link */}
                <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors font-medium self-start"
                    >
                      <Github className="size-4" />
                      <span>Source Repository</span>
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
