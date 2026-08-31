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
      className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#481E14]/30 relative"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-14">
        {/* Section Header & Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2.5">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-[#481E14]/30 border border-[#9B3922]/40 text-[#F2613F] text-xs font-mono uppercase tracking-wider">
              <Code2 className="size-3.5" />
              Featured Case Studies
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-white dark:text-white light:text-[#0C0C0C]">
              AI Engineering{" "}
              <span className="text-gradient-highlight">Projects</span>
            </h2>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 bg-[#0C0C0C] dark:bg-[#0C0C0C] light:bg-[#FFFFFF] p-1 rounded-xl border border-[#481E14]/60 text-xs font-mono">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg transition-all",
                filter === "all"
                  ? "bg-[#9B3922]/40 text-[#F2613F] border border-[#9B3922] font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter("ai")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg transition-all",
                filter === "ai"
                  ? "bg-[#9B3922]/40 text-[#F2613F] border border-[#9B3922] font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              Generative AI
            </button>
            <button
              onClick={() => setFilter("fullstack")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg transition-all",
                filter === "fullstack"
                  ? "bg-[#9B3922]/40 text-[#F2613F] border border-[#9B3922] font-semibold"
                  : "text-slate-400 hover:text-slate-200"
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
              className="glass-panel rounded-3xl overflow-hidden border border-[#481E14]/50 flex flex-col group hover:border-[#F2613F]/50 transition-all duration-300"
            >
              {/* Project Image Banner */}
              <div className="relative h-52 w-full overflow-hidden bg-[#0C0C0C]">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/40 to-transparent" />

                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#0C0C0C]/90 border border-[#481E14] text-[#F2613F] text-[11px] font-mono backdrop-blur-md">
                  {project.badge}
                </span>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white group-hover:text-[#F2613F] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    {project.tagline}
                  </p>
                </div>
              </div>

              {/* Project Details */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between gap-6">
                {/* Pipeline Flow */}
                {project.pipeline && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase tracking-wider">
                      Execution Flow:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-200 dark:text-slate-200 light:text-slate-800">
                      {project.pipeline.map((step, sIdx) => (
                        <React.Fragment key={sIdx}>
                          <span
                            className={cn(
                              "px-2 py-1 rounded-md border text-[11px]",
                              sIdx === project.pipeline!.length - 1
                                ? "bg-[#481E14]/60 border-[#F2613F]/50 text-[#F2613F] font-bold"
                                : "bg-[#481E14]/20 border-[#481E14]/60"
                            )}
                          >
                            {step}
                          </span>
                          {sIdx < project.pipeline!.length - 1 && (
                            <ArrowRight className="size-3 text-[#9B3922]" />
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
                      className="flex items-start gap-2.5 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 font-light"
                    >
                      <Check className="size-3.5 text-[#F2613F] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Pills & GitHub Link */}
                <div className="flex flex-col gap-4 pt-4 border-t border-[#481E14]/40">
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-md bg-[#481E14]/20 border border-[#481E14]/60 text-[11px] font-mono text-slate-300 dark:text-slate-300 light:text-slate-700"
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
                      className="inline-flex items-center gap-2 text-xs font-mono text-[#F2613F] hover:text-[#FFA07A] transition-colors font-medium self-start"
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
