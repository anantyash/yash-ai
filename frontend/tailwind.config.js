/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        void: "#0C0C0C",
        rust: "#481E14",
        "rust-deep": "#481E14",
        system: "#9B3922",
        "system-accent": "#9B3922",
        highlight: "#F2613F",
        "ai-highlight": "#F2613F",
        primary: "#F2613F",
        secondary: "#9B3922",
        accent: "#481E14",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
