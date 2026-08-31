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
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
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
      {/* Solid dot — sharp accent */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{
          width: "7px",
          height: "7px",
          marginLeft: "-3.5px",
          marginTop: "-3.5px",
          borderRadius: "50%",
          background: "#F2613F",
          boxShadow: "0 0 8px rgba(242, 97, 63, 0.55)",
          transition: "opacity 0.2s ease",
        }}
      />
      {/* Trailing ring — muted rust */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] hidden md:block"
        style={{
          width: "28px",
          height: "28px",
          marginLeft: "-14px",
          marginTop: "-14px",
          borderRadius: "50%",
          border: "1px solid rgba(155, 57, 34, 0.50)",
          transition: "opacity 0.2s ease",
        }}
      />
    </>
  );
};
