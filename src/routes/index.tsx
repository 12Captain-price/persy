import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  Pencil,
  Mail,
  Linkedin,
  Github,
  Upload,
  Trash2,
  FileText,
  Image as ImageIcon,
  Plus,
  X,
  ExternalLink,
  Lock,
  Sun,
  Moon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
      { title: "Persistance Chikanya" },
      {
        name: "description",
        content:
          "Persistance Chikanya — aspiring data scientist, data engineer, analyst and web developer. Projects, skills and contact.",
      },
      { property: "og:title", content: "Persistance Chikanya — Portfolio" },
      {
        property: "og:description",
        content:
          "Aspiring data scientist & web developer. Python, SQL, React, Power BI.",
      },
    ],
  }),
  component: Index,
});

// ---------- Types & defaults ----------

type Level = "core" | "learning" | "some";
type Skill = { name: string; level: Level };
type FileRef = { name: string; url: string } | null;
type Project = {
  tag: string;
  title: string;
  blurb: string;
  stack: string[];
  category?: string;
  file?: FileRef;
  url?: string;
};
type Certificate = { title: string; issuer: string; file: FileRef };
type Experience = {
  role: string;
  org: string;
  period: string;
  description: string;
};
type Post = {
  title: string;
  date: string;
  excerpt: string;
  body: string;
};

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
  avatar: string;
  cv?: { name: string; url: string } | null;
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
  experience: Experience[];
  posts: Post[];
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
      category: "Data Analysis",
    },
    {
      tag: "02 / data engineering",
      title: "ETL Pipeline: CSV → Postgres → Dashboard",
      blurb:
        "End-to-end pipeline: ingest raw CSV, transform with SQL, load into Postgres, surface live KPIs.",
      stack: ["Python", "SQL", "Postgres"],
      category: "Data Engineering",
    },
    {
      tag: "03 / machine learning",
      title: "Predicting Drop-Out Risk",
      blurb:
        "Logistic regression & random forest baseline on a synthetic dataset. Focus on evaluation, not hype.",
      stack: ["scikit-learn", "Jupyter", "Matplotlib"],
      category: "Machine Learning",
    },
    {
      tag: "04 / web dev",
      title: "This Portfolio",
      blurb:
        "Built with React, TypeScript, TanStack Start and Tailwind. Deployed on the edge.",
      stack: ["React", "TypeScript", "Tailwind"],
      category: "Web Dev",
    },
  ],
  certificates: [],
  experience: [
    {
      role: "BSc Informatics student",
      org: "NUST",
      period: "2023 — present",
      description:
        "Coursework across databases, statistics, programming and systems. Building portfolio projects on the side.",
    },
  ],
  posts: [
    {
      title: "Why I'm learning in public",
      date: "2026-06-01",
      excerpt:
        "Notes on shipping small data projects every week and the habits that actually stick.",
      body:
        "I started writing about each project the moment I finished it. The act of explaining forces clarity, and clarity compounds.",
    },
  ],
};

const LEVEL_LABEL: Record<Level, string> = {
  core: "core",
  learning: "learning",
  some: "exploring",
};

const BUCKET = "portfolio-files";
const EDIT_PASSCODE = "2005";
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 50; // ~50 years

async function uploadFile(file: File, folder: string): Promise<FileRef> {
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${folder}/${Date.now()}_${safe}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) {
    alert("Upload failed: " + error.message);
    return null;
  }
  const { data, error: signErr } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (signErr || !data) {
    alert("Could not create link for file");
    return null;
  }
  return { name: file.name, url: data.signedUrl };
}

// ---------- Secure file viewer ----------

