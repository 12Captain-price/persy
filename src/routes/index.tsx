import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  Pencil, Mail, Linkedin, Github, Upload, Trash2, FileText,
  Image as ImageIcon, Plus, X, ExternalLink, Lock, Unlock, Sun, Moon,
  Download, Share2, Check, Menu, ChevronDown, ArrowRight, ArrowUp,
  Sparkles, Globe, BarChart3, Brain, Database, Code2, Cpu, Layers,
  Rocket, ShieldCheck, Zap, Trophy, Users, Timer, Award, MessageCircle,
  MapPin, Phone, Send, HelpCircle, Star, Search, PenTool, TestTube2,
  Cloud, LifeBuoy, GitBranch, Server, Package, Palette, DollarSign,
  Building2, Quote, Circle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoAsset from "@/assets/pc-nexus-logo.png.asset.json";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PC Nexus — Intelligent Digital Solutions" },
      {
        name: "description",
        content:
          "PC Nexus builds intelligent digital solutions — web development, data analytics, machine learning and database engineering. Founded by Persistance Chikanya.",
      },
      { property: "og:title", content: "PC Nexus — Intelligent Digital Solutions" },
      {
        property: "og:description",
        content:
          "We help businesses transform ideas into powerful digital experiences through web, data, ML and database solutions.",
      },
      { property: "og:url", content: "https://persy.lovable.app" },
      { property: "og:image", content: "https://persy.lovable.app/og-image.jpg" },
      { property: "og:image:width", content: "1216" },
      { property: "og:image:height", content: "640" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PC Nexus — Intelligent Digital Solutions" },
      {
        name: "twitter:description",
        content:
          "Web · Data · ML · Databases. Premium digital solutions by PC Nexus.",
      },
      { name: "twitter:image", content: "https://persy.lovable.app/og-image.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://persy.lovable.app" },
    ],
  }),
  component: Index,
});

// ---------- Types & defaults ----------

type Level = "core" | "learning" | "some";
type Skill = { name: string; level: Level };
type FileRef = { name: string; url: string; locked?: boolean } | null;
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

// PC Nexus company types
type IconName =
  | "Globe" | "BarChart3" | "Brain" | "Database" | "Code2" | "Cpu"
  | "Layers" | "Rocket" | "ShieldCheck" | "Zap" | "Trophy" | "Users"
  | "Timer" | "Award" | "MessageCircle" | "Cloud" | "GitBranch"
  | "Server" | "Package" | "Palette" | "Search" | "PenTool" | "TestTube2"
  | "LifeBuoy" | "DollarSign" | "Building2" | "Star" | "Sparkles";

type Service = {
  icon: IconName;
  title: string;
  description: string;
  features: string[];
};
type Stat = { icon: IconName; value: string; label: string; suffix?: string };
type Tech = { name: string; icon: IconName };
type ProcessStep = { icon: IconName; title: string; description: string };
type PricingTier = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  featured?: boolean;
  cta: string;
};
type Testimonial = { name: string; role: string; quote: string; rating: number };
type FAQ = { q: string; a: string };
type FooterCol = { title: string; links: { label: string; href: string }[] };

type Data = {
  // Company (PC Nexus)
  brandName: string;
  brandTagline: string;
  heroHeadline: string;
  heroSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaQuote: string;
  ctaBook: string;
  whyTitle: string;
  whyDescription: string;
  servicesTitle: string;
  servicesDescription: string;
  techTitle: string;
  techDescription: string;
  processTitle: string;
  processDescription: string;
  pricingTitle: string;
  pricingDescription: string;
  testimonialsTitle: string;
  testimonialsDescription: string;
  faqTitle: string;
  faqDescription: string;
  location: string;
  whatsapp: string;
  services: Service[];
  stats: Stat[];
  technologies: Tech[];
  process: ProcessStep[];
  pricing: PricingTier[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  footerCols: FooterCol[];
  footerTagline: string;
  // Personal / founder
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
  cv?: { name: string; url: string; locked?: boolean } | null;
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
  experience: Experience[];
  posts: Post[];
};

// Icon renderer for data-driven icons
const ICONS: Record<IconName, React.ComponentType<{ size?: number; className?: string }>> = {
  Globe, BarChart3, Brain, Database, Code2, Cpu, Layers, Rocket,
  ShieldCheck, Zap, Trophy, Users, Timer, Award, MessageCircle,
  Cloud, GitBranch, Server, Package, Palette, Search, PenTool,
  TestTube2, LifeBuoy, DollarSign, Building2, Star, Sparkles,
};
function DynIcon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  const C = ICONS[name] || Sparkles;
  return <C size={size} className={className} />;
}
const ICON_NAMES: IconName[] = Object.keys(ICONS) as IconName[];

