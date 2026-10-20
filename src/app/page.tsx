"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Database, 
  GitBranch, 
  CheckCircle2, 
  Info, 
  Download, 
  Activity, 
  ExternalLink,
  ChevronRight,
  Filter,
  ShieldCheck,
  Radio,
  Clock,
  Sparkles,
  Search,
  Compass,
  FileCheck,
  BookmarkPlus,
  Play,
  Share2,
  Users,
  CheckCircle,
  TrendingUp,
  BookOpen,
  Sliders,
  EyeOff
} from "lucide-react";
import { REPOSITORIES } from "@/data/nexusData";
import { getTrendingHypotheses } from "@/data/hypothesesData";
import HypothesisCard from "@/components/HypothesisCard";
import ClosingBanner from "@/components/ClosingBanner";

export default function DashboardPage() {
  const trendingLeads = getTrendingHypotheses();
  const [activeTab, setActiveTab] = useState<"ALL" | "CONFIDENCE" | "INVESTIGATION" | "VERIFIED">("ALL");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [savedHypotheses, setSavedHypotheses] = useState<string[]>([]);

  const toggleSave = (code: string) => {
    if (savedHypotheses.includes(code)) {
      setSavedHypotheses(savedHypotheses.filter(c => c !== code));
    } else {
      setSavedHypotheses([...savedHypotheses, code]);
    }
  };

  const recentDiscoveries = [
    {
      code: "HYP-2025-0841",
      category: "INVESTIGATION",
      statusBadge: "UNDER INVESTIGATION",
      badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
      headline: "Regions with higher defence expenditure growth show increased higher-education enrollment, followed by a decline in youth unemployment.",
      datasets: ["Defence Expenditure (SIPRI)", "Higher Education (UNESCO)", "Youth Employment (ILO)"],
      correlation: "0.64",
      metric2: "72% Temporal Alignment",
      metric3: "58% Spatial Coverage",
      time: "Discovered 2 hours ago",
      lead: "Dr. Elena Rostova reviewing preliminary regression models",
      actionHref: "/investigations",
      actionText: "Open Investigation Workspace",
    },
    {
      code: "HYP-2025-0619",
      category: "VERIFIED",
      statusBadge: "VERIFIED (PEER-REVIEWED)",
      badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
      subBadge: "Published in Nature Data",
      headline: "Urban PM2.5 particulate surge precedes acute respiratory inpatient admissions by 48 hours across 34 metro clusters.",
      datasets: ["Atmospheric PM2.5 (Copernicus)", "Clinical Emergency Visits (NHS/CDC)", "Census Demographics"],
      correlation: "0.63",
      metric2: "78% Temporal Sync",
      metric3: "94% Multi-site Consistency",
      time: "Replicated across 3 independent laboratory consortiums",
      lead: "DOI: 10.1038/s41597-025-0199",
      actionHref: "/evidence",
      actionText: "View Evidence Report",
    },
    {
      code: "HYP-2025-0902",
      category: "CONFIDENCE",
      statusBadge: "AI-GENERATED CANDIDATE",
      badgeColor: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20",
      headline: "Agricultural Nitrate Runoff correlates with regional autoimmune diagnosis shifts in rural groundwater basins.",
      datasets: ["USGS Hydrology (National Water Dashboard)", "CDC WONDER Public Health Queries"],
      correlation: "0.51",
      metric2: "Investigating Soil Type & Age Confounders",
      metric3: "Precipitation Lag +60d",
      time: "Proposed by NEXUS DeepSynthesizer v4.8",
      lead: "Needs Principal Investigator sign-off",
      actionHref: "/hypotheses",
      actionText: "Run Verification",
    },
  ];

  const filteredDiscoveries = recentDiscoveries.filter((d) => {
    if (activeTab === "INVESTIGATION") return d.category === "INVESTIGATION";
    if (activeTab === "VERIFIED") return d.category === "VERIFIED";
    if (activeTab === "CONFIDENCE") return d.category === "CONFIDENCE";
    return true;
  });

  return (
    <div className="w-full flex flex-col">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 py-8 sm:py-10 flex flex-col gap-10">
        
        {/* 1. HERO HEADER & DYNAMIC CROSS-DOMAIN AFFINITY GRAPH */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Editorial Callout */}
          <div className="lg:col-span-6 flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-mono-data text-xs shadow-sm border border-[var(--primary)]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-ping"></span>
              <span className="tracking-widest uppercase font-semibold text-[10px]">
                AI-Powered Public Data Research Platform
              </span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-5xl font-medium text-[var(--foreground)] tracking-tight max-w-xl leading-[1.12]">
              Discover connections hidden across the world&apos;s open data.
            </h1>

            <p className="font-sans text-sm sm:text-base text-[var(--foreground)]/75 max-w-xl leading-relaxed">
              Connect seemingly unrelated public datasets, uncover unexpected relationships, and turn them into verifiable hypotheses that scientists and researchers can rigorously investigate.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/hypotheses"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--primary)] text-[var(--on-primary)] text-xs font-semibold shadow-md hover:opacity-95 transition-all group tracking-wide"
              >
                <span>Discover Patterns</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/datasets"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--surface-lowest)] text-[var(--foreground)] text-xs font-semibold shadow-sm hover:bg-[var(--surface-high)] border border-[var(--outline-variant)]/60 transition-all tracking-wide"
              >
                <Compass className="w-4 h-4 text-[var(--secondary)]" />
                <span>Explore Datasets</span>
              </Link>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <div className="flex -space-x-2 items-center">
                {/* Avatar 1: Young female researcher / engineering student */}
                <div className="group relative z-10 hover:z-30 transition-all">
                  <Image
                    src="/avatars/fellow-1.jpg"
                    alt="Research fellow"
                    width={34}
                    height={34}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-[var(--surface-lowest)] shadow-sm hover:scale-110 hover:shadow-md transition-transform duration-200 cursor-pointer"
                  />
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-mono-data whitespace-nowrap shadow-md z-40">
                    Research Fellow
                  </div>
                </div>

                {/* Avatar 2: Young male researcher / data scientist */}
                <div className="group relative z-10 hover:z-30 transition-all">
                  <Image
                    src="/avatars/fellow-2.jpg"
                    alt="Data science researcher"
                    width={34}
                    height={34}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-[var(--surface-lowest)] shadow-sm hover:scale-110 hover:shadow-md transition-transform duration-200 cursor-pointer"
                  />
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-mono-data whitespace-nowrap shadow-md z-40">
                    Data Science Researcher
                  </div>
                </div>

                {/* Avatar 3: Young researcher / scientist */}
                <div className="group relative z-10 hover:z-30 transition-all">
                  <Image
                    src="/avatars/fellow-3.jpg"
                    alt="Environmental researcher"
                    width={34}
                    height={34}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-[var(--surface-lowest)] shadow-sm hover:scale-110 hover:shadow-md transition-transform duration-200 cursor-pointer"
                  />
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-mono-data whitespace-nowrap shadow-md z-40">
                    Environmental Researcher
                  </div>
                </div>
              </div>
              <span className="text-xs text-[var(--foreground)]/70 font-sans">
                Active investigation network by <strong className="text-[var(--foreground)]">842 peer-reviewed fellows</strong>
              </span>
            </div>
          </div>

          {/* Right Column: Dynamic Cross-Domain Affinity Graph */}
          <div className="lg:col-span-6 w-full">
            <div className="relative bg-[var(--surface-lowest)] rounded-2xl p-5 shadow-sm border border-[var(--outline-variant)]/50 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[var(--primary)]" />
                  <span className="font-mono-data text-xs uppercase tracking-wider text-[var(--foreground)] font-bold">
                    Dynamic Cross-Domain Affinity Graph
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--surface-container)] font-mono-data text-[10px] text-[var(--foreground)]/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Synthesizer
                </div>
              </div>

              {/* SVG Network Graph */}
              <div className="relative w-full aspect-[16/11] flex items-center justify-center bg-[var(--surface-low)]/50 rounded-xl overflow-hidden select-none border border-[var(--outline-variant)]/30">
                <svg className="w-full h-full" fill="none" viewBox="0 0 540 360" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient cx="50%" cy="50%" id="meshGlow" r="50%">
                      <stop offset="0%" stopColor="#0037b0" stopOpacity="0.16"></stop>
                      <stop offset="100%" stopColor="#0037b0" stopOpacity="0"></stop>
                    </radialGradient>
                  </defs>
                  <circle cx="270" cy="180" fill="url(#meshGlow)" r="160"></circle>

                  {/* Arcs */}
                  <g opacity="0.5" stroke="var(--outline-variant)" strokeDasharray="4 4" strokeWidth="1.2">
                    <path d="M 120 90 Q 270 180 420 100"></path>
                    <path d="M 120 90 Q 180 230 200 280"></path>
                    <path d="M 420 100 Q 370 200 360 270"></path>
                    <path d="M 200 280 Q 280 260 360 270"></path>
                    <path d="M 120 90 Q 260 80 440 210"></path>
                    <path d="M 80 190 Q 270 180 440 210"></path>
                  </g>

                  {/* Dynamic Solid Vector Lines */}
                  <g opacity="0.85" stroke="var(--primary)" strokeWidth="1.75">
                    <line x1="80" x2="270" y1="190" y2="180"></line>
                    <line x1="270" x2="420" y1="180" y2="100"></line>
                    <line x1="270" x2="360" y1="180" y2="270"></line>
                    <line x1="270" x2="120" y1="180" y2="90"></line>
                    <line x1="270" x2="200" y1="180" y2="280"></line>
                    <line x1="270" x2="440" y1="180" y2="210"></line>
                  </g>

                  {/* Center Hub: NEXUS CORE */}
                  <g className="cursor-pointer group">
                    <circle cx="270" cy="180" fill="var(--secondary-container)" r="24"></circle>
                    <circle cx="270" cy="180" fill="var(--primary)" r="14"></circle>
                    <text fill="var(--primary)" fontFamily="var(--font-jetbrains-mono)" fontSize="11" fontWeight="700" textAnchor="middle" x="270" y="218">
                      NEXUS CORE
                    </text>
                  </g>

                  {/* Node: Economy (OECD) */}
                  <g className="cursor-pointer transition-transform hover:scale-105" transform="translate(120, 90)">
                    <circle cx="0" cy="0" fill="var(--surface-lowest)" r="14" stroke="var(--primary)" strokeWidth="2"></circle>
                    <circle cx="0" cy="0" fill="var(--primary)" r="5"></circle>
                    <rect fill="var(--surface-container)" height="20" rx="4" width="88" x="-44" y="-32" stroke="var(--outline-variant)" strokeWidth="0.5"></rect>
                    <text fill="var(--foreground)" fontFamily="var(--font-inter)" fontSize="10" fontWeight="600" textAnchor="middle" x="0" y="-18">Economy (OECD)</text>
                  </g>

                  {/* Node: Climate (Copernicus) */}
                  <g className="cursor-pointer transition-transform hover:scale-105" transform="translate(420, 100)">
                    <circle cx="0" cy="0" fill="var(--surface-lowest)" r="16" stroke="#047857" strokeWidth="2"></circle>
                    <circle cx="0" cy="0" fill="#047857" r="6"></circle>
                    <rect fill="var(--surface-container)" height="20" rx="4" width="96" x="-48" y="-32" stroke="var(--outline-variant)" strokeWidth="0.5"></rect>
                    <text fill="var(--foreground)" fontFamily="var(--font-inter)" fontSize="10" fontWeight="600" textAnchor="middle" x="0" y="-18">Climate (Copernicus)</text>
                  </g>

                  {/* Node: Health (WHO) */}
                  <g className="cursor-pointer transition-transform hover:scale-105" transform="translate(80, 190)">
                    <circle cx="0" cy="0" fill="var(--surface-lowest)" r="13" stroke="#712ae2" strokeWidth="2"></circle>
                    <circle cx="0" cy="0" fill="#712ae2" r="4"></circle>
                    <rect fill="var(--surface-container)" height="20" rx="4" width="80" x="-40" y="16" stroke="var(--outline-variant)" strokeWidth="0.5"></rect>
                    <text fill="var(--foreground)" fontFamily="var(--font-inter)" fontSize="10" fontWeight="600" textAnchor="middle" x="0" y="30">Health (WHO)</text>
                  </g>

                  {/* Node: Education (UNESCO) */}
                  <g className="cursor-pointer transition-transform hover:scale-105" transform="translate(200, 280)">
                    <circle cx="0" cy="0" fill="var(--surface-lowest)" r="13" stroke="#b45309" strokeWidth="2"></circle>
                    <circle cx="0" cy="0" fill="#b45309" r="5"></circle>
                    <rect fill="var(--surface-container)" height="20" rx="4" width="94" x="-47" y="16" stroke="var(--outline-variant)" strokeWidth="0.5"></rect>
                    <text fill="var(--foreground)" fontFamily="var(--font-inter)" fontSize="10" fontWeight="600" textAnchor="middle" x="0" y="30">Education (UNESCO)</text>
                  </g>

                  {/* Node: SIPRI Defence */}
                  <g className="cursor-pointer transition-transform hover:scale-105" transform="translate(360, 270)">
                    <circle cx="0" cy="0" fill="var(--surface-lowest)" r="14" stroke="var(--primary)" strokeWidth="2"></circle>
                    <circle cx="0" cy="0" fill="var(--primary)" r="5"></circle>
                    <rect fill="var(--surface-container)" height="20" rx="4" width="84" x="-42" y="18" stroke="var(--outline-variant)" strokeWidth="0.5"></rect>
                    <text fill="var(--foreground)" fontFamily="var(--font-inter)" fontSize="10" fontWeight="600" textAnchor="middle" x="0" y="32">SIPRI Defence</text>
                  </g>

                  {/* Node: Transit Logs */}
                  <g className="cursor-pointer transition-transform hover:scale-105" transform="translate(440, 210)">
                    <circle cx="0" cy="0" fill="var(--surface-lowest)" r="12" stroke="var(--secondary)" strokeWidth="2"></circle>
                    <circle cx="0" cy="0" fill="var(--secondary)" r="4"></circle>
                    <rect fill="var(--surface-container)" height="20" rx="4" width="76" x="-38" y="16" stroke="var(--outline-variant)" strokeWidth="0.5"></rect>
                    <text fill="var(--foreground)" fontFamily="var(--font-inter)" fontSize="10" fontWeight="600" textAnchor="middle" x="0" y="30">Transit Logs</text>
                  </g>
                </svg>

                {/* Floating Quick Stats Pills */}
                <div className="absolute bottom-3 left-3 bg-[var(--surface-lowest)]/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-[var(--outline-variant)]/40 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                  <span className="font-mono-data text-[11px] text-[var(--foreground)] font-semibold">
                    84,120 Vector Pairs Synthesized
                  </span>
                </div>
                <div className="absolute top-3 right-3 bg-[var(--surface-lowest)]/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm border border-[var(--outline-variant)]/40 flex items-center gap-1.5 font-mono-data text-[10px] text-[var(--outline)]">
                  <Sliders className="w-3 h-3 text-[var(--secondary)]" />
                  <span>Weight: ρ &gt; 0.50</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between font-mono-data text-xs text-[var(--outline)]">
                <span>Graph updated 12s ago via distributed node sync</span>
                <Link href="/hypotheses" className="text-[var(--primary)] hover:underline inline-flex items-center gap-1 font-semibold">
                  <span>Full Topology Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 1.5. TRENDING RESEARCH SECTION (CHANGE 2) */}
        <section className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono-data text-[10px] font-semibold border border-amber-500/20 mb-2">
                <span>🔥</span>
                <span className="uppercase tracking-wider">Top Weekly Investigations</span>
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl text-[var(--foreground)] font-semibold tracking-tight">
                🔥 Trending Research
              </h2>
              <p className="text-xs sm:text-sm text-[var(--foreground)]/70 font-sans mt-0.5">
                Most investigated hypotheses by the community this week.
              </p>
            </div>
            <Link
              href="/hypotheses"
              className="font-mono-data text-xs text-[var(--primary)] hover:underline inline-flex items-center gap-1 font-semibold self-start sm:self-auto"
            >
              <span>Explore All 100 Leads</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
            {trendingLeads.map((hyp) => (
              <HypothesisCard key={hyp.id} hypothesis={hyp} variant="trending" />
            ))}
          </div>
        </section>

        {/* 2. KEY IMPACT METRICS (CHANGE 6: 247 Datasets, 18 Domains, 1,382 Relationships, 100 AI Research Leads) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Datasets */}
          <div className="bg-[var(--surface-lowest)] rounded-2xl p-6 shadow-sm border border-[var(--outline-variant)]/50 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between pb-3">
              <span className="font-mono-data text-[11px] uppercase tracking-wider text-[var(--outline)] font-semibold">
                Datasets Indexed
              </span>
              <Database className="w-5 h-5 text-[var(--secondary)]" />
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-editorial text-4xl sm:text-5xl font-bold text-[var(--foreground)] tracking-tight">
                247
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--secondary-container)] text-[var(--on-secondary-container)] font-mono-data text-[11px] font-semibold">
                +14 this month
              </span>
            </div>
            <div className="pt-3 flex items-center gap-1.5 text-xs text-[var(--outline)] font-sans border-t border-[var(--outline-variant)]/30 mt-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% provenance checked</span>
            </div>
          </div>

          {/* Card 2: 18 Research Domains */}
          <div className="bg-[var(--surface-lowest)] rounded-2xl p-6 shadow-sm border border-[var(--outline-variant)]/50 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between pb-3">
              <span className="font-mono-data text-[11px] uppercase tracking-wider text-[var(--outline)] font-semibold">
                Research Domains
              </span>
              <Activity className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-editorial text-4xl sm:text-5xl font-bold text-[var(--foreground)] tracking-tight">
                18
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-mono-data text-[11px] font-semibold border border-[var(--primary)]/20">
                Multi-vector
              </span>
            </div>
            <div className="pt-3 flex items-center gap-1.5 text-xs text-[var(--outline)] font-sans border-t border-[var(--outline-variant)]/30 mt-3">
              <Users className="w-4 h-4 text-[var(--primary)] shrink-0" />
              <span>31 cross-disciplinary teams</span>
            </div>
          </div>

          {/* Card 3: 1,382 Cross-domain Relationships */}
          <div className="bg-[var(--surface-lowest)] rounded-2xl p-6 shadow-sm border border-[var(--outline-variant)]/50 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between pb-3">
              <span className="font-mono-data text-[11px] uppercase tracking-wider text-[var(--outline)] font-semibold">
                Cross-domain Relationships
              </span>
              <TrendingUp className="w-5 h-5 text-[var(--secondary)]" />
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-editorial text-4xl sm:text-5xl font-bold text-[var(--foreground)] tracking-tight">
                1,382
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--surface-container)] text-[var(--foreground)] font-mono-data text-[11px] font-semibold">
                p &lt; 0.01
              </span>
            </div>
            <div className="pt-3 flex items-center gap-1.5 text-xs text-[var(--outline)] font-sans border-t border-[var(--outline-variant)]/30 mt-3">
              <Filter className="w-4 h-4 text-[var(--secondary)] shrink-0" />
              <span>Filtered from 2.4M combinations</span>
            </div>
          </div>

          {/* Card 4: 100 AI Research Leads */}
          <div className="bg-[var(--surface-lowest)] rounded-2xl p-6 shadow-sm border border-[var(--outline-variant)]/50 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between pb-3">
              <span className="font-mono-data text-[11px] uppercase tracking-wider text-[var(--outline)] font-semibold">
                AI Research Leads
              </span>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-editorial text-4xl sm:text-5xl font-bold text-emerald-600 tracking-tight">
                100
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono-data text-[11px] font-semibold border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                Screened & Audited
              </span>
            </div>
            <div className="pt-3 flex items-center gap-1.5 text-xs text-[var(--outline)] font-sans border-t border-[var(--outline-variant)]/30 mt-3">
              <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Indexed in DOI registry</span>
            </div>
          </div>
        </section>

        {/* 3. RESEARCH LEADS STREAM (CHANGE 7) */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-editorial text-2xl sm:text-3xl text-[var(--foreground)] font-semibold tracking-tight">
                Research Leads
              </h2>
              <p className="text-xs sm:text-sm text-[var(--foreground)]/70 font-sans mt-0.5">
                Systematically screened multivariate hypotheses discovered from indexed public data nodes.
              </p>
            </div>

            {/* Filter Tab Controls */}
            <div className="inline-flex p-1 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40 self-start md:self-auto">
              {(["ALL", "CONFIDENCE", "INVESTIGATION", "VERIFIED"] as const).map((tab) => {
                const label = 
                  tab === "ALL" ? "All Research Leads" :
                  tab === "CONFIDENCE" ? "Evidence Confidence" :
                  tab === "INVESTIGATION" ? "Under Investigation" : "Recently Verified";
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeTab === tab
                        ? "bg-[var(--surface-lowest)] text-[var(--foreground)] font-semibold shadow-sm"
                        : "text-[var(--foreground)]/70 hover:text-[var(--foreground)]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Discovery Cards Stream */}
          <div className="flex flex-col gap-4">
            {filteredDiscoveries.map((disc) => (
              <div
                key={disc.code}
                className="bg-[var(--surface-lowest)] rounded-2xl p-6 shadow-sm border border-[var(--outline-variant)]/50 hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 group"
              >
                <div className="flex flex-col gap-2 max-w-4xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono-data text-[10px] font-bold ${disc.badgeColor}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                      {disc.statusBadge}
                    </span>
                    <span className="text-[var(--outline)] font-mono-data text-xs">•</span>
                    <span className="font-mono-data text-xs text-[var(--outline)] font-semibold">
                      {disc.code}
                    </span>
                    {disc.subBadge && (
                      <>
                        <span className="text-[var(--outline)] font-mono-data text-xs">•</span>
                        <span className="inline-flex items-center gap-1 font-mono-data text-xs text-emerald-600 font-medium">
                          <BookOpen className="w-3.5 h-3.5" />
                          {disc.subBadge}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="font-editorial text-lg sm:text-xl font-semibold text-[var(--foreground)] tracking-tight leading-snug group-hover:text-[var(--primary)] transition-colors">
                    {disc.headline}
                  </h3>

                  {/* Linked Datasets Tag Triad */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="font-mono-data text-[11px] text-[var(--outline)] font-semibold uppercase">
                      Datasets Linked:
                    </span>
                    {disc.datasets.map((ds, idx) => (
                      <React.Fragment key={idx}>
                        <span className="px-2 py-0.5 rounded bg-[var(--surface-container)] text-[var(--foreground)] text-xs font-mono-data border border-[var(--outline-variant)]/30">
                          {ds}
                        </span>
                        {idx < disc.datasets.length - 1 && (
                          <span className="text-[var(--outline)] text-xs">×</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Statistical Confidence Metrics */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-sans text-[var(--foreground)]/75">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-[var(--foreground)] font-mono-data">{disc.correlation}</span> Correlation
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono-data text-[var(--foreground)]">{disc.metric2}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono-data text-[var(--foreground)]">{disc.metric3}</span>
                    </div>
                  </div>

                  {/* Lead Investigator / Peer Note */}
                  <div className="flex items-center gap-2 pt-1 text-xs text-[var(--outline)] font-mono-data">
                    <Clock className="w-3.5 h-3.5 text-[var(--secondary)]" />
                    <span>{disc.time}</span>
                    <span>•</span>
                    <span className="text-[var(--foreground)]/80">{disc.lead}</span>
                  </div>
                </div>

                {/* Actions Column */}
                <div className="shrink-0 flex lg:flex-col items-end justify-between lg:justify-center gap-3">
                  <Link
                    href={disc.actionHref}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--on-primary)] font-medium text-xs shadow-sm hover:opacity-95 transition-all"
                  >
                    <span>{disc.actionText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => toggleSave(disc.code)}
                    className="inline-flex items-center gap-1.5 text-[var(--outline)] hover:text-[var(--foreground)] text-xs font-medium transition-colors"
                  >
                    <BookmarkPlus className={`w-3.5 h-3.5 ${savedHypotheses.includes(disc.code) ? "text-[var(--primary)] fill-current" : ""}`} />
                    <span>{savedHypotheses.includes(disc.code) ? "Saved" : "Save Hypothesis"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. AUTHORITATIVE INGESTION PIPELINE & INSTITUTIONAL PARTNERS STRIP */}
        <section className="bg-[var(--surface-lowest)] rounded-2xl p-6 sm:p-8 shadow-sm border border-[var(--outline-variant)]/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1 max-w-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
              <span className="font-mono-data text-xs uppercase tracking-wider text-[var(--foreground)] font-bold">
                Authoritative Ingestion Pipeline
              </span>
            </div>
            <p className="text-xs text-[var(--foreground)]/70 font-sans leading-relaxed">
              Automated hourly integrity audits, cryptographic hashing, and automated DOI cross-checks against indexed registries.
            </p>
          </div>

          {/* Partner Registry Nodes */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            {/* NOAA */}
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <div className="flex flex-col">
                <span className="font-editorial text-lg font-bold text-[var(--foreground)] leading-tight group-hover:text-[var(--primary)] transition-colors">
                  NOAA
                </span>
                <span className="font-mono-data text-[10px] text-[var(--outline)]">Ocean & Climate</span>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-px bg-[var(--outline-variant)]/50"></div>

            {/* WHO */}
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <div className="flex flex-col">
                <span className="font-editorial text-lg font-bold text-[var(--foreground)] leading-tight group-hover:text-[var(--primary)] transition-colors">
                  WHO
                </span>
                <span className="font-mono-data text-[10px] text-[var(--outline)]">Global Observatory</span>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-px bg-[var(--outline-variant)]/50"></div>

            {/* CERN */}
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <div className="flex flex-col">
                <span className="font-editorial text-lg font-bold text-[var(--foreground)] leading-tight group-hover:text-[var(--primary)] transition-colors">
                  CERN
                </span>
                <span className="font-mono-data text-[10px] text-[var(--outline)]">Open Science Data</span>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-px bg-[var(--outline-variant)]/50"></div>

            {/* World Bank */}
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <div className="flex flex-col">
                <span className="font-editorial text-lg font-bold text-[var(--foreground)] leading-tight group-hover:text-[var(--primary)] transition-colors">
                  World Bank
                </span>
                <span className="font-mono-data text-[10px] text-[var(--outline)]">Socio-economic</span>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-px bg-[var(--outline-variant)]/50"></div>

            {/* Copernicus */}
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <div className="flex flex-col">
                <span className="font-editorial text-lg font-bold text-[var(--foreground)] leading-tight group-hover:text-[var(--primary)] transition-colors">
                  Copernicus
                </span>
                <span className="font-mono-data text-[10px] text-[var(--outline)]">EU Earth Obs</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FINAL BRAND BANNER: From Data to Discovery */}
        <ClosingBanner />

      </div>
    </div>
  );
}
