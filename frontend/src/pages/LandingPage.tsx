import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  BookOpen,
  Briefcase,
  CheckCircle,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { ResultsPanel } from "@/components/ResultsPanel";
import { demoAnalyze, type AnalysisResult } from "@/lib/api";

// ─── Data ────────────────────────────────────────────────────────────────────

const EMPTY_ANALYSIS: AnalysisResult = {
  "Matching Skills": [],
  "Missing Skills": [],
  "Similar Job Titles": [],
  "Upskilling Resources": [],
};

const JANE_SKILLS = ["TypeScript", "React", "Node.js", "PostgreSQL", "REST APIs", "Docker", "Git", "Jest"];

// ─── LandingNav ──────────────────────────────────────────────────────────────

function LandingNav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 transition-all duration-200",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="flex items-center gap-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            Match<span className="text-blue-600">Me</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 sm:flex">
          <a href="#how-it-works" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
            How it works
          </a>
          <a href="#features" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
            Features
          </a>
          <a href="#demo" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
            Try demo
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/app")}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("/app")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
          >
            Get started free
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── HeroMockup ───────────────────────────────────────────────────────────────

function HeroMockup() {
  const circumference = 2 * Math.PI * 26;
  const dashOffset = circumference - 0.87 * circumference;

  return (
    <div className="relative w-full lg:w-[54%] lg:self-end">
      {/* Glow */}
      <div className="absolute -inset-6 rounded-full bg-blue-500/15 blur-3xl" aria-hidden />

      <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-2xl">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1 rounded-md bg-white px-3 py-1 text-center text-xs text-slate-400 shadow-sm">
            matchme.app/analyze
          </div>
        </div>

        {/* App content */}
        <div className="bg-slate-50 p-5">
          {/* Score card */}
          <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50 px-4 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">CV Match Score</p>
            </div>
            <div className="flex items-center gap-5 p-4">
              {/* Mini ring */}
              <div className="relative h-16 w-16 shrink-0">
                <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  <circle
                    cx="32" cy="32" r="26" fill="none"
                    stroke="#059669" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-slate-900">87%</div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-extrabold text-slate-900">87%</p>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Strong Match</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">7 matching · 3 missing skills</p>
              </div>
            </div>
          </div>

          {/* Result grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-100">
                  <CheckCircle className="h-3 w-3 text-emerald-600" />
                </span>
                <span className="text-[11px] font-semibold text-emerald-800">Matching Skills</span>
                <span className="ml-auto text-[11px] font-bold text-emerald-600">7</span>
              </div>
              <div className="flex flex-wrap gap-1 p-2.5">
                {["TypeScript", "React", "Node.js", "Docker"].map((s) => (
                  <span key={s} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800">{s}</span>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-rose-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 bg-rose-50 px-3 py-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-rose-100">
                  <AlertTriangle className="h-3 w-3 text-rose-600" />
                </span>
                <span className="text-[11px] font-semibold text-rose-800">Missing Skills</span>
                <span className="ml-auto text-[11px] font-bold text-rose-600">3</span>
              </div>
              <div className="flex flex-wrap gap-1 p-2.5">
                {["Go", "Kubernetes", "AWS"].map((s) => (
                  <span key={s} className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-800">{s}</span>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-sky-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 bg-sky-50 px-3 py-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-sky-100">
                  <Briefcase className="h-3 w-3 text-sky-600" />
                </span>
                <span className="text-[11px] font-semibold text-sky-800">Similar Roles</span>
              </div>
              <div className="flex flex-wrap gap-1 p-2.5">
                {["Full Stack Eng.", "Software Eng. II"].map((s) => (
                  <span key={s} className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-800">{s}</span>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-amber-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 bg-amber-50 px-3 py-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-100">
                  <BookOpen className="h-3 w-3 text-amber-600" />
                </span>
                <span className="text-[11px] font-semibold text-amber-800">Upskilling</span>
              </div>
              <div className="flex flex-wrap gap-1 p-2.5">
                {["AWS Certified Dev", "K8s Fundamentals"].map((s) => (
                  <span key={s} className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HeroSection ─────────────────────────────────────────────────────────────

function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
        aria-hidden
      />
      {/* Radial glow */}
      <div className="absolute left-1/4 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-0 sm:px-6 lg:px-8 lg:pt-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">

          {/* Left: copy */}
          <div className="flex-1 pb-12 lg:pb-20 lg:pt-4">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              <span className="text-xs font-semibold text-blue-300">
                AI-powered · Free to start
              </span>
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
              Land more interviews
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                with AI matching.
              </span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-400">
              Paste any job description. MatchMe instantly compares it against your CV,
              surfaces every skill gap, and tells you exactly how to close it — before you apply.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate("/app")}
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 hover:shadow-blue-500/40"
              >
                Get started free →
              </button>
              <a
                href="#demo"
                className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition-all hover:border-slate-500 hover:text-white"
              >
                Try the live demo
              </a>
            </div>

            {/* Trust bar */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
              {["No credit card required", "30-second analysis", "Free forever plan"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: product mockup */}
          <HeroMockup />
        </div>
      </div>
    </section>
  );
}

// ─── StatsSection ─────────────────────────────────────────────────────────────

const STATS = [
  { value: "75%",   label: "of CVs filtered by ATS before a human sees them",      color: "text-rose-600" },
  { value: "6 sec", label: "average recruiter review time per application",         color: "text-amber-600" },
  { value: "250+",  label: "candidates apply for every single job posting",         color: "text-blue-600" },
  { value: "3×",    label: "higher interview rate with a tailored, matched CV",     color: "text-emerald-600" },
];

function StatsSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            The job market in numbers
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            The odds are stacked against you. Until now.
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map(({ value, label, color }) => (
            <div key={value} className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center shadow-sm">
              <p className={`text-4xl font-extrabold tabular-nums sm:text-5xl ${color}`}>{value}</p>
              <p className="mt-2.5 text-sm leading-snug text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HowItWorksSection ────────────────────────────────────────────────────────

const STEPS = [
  {
    number: "01",
    title: "Upload your CV",
    description: "Upload a PDF or DOCX once. We extract your skills and experience automatically.",
    color: "bg-blue-600",
    light: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    number: "02",
    title: "Paste any job description",
    description: "Found a role you want? Copy the full job posting and paste it into MatchMe.",
    color: "bg-emerald-600",
    light: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    number: "03",
    title: "See exactly where you stand",
    description: "AI surfaces matching skills, gaps, similar titles, and upskilling paths — in seconds.",
    color: "bg-rose-600",
    light: "bg-rose-50",
    text: "text-rose-600",
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-600">
            How it works
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Three steps. Thirty seconds.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-slate-500">
            No fluff. No jargon. Just a clear picture of where you stand.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Connector line */}
          <div
            className="absolute top-8 left-[calc(16.66%+2.5rem)] hidden w-[calc(66.66%-5rem)] border-t-2 border-dashed border-slate-300 md:block"
            aria-hidden
          />

          {STEPS.map(({ number, title, description, color, light, text }, i) => (
            <div key={number} className="relative flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${color} text-xl font-extrabold text-white shadow-lg`}>
                  {number}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="h-px flex-1 border-t-2 border-dashed border-slate-300 md:hidden" />
                )}
              </div>
              <div className={`rounded-2xl border border-transparent p-5 ${light}`}>
                <h3 className={`text-base font-bold ${text}`}>{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FeaturesSection ──────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Target,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "ATS Keyword Matching",
    description:
      "We compare your CV against every keyword and phrase modern ATS systems scan for — so you know exactly how you'll rank before the recruiter ever sees you.",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    title: "Skill Gap Analysis",
    description:
      "See a clear, prioritized breakdown of the skills you're missing. No guesswork — just a precise list of what to acquire to flip that rejection into an interview.",
  },
  {
    icon: BookOpen,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "Upskilling Roadmap",
    description:
      "Receive specific course and certification recommendations tailored to your gaps — so you know exactly what to study next to land the role you want.",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-600">
            What you get
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to stand out
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, iconBg, iconColor, title, description }) => (
            <div key={title} className="rounded-2xl border border-slate-100 bg-slate-50 p-7 shadow-sm transition-shadow hover:shadow-md">
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── DemoSection ──────────────────────────────────────────────────────────────

function DemoSection() {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult>(EMPTY_ANALYSIS);
  const [matchScore, setMatchScore] = useState(0);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    const trimmed = jobDescription.trim();
    if (!trimmed) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await demoAnalyze(trimmed);
      const matching = result["Matching Skills"].length;
      const missing = result["Missing Skills"].length;
      const total = matching + missing;
      setAnalysis(result);
      setMatchScore(total > 0 ? Math.round((matching / total) * 100) : 0);
      setHasAnalysis(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section id="demo" className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">

        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-600">
            Live demo
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Try it now — no account needed
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-slate-500">
            Paste any job description. We'll run it against our sample CV and show you the exact gaps in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">

          {/* Left: persona + input */}
          <div className="flex flex-col gap-5">
            {/* Persona card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Sample CV
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  JO
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Jane Okafor</p>
                  <p className="text-xs text-slate-500">Software Engineer · 4 yrs</p>
                </div>
              </div>
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {JANE_SKILLS.map((skill) => (
                  <span key={skill} className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {skill}
                  </span>
                ))}
              </div>
              <p className="mt-3.5 text-xs leading-relaxed text-slate-400">
                Mid-level full-stack engineer. No cloud certs, no Kubernetes, no Go —
                gaps emerge naturally from senior or DevOps roles.
              </p>
            </div>

            {/* Input */}
            <div className="flex flex-col gap-3">
              <label htmlFor="demo-job" className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Paste a job description
              </label>
              <textarea
                id="demo-job"
                rows={9}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder={"e.g.\n\nWe're looking for a Senior Backend Engineer. You'll design microservices in Go, deploy on Kubernetes, and build GraphQL APIs at scale…"}
                className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm leading-relaxed text-slate-900 placeholder-slate-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">{error}</div>
              )}
              <button
                onClick={() => void handleAnalyze()}
                disabled={isAnalyzing || !jobDescription.trim()}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                    </svg>
                    Analyzing…
                  </span>
                ) : (
                  "Analyze Match →"
                )}
              </button>
            </div>
          </div>

          {/* Right: results */}
          <div className="flex flex-col gap-4">
            <ResultsPanel
              analysis={analysis}
              matchScore={matchScore}
              hasAnalysis={hasAnalysis}
              isAnalyzing={isAnalyzing}
            />
            {hasAnalysis && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                <p className="text-sm font-bold text-blue-900">Ready to use your own CV?</p>
                <p className="mt-1 text-sm text-blue-700">
                  These results used our sample CV. Create a free account to upload yours and match any role you're applying for.
                </p>
                <button
                  onClick={() => navigate("/app")}
                  className="mt-3.5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700"
                >
                  Create free account →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CtaSection ───────────────────────────────────────────────────────────────

function CtaSection() {
  const navigate = useNavigate();
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 px-8 py-14 text-center shadow-2xl sm:px-16">
          {/* Decorative circles */}
          <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-white/5 blur-2xl" aria-hidden />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/5 blur-2xl" aria-hidden />

          <div className="relative">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-200">
              Get started today
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Stop guessing.
              <br />
              Start matching.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base text-blue-200">
              Upload your CV once. Analyze any role in seconds. Know exactly what to fix before you hit send.
            </p>
            <button
              onClick={() => navigate("/app")}
              className="mt-8 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-blue-700 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
            >
              Get started — it's free
            </button>
            <p className="mt-3 text-xs text-blue-300">No credit card. No CV required to sign up.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600">
              <Zap className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900">
              Match<span className="text-blue-600">Me</span>
            </span>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} MatchMe. All rights reserved.
          </p>
          <div className="flex gap-5">
            <a href="#how-it-works" className="text-xs text-slate-400 transition-colors hover:text-slate-700">How it works</a>
            <a href="#features" className="text-xs text-slate-400 transition-colors hover:text-slate-700">Features</a>
            <a href="#demo" className="text-xs text-slate-400 transition-colors hover:text-slate-700">Demo</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── LandingPage ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <DemoSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