function SecureViewer({ label = "View" }: { file?: { name: string; url: string }; label?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200 hover:bg-emerald-400/20"
      >
        {label}
      </button>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="secure-modal-panel relative w-full max-w-md overflow-hidden rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-[#0d1612] via-[#0a0a0a] to-[#0d1612] p-7 shadow-[0_20px_80px_-20px_rgba(16,185,129,0.4)]"
          >
            {/* decorative glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 rounded-md p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="relative">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10">
                <Lock size={24} className="text-emerald-300" />
              </div>

              <h3
                className="text-xl font-semibold tracking-tight text-white"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                This file is private
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Access to this file is restricted. If you'd like a copy or a walkthrough,
                please reach out — I'll happily share it with you.
              </p>

              <div className="mt-6 space-y-2">
                <a
                  href="mailto:persytchikanya@gmail.com?subject=Request%20for%20file%20access"
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:border-emerald-400/40 hover:bg-emerald-400/5"
                >
                  <Mail size={16} className="text-emerald-300" />
                  <div className="flex-1 text-left">
                    <p className="text-xs uppercase tracking-wider text-white/40">Email</p>
                    <p className="text-sm text-white">persytchikanya@gmail.com</p>
                  </div>
                </a>
                <a
                  href="https://www.linkedin.com/in/persistance-tinevimbo-chikanya-169916350"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:border-emerald-400/40 hover:bg-emerald-400/5"
                >
                  <Linkedin size={16} className="text-emerald-300" />
                  <div className="flex-1 text-left">
                    <p className="text-xs uppercase tracking-wider text-white/40">LinkedIn</p>
                    <p className="text-sm text-white">Message me directly</p>
                  </div>
                </a>
              </div>

              <p className="mt-5 text-center text-[11px] uppercase tracking-[0.2em] text-white/30">
                Persistance Chikanya
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

// ---------- Data hook (cloud-backed, with localStorage fallback) ----------

function useData() {
  const [data, setData] = useState<Data>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: row } = await supabase
          .from("portfolio")
          .select("data")
          .eq("id", "main")
          .maybeSingle();
        if (!cancelled && row?.data && Object.keys(row.data).length > 0) {
          setData({ ...DEFAULTS, ...(row.data as Partial<Data>) });
        }
      } catch {}
      if (!cancelled) setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = (updater: (d: Data) => Data) => {
    setData((prev) => {
      const next = updater(prev);
      // Fire-and-forget save
      supabase
        .from("portfolio")
        .upsert({ id: "main", data: next as any, updated_at: new Date().toISOString() })
        .then(({ error }) => {
          if (error) console.warn("Save failed:", error.message);
        });
      return next;
    });
  };

  return { data, setData: update, loaded };
}

// ---------- Page ----------

function Index() {
  const { data, setData } = useData();
  const [editing, setEditing] = useState(false);
  const [passOpen, setPassOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("portfolio.theme") as "dark" | "light") || "dark";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("portfolio.theme", theme);
  }, [theme]);

  const requestEdit = () => {
    if (editing) setEditing(false);
    else setPassOpen(true);
  };

  return (
    <div
      className={
        (theme === "light" ? "theme-light " : "") +
        "min-h-screen bg-[#0a0a0a] text-[#ededed] antialiased transition-colors"
      }
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <Grid />
      <Nav
        editing={editing}
        onEditClick={requestEdit}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      />

      <Hero data={data} setData={setData} editing={editing} />
      <About data={data} setData={setData} editing={editing} />
      <Skills data={data} setData={setData} editing={editing} />
      <ExperienceSection data={data} setData={setData} editing={editing} />
      <Projects data={data} setData={setData} editing={editing} />
      <Certificates data={data} setData={setData} editing={editing} />
      <Blog data={data} setData={setData} editing={editing} />
      <Contact data={data} setData={setData} editing={editing} />
      {passOpen && (
        <PasscodeModal
          onClose={() => setPassOpen(false)}
          onSuccess={() => {
            setEditing(true);
            setPassOpen(false);
          }}
        />
      )}
    </div>
  );
}

function PasscodeModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111] p-6">
        <div className="mb-4 flex items-center gap-2">
          <Lock size={16} className="text-emerald-300" />
          <h3
            className="text-lg font-semibold"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Enter edit passcode
          </h3>
          <button
            onClick={onClose}
            className="ml-auto text-white/40 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (code === EDIT_PASSCODE) onSuccess();
            else setErr("Wrong passcode");
          }}
        >
          <input
            type="password"
            autoFocus
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setErr("");
            }}
            placeholder="••••"
            className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-center text-lg tracking-[0.5em] text-white outline-none focus:border-emerald-400"
          />
          {err && <p className="mt-2 text-xs text-red-400">{err}</p>}
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-emerald-400 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-300"
          >
            Unlock
          </button>
        </form>
      </div>
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
  onEditClick,
  theme,
  onToggleTheme,
}: {
  editing: boolean;
  onEditClick: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
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
      <nav className="hidden gap-6 text-sm text-white/60 lg:flex">
        <a href="#about" className="hover:text-white">about</a>
        <a href="#skills" className="hover:text-white">skills</a>
        <a href="#experience" className="hover:text-white">experience</a>
        <a href="#projects" className="hover:text-white">projects</a>
        <a href="#certificates" className="hover:text-white">certificates</a>
        <a href="#blog" className="hover:text-white">blog</a>
        <a href="#contact" className="hover:text-white">contact</a>
      </nav>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-white/50 hover:text-white"
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <button
          onClick={onEditClick}
          aria-label={editing ? "Stop editing" : "Edit site"}
          title={editing ? "Done editing" : "Edit (passcode required)"}
          className={
            "flex h-9 w-9 items-center justify-center rounded-full transition " +
            (editing
              ? "bg-emerald-400 text-black hover:bg-emerald-300"
              : "border border-white/20 text-white/70 hover:border-white/50 hover:text-white")
          }
        >
          <Pencil size={15} />
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
  const [busy, setBusy] = useState(false);

  const onPickAvatar = async (file: File) => {
    setBusy(true);
    const ref = await uploadFile(file, "avatars");
    setBusy(false);
    if (ref) setData((d) => ({ ...d, avatar: ref.url }));
  };

  return (
    <section id="top" className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-12 md:pt-20">
      <div className="grid items-center gap-12 md:grid-cols-[auto,1fr]">
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
                disabled={busy}
                className="flex items-center gap-1 rounded-full border border-emerald-400/40 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-400/10 disabled:opacity-50"
              >
                <Upload size={12} />
                {busy ? "Uploading…" : data.avatar ? "Change photo" : "Upload photo"}
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

  const categories = Array.from(
    new Set(data.projects.map((p) => p.category).filter(Boolean) as string[]),
  );
  const [filter, setFilter] = useState<string>("All");
  const visible = data.projects
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => filter === "All" || p.category === filter);

  return (
    <section id="projects" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <SectionLabel n="§ 04" label="projects" />
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {["All", ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={
                "rounded-full border px-3 py-1 text-xs transition " +
                (filter === c
                  ? "border-emerald-400 bg-emerald-400 text-black"
                  : "border-white/15 text-white/60 hover:border-white/40 hover:text-white")
              }
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {visible.map(({ p, i }) => (
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
              <input
                value={p.category ?? ""}
                onChange={(e) => updateProject(i, { category: e.target.value })}
                placeholder="Category (e.g. Data Analysis)"
                className="mt-3 w-full rounded-md border border-emerald-400/40 bg-emerald-400/[0.04] px-2 py-1 text-xs text-white outline-none"
              />
            )}
            {!editing && p.category && (
              <span className="mt-3 inline-block rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/50">
                {p.category}
              </span>
            )}

            {/* File attachment + URL */}
            <div className="mt-5 space-y-3 border-t border-white/10 pt-4">
              {p.file ? (
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-emerald-300" />
                  <span className="flex-1 truncate text-xs text-white/80">{p.file.name}</span>
                  <SecureViewer file={p.file} />
                  {editing && (
                    <button
                      onClick={() => updateProject(i, { file: null })}
                      className="text-white/40 hover:text-red-400"
                      aria-label="Remove file"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ) : editing ? (
                <ProjectFileUpload onUploaded={(ref) => updateProject(i, { file: ref })} />
              ) : null}

              {editing ? (
                <input
                  value={p.url ?? ""}
                  onChange={(e) => updateProject(i, { url: e.target.value })}
                  placeholder="Project URL (https://...)"
                  className="w-full rounded-md border border-emerald-400/40 bg-emerald-400/[0.04] px-2 py-1 text-xs text-white outline-none"
                />
              ) : p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200 hover:bg-emerald-400/20"
                >
                  <ExternalLink size={12} /> Visit site
                </a>
              ) : !p.file ? (
                <p className="text-xs text-white/30">No file or link attached</p>
              ) : null}
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
            className="flex min-h-[260px] items-center justify-center rounded-2xl border-2 border-dashed border-emerald-400/40 text-sm text-emerald-300 hover:bg-emerald-400/5"
          >
            <Plus size={16} className="mr-1" /> Add project
          </button>
        )}
      </div>
    </section>
  );
}

