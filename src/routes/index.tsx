import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
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
      { title: "Persistance Chikanya — Data & Web Portfolio" },
      {
        name: "description",
        content:
          "Persistance Chikanya — aspiring data scientist, data engineer, analyst and web developer. Projects, skills and contact.",
      },
      { property: "og:title", content: "Persistance Chikanya — Portfolio" },
      {
        property: "og:description",
        content:
          "Aspiring data scientist & web developer. Python, SQL, React, Power BI, Supabase.",
      },
    ],
  }),
  component: Index,
});

// ---------- Types & defaults ----------

type Level = "core" | "learning" | "some";
type Skill = { name: string; level: Level };
type Project = { tag: string; title: string; blurb: string; stack: string[] };

type Data = {
  name: string;
  tagline: string;
  headlineLead: string;
  headlineAccent: string;
  headlineTail: string;
  about1: string;
  about2: string;
  email: string;
  linkedin: string;
  github: string;
  avatar: string; // data URL or empty
  skills: Skill[];
  projects: Project[];
};

const DEFAULTS: Data = {
  name: "Persistance Chikanya",
  tagline: "Data · Analytics · Web",
  headlineLead: "Turning raw data",
  headlineAccent: "decisions",
  headlineTail: "& products.",
  about1:
    "I'm building a career at the intersection of data and software. Day-to-day that means writing Python and SQL, sketching pipelines, exploring datasets, and shipping interfaces that make the work usable.",
  about2:
    "My approach is simple: pick a real problem, build it end-to-end, document it, repeat. Every project on this page exists because I wanted to understand something better.",
  email: "persytchikanya@gmail.com",
  linkedin:
    "https://www.linkedin.com/in/persistance-tinevimbo-chikanya-169916350",
  github: "https://github.com/12Captain-price",
  avatar: "",
  skills: [
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
  ],
  projects: [
    {
      tag: "01 / data analysis",
      title: "Student Performance Explorer",
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
        "Logistic regression & random forest baseline on a synthetic dataset. Focus on evaluation, not hype.",
      stack: ["scikit-learn", "Jupyter", "Matplotlib"],
    },
    {
      tag: "04 / web dev",
      title: "This Portfolio",
      blurb:
        "Built with React, TypeScript, TanStack Start and Tailwind. Deployed on the edge.",
      stack: ["React", "TypeScript", "Tailwind"],
    },
  ],
};

const LEVEL_LABEL: Record<Level, string> = {
  core: "core",
  learning: "learning",
  some: "exploring",
};

const STORAGE_KEY = "portfolio.data.v1";

function useData() {
  const [data, setData] = useState<Data>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setData({ ...DEFAULTS, ...parsed });
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data, loaded]);

  return { data, setData };
}

// ---------- Page ----------

