import React, { useState } from "react";
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

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  return (
    <div className="bg-[#06080d] text-slate-100 min-h-screen relative selection:bg-indigo-500/30 selection:text-cyan-400 font-sans">
      {/* Custom Magnetic Cursor */}
      <CustomCursor />

      {/* Ambient Radial Mesh & Neural Particle Canvas */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-35 z-0" />
      <div className="ambient-glow-1 top-[-100px] left-[-100px]" />
      <div className="ambient-glow-2 top-[35%] right-[-150px]" />
      <div className="ambient-glow-3 bottom-[-100px] left-[20%]" />
      <NeuralCanvas />

      {/* Header Navigation */}
      <Navbar onCopyEmail={showNotification} />

      {/* Main Sections */}
      <main className="relative z-10">
        <Hero onOpenResume={() => setResumeOpen(true)} />
        <AILab />
        <WhatIBuild />
        <FeaturedProjects />
        <Experience />
        <SkillsSection />
        <Contact onNotify={showNotification} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Printable / ATS Resume Modal */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />

      {/* Global Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
};

export default App;
