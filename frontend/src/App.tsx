import React, { useState, useEffect } from "react";
import { CustomCursor } from "./components/CustomCursor";
import { NeuralCanvas } from "./components/NeuralCanvas";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { AILab } from "./components/AILab";
import { WhatIBuild } from "./components/WhatIBuild";
import { FeaturedProjects } from "./components/FeaturedProjects";
import { Experience } from "./components/Experience";
import { SkillsSection } from "./components/SkillsSection";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Toast } from "./components/Toast";
import { ResumeModal } from "./components/ResumeModal";

export const App: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [resumeOpen, setResumeOpen] = useState<boolean>(false);

  /* Bootstrap theme before first paint — prevents flash */
  useEffect(() => {
    const saved =
      (localStorage.getItem("yash_ai_theme") as "dark" | "light") || "dark";
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(saved);
  }, []);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden font-sans">
      {/* Custom Magnetic Cursor */}
      <CustomCursor />

      {/* Background layers */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-40 z-0" />
      <div className="ambient-glow-1 top-[-120px] left-[-120px]" />
      <div className="ambient-glow-2 top-[40%] right-[-160px]" />
      <div className="ambient-glow-3 bottom-[-80px] left-[25%]" />
      <NeuralCanvas />

      {/* Nav */}
      <Navbar onCopyEmail={showNotification} />

      {/* Main — flex-1 fills remaining space so footer stays at bottom */}
      <main className="relative z-10 flex-1">
        <Hero onOpenResume={() => setResumeOpen(true)} />
        <AILab />
        <WhatIBuild />
        <FeaturedProjects />
        <Experience />
        <SkillsSection />
        <Contact onNotify={showNotification} />
      </main>

      <Footer />
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
      <Toast message={toastMessage} />
    </div>
  );
};

export default App;
