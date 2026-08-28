/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#06080d",
        surface: "#0b0f19",
        card: "#0d121e",
        "card-hover": "#121a2c",
        primary: "#38bdf8",
        secondary: "#818cf8",
        accent: "#c084fc",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
