import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portfolio — Informatics Student | Data & Web" },
      {
        name: "description",
        content:
          "Informatics student at NUST building toward data science, data engineering, analytics and web development. Projects, skills, and contact.",
      },
      { property: "og:title", content: "Informatics Student — Data & Web Portfolio" },
      {
        property: "og:description",
        content:
          "Aspiring data scientist & web developer. Python, SQL, React, Power BI, Supabase.",
      },
    ],
  }),
  component: Index,
});

const SKILLS = [
  { name: "Python", level: "core" },
  { name: "SQL", level: "core" },
  { name: "Data Analysis", level: "core" },
  { name: "Statistics", level: "core" },
  { name: "Excel", level: "core" },
  { name: "Power BI / Tableau", level: "learning" },
  { name: "Machine Learning", level: "learning" },
  { name: "Data Viz", level: "learning" },
  { name: "React", level: "some" },
  { name: "TypeScript", level: "some" },
  { name: "Supabase", level: "some" },
  { name: "Node.js", level: "some" },
] as const;

const LEVEL_LABEL: Record<string, string> = {
  core: "core",
  learning: "learning",
  some: "exploring",
};

const PROJECTS = [
  {
    tag: "01 / data analysis",
    title: "NUST Student Performance Explorer",
    blurb:
      "Cleaning, EDA and dashboards on academic performance data — Python + Pandas, visualised in Power BI.",
    stack: ["Python", "Pandas", "Power BI"],
  },
  {
    tag: "02 / data engineering",
    title: "ETL Pipeline: CSV → Postgres → Dashboard",
    blurb:
      "End-to-end pipeline: ingest raw CSV, transform with SQL, load into Postgres, surface live KPIs.",
    stack: ["Python", "SQL", "Postgres"],
  },
  {
    tag: "03 / machine learning",
    title: "Predicting Drop-Out Risk",
    blurb:
      "Logistic regression & random forest baseline on a synthetic student dataset. Focus on evaluation, not hype.",
    stack: ["scikit-learn", "Jupyter", "Matplotlib"],
  },
  {
    tag: "04 / web dev",
    title: "This Portfolio",
    blurb:
      "Built with React, TypeScript, TanStack Start and Tailwind. Deployed on the edge.",
    stack: ["React", "TypeScript", "Tailwind"],
  },
];

function Index() {
  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-[#ededed] antialiased"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <Grid />
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}

function Grid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.07]"
      style={{
        backgroundImage:
          "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        maskImage:
          "radial-gradient(ellipse at center, #000 30%, transparent 75%)",
      }}
    />
  );
}