function ProjectFileUpload({ onUploaded }: { onUploaded: (ref: FileRef) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  return (
    <>
      <button
        onClick={() => ref.current?.click()}
        disabled={busy}
        className="flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-emerald-400/40 px-3 py-2 text-xs text-emerald-300 hover:bg-emerald-400/5 disabled:opacity-50"
      >
        <Upload size={12} /> {busy ? "Uploading…" : "Upload .zip or document"}
      </button>
      <input
        ref={ref}
        type="file"
        accept=".zip,.rar,.7z,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.ipynb,.txt"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setBusy(true);
          const result = await uploadFile(f, "projects");
          setBusy(false);
          e.target.value = "";
          if (result) onUploaded(result);
        }}
      />
    </>
  );
}

// ---------- Certificates ----------

function Certificates({
  data,
  setData,
  editing,
}: {
  data: Data;
  setData: (u: (d: Data) => Data) => void;
  editing: boolean;
}) {
  const updateCert = (i: number, patch: Partial<Certificate>) =>
    setData((d) => {
      const next = [...d.certificates];
      next[i] = { ...next[i], ...patch };
      return { ...d, certificates: next };
    });

  return (
    <section id="certificates" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <SectionLabel n="§ 05" label="certificates" />
      {data.certificates.length === 0 && !editing && (
        <p className="text-sm text-white/40">No certificates uploaded yet.</p>
      )}
      <div className="grid gap-5 md:grid-cols-3">
        {data.certificates.map((c, i) => {
          const isImage = c.file?.name?.match(/\.(png|jpe?g|gif|webp|svg)$/i);
          return (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-4"
            >
              <div className="mb-3 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-black/40">
                {c.file && isImage ? (
                  <img src={c.file.url} alt={c.title} className="h-full w-full object-cover" />
                ) : c.file ? (
                  <FileText size={40} className="text-white/30" />
                ) : (
                  <ImageIcon size={40} className="text-white/20" />
                )}
              </div>
              {editing ? (
                <>
                  <input
                    value={c.title}
                    onChange={(e) => updateCert(i, { title: e.target.value })}
                    placeholder="Certificate title"
                    className="mb-2 w-full rounded-md border border-emerald-400/40 bg-emerald-400/[0.04] px-2 py-1 text-sm text-white outline-none"
                  />
                  <input
                    value={c.issuer}
                    onChange={(e) => updateCert(i, { issuer: e.target.value })}
                    placeholder="Issuer"
                    className="mb-2 w-full rounded-md border border-emerald-400/40 bg-emerald-400/[0.04] px-2 py-1 text-xs text-white/80 outline-none"
                  />
                  {!c.file && (
                    <CertFileUpload onUploaded={(ref) => updateCert(i, { file: ref })} />
                  )}
                  {c.file && (
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <span className="flex-1 truncate">{c.file.name}</span>
                      <button
                        onClick={() => updateCert(i, { file: null })}
                        className="text-white/40 hover:text-red-400"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() =>
                      setData((d) => ({
                        ...d,
                        certificates: d.certificates.filter((_, j) => j !== i),
                      }))
                    }
                    className="mt-3 text-xs text-white/40 hover:text-red-400"
                  >
                    Remove certificate
                  </button>
                </>
              ) : (
                <>
                  <h4
                    className="text-sm font-semibold text-white"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    {c.title || "Untitled"}
                  </h4>
                  <p className="text-xs text-white/50">{c.issuer}</p>
                  {c.file && (
                    <div className="mt-2">
                      <SecureViewer file={c.file} />
                    </div>
                  )}

                </>
              )}
            </div>
          );
        })}

        {editing && (
          <button
            onClick={() =>
              setData((d) => ({
                ...d,
                certificates: [
                  ...d.certificates,
                  { title: "New certificate", issuer: "Issuer", file: null },
                ],
              }))
            }
            className="flex aspect-[4/3] items-center justify-center rounded-xl border-2 border-dashed border-emerald-400/40 text-sm text-emerald-300 hover:bg-emerald-400/5"
          >
            <Plus size={16} className="mr-1" /> Add certificate
          </button>
        )}
      </div>
    </section>
  );
}

function CertFileUpload({ onUploaded }: { onUploaded: (ref: FileRef) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  return (
    <>
      <button
        onClick={() => ref.current?.click()}
        disabled={busy}
        className="flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-emerald-400/40 px-3 py-2 text-xs text-emerald-300 hover:bg-emerald-400/5 disabled:opacity-50"
      >
        <Upload size={12} /> {busy ? "Uploading…" : "Upload image or PDF"}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*,.pdf,.doc,.docx"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setBusy(true);
          const result = await uploadFile(f, "certificates");
          setBusy(false);
          e.target.value = "";
          if (result) onUploaded(result);
        }}
      />
    </>
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
      <SectionLabel n="§ 07" label="contact" />
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
            icon={<Mail size={16} />}
            label="Email"
            value={data.email}
            href={`mailto:${data.email}`}
            editing={editing}
            onChange={(v) => setData((d) => ({ ...d, email: v }))}
          />
          <ContactRow
            icon={<Linkedin size={16} />}
            label="LinkedIn"
            value={data.linkedin}
            href={data.linkedin}
            editing={editing}
            onChange={(v) => setData((d) => ({ ...d, linkedin: v }))}
          />
          <ContactRow
            icon={<Github size={16} />}
            label="GitHub"
            value={data.github}
            href={data.github}
            editing={editing}
            onChange={(v) => setData((d) => ({ ...d, github: v }))}
          />
          <ContactForm email={data.email} />
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  editing,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  editing: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div
        className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        <span className="text-emerald-300">{icon}</span>
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

// ---------- Experience ----------

function ExperienceSection({
  data,
  setData,
  editing,
}: {
  data: Data;
  setData: (u: (d: Data) => Data) => void;
  editing: boolean;
}) {
  const updateExp = (i: number, patch: Partial<Experience>) =>
    setData((d) => {
      const next = [...d.experience];
      next[i] = { ...next[i], ...patch };
      return { ...d, experience: next };
    });

  if (!editing && data.experience.length === 0) return null;

  return (
    <section id="experience" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <SectionLabel n="§ 03" label="experience" />
      <div className="relative space-y-8 border-l border-white/10 pl-6">
        {data.experience.map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="relative"
          >
            <span className="absolute -left-[31px] top-2 h-3 w-3 rounded-full border-2 border-emerald-400 bg-[#0a0a0a]" />
            {editing ? (
              <div className="space-y-2 rounded-xl border border-emerald-400/30 bg-emerald-400/[0.03] p-4">
                <input
                  value={e.role}
                  onChange={(ev) => updateExp(i, { role: ev.target.value })}
                  placeholder="Role"
                  className="w-full rounded-md border border-white/10 bg-black/40 px-2 py-1 text-sm text-white outline-none"
                />
                <input
                  value={e.org}
                  onChange={(ev) => updateExp(i, { org: ev.target.value })}
                  placeholder="Organisation"
                  className="w-full rounded-md border border-white/10 bg-black/40 px-2 py-1 text-sm text-white outline-none"
                />
                <input
                  value={e.period}
                  onChange={(ev) => updateExp(i, { period: ev.target.value })}
                  placeholder="Period (e.g. 2024 — present)"
                  className="w-full rounded-md border border-white/10 bg-black/40 px-2 py-1 text-xs text-white/80 outline-none"
                />
                <textarea
                  value={e.description}
                  onChange={(ev) => updateExp(i, { description: ev.target.value })}
                  placeholder="What you did / learned"
                  rows={3}
                  className="w-full resize-y rounded-md border border-white/10 bg-black/40 px-2 py-1 text-sm text-white/80 outline-none"
                />
                <button
                  onClick={() =>
                    setData((d) => ({
                      ...d,
                      experience: d.experience.filter((_, j) => j !== i),
                    }))
                  }
                  className="text-xs text-white/40 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  {e.period}
                </p>
                <h3
                  className="mt-1 text-lg font-semibold text-white"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  {e.role}{" "}
                  <span className="font-normal text-white/50">· {e.org}</span>
                </h3>
                <p className="mt-2 text-sm text-white/65">{e.description}</p>
              </>
            )}
          </motion.div>
        ))}

        {editing && (
          <button
            onClick={() =>
              setData((d) => ({
                ...d,
                experience: [
                  ...d.experience,
                  { role: "New role", org: "Organisation", period: "Year — Year", description: "What you did." },
                ],
              }))
            }
            className="flex items-center gap-1 rounded-full border-2 border-dashed border-emerald-400/40 px-4 py-2 text-xs text-emerald-300 hover:bg-emerald-400/5"
          >
            <Plus size={14} /> Add experience
          </button>
        )}
      </div>
    </section>
  );
}

