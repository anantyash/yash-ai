export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: "ai" | "fullstack";
  image: string;
  impact: string[];
  pipeline?: string[];
  techStack: string[];
  githubUrl?: string;
  badge: string;
}

export const portfolioData = {
  personal: {
    name: "YASH",
    title: "Generative AI & Systems Engineer",
    tagline: "Turning Intelligence Into Software.",
    pitch:
      "Architecting multi-model LLM orchestration, RAG pipelines, and high-performance software systems.",
    manifesto: "One model is a start. An engineered system is the product.",
    status: "Available for AI / GenAI Engineering Roles",
    email: "anantyash.2710@gmail.com",
    phone: "+91 9878463360",
    location: "Jharkhand, India (Open to Remote / Relocation)",
    linkedin: "https://www.linkedin.com/in/anantyash",
    github: "https://github.com/anantyash",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    roles: [
      "Generative AI Engineer",
      "AI Systems Engineer",
      "LLM Engineer",
      "Full-Stack Engineer",
    ],
  },

  stats: [
    { value: "8.71", label: "B.Tech CSE CGPA", highlight: "Academic Merit" },
    {
      value: "Multi-LLM",
      label: "Consensus Engine",
      highlight: "Gemini + OpenRouter",
    },
    {
      value: "Full-Stack",
      label: "DigiCrow Production",
      highlight: "Node • React • MySQL",
    },
    {
      value: "<150ms",
      label: "Async Inference",
      highlight: "Bun & TypeScript",
    },
  ],

  pillars: [
    {
      title: "Generative AI & RAG",
      summary:
        "Dynamic persona modeling, structured prompt pipelines, and vector semantic retrieval.",
      icon: "Sparkles",
      tags: ["Gemini API", "Prompt Engineering", "RAG", "pgvector"],
    },
    {
      title: "Multi-Model Orchestration",
      summary:
        "Parallel LLM inference with consensus voting to eliminate hallucinations.",
      icon: "Layers",
      tags: ["Self-Consistency", "Evaluator Layer", "Zod Validation"],
    },
    {
      title: "Full-Stack Systems",
      summary:
        "Type-safe APIs and responsive interfaces backed by robust database architectures.",
      icon: "Cpu",
      tags: ["React", "TypeScript", "Node.js / Express", "PostgreSQL"],
    },
  ],

  projects: [
    {
      id: "mixchai",
      title: "MixChAI: Self-Consistency LLM Engine",
      tagline: "Multi-Model AI Orchestration & Evaluator Synthesis",
      category: "ai",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      badge: "Multi-Model AI",
      pipeline: [
        "Query",
        "Parallel LLMs",
        "Candidate Pool",
        "Evaluator Synthesis",
        "Verified Output",
      ],
      impact: [
        "Orchestrated parallel inference across Gemini and OpenRouter models using TypeScript & Bun.",
        "Built provider-agnostic architecture using Strategy and Factory design patterns.",
        "Implemented evaluator-driven answer synthesis and strict Zod schema validation.",
      ],
      techStack: [
        "TypeScript",
        "Bun",
        "Gemini API",
        "OpenRouter",
        "Zod",
        "Strategy Pattern",
      ],
      githubUrl: "https://github.com/anantyash/MixChAI",
    },
    {
      id: "devbot",
      title: "DevBot: AI Persona Chatbot",
      tagline: "Conversational Personality Engineering & LLM APIs",
      category: "ai",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
      badge: "Conversational AI",
      impact: [
        "Engineered configurable persona models defining domain tone, vocabulary, and constraints.",
        "Built Node.js & Express REST API for low-latency asynchronous response streaming.",
        "Integrated dynamic persona switching with structured JSON response validation.",
      ],
      techStack: [
        "Node.js",
        "Express.js",
        "Gemini API",
        "Prompt Engineering",
        "Tailwind CSS",
      ],
      githubUrl: "https://github.com/anantyash/DevBot-Persona-AI",
    },
    {
      id: "rag-gateway",
      title: "YASH.AI: RAG & AI Gateway Architecture",
      tagline: "Vector Search, Quotas & Token Accounting Engine",
      category: "ai",
      image:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
      badge: "RAG + pgvector",
      pipeline: [
        "Query",
        "OpenAI Embeddings",
        "pgvector HNSW",
        "Context Builder",
        "gpt-4o-mini",
      ],
      impact: [
        "Implemented semantic retrieval over portfolio knowledge with PostgreSQL pgvector (HNSW cosine index).",
        "Built 4-tier token quota system with Redis sliding window rate limits and pre-call reservations.",
        "Engineered strict grounding safeguards preventing hallucinations and prompt injection.",
      ],
      techStack: [
        "PostgreSQL",
        "pgvector",
        "Redis",
        "OpenAI API",
        "Express",
        "TypeScript",
      ],
    },
    {
      id: "digicrow",
      title: "DigiCrow Web & Payment Platform",
      tagline: "Production Full-Stack Architecture & Secure Transactions",
      category: "fullstack",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      badge: "Production Web",
      impact: [
        "Engineered full-stack responsive web applications with Tailwind CSS, JavaScript, PHP, and MySQL.",
        "Integrated secure payment gateways with automated verification and webhook handlers.",
        "Developed reusable UI components and optimized server-side CRUD operations.",
      ],
      techStack: [
        "Tailwind CSS",
        "JavaScript",
        "PHP",
        "MySQL",
        "Payment Gateway APIs",
      ],
    },
  ] as Project[],

  experience: [
    {
      role: "Web Developer",
      company: "DigiCrow",
      period: "June 2025 — Present",
      points: [
        "Developed end-to-end full-stack web applications using HTML, Tailwind CSS, JavaScript, PHP, and MySQL.",
        "Built modular UI components and handled server-side data processing and database CRUD.",
        "Integrated secure payment gateway workflows and conducted transaction stability testing.",
      ],
    },
  ],

  education: {
    degree: "B.Tech in Computer Science & Engineering",
    institution: "Guru Gobind Singh Educational Society’s Technical Campus",
    location: "Bokaro, Jharkhand",
    period: "2020 – 2024",
    cgpa: "8.71 / 10",
    coursework: [
      "Data Structures & Algorithms",
      "OOPs",
      "Operating Systems",
      "DBMS",
      "Computer Networks",
    ],
  },

  skills: {
    ai: [
      "Gemini API",
      "OpenAI SDK",
      "Prompt Engineering",
      "Multi-Model Orchestration",
      "RAG & Vector Search",
      "Persona Modeling",
      "OpenRouter",
    ],
    frontend: [
      "React.js",
      "Tailwind CSS",
      "JavaScript (ES6+)",
      "HTML5 / Modern CSS",
      "GSAP Animations",
    ],
    backend: [
      "Node.js",
      "Express.js",
      "TypeScript",
      "Bun",
      "PHP",
      "REST APIs",
      "Zod Validation",
    ],
    core: [
      "PostgreSQL + pgvector",
      "Redis Cache",
      "MySQL",
      "OOPs Principles",
      "Data Structures & Algorithms",
      "Git & GitHub",
    ],
  },
};
