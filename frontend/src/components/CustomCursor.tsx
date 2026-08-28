import React, { useEffect, useRef } from "react";

export const CustomCursor: React.FC = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const render = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 size-2 bg-cyan-400 rounded-full pointer-events-none z-50 -ml-1 -mt-1 shadow-glow transition-opacity duration-300 hidden md:block"
      />
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 size-8 border border-cyan-500/40 rounded-full pointer-events-none z-50 -ml-4 -mt-4 transition-transform duration-75 hidden md:block"
      />
    </>
  );
};