// ---------- Blog ----------

function Blog({
  data,
  setData,
  editing,
}: {
  data: Data;
  setData: (u: (d: Data) => Data) => void;
  editing: boolean;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const updatePost = (i: number, patch: Partial<Post>) =>
    setData((d) => {
      const next = [...d.posts];
      next[i] = { ...next[i], ...patch };
      return { ...d, posts: next };
    });

  if (!editing && data.posts.length === 0) return null;

  return (
    <section id="blog" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <SectionLabel n="§ 06" label="writing" />
      <div className="grid gap-5 md:grid-cols-2">
        {data.posts.map((post, i) => (
          <article
            key={i}
            className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/30 hover:bg-white/[0.04]"
          >
            {editing ? (
              <div className="space-y-2">
                <input
                  value={post.title}
                  onChange={(e) => updatePost(i, { title: e.target.value })}
                  placeholder="Title"
                  className="w-full rounded-md border border-emerald-400/40 bg-emerald-400/[0.04] px-2 py-1 text-lg font-semibold text-white outline-none"
                />
                <input
                  value={post.date}
                  onChange={(e) => updatePost(i, { date: e.target.value })}
                  placeholder="YYYY-MM-DD"
                  className="w-full rounded-md border border-emerald-400/40 bg-emerald-400/[0.04] px-2 py-1 text-xs text-white outline-none"
                />
                <textarea
                  value={post.excerpt}
                  onChange={(e) => updatePost(i, { excerpt: e.target.value })}
                  placeholder="Short excerpt"
                  rows={2}
                  className="w-full resize-y rounded-md border border-emerald-400/40 bg-emerald-400/[0.04] px-2 py-1 text-sm text-white/80 outline-none"
                />
                <textarea
                  value={post.body}
                  onChange={(e) => updatePost(i, { body: e.target.value })}
                  placeholder="Full post body"
                  rows={6}
                  className="w-full resize-y rounded-md border border-emerald-400/40 bg-emerald-400/[0.04] px-2 py-1 text-sm text-white/80 outline-none"
                />
                <button
                  onClick={() =>
                    setData((d) => ({
                      ...d,
                      posts: d.posts.filter((_, j) => j !== i),
                    }))
                  }
                  className="text-xs text-white/40 hover:text-red-400"
                >
                  Remove post
                </button>
              </div>
            ) : (
              <>
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  {post.date}
                </p>
                <h3
                  className="mt-2 text-xl font-semibold text-white"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  {post.title}
                </h3>
                <p className="mt-3 text-sm text-white/65">{post.excerpt}</p>
                <button
                  onClick={() => setOpenIdx(i)}
                  className="mt-4 text-xs font-medium text-emerald-300 hover:text-emerald-200"
                >
                  Read more →
                </button>
              </>
            )}
          </article>
        ))}

        {editing && (
          <button
            onClick={() =>
              setData((d) => ({
                ...d,
                posts: [
                  {
                    title: "New post",
                    date: new Date().toISOString().slice(0, 10),
                    excerpt: "Short summary…",
                    body: "Write your post here.",
                  },
                  ...d.posts,
                ],
              }))
            }
            className="flex min-h-[180px] items-center justify-center rounded-2xl border-2 border-dashed border-emerald-400/40 text-sm text-emerald-300 hover:bg-emerald-400/5"
          >
            <Plus size={16} className="mr-1" /> Add post
          </button>
        )}
      </div>

      {openIdx !== null && data.posts[openIdx] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={() => setOpenIdx(null)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/15 bg-[#0d0d0d] p-8"
          >
            <button
              onClick={() => setOpenIdx(null)}
              className="absolute right-4 top-4 rounded-md p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {data.posts[openIdx].date}
            </p>
            <h2
              className="mt-3 text-3xl font-bold tracking-tight text-white"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              {data.posts[openIdx].title}
            </h2>
            <div className="mt-6 whitespace-pre-wrap text-[15px] leading-relaxed text-white/75">
              {data.posts[openIdx].body}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}

// ---------- Contact form ----------

function ContactForm({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(
      `From: ${name}${from ? ` <${from}>` : ""}\n\n${message}`,
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex w-full items-center justify-between rounded-xl border border-emerald-400/30 bg-emerald-400/[0.06] px-5 py-4 text-left transition hover:border-emerald-400/60 hover:bg-emerald-400/[0.1]"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
            <Mail size={16} />
          </span>
          <span>
            <span className="block text-sm font-medium text-white">Send me a message</span>
            <span className="block text-xs text-white/55">Opens a quick form</span>
          </span>
        </span>
        <span className="font-mono text-xs text-emerald-300 transition group-hover:translate-x-0.5">→</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <motion.form
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
            onSubmit={onSubmit}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-emerald-400/30 bg-[#0d1612] p-7 shadow-[0_20px_80px_-20px_rgba(16,185,129,0.4)]"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 rounded-md p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="relative">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10">
                <Mail size={20} className="text-emerald-300" />
              </div>
              <h3
                className="text-xl font-semibold tracking-tight text-white"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Send a message
              </h3>
              <p className="mt-1 text-sm text-white/60">
                I'll get back to you as soon as I can.
              </p>

              <div className="mt-5 space-y-2">
                <input
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  placeholder="Your name"
                  className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/60"
                />
                <input
                  type="email"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  maxLength={255}
                  placeholder="Your email (optional)"
                  className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/60"
                />
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={1000}
                  rows={5}
                  placeholder="Your message"
                  className="w-full resize-y rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/60"
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-emerald-400 px-4 py-2.5 text-sm font-medium text-black transition hover:bg-emerald-300"
                >
                  {sent ? "Opening your email…" : "Send via email"}
                </button>
                <p className="text-[11px] text-white/40">
                  This opens your email app with the message pre-filled.
                </p>
              </div>
            </div>
          </motion.form>
        </div>
      )}
    </>
  );
}