function Index() {
  const { data, setData } = useData();
  const [editing, setEditing] = useState(false);

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-[#ededed] antialiased"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <Grid />
      <Nav editing={editing} setEditing={setEditing} onReset={() => setData(DEFAULTS)} />
      <Hero data={data} setData={setData} editing={editing} />
      <About data={data} setData={setData} editing={editing} />
      <Skills data={data} setData={setData} editing={editing} />
      <Projects data={data} setData={setData} editing={editing} />
      <Contact data={data} setData={setData} editing={editing} />
      <Footer data={data} />
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

function Nav({
  editing,
  setEditing,
  onReset,
}: {
  editing: boolean;
  setEditing: (v: boolean) => void;
  onReset: () => void;
}) {
  return (
    <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
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
      <div className="flex items-center gap-2">
        {editing && (
          <button
            onClick={() => {
              if (confirm("Reset all content to defaults?")) onReset();
            }}
            className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/10"
          >
            Reset
          </button>
        )}
        <button
          onClick={() => setEditing(!editing)}
          className={
            "rounded-full px-4 py-1.5 text-xs transition " +
            (editing
              ? "bg-emerald-400 text-black hover:bg-emerald-300"
              : "border border-white/20 text-white hover:bg-white hover:text-black")
          }
        >
          {editing ? "Done editing" : "Edit site"}
        </button>
      </div>
    </header>
  );
}

// ---------- Editable primitives ----------

function EditableText({
  value,
  onChange,
  editing,
  multiline,
  className,
  placeholder,
  style,
  as: As = "span",
}: {
  value: string;
  onChange: (v: string) => void;
  editing: boolean;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  style?: React.CSSProperties;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  if (!editing) {
    const Tag = As as any;
    return <Tag className={className} style={style}>{value}</Tag>;
  }
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className={
          (className || "") +
          " block w-full resize-y rounded-md border border-emerald-400/40 bg-emerald-400/[0.04] px-2 py-1 outline-none focus:border-emerald-300"
        }
        style={style}
      />
    );
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={
        (className || "") +
        " rounded-md border border-emerald-400/40 bg-emerald-400/[0.04] px-2 py-1 outline-none focus:border-emerald-300"
      }
      style={style}
    />
  );
}

// ---------- Hero ----------

function Hero({
  data,
  setData,
  editing,
}: {
  data: Data;
  setData: (u: (d: Data) => Data) => void;
  editing: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const onPickAvatar = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result || "");
      setData((d) => ({ ...d, avatar: url }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <section id="top" className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-12 md:pt-20">
      <div className="grid items-center gap-12 md:grid-cols-[auto,1fr]">
        {/* Avatar */}
        <div className="flex flex-col items-start gap-3">
          <div className="relative h-32 w-32 overflow-hidden rounded-full border border-white/15 bg-white/[0.04] md:h-40 md:w-40">
            {data.avatar ? (
              <img
                src={data.avatar}
                alt={data.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-white/40">
                {data.name
                  .split(" ")
                  .map((s) => s[0])
                  .slice(0, 2)
                  .join("")}
              </div>
            )}
          </div>
          {editing && (
            <div className="flex gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="rounded-full border border-emerald-400/40 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-400/10"
              >
                {data.avatar ? "Change photo" : "Upload photo"}
              </button>
              {data.avatar && (
                <button
                  onClick={() => setData((d) => ({ ...d, avatar: "" }))}
                  className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60 hover:bg-white/5"
                >
                  Remove
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onPickAvatar(f);
                  e.target.value = "";
                }}
              />
            </div>
          )}
        </div>

        {/* Text */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-white/50"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            <EditableText
              value={data.tagline}
              onChange={(v) => setData((d) => ({ ...d, tagline: v }))}
              editing={editing}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mb-4"
          >
            <EditableText
              value={data.name}
              onChange={(v) => setData((d) => ({ ...d, name: v }))}
              editing={editing}
              className="text-xl font-medium text-white/80"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[clamp(2.2rem,7vw,5rem)] font-bold leading-[0.95] tracking-tight"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            {editing ? (
              <div className="space-y-2">
                <EditableText
                  value={data.headlineLead}
                  onChange={(v) => setData((d) => ({ ...d, headlineLead: v }))}
                  editing={editing}
                  className="text-3xl"
                />
                <EditableText
                  value={data.headlineAccent}
                  onChange={(v) => setData((d) => ({ ...d, headlineAccent: v }))}
                  editing={editing}
                  className="text-3xl"
                />
                <EditableText
                  value={data.headlineTail}
                  onChange={(v) => setData((d) => ({ ...d, headlineTail: v }))}
                  editing={editing}
                  className="text-3xl"
                />
              </div>
            ) : (
              <>
                {data.headlineLead}
                <br />
                into{" "}
                <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
                  {data.headlineAccent}
                </span>{" "}
                {data.headlineTail}
              </>
            )}
          </motion.h1>

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
        </div>
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

function About({
  data,
  setData,
  editing,
}: {
  data: Data;
  setData: (u: (d: Data) => Data) => void;
  editing: boolean;
}) {
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
          <EditableText
            value={data.about1}
            onChange={(v) => setData((d) => ({ ...d, about1: v }))}
            editing={editing}
            multiline
            as="p"
          />
          <EditableText
            value={data.about2}
            onChange={(v) => setData((d) => ({ ...d, about2: v }))}
            editing={editing}
            multiline
            as="p"
          />
        </div>
      </div>
    </section>
  );
}

// ---------- Skills ----------

function Skills({
  data,
  setData,
  editing,
}: {
  data: Data;
  setData: (u: (d: Data) => Data) => void;
  editing: boolean;
}) {
  const [newName, setNewName] = useState("");
  const [newLevel, setNewLevel] = useState<Level>("learning");

  const dot = (lvl: Level) =>
    lvl === "core"
      ? "bg-emerald-400"
      : lvl === "learning"
      ? "bg-cyan-400"
      : "bg-violet-400";

  return (
    <section id="skills" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <SectionLabel n="§ 02" label="stack" />
      <div className="flex flex-wrap gap-3">
        {data.skills.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.02 }}
            className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.02] px-4 py-2 text-sm"
          >
            <span className={"h-1.5 w-1.5 rounded-full " + dot(s.level)} />
            {editing ? (
              <>
                <input
                  value={s.name}
                  onChange={(e) =>
                    setData((d) => {
                      const next = [...d.skills];
                      next[i] = { ...next[i], name: e.target.value };
                      return { ...d, skills: next };
                    })
                  }
                  className="w-28 bg-transparent text-white outline-none"
                />
                <select
                  value={s.level}
                  onChange={(e) =>
                    setData((d) => {
                      const next = [...d.skills];
                      next[i] = { ...next[i], level: e.target.value as Level };
                      return { ...d, skills: next };
                    })
                  }
                  className="bg-black font-mono text-[10px] uppercase tracking-wider text-white/60 outline-none"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  <option value="core">core</option>
                  <option value="learning">learning</option>
                  <option value="some">exploring</option>
                </select>
                <button
                  onClick={() =>
                    setData((d) => ({
                      ...d,
                      skills: d.skills.filter((_, j) => j !== i),
                    }))
                  }
                  className="ml-1 text-white/40 hover:text-red-400"
                  aria-label="Remove skill"
                >
                  ×
                </button>
              </>
            ) : (
              <>
                <span className="text-white">{s.name}</span>
                <span
                  className="font-mono text-[10px] uppercase tracking-wider text-white/40"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  {LEVEL_LABEL[s.level]}
                </span>
              </>
            )}
          </motion.div>
        ))}

        {editing && (
          <div className="flex items-center gap-2 rounded-full border border-dashed border-emerald-400/40 bg-emerald-400/[0.04] px-3 py-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New skill"
              className="w-28 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            />
            <select
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value as Level)}
              className="bg-black font-mono text-[10px] uppercase tracking-wider text-white/60 outline-none"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              <option value="core">core</option>
              <option value="learning">learning</option>
              <option value="some">exploring</option>
            </select>
            <button
              onClick={() => {
                if (!newName.trim()) return;
                setData((d) => ({
                  ...d,
                  skills: [...d.skills, { name: newName.trim(), level: newLevel }],
                }));
                setNewName("");
              }}
              className="rounded-full bg-emerald-400 px-2 py-0.5 text-xs text-black hover:bg-emerald-300"
            >
              + Add
            </button>
          </div>
        )}
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