function Nav() {
  return (
    <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <a
        href="#top"
        className="font-mono text-sm tracking-tight text-white"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        ./portfolio
      </a>
      <nav className="hidden gap-8 text-sm text-white/60 md:flex">
        <a href="#about" className="hover:text-white">about</a>
        <a href="#skills" className="hover:text-white">skills</a>
        <a href="#projects" className="hover:text-white">projects</a>
        <a href="#contact" className="hover:text-white">contact</a>
      </nav>
      <a
        href="#contact"
        className="rounded-full border border-white/20 px-4 py-1.5 text-xs text-white transition hover:bg-white hover:text-black"
      >
        Hire / collab
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-16 md:pt-28">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-white/50"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        // NUST · Informatics · Student in transit
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.05 }}
        className="text-[clamp(2.6rem,8vw,6rem)] font-bold leading-[0.95] tracking-tight"
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        Turning raw data
        <br />
        into{" "}
        <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
          decisions
        </span>{" "}
        & products.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-8 max-w-xl text-base text-white/70 md:text-lg"
      >
        I'm an Informatics student at NUST aspiring to work across{" "}
        <span className="text-white">data science</span>,{" "}
        <span className="text-white">data engineering</span>,{" "}
        <span className="text-white">analytics</span> and{" "}
        <span className="text-white">web development</span>. I build projects to
        learn in public — pipelines, dashboards, models, and the apps that put
        them in people's hands.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mt-10 flex flex-wrap gap-3"
      >
        <a
          href="#projects"
          className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
        >
          See projects →
        </a>
        <a
          href="#contact"
          className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/5"
        >
          Get in touch
        </a>
      </motion.div>

      <div className="mt-20 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 md:grid-cols-4">
        {[
          { k: "Focus", v: "Data + Web" },
          { k: "School", v: "NUST" },
          { k: "Field", v: "Informatics" },
          { k: "Status", v: "Open to projects" },
        ].map((s) => (
          <div key={s.k}>
            <div
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {s.k}
            </div>
            <div className="mt-1 text-sm text-white">{s.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div
      className="mb-10 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-white/50"
      style={{ fontFamily: "JetBrains Mono, monospace" }}
    >
      <span>{n}</span>
      <span className="h-px flex-1 bg-white/15" />
      <span>{label}</span>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <SectionLabel n="§ 01" label="about" />
      <div className="grid gap-12 md:grid-cols-5">
        <h2
          className="text-3xl font-bold leading-tight tracking-tight md:col-span-2 md:text-4xl"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Student today.
          <br />
          Practitioner tomorrow.
        </h2>
        <div className="space-y-5 text-white/70 md:col-span-3 md:text-lg">
          <p>
            I'm building a career that sits at the intersection of{" "}
            <span className="text-white">data</span> and{" "}
            <span className="text-white">software</span>. Day-to-day that means
            writing Python and SQL, sketching pipelines, exploring datasets,
            and shipping interfaces that make the work usable.
          </p>
          <p>
            My approach is simple: pick a real problem, build it end-to-end,
            document it, repeat. Every project on this page exists because I
            wanted to understand something better — not to pad a CV.
          </p>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <SectionLabel n="§ 02" label="stack" />
      <div className="flex flex-wrap gap-3">
        {SKILLS.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
            className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.02] px-4 py-2 text-sm transition hover:border-white/40 hover:bg-white/[0.05]"
          >
            <span
              className={
                "h-1.5 w-1.5 rounded-full " +
                (s.level === "core"
                  ? "bg-emerald-400"
                  : s.level === "learning"
                  ? "bg-cyan-400"
                  : "bg-violet-400")
              }
            />
            <span className="text-white">{s.name}</span>
            <span
              className="font-mono text-[10px] uppercase tracking-wider text-white/40"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {LEVEL_LABEL[s.level]}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-6 text-xs text-white/50">
        <Legend color="bg-emerald-400" label="core — use regularly" />
        <Legend color="bg-cyan-400" label="learning — active focus" />
        <Legend color="bg-violet-400" label="exploring — know some" />
      </div>
    </section>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={"h-1.5 w-1.5 rounded-full " + color} />
      <span>{label}</span>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <SectionLabel n="§ 03" label="projects" />
      <div className="grid gap-6 md:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition hover:border-white/30 hover:bg-white/[0.04]"
          >
            <div
              className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {p.tag}
            </div>
            <h3
              className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-white"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              {p.title}
            </h3>
            <p className="mt-3 text-sm text-white/65">{p.blurb}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {p.stack.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-white/10 px-2 py-1 font-mono text-[10px] text-white/60"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-white/50 group-hover:text-white">
              Case study soon
              <span className="transition group-hover:translate-x-1">→</span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <SectionLabel n="§ 04" label="contact" />
      <div className="grid gap-12 md:grid-cols-5">
        <div className="md:col-span-2">
          <h2
            className="text-3xl font-bold leading-tight tracking-tight md:text-4xl"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Got data, a project, or just want to talk?
          </h2>
          <p className="mt-4 text-white/65">
            I'm open to internships, freelance analytics work, study groups,
            and side projects. Drop a note — I reply.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="space-y-4 md:col-span-3"
        >
          <Field label="Your name" placeholder="Jane Doe" />
          <Field label="Email" type="email" placeholder="jane@domain.com" />
          <div>
            <label
              className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-white/50"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              Message
            </label>
            <textarea
              required
              rows={4}
              placeholder="What are you working on?"
              className="w-full resize-none rounded-lg border border-white/15 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
          >
            {sent ? "Thanks — I'll get back to you" : "Send message →"}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  type = "text",
  placeholder,
}: {
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-white/50"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        {label}
      </label>
      <input
        required
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none"
      />
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 mx-auto max-w-6xl border-t border-white/10 px-6 py-10">
      <div
        className="flex flex-col items-start justify-between gap-4 font-mono text-xs text-white/40 md:flex-row md:items-center"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        <span>© {new Date().getFullYear()} — built to learn in public.</span>
        <span>NUST · Informatics · Data + Web</span>
      </div>
    </footer>
  );
}