const DEFAULTS: Data = {
  // ---- Company (PC Nexus) ----
  brandName: "PC Nexus",
  brandTagline: "Intelligent Digital Solutions",
  heroHeadline: "Building Intelligent Digital Solutions",
  heroSubtitle:
    "We help businesses transform ideas into powerful digital experiences through web development, data analytics, machine learning, and database solutions.",
  ctaPrimary: "Hire Us",
  ctaSecondary: "View Portfolio",
  ctaQuote: "Request a Quote",
  ctaBook: "Book Consultation",
  whyTitle: "Why choose PC Nexus",
  whyDescription:
    "A modern studio built for outcomes — speed, craft, and technology that scales with your business.",
  servicesTitle: "What we do",
  servicesDescription:
    "Four disciplines, one team. Delivered end-to-end from discovery to deployment.",
  techTitle: "Technologies we use",
  techDescription:
    "A pragmatic stack picked for reliability, velocity, and long-term maintenance.",
  processTitle: "How we work",
  processDescription:
    "A transparent process that keeps you informed at every step, from first call to long-term support.",
  pricingTitle: "Simple, transparent pricing",
  pricingDescription:
    "Flexible engagements sized to your project. Every quote is bespoke — these are indicative starting points.",
  testimonialsTitle: "Trusted by builders",
  testimonialsDescription:
    "Kind words from clients and collaborators we've shipped alongside.",
  faqTitle: "Frequently asked questions",
  faqDescription:
    "Everything you need to know before we start working together.",
  location: "Harare, Zimbabwe · Remote worldwide",
  whatsapp: "+263000000000",
  services: [
    {
      icon: "Globe",
      title: "Web Development",
      description:
        "Fast, accessible, production-grade websites and web apps built for scale.",
      features: [
        "Business Websites",
        "Portfolio Websites",
        "Web Applications",
        "REST APIs",
        "Laravel Development",
        "React Development",
      ],
    },
    {
      icon: "BarChart3",
      title: "Data Analytics",
      description:
        "Turn scattered data into dashboards, decisions, and revenue.",
      features: [
        "Dashboard Development",
        "Business Intelligence",
        "Data Cleaning",
        "SQL Analysis",
        "Power BI",
        "Business Reports",
      ],
    },
    {
      icon: "Brain",
      title: "Machine Learning",
      description:
        "Practical ML that predicts, classifies, and drives operational value.",
      features: [
        "Predictive Models",
        "Classification Models",
        "Regression Models",
        "Feature Engineering",
        "Model Evaluation",
      ],
    },
    {
      icon: "Database",
      title: "Database Solutions",
      description:
        "Robust data foundations — schemas, APIs, and architecture done right.",
      features: [
        "Database Design",
        "MySQL",
        "MongoDB",
        "API Integration",
        "System Architecture",
      ],
    },
  ],
  stats: [
    { icon: "Trophy", value: "25", suffix: "+", label: "Projects Completed" },
    { icon: "Layers", value: "20", suffix: "+", label: "Technologies Used" },
    { icon: "Users", value: "100", suffix: "%", label: "Client Satisfaction" },
    { icon: "Timer", value: "48", suffix: "h", label: "Avg. First Response" },
    { icon: "Zap", value: "10", suffix: "x", label: "Faster Iteration" },
  ],
  technologies: [
    { name: "React", icon: "Code2" },
    { name: "TypeScript", icon: "Code2" },
    { name: "Laravel", icon: "Server" },
    { name: "PHP", icon: "Server" },
    { name: "Python", icon: "Brain" },
    { name: "Java", icon: "Cpu" },
    { name: "MongoDB", icon: "Database" },
    { name: "MySQL", icon: "Database" },
    { name: "PostgreSQL", icon: "Database" },
    { name: "Git", icon: "GitBranch" },
    { name: "GitHub", icon: "GitBranch" },
    { name: "Tailwind CSS", icon: "Palette" },
    { name: "TensorFlow", icon: "Brain" },
    { name: "Power BI", icon: "BarChart3" },
    { name: "Docker", icon: "Package" },
  ],
  process: [
    { icon: "Search", title: "Discovery", description: "We listen, ask, and map your goals to concrete outcomes." },
    { icon: "PenTool", title: "Planning", description: "A scoped roadmap with milestones, deliverables, and dates." },
    { icon: "Palette", title: "Design", description: "Prototypes that look premium and feel intuitive." },
    { icon: "Code2", title: "Development", description: "Clean, testable code shipped in short iterations." },
    { icon: "TestTube2", title: "Testing", description: "Automated + manual QA on every device that matters." },
    { icon: "Rocket", title: "Deployment", description: "Zero-downtime release with monitoring and analytics." },
    { icon: "LifeBuoy", title: "Support", description: "Ongoing improvements and priority support post-launch." },
  ],
  pricing: [
    {
      name: "Starter Website",
      price: "$250",
      period: "one-time",
      description: "A polished landing or 3-page site to establish your presence.",
      features: ["Up to 3 pages", "Responsive design", "Basic SEO", "Contact form", "1 revision round"],
      cta: "Get started",
    },
    {
      name: "Business Website",
      price: "$650",
      period: "one-time",
      description: "A complete marketing site with CMS and analytics.",
      features: ["Up to 8 pages", "CMS integration", "SEO optimized", "Analytics", "3 revision rounds", "30-day support"],
      featured: true,
      cta: "Most popular",
    },
    {
      name: "Custom Web App",
      price: "$1,500",
      period: "starting at",
      description: "Bespoke web applications with authentication and databases.",
      features: ["Auth & user roles", "Database design", "Admin panel", "REST API", "Deployment", "60-day support"],
      cta: "Request quote",
    },
    {
      name: "Data Analytics",
      price: "$450",
      period: "per project",
      description: "Dashboards, reports, and insights that unlock decisions.",
      features: ["Power BI / Tableau", "SQL analysis", "Data cleaning", "Executive report", "Handover session"],
      cta: "Talk to us",
    },
    {
      name: "Machine Learning",
      price: "$900",
      period: "starting at",
      description: "Predictive and classification models tailored to your data.",
      features: ["Problem framing", "Feature engineering", "Model training", "Evaluation report", "API delivery"],
      cta: "Discuss project",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "annual",
      description: "Retainer engagement for teams shipping continuously.",
      features: ["Dedicated engineer", "Priority SLAs", "Quarterly roadmap", "Architecture reviews", "Unlimited revisions"],
      cta: "Contact sales",
    },
  ],
  testimonials: [],
  faqs: [
    { q: "How long does a typical project take?", a: "Landing sites ship in 1–2 weeks. Business sites take 3–4 weeks. Custom web apps and ML projects run 6–12 weeks depending on scope." },
    { q: "Do you work with clients outside Zimbabwe?", a: "Yes — we work remotely with clients worldwide. Communication happens over email, WhatsApp, and scheduled video calls." },
    { q: "What does your pricing include?", a: "Every quote includes design, development, testing, deployment, and an initial support window. Ongoing support is available as a monthly retainer." },
    { q: "Can you take over an existing project?", a: "Absolutely. We start with a code audit and a short discovery sprint before proposing a roadmap." },
    { q: "Do you offer maintenance?", a: "Yes. Monthly maintenance plans cover updates, monitoring, backups, and priority fixes." },
    { q: "How do we get started?", a: "Book a free consultation or send a message via the contact section. We reply within 48 hours." },
  ],
  footerCols: [
    {
      title: "Quick Links",
      links: [
        { label: "Services", href: "#services" },
        { label: "Projects", href: "#projects" },
        { label: "Pricing", href: "#pricing" },
        { label: "Contact", href: "#contact" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Web Development", href: "#services" },
        { label: "Data Analytics", href: "#services" },
        { label: "Machine Learning", href: "#services" },
        { label: "Database Solutions", href: "#services" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "#blog" },
        { label: "Certificates", href: "#certificates" },
        { label: "FAQ", href: "#faq" },
        { label: "Process", href: "#process" },
      ],
    },
  ],
  footerTagline:
    "PC Nexus — building intelligent digital solutions for teams that ship.",
  // ---- Personal / Founder ----
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
  cv: null,
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
  return { name: file.name, url: data.signedUrl, locked: true };
}

// ---------- Secure file viewer ----------

function SecureViewer({ file, label = "View" }: { file?: { name: string; url: string; locked?: boolean } | null; label?: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const locked = file?.locked !== false;
  const isImage = !!file?.name?.match(/\.(png|jpe?g|gif|webp|svg)$/i);

  const onShare = async () => {
    if (!file) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: file.name, url: file.url });
        return;
      }
    } catch {}
    try {
      await navigator.clipboard.writeText(file.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

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
      {open && locked && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="secure-modal-panel relative w-full max-w-md overflow-hidden rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-[#0d1612] via-[#0a0a0a] to-[#0d1612] p-7 shadow-[0_20px_80px_-20px_rgba(16,185,129,0.4)]"
          >
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

      {open && !locked && file && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 p-4 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 pb-3">
            <div className="flex min-w-0 items-center gap-2 text-white">
              <FileText size={16} className="shrink-0 text-emerald-300" />
              <span className="truncate text-sm">{file.name}</span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={file.url}
                download={file.name}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/40 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-200 hover:bg-emerald-400/20"
              >
                <Download size={14} /> Download
              </a>
              <button
                onClick={onShare}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10"
              >
                {copied ? <Check size={14} /> : <Share2 size={14} />}
                {copied ? "Link copied" : "Share"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-5xl flex-1 overflow-hidden rounded-xl border border-white/10 bg-black">
            {isImage ? (
              <img src={file.url} alt={file.name} className="m-auto max-h-full max-w-full object-contain" />
            ) : (
              <iframe src={file.url} title={file.name} className="h-full w-full" />
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ---------- Lock toggle (edit mode) ----------

function LockToggle({
  locked,
  onChange,
}: {
  locked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!locked)}
      title={locked ? "Locked — visitors see the private message. Click to unlock." : "Unlocked — visitors can view, download & share. Click to lock."}
      className={
        "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium transition " +
        (locked
          ? "border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20"
          : "border-emerald-400/40 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20")
      }
    >
      {locked ? <Lock size={11} /> : <Unlock size={11} />}
      {locked ? "Locked" : "Unlocked"}
    </button>
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
        data={data}
        editing={editing}
        onEditClick={requestEdit}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      />

      <Hero data={data} setData={setData} editing={editing} />
      <Services data={data} setData={setData} editing={editing} />
      <WhyChoose data={data} setData={setData} editing={editing} />
      <Technologies data={data} setData={setData} editing={editing} />
      <Process data={data} setData={setData} editing={editing} />
      <Projects data={data} setData={setData} editing={editing} />
      <Pricing data={data} setData={setData} editing={editing} />
      <Testimonials data={data} setData={setData} editing={editing} />
      <About data={data} setData={setData} editing={editing} />
      <Skills data={data} setData={setData} editing={editing} />
      <ExperienceSection data={data} setData={setData} editing={editing} />
      <Certificates data={data} setData={setData} editing={editing} />
      <Blog data={data} setData={setData} editing={editing} />
      <FAQSection data={data} setData={setData} editing={editing} />
      <Contact data={data} setData={setData} editing={editing} />
      <Footer data={data} setData={setData} editing={editing} />
      <BackToTop />
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
  data,
  editing,
  onEditClick,
  theme,
  onToggleTheme,
}: {
  data: Data;
  editing: boolean;
  onEditClick: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    { href: "#services", label: "Services" },
    { href: "#technologies", label: "Tech" },
    { href: "#projects", label: "Projects" },
    { href: "#pricing", label: "Pricing" },
    { href: "#about", label: "Founder" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact" },
  ];
  return (
    <header
      className={
        "sticky top-0 z-40 w-full transition-all " +
        (scrolled
          ? "border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent")
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <a href="#top" className="flex items-center gap-2.5">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-white/15 bg-white/[0.04]">
            <img src={logoAsset.url} alt={data.brandName} className="h-full w-full object-contain p-1" />
          </div>
          <div className="flex flex-col leading-tight">
            <span
              className="text-sm font-semibold tracking-tight text-white"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              {data.brandName}
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">
              {data.brandTagline}
            </span>
          </div>
        </a>
        <nav className="hidden gap-7 text-sm text-white/65 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="hidden rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2 text-xs font-semibold text-black shadow-[0_0_20px_-4px_rgba(16,185,129,0.6)] transition hover:brightness-110 md:inline-flex"
          >
            Hire Us
          </a>
          <button
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
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
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 lg:hidden"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
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
  return (
    <section id="top" className="relative z-10 overflow-hidden">
      {/* Animated background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[120px]" />
        <div className="absolute right-[-10%] top-[20%] h-[420px] w-[420px] rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="absolute left-[-10%] bottom-[-10%] h-[420px] w-[420px] rounded-full bg-violet-500/10 blur-[120px]" />
      </div>
      {/* Floating tech icons */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
        {[
          { Icon: Code2, top: "18%", left: "8%", d: 0 },
          { Icon: Database, top: "70%", left: "12%", d: 0.6 },
          { Icon: Brain, top: "26%", right: "10%", d: 0.3 },
          { Icon: BarChart3, top: "72%", right: "8%", d: 0.9 },
          { Icon: Cpu, top: "48%", left: "5%", d: 1.2 },
          { Icon: Sparkles, top: "40%", right: "6%", d: 1.5 },
        ].map(({ Icon, top, left, right, d }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.35, y: [0, -14, 0] }}
            transition={{ duration: 6, delay: d, repeat: Infinity, ease: "easeInOut" }}
            className="absolute text-emerald-300/50"
            style={{ top, left, right }}
          >
            <Icon size={28} />
          </motion.div>
        ))}
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-28 pt-16 md:pt-24 text-center">
        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="mb-8 flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 backdrop-blur-sm"
        >
          <div className="relative h-7 w-7 overflow-hidden rounded-md">
            <img src={logoAsset.url} alt={data.brandName} className="h-full w-full object-contain" />
          </div>
          <EditableText
            value={data.brandName}
            onChange={(v) => setData((d) => ({ ...d, brandName: v }))}
            editing={editing}
            className="text-sm font-semibold tracking-tight text-white"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          />
          <span className="h-3 w-px bg-white/20" />
          <EditableText
            value={data.brandTagline}
            onChange={(v) => setData((d) => ({ ...d, brandTagline: v }))}
            editing={editing}
            className="text-[11px] uppercase tracking-[0.18em] text-white/60"
          />
        </motion.div>

        {/* Big logo (mobile-friendly) */}
        <motion.img
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          src={logoAsset.url}
          alt={data.brandName}
          className="mb-8 h-28 w-28 object-contain drop-shadow-[0_0_40px_rgba(16,185,129,0.35)] md:h-36 md:w-36"
        />

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl text-[clamp(2.4rem,6.5vw,4.75rem)] font-bold leading-[1.02] tracking-tight text-white"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          {editing ? (
            <EditableText
              value={data.heroHeadline}
              onChange={(v) => setData((d) => ({ ...d, heroHeadline: v }))}
              editing={editing}
              multiline
              className="text-3xl"
            />
          ) : (
            <>
              Building{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
                {data.heroHeadline.replace(/^Building\s+/i, "")}
              </span>
            </>
          )}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg"
        >
          <EditableText
            value={data.heroSubtitle}
            onChange={(v) => setData((d) => ({ ...d, heroSubtitle: v }))}
            editing={editing}
            multiline
            as="p"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3 text-sm font-semibold text-black shadow-[0_10px_40px_-10px_rgba(16,185,129,0.7)] transition hover:brightness-110"
          >
            <EditableText value={data.ctaPrimary} onChange={(v) => setData((d) => ({ ...d, ctaPrimary: v }))} editing={editing} />
            <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
          </a>
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-white/[0.06]"
          >
            <EditableText value={data.ctaSecondary} onChange={(v) => setData((d) => ({ ...d, ctaSecondary: v }))} editing={editing} />
          </a>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.02] px-6 py-3 text-sm font-medium text-white/85 transition hover:border-white/30 hover:text-white"
          >
            <DollarSign size={15} />
            <EditableText value={data.ctaQuote} onChange={(v) => setData((d) => ({ ...d, ctaQuote: v }))} editing={editing} />
          </a>
          <a
            href={`mailto:${data.email}?subject=Consultation%20request`}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.02] px-6 py-3 text-sm font-medium text-white/85 transition hover:border-white/30 hover:text-white"
          >
            <MessageCircle size={15} />
            <EditableText value={data.ctaBook} onChange={(v) => setData((d) => ({ ...d, ctaBook: v }))} editing={editing} />
          </a>
        </motion.div>

        {/* Trust chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-white/40"
        >
          <span className="flex items-center gap-1.5"><ShieldCheck size={13} /> Secure</span>
          <span className="flex items-center gap-1.5"><Zap size={13} /> Fast Delivery</span>
          <span className="flex items-center gap-1.5"><Award size={13} /> Modern Solutions</span>
          <span className="flex items-center gap-1.5"><Globe size={13} /> Remote-first</span>
        </motion.div>
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
  const avatarRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [cvBusy, setCvBusy] = useState(false);

  const onPickAvatar = async (file: File) => {
    setBusy(true);
    const ref = await uploadFile(file, "avatars");
    setBusy(false);
    if (ref) setData((d) => ({ ...d, avatar: ref.url }));
  };
  const onPickCv = async (file: File) => {
    setCvBusy(true);
    const ref = await uploadFile(file, "cv");
    setCvBusy(false);
    if (ref) setData((d) => ({ ...d, cv: { name: ref.name, url: ref.url } }));
  };

  return (
    <section id="about" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <SectionLabel n="§ 01" label="meet the founder" />
      <div className="grid gap-10 md:grid-cols-[auto,1fr] md:gap-14">
        <div className="flex flex-col items-start gap-4">
          <div className="relative h-40 w-40 overflow-hidden rounded-3xl border border-white/15 bg-white/[0.04] shadow-[0_20px_60px_-20px_rgba(16,185,129,0.35)] md:h-48 md:w-48">
            {data.avatar ? (
              <img src={data.avatar} alt={data.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-white/40">
                {data.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
              </div>
            )}
          </div>
          <div className="text-left">
            <EditableText
              value={data.name}
              onChange={(v) => setData((d) => ({ ...d, name: v }))}
              editing={editing}
              className="block text-lg font-semibold text-white"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            />
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">Founder · PC Nexus</p>
          </div>
          {editing && (
            <div className="flex flex-wrap gap-2">
              <button onClick={() => avatarRef.current?.click()} disabled={busy} className="flex items-center gap-1 rounded-full border border-emerald-400/40 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-400/10 disabled:opacity-50">
                <Upload size={12} /> {busy ? "Uploading…" : data.avatar ? "Change photo" : "Upload photo"}
              </button>
              {data.avatar && (
                <button onClick={() => setData((d) => ({ ...d, avatar: "" }))} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60 hover:bg-white/5">Remove</button>
              )}
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onPickAvatar(f); e.target.value = ""; }} />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {data.cv && <SecureViewer file={data.cv} label="View CV" />}
            {editing && (
              <>
                <button onClick={() => cvRef.current?.click()} disabled={cvBusy} className="rounded-full border border-emerald-400/40 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-400/10 disabled:opacity-50">
                  {cvBusy ? "Uploading…" : data.cv ? "Change CV" : "Upload CV"}
                </button>
                {data.cv && (
                  <LockToggle locked={data.cv.locked !== false} onChange={(next) => setData((d) => (d.cv ? { ...d, cv: { ...d.cv, locked: next } } : d))} />
                )}
                {data.cv && (
                  <button onClick={() => setData((d) => ({ ...d, cv: null }))} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60 hover:bg-white/5">Remove</button>
                )}
                <input ref={cvRef} type="file" accept="application/pdf,image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onPickCv(f); e.target.value = ""; }} />
              </>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            The mind behind <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">PC Nexus</span>.
          </h2>
          <div className="space-y-4 text-white/75 md:text-lg">
            <EditableText value={data.about1} onChange={(v) => setData((d) => ({ ...d, about1: v }))} editing={editing} multiline as="p" />
            <EditableText value={data.about2} onChange={(v) => setData((d) => ({ ...d, about2: v }))} editing={editing} multiline as="p" />
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href={`mailto:${data.email}`} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-xs text-white/85 hover:border-white/30 hover:bg-white/[0.06]"><Mail size={13} /> Email</a>
            <a href={data.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-xs text-white/85 hover:border-white/30 hover:bg-white/[0.06]"><Linkedin size={13} /> LinkedIn</a>
            <a href={data.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-xs text-white/85 hover:border-white/30 hover:bg-white/[0.06]"><Github size={13} /> GitHub</a>
          </div>
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
                    <LockToggle
                      locked={p.file.locked !== false}
                      onChange={(next) =>
                        updateProject(i, { file: { ...p.file!, locked: next } })
                      }
                    />
                  )}
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
                      <LockToggle
                        locked={c.file.locked !== false}
                        onChange={(next) =>
                          updateCert(i, { file: { ...c.file!, locked: next } })
                        }
                      />
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
            className="contact-modal-panel relative w-full max-w-md overflow-hidden rounded-2xl border border-emerald-400/30 bg-[#0d1612] p-7 shadow-[0_20px_80px_-20px_rgba(16,185,129,0.4)]"
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

// ============================================================
// ==============  PC NEXUS COMPANY SECTIONS  =================
// ============================================================

// ---------- Small helpers ----------

function SectionHeader({
  eyebrow,
  title,
  description,
  onEyebrow,
  onTitle,
  onDescription,
  editing,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description: string;
  onEyebrow?: (v: string) => void;
  onTitle?: (v: string) => void;
  onDescription?: (v: string) => void;
  editing: boolean;
  align?: "center" | "left";
}) {
  return (
    <div className={"mb-14 " + (align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl")}>
      <div className={"inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/[0.06] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-300"}>
        <Sparkles size={11} />
        {editing && onEyebrow ? (
          <EditableText value={eyebrow} onChange={onEyebrow} editing={editing} className="bg-transparent text-emerald-300" />
        ) : (
          <span>{eyebrow}</span>
        )}
      </div>
      <h2
        className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl"
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        {editing && onTitle ? (
          <EditableText value={title} onChange={onTitle} editing={editing} multiline className="text-2xl w-full" />
        ) : (
          title
        )}
      </h2>
      {(description || editing) && (
        <div className="mt-4 text-white/65 md:text-lg">
          {editing && onDescription ? (
            <EditableText value={description} onChange={onDescription} editing={editing} multiline as="p" />
          ) : (
            <p>{description}</p>
          )}
        </div>
      )}
    </div>
  );
}

function IconPicker({ value, onChange }: { value: IconName; onChange: (v: IconName) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as IconName)}
      className="rounded-md border border-emerald-400/40 bg-black px-2 py-1 text-xs text-emerald-200"
    >
      {ICON_NAMES.map((n) => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>
  );
}

function AddRemoveBar({
  onAdd,
  onRemove,
  addLabel = "Add item",
}: {
  onAdd: () => void;
  onRemove?: () => void;
  addLabel?: string;
}) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <button onClick={onAdd} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-xs font-medium text-emerald-200 hover:bg-emerald-400/20">
        <Plus size={12} /> {addLabel}
      </button>
      {onRemove && (
        <button onClick={onRemove} className="inline-flex items-center gap-1.5 rounded-full border border-red-400/40 bg-red-400/10 px-4 py-2 text-xs font-medium text-red-200 hover:bg-red-400/20">
          <Trash2 size={12} /> Remove last
        </button>
      )}
    </div>
  );
}

// ---------- 02 Services ----------

function Services({ data, setData, editing }: { data: Data; setData: (u: (d: Data) => Data) => void; editing: boolean }) {
  const updateService = (i: number, patch: Partial<Service>) =>
    setData((d) => ({ ...d, services: d.services.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) }));
  const addService = () =>
    setData((d) => ({ ...d, services: [...d.services, { icon: "Sparkles", title: "New Service", description: "Describe the service.", features: ["Feature 1"] }] }));
  const removeService = (i: number) =>
    setData((d) => ({ ...d, services: d.services.filter((_, idx) => idx !== i) }));

  return (
    <section id="services" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <SectionHeader
        eyebrow="§ 02 · Services"
        title={data.servicesTitle}
        description={data.servicesDescription}
        onEyebrow={undefined}
        onTitle={(v) => setData((d) => ({ ...d, servicesTitle: v }))}
        onDescription={(v) => setData((d) => ({ ...d, servicesDescription: v }))}
        editing={editing}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {data.services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition hover:border-emerald-400/40"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 opacity-0 blur-3xl transition group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
                <DynIcon name={s.icon} size={22} />
              </div>
              {editing && <div className="mb-2"><IconPicker value={s.icon} onChange={(v) => updateService(i, { icon: v })} /></div>}
              <h3 className="mb-2 text-lg font-semibold text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                <EditableText value={s.title} onChange={(v) => updateService(i, { title: v })} editing={editing} />
              </h3>
              <div className="mb-4 text-sm text-white/65">
                <EditableText value={s.description} onChange={(v) => updateService(i, { description: v })} editing={editing} multiline as="p" />
              </div>
              <ul className="space-y-1.5 text-xs text-white/70">
                {s.features.map((f, fi) => (
                  <li key={fi} className="flex items-start gap-2">
                    <Check size={12} className="mt-0.5 shrink-0 text-emerald-300" />
                    {editing ? (
                      <div className="flex flex-1 items-center gap-1">
                        <EditableText value={f} onChange={(v) => updateService(i, { features: s.features.map((x, xi) => xi === fi ? v : x) })} editing={editing} className="flex-1 text-xs" />
                        <button onClick={() => updateService(i, { features: s.features.filter((_, xi) => xi !== fi) })} className="text-red-300"><X size={11} /></button>
                      </div>
                    ) : (
                      <span>{f}</span>
                    )}
                  </li>
                ))}
              </ul>
              {editing && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => updateService(i, { features: [...s.features, "New feature"] })} className="rounded-full border border-emerald-400/40 px-2 py-0.5 text-[10px] text-emerald-300">+ feature</button>
                  <button onClick={() => removeService(i)} className="rounded-full border border-red-400/40 px-2 py-0.5 text-[10px] text-red-300">remove card</button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      {editing && <AddRemoveBar onAdd={addService} addLabel="Add service" />}
    </section>
  );
}

// ---------- 03 Why Choose (animated counters) ----------

function useCounter(target: number, active: boolean, duration = 1200) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.floor(p * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return n;
}

function StatCard({ stat, editing, onChange, onRemove }: { stat: Stat; editing: boolean; onChange: (p: Partial<Stat>) => void; onRemove: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const numeric = parseInt(stat.value.replace(/[^0-9]/g, ""), 10) || 0;
  const nonNumeric = /^[a-zA-Z]/.test(stat.value);
  const n = useCounter(numeric, visible);
  return (
    <div ref={ref} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center backdrop-blur-sm transition hover:border-emerald-400/40">
      <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
        <DynIcon name={stat.icon} size={22} />
      </div>
      {editing && <div className="mb-2"><IconPicker value={stat.icon} onChange={(v) => onChange({ icon: v })} /></div>}
      <div className="text-4xl font-bold tracking-tight text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
        {editing ? (
          <EditableText value={stat.value} onChange={(v) => onChange({ value: v })} editing={editing} className="w-24 text-center text-2xl" />
        ) : (
          <>
            {nonNumeric ? stat.value : n}
            {stat.suffix && <span className="text-emerald-300">{stat.suffix}</span>}
          </>
        )}
      </div>
      {editing && (
        <EditableText value={stat.suffix || ""} onChange={(v) => onChange({ suffix: v })} editing={editing} placeholder="suffix" className="mt-1 w-16 text-center text-xs" />
      )}
      <div className="mt-2 text-sm text-white/60">
        <EditableText value={stat.label} onChange={(v) => onChange({ label: v })} editing={editing} />
      </div>
      {editing && (
        <button onClick={onRemove} className="mt-3 text-[10px] text-red-300">remove</button>
      )}
    </div>
  );
}

function WhyChoose({ data, setData, editing }: { data: Data; setData: (u: (d: Data) => Data) => void; editing: boolean }) {
  const update = (i: number, p: Partial<Stat>) =>
    setData((d) => ({ ...d, stats: d.stats.map((s, idx) => idx === i ? { ...s, ...p } : s) }));
  return (
    <section id="why" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <SectionHeader
        eyebrow="§ 03 · Why us"
        title={data.whyTitle}
        description={data.whyDescription}
        onTitle={(v) => setData((d) => ({ ...d, whyTitle: v }))}
        onDescription={(v) => setData((d) => ({ ...d, whyDescription: v }))}
        editing={editing}
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {data.stats.map((s, i) => (
          <StatCard key={i} stat={s} editing={editing} onChange={(p) => update(i, p)} onRemove={() => setData((d) => ({ ...d, stats: d.stats.filter((_, idx) => idx !== i) }))} />
        ))}
      </div>
      {editing && (
        <AddRemoveBar
          onAdd={() => setData((d) => ({ ...d, stats: [...d.stats, { icon: "Star", value: "10", suffix: "+", label: "New stat" }] }))}
          addLabel="Add stat"
        />
      )}
    </section>
  );
}

// ---------- 05 Technologies ----------

function Technologies({ data, setData, editing }: { data: Data; setData: (u: (d: Data) => Data) => void; editing: boolean }) {
  return (
    <section id="technologies" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <SectionHeader
        eyebrow="§ 05 · Stack"
        title={data.techTitle}
        description={data.techDescription}
        onTitle={(v) => setData((d) => ({ ...d, techTitle: v }))}
        onDescription={(v) => setData((d) => ({ ...d, techDescription: v }))}
        editing={editing}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {data.technologies.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.03 }}
            whileHover={{ y: -4, scale: 1.03 }}
            className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition hover:border-emerald-400/40 hover:bg-emerald-400/[0.04]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 transition group-hover:scale-110">
              <DynIcon name={t.icon} size={18} />
            </div>
            <div className="min-w-0 flex-1">
              {editing ? (
                <>
                  <EditableText value={t.name} onChange={(v) => setData((d) => ({ ...d, technologies: d.technologies.map((x, xi) => xi === i ? { ...x, name: v } : x) }))} editing={editing} className="w-full text-sm" />
                  <IconPicker value={t.icon} onChange={(v) => setData((d) => ({ ...d, technologies: d.technologies.map((x, xi) => xi === i ? { ...x, icon: v } : x) }))} />
                  <button onClick={() => setData((d) => ({ ...d, technologies: d.technologies.filter((_, xi) => xi !== i) }))} className="mt-1 text-[10px] text-red-300">remove</button>
                </>
              ) : (
                <span className="block truncate text-sm font-medium text-white">{t.name}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      {editing && (
        <AddRemoveBar onAdd={() => setData((d) => ({ ...d, technologies: [...d.technologies, { name: "New tech", icon: "Code2" }] }))} addLabel="Add technology" />
      )}
    </section>
  );
}

// ---------- 06 Process ----------

function Process({ data, setData, editing }: { data: Data; setData: (u: (d: Data) => Data) => void; editing: boolean }) {
  return (
    <section id="process" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <SectionHeader
        eyebrow="§ 06 · Process"
        title={data.processTitle}
        description={data.processDescription}
        onTitle={(v) => setData((d) => ({ ...d, processTitle: v }))}
        onDescription={(v) => setData((d) => ({ ...d, processDescription: v }))}
        editing={editing}
      />
      <div className="relative">
        <div aria-hidden className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-emerald-400/40 via-white/10 to-transparent md:block" />
        <div className="grid gap-4 md:grid-cols-1">
          {data.process.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="group relative flex gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition hover:border-emerald-400/40"
            >
              <div className="relative shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
                  <DynIcon name={p.icon} size={20} />
                </div>
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-bold text-black">{i + 1}</span>
              </div>
              <div className="flex-1">
                {editing && <div className="mb-1"><IconPicker value={p.icon} onChange={(v) => setData((d) => ({ ...d, process: d.process.map((x, xi) => xi === i ? { ...x, icon: v } : x) }))} /></div>}
                <h3 className="font-semibold text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  <EditableText value={p.title} onChange={(v) => setData((d) => ({ ...d, process: d.process.map((x, xi) => xi === i ? { ...x, title: v } : x) }))} editing={editing} />
                </h3>
                <div className="mt-1 text-sm text-white/65">
                  <EditableText value={p.description} onChange={(v) => setData((d) => ({ ...d, process: d.process.map((x, xi) => xi === i ? { ...x, description: v } : x) }))} editing={editing} multiline as="p" />
                </div>
                {editing && (
                  <button onClick={() => setData((d) => ({ ...d, process: d.process.filter((_, xi) => xi !== i) }))} className="mt-2 text-[10px] text-red-300">remove step</button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {editing && (
        <AddRemoveBar onAdd={() => setData((d) => ({ ...d, process: [...d.process, { icon: "Sparkles", title: "New step", description: "Describe this step." }] }))} addLabel="Add step" />
      )}
    </section>
  );
}

// ---------- 08 Pricing ----------

function Pricing({ data, setData, editing }: { data: Data; setData: (u: (d: Data) => Data) => void; editing: boolean }) {
  const update = (i: number, p: Partial<PricingTier>) =>
    setData((d) => ({ ...d, pricing: d.pricing.map((t, xi) => xi === i ? { ...t, ...p } : t) }));
  return (
    <section id="pricing" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <SectionHeader
        eyebrow="§ 08 · Pricing"
        title={data.pricingTitle}
        description={data.pricingDescription}
        onTitle={(v) => setData((d) => ({ ...d, pricingTitle: v }))}
        onDescription={(v) => setData((d) => ({ ...d, pricingDescription: v }))}
        editing={editing}
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {data.pricing.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            whileHover={{ y: -6 }}
            className={
              "relative flex flex-col overflow-hidden rounded-3xl border p-7 backdrop-blur-sm transition " +
              (t.featured
                ? "border-emerald-400/60 bg-gradient-to-b from-emerald-400/[0.08] to-transparent shadow-[0_20px_60px_-20px_rgba(16,185,129,0.4)]"
                : "border-white/10 bg-white/[0.03] hover:border-white/25")
            }
          >
            {t.featured && (
              <div className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
                <Star size={10} /> Most popular
              </div>
            )}
            <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              <EditableText value={t.name} onChange={(v) => update(i, { name: v })} editing={editing} />
            </h3>
            <div className="mt-2 text-sm text-white/60">
              <EditableText value={t.description} onChange={(v) => update(i, { description: v })} editing={editing} multiline as="p" />
            </div>
            <div className="mt-5 flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                <EditableText value={t.price} onChange={(v) => update(i, { price: v })} editing={editing} className="w-28" />
              </span>
              <span className="text-xs uppercase tracking-wider text-white/50">
                <EditableText value={t.period} onChange={(v) => update(i, { period: v })} editing={editing} />
              </span>
            </div>
            <ul className="mt-6 flex-1 space-y-2 text-sm text-white/75">
              {t.features.map((f, fi) => (
                <li key={fi} className="flex items-start gap-2">
                  <Check size={14} className="mt-0.5 shrink-0 text-emerald-300" />
                  {editing ? (
                    <div className="flex flex-1 items-center gap-1">
                      <EditableText value={f} onChange={(v) => update(i, { features: t.features.map((x, xi) => xi === fi ? v : x) })} editing={editing} className="flex-1 text-sm" />
                      <button onClick={() => update(i, { features: t.features.filter((_, xi) => xi !== fi) })} className="text-red-300"><X size={11} /></button>
                    </div>
                  ) : (
                    <span>{f}</span>
                  )}
                </li>
              ))}
              {editing && (
                <li>
                  <button onClick={() => update(i, { features: [...t.features, "New feature"] })} className="text-[11px] text-emerald-300">+ add feature</button>
                </li>
              )}
            </ul>
            {editing && (
              <label className="mt-4 flex items-center gap-2 text-[11px] text-white/60">
                <input type="checkbox" checked={!!t.featured} onChange={(e) => update(i, { featured: e.target.checked })} /> featured
              </label>
            )}
            <a
              href="#contact"
              className={
                "mt-6 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition " +
                (t.featured
                  ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-black hover:brightness-110"
                  : "border border-white/20 bg-white/[0.03] text-white hover:border-white/40 hover:bg-white/[0.06]")
              }
            >
              <EditableText value={t.cta} onChange={(v) => update(i, { cta: v })} editing={editing} />
              <ArrowRight size={14} />
            </a>
            {editing && (
              <button onClick={() => setData((d) => ({ ...d, pricing: d.pricing.filter((_, xi) => xi !== i) }))} className="mt-2 text-[10px] text-red-300">remove tier</button>
            )}
          </motion.div>
        ))}
      </div>
      {editing && (
        <AddRemoveBar onAdd={() => setData((d) => ({ ...d, pricing: [...d.pricing, { name: "New tier", price: "$0", period: "one-time", description: "Describe.", features: ["Feature 1"], cta: "Get started" }] }))} addLabel="Add pricing tier" />
      )}
    </section>
  );
}

// ---------- 09 Testimonials ----------

function Testimonials({ data, setData, editing }: { data: Data; setData: (u: (d: Data) => Data) => void; editing: boolean }) {
  const update = (i: number, p: Partial<Testimonial>) =>
    setData((d) => ({ ...d, testimonials: d.testimonials.map((t, xi) => xi === i ? { ...t, ...p } : t) }));
  return (
    <section id="testimonials" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <SectionHeader
        eyebrow="§ 09 · Testimonials"
        title={data.testimonialsTitle}
        description={data.testimonialsDescription}
        onTitle={(v) => setData((d) => ({ ...d, testimonialsTitle: v }))}
        onDescription={(v) => setData((d) => ({ ...d, testimonialsDescription: v }))}
        editing={editing}
      />
      {data.testimonials.length === 0 ? (
        <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center">
          <Quote size={28} className="mx-auto mb-3 text-emerald-300/70" />
          <p className="text-sm text-white/60">
            Testimonials from clients we've worked with will appear here.
            {editing && " Add the first one below."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
            >
              <Quote size={22} className="mb-3 text-emerald-300/70" />
              <div className="mb-4 text-sm leading-relaxed text-white/80">
                <EditableText value={t.quote} onChange={(v) => update(i, { quote: v })} editing={editing} multiline as="p" />
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, si) => (
                  <Star key={si} size={12} className={si < t.rating ? "fill-emerald-300 text-emerald-300" : "text-white/20"} />
                ))}
              </div>
              {editing && (
                <input type="number" min={1} max={5} value={t.rating} onChange={(e) => update(i, { rating: parseInt(e.target.value) || 5 })} className="mb-2 w-16 rounded border border-white/20 bg-black px-2 py-1 text-xs text-white" />
              )}
              <div className="text-sm font-semibold text-white">
                <EditableText value={t.name} onChange={(v) => update(i, { name: v })} editing={editing} />
              </div>
              <div className="text-xs text-white/50">
                <EditableText value={t.role} onChange={(v) => update(i, { role: v })} editing={editing} />
              </div>
              {editing && (
                <button onClick={() => setData((d) => ({ ...d, testimonials: d.testimonials.filter((_, xi) => xi !== i) }))} className="mt-2 text-[10px] text-red-300">remove</button>
              )}
            </motion.div>
          ))}
        </div>
      )}
      {editing && (
        <AddRemoveBar onAdd={() => setData((d) => ({ ...d, testimonials: [...d.testimonials, { name: "Client Name", role: "Role · Company", quote: "PC Nexus delivered beyond expectations.", rating: 5 }] }))} addLabel="Add testimonial" />
      )}
    </section>
  );
}

// ---------- 11 FAQ ----------

function FAQSection({ data, setData, editing }: { data: Data; setData: (u: (d: Data) => Data) => void; editing: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  const update = (i: number, p: Partial<FAQ>) =>
    setData((d) => ({ ...d, faqs: d.faqs.map((f, xi) => xi === i ? { ...f, ...p } : f) }));
  return (
    <section id="faq" className="relative z-10 mx-auto max-w-4xl px-6 py-24">
      <SectionHeader
        eyebrow="§ 11 · FAQ"
        title={data.faqTitle}
        description={data.faqDescription}
        onTitle={(v) => setData((d) => ({ ...d, faqTitle: v }))}
        onDescription={(v) => setData((d) => ({ ...d, faqDescription: v }))}
        editing={editing}
      />
      <div className="space-y-3">
        {data.faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition hover:border-white/20">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="flex flex-1 items-start gap-3 text-sm font-medium text-white md:text-base">
                  <HelpCircle size={16} className="mt-0.5 shrink-0 text-emerald-300" />
                  {editing ? (
                    <EditableText value={f.q} onChange={(v) => update(i, { q: v })} editing={editing} className="flex-1" />
                  ) : (
                    <span>{f.q}</span>
                  )}
                </span>
                <ChevronDown size={16} className={"shrink-0 text-white/50 transition-transform " + (isOpen ? "rotate-180" : "")} />
              </button>
              <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 pl-14 text-sm leading-relaxed text-white/70">
                  <EditableText value={f.a} onChange={(v) => update(i, { a: v })} editing={editing} multiline as="p" />
                  {editing && (
                    <button onClick={() => setData((d) => ({ ...d, faqs: d.faqs.filter((_, xi) => xi !== i) }))} className="mt-2 text-[10px] text-red-300">remove</button>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
      {editing && (
        <AddRemoveBar onAdd={() => setData((d) => ({ ...d, faqs: [...d.faqs, { q: "New question?", a: "Answer here." }] }))} addLabel="Add FAQ" />
      )}
    </section>
  );
}

// ---------- 13 Footer ----------

function Footer({ data, setData, editing }: { data: Data; setData: (u: (d: Data) => Data) => void; editing: boolean }) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-white/10 bg-white/[0.02] backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04]">
                <img src={logoAsset.url} alt={data.brandName} className="h-full w-full object-contain p-1" />
              </div>
              <div>
                <div className="text-base font-semibold text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{data.brandName}</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">{data.brandTagline}</div>
              </div>
            </div>
            <div className="mt-4 max-w-sm text-sm text-white/60">
              <EditableText value={data.footerTagline} onChange={(v) => setData((d) => ({ ...d, footerTagline: v }))} editing={editing} multiline as="p" />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={`mailto:${data.email}`} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 hover:border-emerald-400/50 hover:text-emerald-300"><Mail size={14} /></a>
              <a href={data.linkedin} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 hover:border-emerald-400/50 hover:text-emerald-300"><Linkedin size={14} /></a>
              <a href={data.github} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 hover:border-emerald-400/50 hover:text-emerald-300"><Github size={14} /></a>
              <a href={`https://wa.me/${data.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 hover:border-emerald-400/50 hover:text-emerald-300"><MessageCircle size={14} /></a>
            </div>
          </div>
          {data.footerCols.map((col, ci) => (
            <div key={ci}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                <EditableText value={col.title} onChange={(v) => setData((d) => ({ ...d, footerCols: d.footerCols.map((c, xi) => xi === ci ? { ...c, title: v } : c) }))} editing={editing} />
              </h4>
              <ul className="space-y-2 text-sm">
                {col.links.map((l, li) => (
                  <li key={li} className="flex items-center gap-2">
                    <a href={l.href} className="text-white/60 hover:text-white">
                      {editing ? (
                        <EditableText value={l.label} onChange={(v) => setData((d) => ({ ...d, footerCols: d.footerCols.map((c, xi) => xi === ci ? { ...c, links: c.links.map((x, yi) => yi === li ? { ...x, label: v } : x) } : c) }))} editing={editing} className="text-sm" />
                      ) : l.label}
                    </a>
                    {editing && (
                      <input value={l.href} onChange={(e) => setData((d) => ({ ...d, footerCols: d.footerCols.map((c, xi) => xi === ci ? { ...c, links: c.links.map((x, yi) => yi === li ? { ...x, href: e.target.value } : x) } : c) }))} className="w-24 rounded border border-white/15 bg-black/40 px-1 py-0.5 text-[10px] text-white" />
                    )}
                    {editing && (
                      <button onClick={() => setData((d) => ({ ...d, footerCols: d.footerCols.map((c, xi) => xi === ci ? { ...c, links: c.links.filter((_, yi) => yi !== li) } : c) }))} className="text-[10px] text-red-300"><X size={10} /></button>
                    )}
                  </li>
                ))}
                {editing && (
                  <li>
                    <button onClick={() => setData((d) => ({ ...d, footerCols: d.footerCols.map((c, xi) => xi === ci ? { ...c, links: [...c.links, { label: "New link", href: "#" }] } : c) }))} className="text-[11px] text-emerald-300">+ link</button>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row">
          <div>© {year} {data.brandName}. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#top" className="inline-flex items-center gap-1 hover:text-white">Back to top <ArrowUp size={11} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ---------- Back to top ----------

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 text-black shadow-[0_10px_30px_-8px_rgba(16,185,129,0.6)] transition hover:brightness-110"
    >
      <ArrowUp size={18} />
    </motion.button>
  );
}