// ---------- Projects ----------

function Projects({
  data,
  setData,
  editing,
}: {
  data: Data;
  setData: (u: (d: Data) => Data) => void;
  editing: boolean;
}) {
  const updateProject = (i: number, patch: Partial<Project>) =>
    setData((d) => {
      const next = [...d.projects];
      next[i] = { ...next[i], ...patch };
      return { ...d, projects: next };
    });

  return (
    <section id="projects" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <SectionLabel n="§ 03" label="projects" />
      <div className="grid gap-6 md:grid-cols-2">
        {data.projects.map((p, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition hover:border-white/30 hover:bg-white/[0.04]"
          >
            <EditableText
              value={p.tag}
              onChange={(v) => updateProject(i, { tag: v })}
              editing={editing}
              className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            />
            <div className="mt-4">
              <EditableText
                value={p.title}
                onChange={(v) => updateProject(i, { title: v })}
                editing={editing}
                className="text-2xl font-semibold leading-tight tracking-tight text-white"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              />
            </div>
            <div className="mt-3">
              <EditableText
                value={p.blurb}
                onChange={(v) => updateProject(i, { blurb: v })}
                editing={editing}
                multiline
                className="text-sm text-white/65"
                as="p"
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {editing ? (
                <input
                  value={p.stack.join(", ")}
                  onChange={(e) =>
                    updateProject(i, {
                      stack: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Comma-separated stack"
                  className="w-full rounded-md border border-emerald-400/40 bg-emerald-400/[0.04] px-2 py-1 font-mono text-xs text-white outline-none"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                />
              ) : (
                p.stack.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-white/10 px-2 py-1 font-mono text-[10px] text-white/60"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {t}
                  </span>
                ))
              )}
            </div>
            {editing && (
              <button
                onClick={() =>
                  setData((d) => ({
                    ...d,
                    projects: d.projects.filter((_, j) => j !== i),
                  }))
                }
                className="mt-4 text-xs text-white/40 hover:text-red-400"
              >
                Remove project
              </button>
            )}
          </motion.article>
        ))}

        {editing && (
          <button
            onClick={() =>
              setData((d) => ({
                ...d,
                projects: [
                  ...d.projects,
                  {
                    tag: `${String(d.projects.length + 1).padStart(2, "0")} / new`,
                    title: "New project",
                    blurb: "Describe what you built and what you learned.",
                    stack: ["Tool", "Tool"],
                  },
                ],
              }))
            }
            className="flex min-h-[200px] items-center justify-center rounded-2xl border-2 border-dashed border-emerald-400/40 text-sm text-emerald-300 hover:bg-emerald-400/5"
          >
            + Add project
          </button>
        )}
      </div>
    </section>
  );
}

// ---------- Contact ----------

function Contact({
  data,
  setData,
  editing,
}: {
  data: Data;
  setData: (u: (d: Data) => Data) => void;
  editing: boolean;
}) {
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
            I'm open to internships, freelance analytics work, and side
            projects. Drop a note — I reply.
          </p>
        </div>

        <div className="space-y-4 md:col-span-3">
          <ContactRow
            label="Email"
            value={data.email}
            href={`mailto:${data.email}`}
            editing={editing}
            onChange={(v) => setData((d) => ({ ...d, email: v }))}
          />
          <ContactRow
            label="LinkedIn"
            value={data.linkedin}
            href={data.linkedin}
            editing={editing}
            onChange={(v) => setData((d) => ({ ...d, linkedin: v }))}
          />
          <ContactRow
            label="GitHub"
            value={data.github}
            href={data.github}
            editing={editing}
            onChange={(v) => setData((d) => ({ ...d, github: v }))}
          />
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  label,
  value,
  href,
  editing,
  onChange,
}: {
  label: string;
  value: string;
  href: string;
  editing: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div
        className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        {label}
      </div>
      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-emerald-400/40 bg-emerald-400/[0.04] px-2 py-1 text-sm text-white outline-none"
        />
      ) : (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          className="break-all text-sm text-white hover:text-emerald-300"
        >
          {value}
        </a>
      )}
    </div>
  );
}

function Footer({ data }: { data: Data }) {
  return (
    <footer className="relative z-10 mx-auto max-w-6xl border-t border-white/10 px-6 py-10">
      <div
        className="flex flex-col items-start justify-between gap-4 font-mono text-xs text-white/40 md:flex-row md:items-center"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        <span>© {new Date().getFullYear()} — {data.name}</span>
        <span>Built to learn in public.</span>
      </div>
    </footer>
  );
}
