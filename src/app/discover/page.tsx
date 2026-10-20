"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  ArrowRight, 
  Shuffle, 
  Activity, 
  Layers, 
  Database, 
  AlertTriangle, 
  Info, 
  Compass,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  Clock,
  MapPin,
  Sliders,
  ExternalLink,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Award,
  BarChart3,
  HelpCircle
} from "lucide-react";
import { REPOSITORIES } from "@/data/nexusData";
import { analyzeDatasetTrio, ProjectionPoint, CandidateHypothesis } from "@/lib/discoveryEngine";

export default function DiscoverPage() {
  const router = useRouter();

  // 1. Three independent dataset selectors
  const [selectedDs1, setSelectedDs1] = useState<string>(REPOSITORIES[0].id); // Defence
  const [selectedDs2, setSelectedDs2] = useState<string>(REPOSITORIES[1].id); // HigherEd
  const [selectedDs3, setSelectedDs3] = useState<string>(REPOSITORIES[2].id); // Youth Employment

  // Animation & Hover states
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<ProjectionPoint | null>(null);

  // Selected hypothesis ID (defaults to strongest candidate)
  const [activeHypothesisId, setActiveHypothesisId] = useState<string | null>(null);

  // Expandable score breakdown toggle map
  const [expandedScoreMap, setExpandedScoreMap] = useState<Record<string, boolean>>({});

  // 2. Deterministic analysis result derived immediately from the 3 selected IDs
  const analysis = useMemo(() => {
    return analyzeDatasetTrio(selectedDs1, selectedDs2, selectedDs3, REPOSITORIES);
  }, [selectedDs1, selectedDs2, selectedDs3]);

  // Active hypothesis is either user-selected or the strongest candidate (Rank 1)
  const activeHypothesis: CandidateHypothesis = useMemo(() => {
    if (activeHypothesisId) {
      const found = analysis.hypotheses.find(h => h.id === activeHypothesisId);
      if (found) return found;
    }
    return analysis.strongestHypothesis;
  }, [activeHypothesisId, analysis]);

  // 5. Surprise Me button logic:
  // Randomly selects 3 distinct datasets, updates all 3 selectors, starts animation
  const handleSurpriseMe = () => {
    setIsSynthesizing(true);
    const available = [...REPOSITORIES];
    const idx1 = Math.floor(Math.random() * available.length);
    const item1 = available.splice(idx1, 1)[0];

    const idx2 = Math.floor(Math.random() * available.length);
    const item2 = available.splice(idx2, 1)[0];

    const idx3 = Math.floor(Math.random() * available.length);
    const item3 = available.splice(idx3, 1)[0];

    setTimeout(() => {
      setSelectedDs1(item1.id);
      setSelectedDs2(item2.id);
      setSelectedDs3(item3.id);
      setActiveHypothesisId(null);
      setExpandedScoreMap({});
      setIsSynthesizing(false);
    }, 450);
  };

  const handleManualRunDiscovery = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setActiveHypothesisId(null);
      setIsSynthesizing(false);
    }, 350);
  };

  const toggleScoreBreakdown = (hypId: string) => {
    setExpandedScoreMap(prev => ({
      ...prev,
      [hypId]: !prev[hypId]
    }));
  };

  // Helper to construct Investigation Handoff URL for any hypothesis
  const getInvestigationHref = (hyp: CandidateHypothesis) => {
    return `/investigations?d1=${encodeURIComponent(selectedDs1)}&d2=${encodeURIComponent(selectedDs2)}&d3=${encodeURIComponent(selectedDs3)}&hyp=${encodeURIComponent(hyp.id)}`;
  };

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* HEADER SECTION */}
      <section className="w-full bg-[var(--surface-lowest)] border-b border-[var(--outline-variant)]/50 px-4 sm:px-8 py-6">
        <div className="max-w-[1536px] mx-auto flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono-data text-[var(--outline)]">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-[var(--primary)] uppercase font-semibold">
                NEXUS
              </Link>
              <span>/</span>
              <span className="text-[var(--foreground)] uppercase font-bold">
                DISCOVERY ENGINE // 5-CANDIDATE SYNTHESIZER
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[var(--secondary)] font-semibold">Discovery Model Active (Deterministic)</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="font-editorial text-2xl sm:text-4xl font-semibold text-[var(--foreground)] tracking-tight">
                Tri-Vector Discovery Engine
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[var(--foreground)]/75 mt-1 max-w-3xl leading-relaxed">
                Choose any three public datasets. NEXUS screens for candidate statistical links, generates 5 distinct plain-English hypotheses, scores each with an AI Relevance Score, and connects them to published research.
              </p>
            </div>

            {/* Surprise Me & Run Discovery Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleSurpriseMe}
                disabled={isSynthesizing}
                id="surprise-me-btn"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--surface-low)] hover:bg-[var(--surface-container)] text-[var(--foreground)] font-mono-data text-xs uppercase font-semibold tracking-wider transition-all border border-[var(--outline-variant)]/60 shadow-sm cursor-pointer"
              >
                <Shuffle className={`w-4 h-4 text-[var(--primary)] ${isSynthesizing ? "animate-spin" : ""}`} />
                <span>Surprise Me</span>
              </button>

              <button
                onClick={handleManualRunDiscovery}
                disabled={isSynthesizing}
                id="run-discovery-btn"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:opacity-95 text-[var(--on-primary)] font-mono-data text-xs uppercase font-semibold tracking-wider transition-all shadow-md shadow-[var(--primary)]/20 cursor-pointer"
              >
                {isSynthesizing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Datasets...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Discovery</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 1. THREE INDEPENDENT DATASET SELECTORS */}
          <div className="pt-4 border-t border-[var(--outline-variant)]/40 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Selector 1 */}
            <div className="flex flex-col gap-1.5 bg-[var(--surface-low)] p-3.5 rounded-xl border border-[var(--outline-variant)]/50">
              <div className="flex items-center justify-between font-mono-data text-[11px]">
                <span className="font-bold text-[var(--primary)] uppercase">DATASET 01 (EXPOSURE)</span>
                <span className="text-[var(--outline)]">{analysis.dataset1.category}</span>
              </div>
              <select
                value={selectedDs1}
                onChange={(e) => {
                  setSelectedDs1(e.target.value);
                  setActiveHypothesisId(null);
                }}
                id="dataset-selector-1"
                className="bg-[var(--surface-lowest)] text-[var(--foreground)] border border-[var(--outline-variant)]/60 rounded-lg p-2 text-xs font-sans font-medium focus:outline-none focus:ring-1 focus:ring-[var(--primary)] cursor-pointer"
              >
                {REPOSITORIES.map((r) => (
                  <option key={`ds1-${r.id}`} value={r.id}>
                    {r.title} ({r.identifier})
                  </option>
                ))}
              </select>
              <div className="text-[10px] font-mono-data text-[var(--outline)] truncate">
                {analysis.dataset1.institution}
              </div>
            </div>

            {/* Selector 2 */}
            <div className="flex flex-col gap-1.5 bg-[var(--surface-low)] p-3.5 rounded-xl border border-[var(--outline-variant)]/50">
              <div className="flex items-center justify-between font-mono-data text-[11px]">
                <span className="font-bold text-[var(--tertiary)] uppercase">DATASET 02 (MEDIATOR)</span>
                <span className="text-[var(--outline)]">{analysis.dataset2.category}</span>
              </div>
              <select
                value={selectedDs2}
                onChange={(e) => {
                  setSelectedDs2(e.target.value);
                  setActiveHypothesisId(null);
                }}
                id="dataset-selector-2"
                className="bg-[var(--surface-lowest)] text-[var(--foreground)] border border-[var(--outline-variant)]/60 rounded-lg p-2 text-xs font-sans font-medium focus:outline-none focus:ring-1 focus:ring-[var(--primary)] cursor-pointer"
              >
                {REPOSITORIES.map((r) => (
                  <option key={`ds2-${r.id}`} value={r.id}>
                    {r.title} ({r.identifier})
                  </option>
                ))}
              </select>
              <div className="text-[10px] font-mono-data text-[var(--outline)] truncate">
                {analysis.dataset2.institution}
              </div>
            </div>

            {/* Selector 3 */}
            <div className="flex flex-col gap-1.5 bg-[var(--surface-low)] p-3.5 rounded-xl border border-[var(--outline-variant)]/50">
              <div className="flex items-center justify-between font-mono-data text-[11px]">
                <span className="font-bold text-[var(--secondary)] uppercase">DATASET 03 (OUTCOME)</span>
                <span className="text-[var(--outline)]">{analysis.dataset3.category}</span>
              </div>
              <select
                value={selectedDs3}
                onChange={(e) => {
                  setSelectedDs3(e.target.value);
                  setActiveHypothesisId(null);
                }}
                id="dataset-selector-3"
                className="bg-[var(--surface-lowest)] text-[var(--foreground)] border border-[var(--outline-variant)]/60 rounded-lg p-2 text-xs font-sans font-medium focus:outline-none focus:ring-1 focus:ring-[var(--primary)] cursor-pointer"
              >
                {REPOSITORIES.map((r) => (
                  <option key={`ds3-${r.id}`} value={r.id}>
                    {r.title} ({r.identifier})
                  </option>
                ))}
              </select>
              <div className="text-[10px] font-mono-data text-[var(--outline)] truncate">
                {analysis.dataset3.institution}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <div className={`w-full max-w-[1536px] mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8 transition-opacity duration-300 ${isSynthesizing ? "opacity-35" : "opacity-100"}`}>
        
        {/* 10. DISCOVERY SIGNAL DETECTED SECTION */}
        <section className="bg-gradient-to-r from-[var(--surface-lowest)] to-[var(--surface-low)] border-2 border-[var(--primary)]/50 rounded-2xl p-6 sm:p-7 shadow-md flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--outline-variant)]/40 pb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--primary)]"></span>
              </span>
              <h2 className="font-mono-data text-sm font-bold text-[var(--primary)] uppercase tracking-widest">
                DISCOVERY SIGNAL DETECTED
              </h2>
            </div>
            <div className="flex items-center gap-3 font-mono-data text-xs">
              <span className="px-2.5 py-0.5 rounded bg-[var(--surface-high)] font-bold text-[var(--foreground)]">
                {analysis.hypothesisCode}
              </span>
              <span className="text-[var(--outline)]">•</span>
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <Award className="w-4 h-4" />
                <span>AI RELEVANCE SCORE: {analysis.strongestHypothesis.aiScore} / 100</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono-data text-[var(--outline)] uppercase font-semibold">
              Potential Cross-Domain Relationship Detected:
            </span>
            <div className="font-editorial text-xl sm:text-2xl text-[var(--foreground)] font-medium leading-snug">
              &ldquo;{analysis.strongestHypothesis.statement}&rdquo;
            </div>
          </div>

          {/* Plain language epistemic disclaimer */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 text-amber-900 dark:text-amber-200 border border-amber-500/20 text-xs font-sans">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong>Methodological Notice:</strong> This is an AI-synthesized candidate hypothesis for investigation, not proof of causation. Detailed human verification and confounder testing are required.
            </span>
          </div>
        </section>

        {/* 8. HYPOTHESIS RESULT UI — 5 CANDIDATE HYPOTHESES */}
        <section className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--primary)]" />
                <h2 className="font-editorial text-2xl font-bold text-[var(--foreground)]">
                  Discovery Research Leads
                </h2>
              </div>
              <p className="text-xs text-[var(--outline)] font-mono-data mt-0.5">
                5 distinct candidate hypotheses discovered and ranked by Evidence Confidence Score
              </p>
            </div>
            <div className="text-xs font-mono-data text-[var(--outline)]">
              Showing relationships for: <strong>{analysis.dataset1.identifier}</strong> × <strong>{analysis.dataset2.identifier}</strong> × <strong>{analysis.dataset3.identifier}</strong>
            </div>
          </div>

          {/* =========================================================================
              RANK 01 — STRONGEST CANDIDATE (VISUALLY DOMINANT)
              ========================================================================= */}
          {(() => {
            const top = analysis.strongestHypothesis;
            const isSelected = activeHypothesis.id === top.id;
            const isScoreExpanded = !!expandedScoreMap[top.id];

            return (
              <div 
                className={`p-6 sm:p-7 rounded-2xl bg-[var(--surface-lowest)] border-2 transition-all shadow-md flex flex-col gap-6 ${
                  isSelected ? "border-[var(--primary)] shadow-lg shadow-[var(--primary)]/10" : "border-[var(--primary)]/60"
                }`}
              >
                {/* Header Row: Rank Badge & AI Relevance Score */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--outline-variant)]/40 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-lg bg-[var(--primary)] text-[var(--on-primary)] font-mono-data text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 shadow-sm">
                      <Award className="w-4 h-4" />
                      01 STRONGEST CANDIDATE
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-[var(--surface-low)] border border-[var(--outline-variant)]/50 text-[11px] font-mono-data text-[var(--foreground)] font-semibold">
                      {top.relationshipLabel}
                    </span>
                  </div>

                  {/* AI Relevance Score Display */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono-data text-xs uppercase text-[var(--outline)] font-semibold">AI RELEVANCE SCORE</span>
                      <span className="font-editorial text-3xl font-bold text-emerald-600">
                        {top.aiScore}
                      </span>
                      <span className="text-xs font-mono-data text-[var(--outline)]">/ 100</span>
                    </div>

                    <button
                      onClick={() => toggleScoreBreakdown(top.id)}
                      className="text-xs font-mono-data text-[var(--primary)] hover:underline flex items-center gap-1 ml-2 cursor-pointer"
                    >
                      <span>Why this score?</span>
                      {isScoreExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Score Breakdown (when expanded) */}
                {isScoreExpanded && (
                  <div className="p-4 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/50 flex flex-col gap-3 font-mono-data text-xs">
                    <div className="flex items-center justify-between border-b border-[var(--outline-variant)]/30 pb-2">
                      <span className="font-bold text-[var(--foreground)] uppercase">
                        AI Relevance Score Breakdown
                      </span>
                      <span className="text-[10px] text-[var(--outline)]">
                        Evaluates empirical alignment, temporal fit, and research support (Not proof of truth)
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
                      <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-[var(--surface-lowest)] border border-[var(--outline-variant)]/30">
                        <span className="text-[10px] text-[var(--outline)] uppercase">Dataset Compatibility</span>
                        <div className="font-bold text-base text-[var(--primary)]">{top.scoreBreakdown.datasetCompatibility}</div>
                        <p className="text-[11px] font-sans text-[var(--foreground)]/70">{top.scoreExplanation.compatibilityText}</p>
                      </div>
                      <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-[var(--surface-lowest)] border border-[var(--outline-variant)]/30">
                        <span className="text-[10px] text-[var(--outline)] uppercase">Research Relevance</span>
                        <div className="font-bold text-base text-[var(--primary)]">{top.scoreBreakdown.researchRelevance}</div>
                        <p className="text-[11px] font-sans text-[var(--foreground)]/70">{top.scoreExplanation.relevanceText}</p>
                      </div>
                      <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-[var(--surface-lowest)] border border-[var(--outline-variant)]/30">
                        <span className="text-[10px] text-[var(--outline)] uppercase">Evidence Strength</span>
                        <div className="font-bold text-base text-[var(--primary)]">{top.scoreBreakdown.evidenceStrength}</div>
                        <p className="text-[11px] font-sans text-[var(--foreground)]/70">{top.scoreExplanation.evidenceText}</p>
                      </div>
                      <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-[var(--surface-lowest)] border border-[var(--outline-variant)]/30">
                        <span className="text-[10px] text-[var(--outline)] uppercase">Novelty</span>
                        <div className="font-bold text-base text-[var(--primary)]">{top.scoreBreakdown.novelty}</div>
                        <p className="text-[11px] font-sans text-[var(--foreground)]/70">{top.scoreExplanation.noveltyText}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Primary Plain-English Statement (Immediate 5-second comprehension) */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-mono-data text-[var(--outline)] uppercase font-bold tracking-wider">
                    Core Hypothesis Statement:
                  </span>
                  <div className="font-editorial text-2xl sm:text-3xl text-[var(--foreground)] font-semibold leading-snug">
                    &ldquo;{top.statement}&rdquo;
                  </div>
                </div>

                {/* Dataset Tag Triad */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-mono-data text-[var(--outline)] mr-1">Datasets Involved:</span>
                  <span className="px-2.5 py-1 rounded-md bg-[var(--surface-low)] border border-[var(--outline-variant)]/50 text-xs font-mono-data text-[var(--foreground)]">
                    <strong className="text-[var(--primary)]">A:</strong> {analysis.dataset1.title}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[var(--surface-low)] border border-[var(--outline-variant)]/50 text-xs font-mono-data text-[var(--foreground)]">
                    <strong className="text-[var(--tertiary)]">B:</strong> {analysis.dataset2.title}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[var(--surface-low)] border border-[var(--outline-variant)]/50 text-xs font-mono-data text-[var(--foreground)]">
                    <strong className="text-[var(--secondary)]">C:</strong> {analysis.dataset3.title}
                  </span>
                </div>

                {/* Grid: WHY NEXUS FLAGGED THIS + CONNECTED RESEARCH PAPER */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 border-t border-[var(--outline-variant)]/30">
                  {/* Left: WHY NEXUS FLAGGED THIS (7 cols) */}
                  <div className="lg:col-span-7 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                      <h4 className="font-mono-data text-xs uppercase font-bold text-[var(--foreground)]">
                        WHY NEXUS FLAGGED THIS
                      </h4>
                    </div>

                    <ul className="space-y-2">
                      {top.whyFlagged.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5 text-xs font-sans text-[var(--foreground)]/80 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0 mt-1.5"></span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: CONNECTED RESEARCH PAPER (5 cols) */}
                  <div className="lg:col-span-5 p-4 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/50 flex flex-col justify-between gap-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between font-mono-data text-[10px]">
                        <span className="font-bold text-[var(--primary)] uppercase flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          RELATED RESEARCH
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold">
                          {top.researchMatch.matchStatus}
                        </span>
                      </div>

                      <h5 className="font-editorial text-sm font-bold text-[var(--foreground)] line-clamp-2">
                        &ldquo;{top.researchMatch.paper.title}&rdquo;
                      </h5>

                      <div className="text-[11px] font-mono-data text-[var(--outline)]">
                        {top.researchMatch.paper.authors} ({top.researchMatch.paper.year}) • <em>{top.researchMatch.paper.source}</em>
                      </div>

                      <p className="text-[11px] font-sans text-[var(--foreground)]/75 leading-relaxed line-clamp-2 mt-0.5">
                        {top.researchMatch.paper.whyItMatters}
                      </p>
                    </div>

                    {/* 6. PROMINENT VIEW RELATED RESEARCH BUTTON (REAL HYPERLINK) */}
                    <a
                      href={top.researchMatch.paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      id="view-related-research-btn"
                      className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[var(--surface-lowest)] hover:bg-[var(--surface-container)] text-[var(--foreground)] font-mono-data text-xs font-semibold uppercase tracking-wider transition-colors border border-[var(--outline-variant)]/60 hover:border-[var(--primary)] text-center"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[var(--primary)]" />
                      <span>VIEW RELATED RESEARCH →</span>
                    </a>
                  </div>
                </div>

                {/* 12. BEGIN INVESTIGATION BUTTON FOR TOP CANDIDATE */}
                <div className="pt-2 border-t border-[var(--outline-variant)]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-[var(--outline)] font-mono-data">
                    Ready to audit confounders, time series, and structural equations for this hypothesis?
                  </div>

                  <Link
                    href={getInvestigationHref(top)}
                    id="begin-investigation-top-btn"
                    className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[var(--primary)] hover:opacity-95 text-[var(--on-primary)] font-mono-data text-xs uppercase font-bold tracking-wider transition-all shadow-md shadow-[var(--primary)]/20 shrink-0"
                  >
                    <span>BEGIN INVESTIGATION →</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })()}

          {/* =========================================================================
              RANKS 02 TO 05 — REMAINING CANDIDATE HYPOTHESES
              ========================================================================= */}
          <div className="flex flex-col gap-3 mt-2">
            <h3 className="font-mono-data text-xs uppercase font-bold text-[var(--outline)] tracking-wider">
              Additional Candidate Hypotheses Generated for this Trio (Ranks 02–05)
            </h3>

            <div className="space-y-3">
              {analysis.hypotheses.slice(1).map((hyp) => {
                const isSelected = activeHypothesis.id === hyp.id;
                const isScoreExpanded = !!expandedScoreMap[hyp.id];

                return (
                  <div
                    key={hyp.id}
                    onClick={() => setActiveHypothesisId(hyp.id)}
                    className={`p-5 rounded-xl bg-[var(--surface-lowest)] border transition-all cursor-pointer flex flex-col gap-4 ${
                      isSelected
                        ? "border-[var(--primary)] shadow-md shadow-[var(--primary)]/5 ring-1 ring-[var(--primary)]"
                        : "border-[var(--outline-variant)]/50 hover:border-[var(--outline-variant)]"
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono-data text-xs font-bold px-2.5 py-0.5 rounded bg-[var(--surface-low)] text-[var(--foreground)] border border-[var(--outline-variant)]/40">
                          0{hyp.rank}
                        </span>
                        <span className="font-mono-data text-xs font-bold text-[var(--foreground)]">
                          {hyp.title}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[var(--surface-container)] text-[10px] font-mono-data text-[var(--outline)]">
                          {hyp.relationshipLabel}
                        </span>
                      </div>

                      {/* AI Score Badge */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-baseline gap-1 font-mono-data text-xs">
                          <span className="text-[var(--outline)]">AI SCORE:</span>
                          <span className="font-bold text-base text-emerald-600">{hyp.aiScore}</span>
                          <span className="text-[10px] text-[var(--outline)]">/ 100</span>
                        </div>

                        <span className="px-2 py-0.5 rounded bg-[var(--surface-low)] text-[10px] font-mono-data font-semibold text-[var(--primary)]">
                          {hyp.researchMatch.matchStatus}
                        </span>
                      </div>
                    </div>

                    {/* Plain English Statement */}
                    <div className="font-editorial text-lg text-[var(--foreground)] font-medium leading-snug">
                      &ldquo;{hyp.statement}&rdquo;
                    </div>

                    {/* Actions & Expandable Options */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--outline-variant)]/30 text-xs font-mono-data">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleScoreBreakdown(hyp.id);
                          }}
                          className="text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isScoreExpanded ? "Hide score breakdown" : "Score breakdown"}</span>
                          {isScoreExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        <a
                          href={hyp.researchMatch.paper.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[var(--outline)] hover:text-[var(--foreground)] flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3 text-[var(--primary)]" />
                          <span>Paper: &ldquo;{hyp.researchMatch.paper.title.slice(0, 32)}...&rdquo;</span>
                        </a>
                      </div>

                      <Link
                        href={getInvestigationHref(hyp)}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-high)] hover:bg-[var(--surface-container)] text-[var(--foreground)] font-semibold transition-colors border border-[var(--outline-variant)]/50"
                      >
                        <span>INVESTIGATE THIS HYPOTHESIS →</span>
                      </Link>
                    </div>

                    {/* Score Breakdown (when expanded) */}
                    {isScoreExpanded && (
                      <div className="p-3 rounded-lg bg-[var(--surface-low)] border border-[var(--outline-variant)]/40 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono-data">
                        <div>
                          <span className="text-[var(--outline)] uppercase text-[9px]">Compatibility</span>
                          <div className="font-bold text-[var(--primary)]">{hyp.scoreBreakdown.datasetCompatibility}</div>
                        </div>
                        <div>
                          <span className="text-[var(--outline)] uppercase text-[9px]">Relevance</span>
                          <div className="font-bold text-[var(--primary)]">{hyp.scoreBreakdown.researchRelevance}</div>
                        </div>
                        <div>
                          <span className="text-[var(--outline)] uppercase text-[9px]">Evidence</span>
                          <div className="font-bold text-[var(--primary)]">{hyp.scoreBreakdown.evidenceStrength}</div>
                        </div>
                        <div>
                          <span className="text-[var(--outline)] uppercase text-[9px]">Novelty</span>
                          <div className="font-bold text-[var(--primary)]">{hyp.scoreBreakdown.novelty}</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 2. DYNAMIC ANALYSIS METRICS STRIP */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)]/50 shadow-sm flex flex-col">
            <span className="text-[10px] font-mono-data text-[var(--outline)] uppercase font-semibold">Correlation</span>
            <div className="font-editorial text-3xl font-bold text-[var(--primary)] mt-1">
              {analysis.correlationDisplay}
            </div>
            <span className="text-[11px] font-mono-data text-[var(--outline)] mt-1">{analysis.correlationType}</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)]/50 shadow-sm flex flex-col">
            <span className="text-[10px] font-mono-data text-[var(--outline)] uppercase font-semibold">Temporal Lag</span>
            <div className="font-editorial text-3xl font-bold text-[var(--tertiary)] mt-1">
              {analysis.lag}
            </div>
            <span className="text-[11px] font-mono-data text-[var(--outline)] mt-1">{analysis.temporalAssociation}% Assoc. Strength</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)]/50 shadow-sm flex flex-col">
            <span className="text-[10px] font-mono-data text-[var(--outline)] uppercase font-semibold">Spatial Coverage</span>
            <div className="font-editorial text-3xl font-bold text-[var(--secondary)] mt-1">
              {analysis.spatialCoverage}%
            </div>
            <span className="text-[11px] font-mono-data text-[var(--outline)] mt-1">Cross-regional Nodes</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)]/50 shadow-sm flex flex-col">
            <span className="text-[10px] font-mono-data text-[var(--outline)] uppercase font-semibold">Bayes Factor</span>
            <div className="font-editorial text-3xl font-bold text-emerald-600 mt-1">
              {analysis.bayesFactor}
            </div>
            <span className="text-[11px] font-mono-data text-[var(--outline)] mt-1">{analysis.pValue}</span>
          </div>

          <div className="col-span-2 lg:col-span-1 p-4 rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)]/50 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-mono-data text-[var(--outline)] uppercase font-semibold">Sample Units</span>
            <div className="font-mono-data text-xl font-bold text-[var(--foreground)] mt-1">
              {analysis.sampleSize}
            </div>
            <span className="text-[10px] font-mono-data text-[var(--secondary)] mt-1">Normalized Indices</span>
          </div>
        </section>

        {/* 3. MULTI-VECTOR PROJECTION SVG CHART & OBSERVATIONS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Multi-Vector Projection Chart (8 cols) */}
          <div className="lg:col-span-8 bg-[var(--surface-lowest)] rounded-2xl p-6 shadow-sm border border-[var(--outline-variant)]/50 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--outline-variant)]/40 pb-3">
              <div>
                <h3 className="font-editorial text-xl font-bold text-[var(--foreground)]">
                  Figure 1: Multi-Vector Phase Projection
                </h3>
                <p className="text-xs text-[var(--outline)] font-mono-data">
                  Dimensional manifold projection reflecting candidate relationships (Active: Hypothesis 0{activeHypothesis.rank})
                </p>
              </div>
              {/* Dynamic Legend with the currently selected datasets */}
              <div className="flex flex-wrap items-center gap-3 font-mono-data text-[10px]">
                <span className="flex items-center gap-1.5 text-[var(--primary)] font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]"></span>
                  {analysis.dataset1.identifier}
                </span>
                <span className="flex items-center gap-1.5 text-[var(--tertiary)] font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--tertiary)]"></span>
                  {analysis.dataset2.identifier}
                </span>
                <span className="flex items-center gap-1.5 text-[var(--secondary)] font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--secondary)]"></span>
                  {analysis.dataset3.identifier}
                </span>
              </div>
            </div>

            {/* SVG Projection Canvas */}
            <div className="w-full bg-[var(--surface-low)] rounded-xl p-4 border border-[var(--outline-variant)]/40 relative select-none overflow-x-auto">
              <svg className="w-full min-w-[540px] h-auto" viewBox="0 0 540 340">
                {/* Radial & Orthogonal Coordinate Guides */}
                <circle cx="270" cy="170" r="140" fill="none" stroke="var(--outline-variant)" strokeDasharray="3 3" strokeWidth="0.75" />
                <circle cx="270" cy="170" r="80" fill="none" stroke="var(--outline-variant)" strokeDasharray="3 3" strokeWidth="0.75" />
                <line x1="270" y1="20" x2="270" y2="320" stroke="var(--outline-variant)" strokeWidth="0.75" />
                <line x1="40" y1="170" x2="500" y2="170" stroke="var(--outline-variant)" strokeWidth="0.75" />

                {/* Connecting Correlation Triangles */}
                <polygon
                  points="160,110 380,130 270,260"
                  fill="var(--primary)"
                  fillOpacity="0.06"
                  stroke="var(--primary)"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />

                {/* Trajectory lines and points */}
                {analysis.projectionPoints.map((pt) => {
                  const color = 
                    pt.datasetIndex === 1 ? "var(--primary)" :
                    pt.datasetIndex === 2 ? "var(--tertiary)" : "var(--secondary)";
                  const isHovered = hoveredPoint?.id === pt.id;
                  const isLinkedToActiveHypothesis = pt.hypothesisRank === activeHypothesis.rank;

                  return (
                    <g
                      key={pt.id}
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredPoint(pt)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      {/* Active Hypothesis Aura Halo */}
                      {isLinkedToActiveHypothesis && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={11}
                          fill="none"
                          stroke={color}
                          strokeWidth={1.5}
                          strokeDasharray="2 2"
                          opacity={0.8}
                          className="animate-pulse"
                        />
                      )}

                      {/* Trajectory Vector Arrow */}
                      <line
                        x1={pt.x}
                        y1={pt.y}
                        x2={pt.x + pt.trajectory.dx}
                        y2={pt.y + pt.trajectory.dy}
                        stroke={color}
                        strokeWidth={isHovered || isLinkedToActiveHypothesis ? 2.5 : 1.2}
                        opacity={isLinkedToActiveHypothesis ? 0.9 : 0.6}
                      />
                      <circle
                        cx={pt.x + pt.trajectory.dx}
                        cy={pt.y + pt.trajectory.dy}
                        r={isLinkedToActiveHypothesis ? 3 : 2}
                        fill={color}
                        opacity={0.8}
                      />
                      {/* Primary Node Point */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 7 : isLinkedToActiveHypothesis ? 6 : 4.5}
                        fill={color}
                        stroke="var(--surface-lowest)"
                        strokeWidth={1.5}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Point Hover Contextual Tooltip */}
              {hoveredPoint && (
                <div className="absolute top-4 right-4 bg-[var(--surface-lowest)]/95 backdrop-blur-md border border-[var(--outline-variant)] shadow-lg rounded-lg p-3 font-mono-data text-xs pointer-events-none z-10">
                  <div className="font-bold text-[var(--foreground)]">{hoveredPoint.datasetName}</div>
                  <div className="text-[11px] text-[var(--outline)]">{hoveredPoint.cluster}</div>
                  <div className="text-[11px] mt-1">Magnitude: <strong className="text-[var(--primary)]">{hoveredPoint.value}</strong> ({hoveredPoint.variance})</div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs font-mono-data text-[var(--outline)] pt-1">
              <span>Selected Hypothesis: <strong>0{activeHypothesis.rank} ({activeHypothesis.relationshipLabel})</strong></span>
              <span>Eigenvector Energy: <strong>λ₁ = 0.74, λ₂ = 0.58</strong></span>
            </div>
          </div>

          {/* Right Column: Observations & Handoff (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Why Interesting Observations */}
            <div className="bg-[var(--surface-lowest)] rounded-2xl p-6 shadow-sm border border-[var(--outline-variant)]/50 flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-[var(--outline-variant)]/40 pb-3">
                <Info className="w-4 h-4 text-[var(--primary)]" />
                <h3 className="font-editorial text-lg font-bold text-[var(--foreground)]">
                  Why This Trio Is Notable
                </h3>
              </div>

              <div className="space-y-3">
                {analysis.whyInteresting.map((obs, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/30 text-xs font-sans text-[var(--foreground)]/80 leading-relaxed">
                    <span className="font-mono-data text-xs font-bold text-[var(--primary)] shrink-0">
                      0{idx + 1}.
                    </span>
                    <span>{obs}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Handoff Card for currently selected active hypothesis */}
            <div className="bg-[var(--surface-lowest)] rounded-2xl p-6 shadow-sm border border-[var(--outline-variant)]/50 flex flex-col gap-3">
              <span className="font-mono-data text-[10px] uppercase font-bold text-[var(--outline)]">
                Active Selection
              </span>
              <h4 className="font-editorial text-lg font-bold text-[var(--foreground)]">
                Investigate Hypothesis 0{activeHypothesis.rank}
              </h4>
              <p className="text-xs text-[var(--foreground)]/70 font-sans leading-relaxed line-clamp-3">
                &ldquo;{activeHypothesis.statement}&rdquo;
              </p>

              <Link
                href={getInvestigationHref(activeHypothesis)}
                id="investigate-active-hyp-btn"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--primary)] hover:opacity-95 text-[var(--on-primary)] font-mono-data text-xs uppercase font-bold tracking-wider transition-all shadow-md shadow-[var(--primary)]/20 mt-1"
              >
                <span>OPEN INVESTIGATION WORKSPACE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
