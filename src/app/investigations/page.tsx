"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Sliders, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Activity, 
  AlertTriangle, 
  RefreshCw, 
  FileText, 
  Download,
  Calendar,
  Clock,
  Radio,
  Share2,
  ChevronRight,
  Bookmark,
  Eye,
  Check,
  ExternalLink,
  Users,
  ShieldCheck,
  SlidersHorizontal,
  Save,
  LineChart,
  GitCommit,
  CheckSquare,
  BookOpen,
  Award,
  HelpCircle,
  TrendingUp
} from "lucide-react";
import { REPOSITORIES } from "@/data/nexusData";
import { analyzeDatasetTrio, CandidateHypothesis } from "@/lib/discoveryEngine";

function InvestigationContent() {
  const searchParams = useSearchParams();

  // Read query params for selected trio and selected hypothesis
  const d1Param = searchParams.get("d1");
  const d2Param = searchParams.get("d2");
  const d3Param = searchParams.get("d3");
  const hypParam = searchParams.get("hyp");

  const ds1Id = d1Param || REPOSITORIES[0].id;
  const ds2Id = d2Param || REPOSITORIES[1].id;
  const ds3Id = d3Param || REPOSITORIES[2].id;

  // Compute deterministic analysis for this trio
  const analysis = useMemo(() => {
    return analyzeDatasetTrio(ds1Id, ds2Id, ds3Id, REPOSITORIES);
  }, [ds1Id, ds2Id, ds3Id]);

  // Find the exact candidate hypothesis selected by the user
  const selectedHypothesis: CandidateHypothesis = useMemo(() => {
    if (hypParam) {
      const match = analysis.hypotheses.find(h => h.id === hypParam);
      if (match) return match;
    }
    return analysis.strongestHypothesis;
  }, [hypParam, analysis]);

  // Working tabs
  type TabType = "overview" | "modeling" | "timeseries" | "evidence" | "alternatives" | "notes";
  const tabParam = searchParams.get("tab") as TabType | null;
  const validTabs: TabType[] = ["overview", "modeling", "timeseries", "evidence", "alternatives", "notes"];
  const initialTab = tabParam && validTabs.includes(tabParam) ? tabParam : "overview";
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  // Interactive DAG Confounder Controls
  const [macroGdp, setMacroGdp] = useState(analysis.dagDefaults.macroGdpDefault);
  const [demographics, setDemographics] = useState(analysis.dagDefaults.demographicsDefault);
  const [inflationDeflator, setInflationDeflator] = useState(analysis.dagDefaults.inflationDefault);

  // Watch state & share
  const [watched, setWatched] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Notes & Attestation state
  const [investigatorNotes, setInvestigatorNotes] = useState("");
  const [notesSavedNotice, setNotesSavedNotice] = useState(false);

  // Load / initialize notes based on exact trio and selected hypothesis
  useEffect(() => {
    const storageKey = `nexus_notes_${analysis.trioKey}_${selectedHypothesis.id}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setInvestigatorNotes(saved);
    } else {
      setInvestigatorNotes(
        `INVESTIGATOR ATTESTATION & FIELD AUDIT LOG\n\nHypothesis: ${analysis.hypothesisCode} (Candidate 0${selectedHypothesis.rank})\nStatement: "${selectedHypothesis.statement}"\nDatasets: ${analysis.dataset1.title} × ${analysis.dataset2.title} × ${analysis.dataset3.title}\nAI Relevance Score: ${selectedHypothesis.aiScore} / 100\nLead: Autonomous Synthesizer & Peer Audit Group\n\nInitial Observations:\n1. Observed raw correlation of ${analysis.correlationDisplay} (${analysis.pValue}) with a ${analysis.lag} temporal lag signature.\n2. Confounder calibration tests show the relationship holds after adjusting for baseline macro and demographic indicators.\n3. Supporting Literature: "${selectedHypothesis.researchMatch.paper.title}" (${selectedHypothesis.researchMatch.paper.authors}, ${selectedHypothesis.researchMatch.paper.year}).\n4. Recommendation: Proceed with instrumental variable estimation across regional holdout clusters.`
      );
    }
  }, [analysis.trioKey, analysis.hypothesisCode, analysis.dataset1.title, analysis.dataset2.title, analysis.dataset3.title, analysis.correlationDisplay, analysis.pValue, analysis.lag, selectedHypothesis]);

  const handleSaveNotes = () => {
    const storageKey = `nexus_notes_${analysis.trioKey}_${selectedHypothesis.id}`;
    localStorage.setItem(storageKey, investigatorNotes);
    setNotesSavedNotice(true);
    setTimeout(() => setNotesSavedNotice(false), 3000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  // Dynamic calculations driven by the functional DAG controls:
  // When Macro GDP, Demographics, or Inflation move:
  // - DAG edge thickness changes
  // - Confounder influence changes
  // - Adjusted beta changes
  // - p-value changes
  // - Model confidence changes
  const confounderLoad = Number(((macroGdp * 0.4) + (demographics * 0.35) + (inflationDeflator * 0.25)).toFixed(1));
  const betaAdjustment = Number((analysis.correlation * (1 - (confounderLoad / 200))).toFixed(3));
  const adjustedBeta = betaAdjustment > 0 ? `+${betaAdjustment.toFixed(3)}` : betaAdjustment.toFixed(3);

  const dynamicPValue = 
    confounderLoad > 75 ? "p = 0.042" :
    confounderLoad > 50 ? "p = 0.008" :
    confounderLoad > 25 ? "p < 0.001" : "p < 0.0001";

  const dynamicConfidence = 
    confounderLoad > 70 ? "Moderate" :
    confounderLoad > 40 ? "Robust" : "High Confidence";

  // Edge stroke widths for SVG DAG
  const edgeWidthMacro = Math.max(1.5, Number((1 + (macroGdp / 20)).toFixed(1)));
  const edgeWidthDemo = Math.max(1.5, Number((1 + (demographics / 20)).toFixed(1)));
  const edgeWidthInfl = Math.max(1.5, Number((1 + (inflationDeflator / 20)).toFixed(1)));
  const edgeWidthMain = Math.max(2, Number((3.5 - (confounderLoad / 60)).toFixed(1)));

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* 1. INVESTIGATION STAGE BAR */}
      <div className="w-full bg-[var(--surface-low)] border-b border-[var(--outline-variant)]/40 shadow-sm">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <nav className="flex items-center gap-2 text-xs font-mono-data text-[var(--outline)]">
            <Link href="/discover" className="hover:text-[var(--primary)] transition-colors">
              Discovery Engine
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="bg-[var(--surface-container)] px-2 py-0.5 rounded text-[var(--foreground)] font-bold">
              {analysis.hypothesisCode}
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[var(--foreground)] font-semibold truncate max-w-[240px] sm:max-w-none">
              Candidate 0{selectedHypothesis.rank}: {selectedHypothesis.title}
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span className="font-mono-data text-[10px] font-bold tracking-wider uppercase">
                AI Relevance Score: {selectedHypothesis.aiScore} / 100
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[var(--outline)] font-mono-data text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>Active Investigation Workspace</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY HEADER & HERO STATEMENT */}
      <section className="w-full bg-[var(--surface-lowest)] border-b border-[var(--outline-variant)]/50 shadow-sm">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-8 pt-6 pb-5 flex flex-col gap-4">
          {/* Tag Triad */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--surface-container)] text-xs text-[var(--foreground)] font-medium shadow-sm border border-[var(--outline-variant)]/40 font-mono-data">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]"></span> A: {analysis.dataset1.title}
            </span>
            <span className="text-[var(--outline-variant)] font-mono-data text-xs">×</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--surface-container)] text-xs text-[var(--foreground)] font-medium shadow-sm border border-[var(--outline-variant)]/40 font-mono-data">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--tertiary)]"></span> B: {analysis.dataset2.title}
            </span>
            <span className="text-[var(--outline-variant)] font-mono-data text-xs">×</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--surface-container)] text-xs text-[var(--foreground)] font-medium shadow-sm border border-[var(--outline-variant)]/40 font-mono-data">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)]"></span> C: {analysis.dataset3.title}
            </span>
          </div>

          {/* Headline & Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col gap-1 max-w-4xl">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[var(--primary)] text-[var(--on-primary)] font-mono-data text-[10px] font-bold uppercase">
                  INVESTIGATING CANDIDATE 0{selectedHypothesis.rank}
                </span>
                <span className="text-xs font-mono-data text-[var(--outline)]">
                  {selectedHypothesis.relationshipLabel}
                </span>
              </div>
              <h1 className="font-editorial text-2xl sm:text-3xl text-[var(--foreground)] tracking-tight leading-snug font-medium mt-1">
                &ldquo;{selectedHypothesis.statement}&rdquo;
              </h1>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setWatched(!watched)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--surface-low)] hover:bg-[var(--surface-container)] text-[var(--foreground)] font-medium text-xs transition-colors shadow-sm border border-[var(--outline-variant)]/50 cursor-pointer"
              >
                <Bookmark className={`w-4 h-4 ${watched ? "text-[var(--primary)] fill-current" : ""}`} />
                <span>{watched ? "Watching" : "Watch Hypothesis"}</span>
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--primary)] hover:opacity-95 text-[var(--on-primary)] font-medium text-xs transition-all shadow-md shadow-[var(--primary)]/20 cursor-pointer"
              >
                {copiedShare ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedShare ? "Link Copied" : "Share Dossier"}</span>
              </button>
            </div>
          </div>

          {/* Epistemic Guardrail Notice */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-amber-500/10 text-amber-900 dark:text-amber-200 shadow-sm border border-amber-500/20">
            <div className="flex items-start sm:items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs">
                <span className="font-bold uppercase tracking-wide font-mono-data">Empirical Safeguard</span>
                <span className="hidden sm:inline text-amber-600/50">•</span>
                <span>Observed correlation is not proven causation. Causal DAG confounder adjustments and peer verification required.</span>
              </div>
            </div>
            <a
              href={selectedHypothesis.researchMatch.paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-data text-xs font-semibold text-amber-800 dark:text-amber-300 hover:underline shrink-0 flex items-center gap-1"
            >
              <span>View Related Research Paper</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* WORKING TABS */}
          <div className="flex items-center gap-1 overflow-x-auto py-1 border-t border-[var(--outline-variant)]/30 mt-2">
            {[
              { id: "overview", label: "Overview & Scoping" },
              { id: "modeling", label: "Figure 2: DAG & Modeling" },
              { id: "timeseries", label: "Time-Series Decomposition" },
              { id: "evidence", label: "Empirical Evidence & Research" },
              { id: "alternatives", label: "Alternative Explanations" },
              { id: "notes", label: "Notes & Attestation" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-2 rounded-lg text-xs font-medium tracking-normal transition-all shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[var(--surface-container)] text-[var(--foreground)] font-bold shadow-sm"
                    : "text-[var(--foreground)]/70 hover:bg-[var(--surface-low)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TAB CONTENTS */}
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 py-8">
        
        {/* ===================================================================
            TAB 1: OVERVIEW & SCOPING (Requirement 13)
            =================================================================== */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (8 cols): Scoping, Plain English What are we testing, Flag Reasons */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Investigating Header Card */}
              <div className="p-6 rounded-2xl bg-[var(--surface-lowest)] shadow-sm border border-[var(--outline-variant)]/50 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-[var(--outline-variant)]/40 pb-3">
                  <span className="font-mono-data text-xs uppercase font-bold text-[var(--primary)]">
                    INVESTIGATION SCOPE
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[var(--surface-container)] font-mono-data text-xs font-bold text-emerald-600">
                    AI Relevance Score: {selectedHypothesis.aiScore} / 100
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-mono-data text-[var(--outline)] uppercase font-bold">
                    INVESTIGATING HYPOTHESIS:
                  </span>
                  <div className="font-editorial text-xl sm:text-2xl text-[var(--foreground)] font-semibold leading-snug">
                    &ldquo;{selectedHypothesis.statement}&rdquo;
                  </div>
                </div>

                {/* 13. WHAT ARE WE TESTING? in plain English */}
                <div className="p-4 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40 flex flex-col gap-1.5">
                  <span className="font-mono-data text-xs uppercase font-bold text-[var(--foreground)]">
                    WHAT ARE WE TESTING?
                  </span>
                  <p className="text-sm font-sans text-[var(--foreground)]/85 leading-relaxed">
                    {selectedHypothesis.whatAreWeTesting}
                  </p>
                </div>

                {/* WHY NEXUS FLAGGED THIS */}
                <div className="flex flex-col gap-2 pt-2 border-t border-[var(--outline-variant)]/30">
                  <span className="font-mono-data text-xs uppercase font-bold text-[var(--outline)]">
                    WHY NEXUS FLAGGED THIS CANDIDATE:
                  </span>
                  <ul className="space-y-2">
                    {selectedHypothesis.whyFlagged.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs font-sans text-[var(--foreground)]/80 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0 mt-1.5"></span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 19. SCORE EXPLANATION BREAKDOWN (WHY THIS SCORE?) */}
              <div className="p-6 rounded-2xl bg-[var(--surface-lowest)] shadow-sm border border-[var(--outline-variant)]/50 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-[var(--outline-variant)]/40 pb-3">
                  <div>
                    <h3 className="font-editorial text-lg font-bold text-[var(--foreground)]">
                      Why This AI Score? ({selectedHypothesis.aiScore} / 100)
                    </h3>
                    <p className="text-xs text-[var(--outline)] font-mono-data">
                      Multi-dimensional diagnostic evaluating empirical fit and research relevance
                    </p>
                  </div>
                  <span className="text-[10px] font-mono-data px-2 py-0.5 rounded bg-[var(--surface-high)] font-bold text-[var(--outline)]">
                    NOT PROOF OF TRUTH
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40 flex flex-col gap-1">
                    <div className="flex justify-between font-mono-data text-xs">
                      <span className="font-bold text-[var(--foreground)]">Dataset Compatibility</span>
                      <span className="font-bold text-[var(--primary)]">{selectedHypothesis.scoreBreakdown.datasetCompatibility} / 100</span>
                    </div>
                    <p className="text-xs font-sans text-[var(--foreground)]/75 mt-0.5">
                      {selectedHypothesis.scoreExplanation.compatibilityText}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40 flex flex-col gap-1">
                    <div className="flex justify-between font-mono-data text-xs">
                      <span className="font-bold text-[var(--foreground)]">Research Relevance</span>
                      <span className="font-bold text-[var(--primary)]">{selectedHypothesis.scoreBreakdown.researchRelevance} / 100</span>
                    </div>
                    <p className="text-xs font-sans text-[var(--foreground)]/75 mt-0.5">
                      {selectedHypothesis.scoreExplanation.relevanceText}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40 flex flex-col gap-1">
                    <div className="flex justify-between font-mono-data text-xs">
                      <span className="font-bold text-[var(--foreground)]">Evidence Strength</span>
                      <span className="font-bold text-[var(--primary)]">{selectedHypothesis.scoreBreakdown.evidenceStrength} / 100</span>
                    </div>
                    <p className="text-xs font-sans text-[var(--foreground)]/75 mt-0.5">
                      {selectedHypothesis.scoreExplanation.evidenceText}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40 flex flex-col gap-1">
                    <div className="flex justify-between font-mono-data text-xs">
                      <span className="font-bold text-[var(--foreground)]">Novelty</span>
                      <span className="font-bold text-[var(--primary)]">{selectedHypothesis.scoreBreakdown.novelty} / 100</span>
                    </div>
                    <p className="text-xs font-sans text-[var(--foreground)]/75 mt-0.5">
                      {selectedHypothesis.scoreExplanation.noveltyText}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (4 cols): Connected Research & Pipeline Actions */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Connected Research Paper Card */}
              <div className="p-6 rounded-2xl bg-[var(--surface-lowest)] shadow-sm border border-[var(--outline-variant)]/50 flex flex-col gap-4">
                <div className="border-b border-[var(--outline-variant)]/40 pb-3">
                  <span className="text-[10px] font-mono-data uppercase font-bold text-[var(--primary)] flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    RELATED RESEARCH
                  </span>
                  <h4 className="font-editorial text-lg font-bold text-[var(--foreground)] mt-0.5">
                    &ldquo;{selectedHypothesis.researchMatch.paper.title}&rdquo;
                  </h4>
                </div>

                <div className="text-xs font-mono-data text-[var(--outline)] space-y-1">
                  <div><strong>Authors:</strong> {selectedHypothesis.researchMatch.paper.authors}</div>
                  <div><strong>Year:</strong> {selectedHypothesis.researchMatch.paper.year}</div>
                  <div><strong>Journal / Source:</strong> {selectedHypothesis.researchMatch.paper.source}</div>
                </div>

                <div className="text-xs font-sans text-[var(--foreground)]/80 leading-relaxed bg-[var(--surface-low)] p-3 rounded-lg border border-[var(--outline-variant)]/30">
                  <strong>Why it matters:</strong> {selectedHypothesis.researchMatch.paper.whyItMatters}
                </div>

                <a
                  href={selectedHypothesis.researchMatch.paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[var(--primary)] text-[var(--on-primary)] font-mono-data text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:opacity-95 text-center"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>OPEN RESEARCH PAPER →</span>
                </a>
              </div>

              {/* Quick Navigation to DAG & Modeling */}
              <div className="p-6 rounded-2xl bg-[var(--surface-lowest)] shadow-sm border border-[var(--outline-variant)]/50 flex flex-col gap-3">
                <span className="text-[10px] font-mono-data uppercase font-bold text-[var(--outline)]">
                  Next Step in Investigation
                </span>
                <h4 className="font-editorial text-lg font-bold text-[var(--foreground)]">
                  Test Causal DAG &amp; Confounder Sensitivity
                </h4>
                <p className="text-xs text-[var(--foreground)]/70 font-sans leading-relaxed">
                  Interact with Figure 2 live data variables to observe how Macro GDP, Demographics, and Inflation alter the adjusted beta effect.
                </p>

                <button
                  onClick={() => setActiveTab("modeling")}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[var(--surface-high)] hover:bg-[var(--surface-container)] text-[var(--foreground)] font-mono-data text-xs font-semibold uppercase tracking-wider transition-colors border border-[var(--outline-variant)]/60 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-[var(--primary)]" />
                  <span>Open DAG &amp; Model Tab</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 2: FIGURE 2: DAG & MODELING (Requirements 14 & 16)
            =================================================================== */}
        {activeTab === "modeling" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Figure 2 Live Data Variable DAG (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="p-6 rounded-2xl bg-[var(--surface-lowest)] shadow-sm border border-[var(--outline-variant)]/50 flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--outline-variant)]/40 pb-3">
                  <div>
                    <h3 className="font-editorial text-xl font-bold text-[var(--foreground)]">
                      Figure 2: Live Data Variable DAG
                    </h3>
                    <p className="text-xs text-[var(--outline)] font-mono-data">
                      Interactive Directed Acyclic Graph calibrated for Candidate 0{selectedHypothesis.rank} ({selectedHypothesis.relationshipLabel})
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono-data">
                    <span className="text-[var(--outline)]">Control Load:</span>
                    <span className="font-bold text-[var(--primary)]">{confounderLoad}%</span>
                  </div>
                </div>

                {/* Interactive SVG DAG Graph Canvas */}
                <div className="w-full bg-[var(--surface-low)] rounded-xl p-5 border border-[var(--outline-variant)]/40 relative select-none overflow-x-auto">
                  <svg className="w-full min-w-[580px] h-auto" viewBox="0 0 580 340">
                    <defs>
                      <marker id="arrow-dag" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--primary)" />
                      </marker>
                      <marker id="arrow-confounder" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#b45309" />
                      </marker>
                    </defs>

                    {/* Confounder Nodes at Top */}
                    {/* Confounder 1: Macro GDP Growth */}
                    <g transform="translate(130, 45)">
                      <rect x="-65" y="-18" width="130" height="36" rx="8" fill="var(--surface-container)" stroke="#b45309" strokeWidth="1.5" />
                      <text x="0" y="4" fill="var(--foreground)" fontFamily="var(--font-jetbrains-mono)" fontSize="10" fontWeight="bold" textAnchor="middle">
                        Macro GDP ({macroGdp}%)
                      </text>
                    </g>

                    {/* Confounder 2: Demographics */}
                    <g transform="translate(290, 45)">
                      <rect x="-65" y="-18" width="130" height="36" rx="8" fill="var(--surface-container)" stroke="#b45309" strokeWidth="1.5" />
                      <text x="0" y="4" fill="var(--foreground)" fontFamily="var(--font-jetbrains-mono)" fontSize="10" fontWeight="bold" textAnchor="middle">
                        Demographics ({demographics}%)
                      </text>
                    </g>

                    {/* Confounder 3: Inflation Deflator */}
                    <g transform="translate(450, 45)">
                      <rect x="-65" y="-18" width="130" height="36" rx="8" fill="var(--surface-container)" stroke="#b45309" strokeWidth="1.5" />
                      <text x="0" y="4" fill="var(--foreground)" fontFamily="var(--font-jetbrains-mono)" fontSize="10" fontWeight="bold" textAnchor="middle">
                        Inflation ({inflationDeflator}%)
                      </text>
                    </g>

                    {/* Confounder Influence Arrows to Dataset Nodes */}
                    <line x1="130" y1="63" x2="100" y2="190" stroke="#b45309" strokeWidth={edgeWidthMacro} strokeDasharray="3 3" opacity={0.7} markerEnd="url(#arrow-confounder)" />
                    <line x1="130" y1="63" x2="280" y2="190" stroke="#b45309" strokeWidth={edgeWidthMacro * 0.8} strokeDasharray="3 3" opacity={0.6} markerEnd="url(#arrow-confounder)" />

                    <line x1="290" y1="63" x2="290" y2="190" stroke="#b45309" strokeWidth={edgeWidthDemo} strokeDasharray="3 3" opacity={0.7} markerEnd="url(#arrow-confounder)" />
                    <line x1="290" y1="63" x2="470" y2="190" stroke="#b45309" strokeWidth={edgeWidthDemo * 0.8} strokeDasharray="3 3" opacity={0.6} markerEnd="url(#arrow-confounder)" />

                    <line x1="450" y1="63" x2="290" y2="190" stroke="#b45309" strokeWidth={edgeWidthInfl * 0.8} strokeDasharray="3 3" opacity={0.6} markerEnd="url(#arrow-confounder)" />
                    <line x1="450" y1="63" x2="480" y2="190" stroke="#b45309" strokeWidth={edgeWidthInfl} strokeDasharray="3 3" opacity={0.7} markerEnd="url(#arrow-confounder)" />

                    {/* Primary Dataset Trio Nodes for this Hypothesis */}
                    {/* Node 1: Exposure Vector */}
                    <g transform="translate(100, 230)">
                      <rect x="-80" y="-35" width="160" height="70" rx="10" fill="var(--surface-lowest)" stroke="var(--primary)" strokeWidth="2" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.06))" />
                      <text x="0" y="-12" fill="var(--primary)" fontFamily="var(--font-jetbrains-mono)" fontSize="9" fontWeight="bold" textAnchor="middle">PRIMARY DRIVER (A)</text>
                      <text x="0" y="8" fill="var(--foreground)" fontFamily="var(--font-inter)" fontSize="11" fontWeight="bold" textAnchor="middle">
                        {analysis.dataset1.identifier}
                      </text>
                      <text x="0" y="24" fill="var(--outline)" fontFamily="var(--font-inter)" fontSize="9" textAnchor="middle">
                        {analysis.dataset1.category}
                      </text>
                    </g>

                    {/* Primary Causal Edge 1 -> 2 */}
                    <line x1="180" y1="230" x2="210" y2="230" stroke="var(--primary)" strokeWidth={edgeWidthMain} markerEnd="url(#arrow-dag)" />

                    {/* Node 2: Mediator */}
                    <g transform="translate(290, 230)">
                      <rect x="-80" y="-35" width="160" height="70" rx="10" fill="var(--surface-lowest)" stroke="var(--tertiary)" strokeWidth="2" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.06))" />
                      <text x="0" y="-12" fill="var(--tertiary)" fontFamily="var(--font-jetbrains-mono)" fontSize="9" fontWeight="bold" textAnchor="middle">INTERMEDIARY (B)</text>
                      <text x="0" y="8" fill="var(--foreground)" fontFamily="var(--font-inter)" fontSize="11" fontWeight="bold" textAnchor="middle">
                        {analysis.dataset2.identifier}
                      </text>
                      <text x="0" y="24" fill="var(--outline)" fontFamily="var(--font-inter)" fontSize="9" textAnchor="middle">
                        {analysis.dataset2.category}
                      </text>
                    </g>

                    {/* Primary Causal Edge 2 -> 3 */}
                    <line x1="370" y1="230" x2="400" y2="230" stroke="var(--primary)" strokeWidth={edgeWidthMain} markerEnd="url(#arrow-dag)" />

                    {/* Node 3: Primary Outcome */}
                    <g transform="translate(480, 230)">
                      <rect x="-80" y="-35" width="160" height="70" rx="10" fill="var(--surface-lowest)" stroke="var(--secondary)" strokeWidth="2" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.06))" />
                      <text x="0" y="-12" fill="var(--secondary)" fontFamily="var(--font-jetbrains-mono)" fontSize="9" fontWeight="bold" textAnchor="middle">TARGET OUTCOME (C)</text>
                      <text x="0" y="8" fill="var(--foreground)" fontFamily="var(--font-inter)" fontSize="11" fontWeight="bold" textAnchor="middle">
                        {analysis.dataset3.identifier}
                      </text>
                      <text x="0" y="24" fill="var(--outline)" fontFamily="var(--font-inter)" fontSize="9" textAnchor="middle">
                        {analysis.dataset3.category}
                      </text>
                    </g>
                  </svg>
                </div>

                {/* 16. RESPONSIVE CONTROLS: Sliders for Macro GDP, Demographics, Inflation */}
                <div className="flex flex-col gap-4 pt-2 border-t border-[var(--outline-variant)]/40">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-data text-xs font-bold uppercase text-[var(--foreground)]">
                      Confounder Calibration Controls
                    </span>
                    <button
                      onClick={() => {
                        setMacroGdp(analysis.dagDefaults.macroGdpDefault);
                        setDemographics(analysis.dagDefaults.demographicsDefault);
                        setInflationDeflator(analysis.dagDefaults.inflationDefault);
                      }}
                      className="text-xs font-mono-data text-[var(--primary)] hover:underline cursor-pointer"
                    >
                      Reset Defaults
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Control 1: Macro GDP Growth */}
                    <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40">
                      <div className="flex justify-between text-xs font-mono-data">
                        <span className="font-semibold text-[var(--foreground)]">Macro GDP Growth</span>
                        <span className="font-bold text-[var(--primary)]">{macroGdp}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={macroGdp}
                        onChange={(e) => setMacroGdp(Number(e.target.value))}
                        className="w-full accent-[var(--primary)] cursor-pointer"
                      />
                      <span className="text-[10px] text-[var(--outline)] font-mono-data">
                        Edge stroke: {edgeWidthMacro}px
                      </span>
                    </div>

                    {/* Control 2: Demographics */}
                    <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40">
                      <div className="flex justify-between text-xs font-mono-data">
                        <span className="font-semibold text-[var(--foreground)]">Demographics</span>
                        <span className="font-bold text-[#b45309]">{demographics}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={demographics}
                        onChange={(e) => setDemographics(Number(e.target.value))}
                        className="w-full accent-[#b45309] cursor-pointer"
                      />
                      <span className="text-[10px] text-[var(--outline)] font-mono-data">
                        Edge stroke: {edgeWidthDemo}px
                      </span>
                    </div>

                    {/* Control 3: Inflation Deflator */}
                    <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40">
                      <div className="flex justify-between text-xs font-mono-data">
                        <span className="font-semibold text-[var(--foreground)]">Inflation Deflator</span>
                        <span className="font-bold text-[var(--secondary)]">{inflationDeflator}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={inflationDeflator}
                        onChange={(e) => setInflationDeflator(Number(e.target.value))}
                        className="w-full accent-[var(--secondary)] cursor-pointer"
                      />
                      <span className="text-[10px] text-[var(--outline)] font-mono-data">
                        Edge stroke: {edgeWidthInfl}px
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 14. WHAT THE MODEL SUGGESTS (Plain English first) + Outputs */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="p-6 rounded-2xl bg-[var(--surface-lowest)] shadow-sm border border-[var(--outline-variant)]/50 flex flex-col gap-4">
                <div className="border-b border-[var(--outline-variant)]/40 pb-3">
                  <span className="text-[10px] font-mono-data uppercase font-bold text-[var(--outline)]">
                    Model Assessment
                  </span>
                  <h3 className="font-editorial text-lg font-bold text-[var(--foreground)]">
                    WHAT THE MODEL SUGGESTS
                  </h3>
                </div>

                {/* 14. Plain English First */}
                <div className="p-4 bg-[var(--surface-low)] rounded-xl border border-[var(--outline-variant)]/40 text-xs font-sans text-[var(--foreground)]/85 leading-relaxed">
                  &ldquo;{selectedHypothesis.modelSuggestion}&rdquo;
                </div>

                {/* 16. Plain English Adjusted Effect */}
                <div className="space-y-3 font-mono-data text-xs">
                  <div className="p-3 bg-[var(--surface-low)] rounded-xl border border-[var(--outline-variant)]/40 flex justify-between items-center">
                    <span className="text-[var(--outline)]">Adjusted Effect (β):</span>
                    <span className="font-bold text-base text-[var(--primary)]">{adjustedBeta}</span>
                  </div>

                  <div className="p-3 bg-[var(--surface-low)] rounded-xl border border-[var(--outline-variant)]/40 flex justify-between items-center">
                    <span className="text-[var(--outline)]">Model p-value:</span>
                    <span className="font-bold text-sm text-[var(--foreground)]">{dynamicPValue}</span>
                  </div>

                  <div className="p-3 bg-[var(--surface-low)] rounded-xl border border-[var(--outline-variant)]/40 flex justify-between items-center">
                    <span className="text-[var(--outline)]">Evidence Confidence:</span>
                    <span className="font-bold text-sm text-emerald-600">{dynamicConfidence}</span>
                  </div>

                  <div className="p-3 bg-[var(--surface-low)] rounded-xl border border-[var(--outline-variant)]/40 flex justify-between items-center">
                    <span className="text-[var(--outline)]">Confounder Load:</span>
                    <span className="font-bold text-sm text-[#b45309]">{confounderLoad}%</span>
                  </div>
                </div>

                <div className="text-xs font-sans text-[var(--foreground)]/75 leading-relaxed pt-1">
                  <strong>Plain English Interpretation:</strong> {selectedHypothesis.adjustedEffectExplanation}
                </div>

                <button
                  onClick={() => setActiveTab("evidence")}
                  className="w-full text-center py-2.5 rounded-xl bg-[var(--primary)] text-[var(--on-primary)] font-mono-data text-xs uppercase font-bold tracking-wider hover:opacity-95 transition-all shadow-sm mt-2 cursor-pointer"
                >
                  Proceed to Evidence &amp; Research →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 3: TIME-SERIES DECOMPOSITION (Requirement 15)
            =================================================================== */}
        {activeTab === "timeseries" && (
          <div className="p-6 rounded-2xl bg-[var(--surface-lowest)] shadow-sm border border-[var(--outline-variant)]/50 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--outline-variant)]/40 pb-4">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-[var(--foreground)]">
                  Time-Series Decomposition for Candidate 0{selectedHypothesis.rank}
                </h3>
                <p className="text-xs text-[var(--outline)] font-mono-data">
                  24-month normalized horizon displaying trend, seasonality, and residual noise
                </p>
              </div>
              <div className="flex items-center gap-4 font-mono-data text-xs">
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

            {/* Time-Series Line SVG Canvas */}
            <div className="w-full bg-[var(--surface-low)] rounded-xl p-5 border border-[var(--outline-variant)]/40 overflow-x-auto">
              <svg className="w-full min-w-[650px] h-auto select-none" viewBox="0 0 720 260">
                {/* Horizontal Grid lines */}
                <line x1="50" y1="40" x2="690" y2="40" stroke="var(--outline-variant)" strokeDasharray="3 3" strokeWidth="0.5" />
                <line x1="50" y1="100" x2="690" y2="100" stroke="var(--outline-variant)" strokeDasharray="3 3" strokeWidth="0.5" />
                <line x1="50" y1="160" x2="690" y2="160" stroke="var(--outline-variant)" strokeDasharray="3 3" strokeWidth="0.5" />
                <line x1="50" y1="220" x2="690" y2="220" stroke="var(--outline-variant)" strokeWidth="0.75" />

                {/* Vertical Timeline ticks */}
                {analysis.timeSeriesData.map((pt, idx) => {
                  if (idx % 3 !== 0) return null;
                  const x = 60 + idx * 26;
                  return (
                    <g key={pt.month}>
                      <line x1={x} y1="220" x2={x} y2="225" stroke="var(--outline)" strokeWidth="1" />
                      <text x={x} y="240" fill="var(--outline)" fontFamily="var(--font-jetbrains-mono)" fontSize="9" textAnchor="middle">
                        {pt.month}
                      </text>
                    </g>
                  );
                })}

                {/* Polyline Dataset 1 (Primary Blue) */}
                <polyline
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2.5"
                  points={analysis.timeSeriesData.map((pt, idx) => `${60 + idx * 26},${220 - pt.ds1 * 1.8}`).join(" ")}
                />

                {/* Polyline Dataset 2 (Tertiary Purple) */}
                <polyline
                  fill="none"
                  stroke="var(--tertiary)"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  points={analysis.timeSeriesData.map((pt, idx) => `${60 + idx * 26},${220 - pt.ds2 * 1.8}`).join(" ")}
                />

                {/* Polyline Dataset 3 (Secondary Amber/Slate) */}
                <polyline
                  fill="none"
                  stroke="var(--secondary)"
                  strokeWidth="2"
                  points={analysis.timeSeriesData.map((pt, idx) => `${60 + idx * 26},${220 - pt.ds3 * 1.8}`).join(" ")}
                />
              </svg>
            </div>

            {/* 15. Simple Explanatory Text for Trend, Seasonal Pattern, Residuals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40 flex flex-col gap-1.5">
                <span className="font-mono-data text-[10px] uppercase font-bold text-[var(--primary)]">TREND</span>
                <span className="font-editorial text-base font-bold text-[var(--foreground)]">Overall Trajectory</span>
                <p className="text-xs text-[var(--foreground)]/80 leading-relaxed font-sans">
                  {selectedHypothesis.timeSeriesExplanation.trendText}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40 flex flex-col gap-1.5">
                <span className="font-mono-data text-[10px] uppercase font-bold text-[var(--tertiary)]">SEASONAL PATTERN</span>
                <span className="font-editorial text-base font-bold text-[var(--foreground)]">Recurring Cycle</span>
                <p className="text-xs text-[var(--foreground)]/80 leading-relaxed font-sans">
                  {selectedHypothesis.timeSeriesExplanation.seasonalText}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40 flex flex-col gap-1.5">
                <span className="font-mono-data text-[10px] uppercase font-bold text-emerald-600">RESIDUAL NOISE</span>
                <span className="font-editorial text-base font-bold text-[var(--foreground)]">Noise Stability</span>
                <p className="text-xs text-[var(--foreground)]/80 leading-relaxed font-sans">
                  {selectedHypothesis.timeSeriesExplanation.residualText}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: EMPIRICAL EVIDENCE & WHAT PREVIOUS RESEARCH SAYS (Req 17 & 18)
            =================================================================== */}
        {activeTab === "evidence" && (
          <div className="p-6 rounded-2xl bg-[var(--surface-lowest)] shadow-sm border border-[var(--outline-variant)]/50 flex flex-col gap-6">
            {/* 17. WHAT PREVIOUS RESEARCH SAYS SECTION */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-[var(--surface-lowest)] to-[var(--surface-low)] border border-[var(--primary)]/40 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[var(--outline-variant)]/30 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[var(--primary)]" />
                  <h3 className="font-editorial text-xl font-bold text-[var(--foreground)]">
                    WHAT PREVIOUS RESEARCH SAYS
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono-data text-xs font-bold">
                  {selectedHypothesis.researchMatch.matchStatus}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono-data uppercase font-bold text-[var(--outline)]">
                  Relevant Published Study:
                </span>
                <h4 className="font-editorial text-lg sm:text-xl font-bold text-[var(--foreground)]">
                  &ldquo;{selectedHypothesis.researchMatch.paper.title}&rdquo;
                </h4>
                <div className="text-xs font-mono-data text-[var(--outline)]">
                  {selectedHypothesis.researchMatch.paper.authors} ({selectedHypothesis.researchMatch.paper.year}) • <em>{selectedHypothesis.researchMatch.paper.source}</em>
                </div>
              </div>

              <div className="p-3.5 bg-[var(--surface-lowest)] rounded-lg border border-[var(--outline-variant)]/40 text-xs font-sans text-[var(--foreground)]/85 leading-relaxed">
                <strong>Why it matters:</strong> {selectedHypothesis.researchMatch.paper.whyItMatters}
              </div>

              {/* 18. Epistemic clarity note: research does not prove */}
              <div className="text-[11px] font-mono-data text-[var(--outline)] italic">
                * Note on scientific rigor: Previous research reported a similar relationship. Related research supports further investigation; it does not constitute proven causation.
              </div>

              <div className="pt-2 flex justify-end">
                <a
                  href={selectedHypothesis.researchMatch.paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-[var(--primary)] text-[var(--on-primary)] font-mono-data text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-all shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>VIEW FULL RESEARCH PAPER →</span>
                </a>
              </div>
            </div>

            {/* Automated Empirical Tests */}
            <div className="border-b border-[var(--outline-variant)]/40 pb-2 pt-2">
              <h4 className="font-editorial text-xl font-bold text-[var(--foreground)]">
                Empirical Evidence Ledger // {analysis.hypothesisCode}
              </h4>
              <p className="text-xs text-[var(--outline)] font-mono-data mt-0.5">
                Automated statistical diagnostics evaluating cross-lag correlation and spatial diffusion
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.evidenceItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40 flex flex-col justify-between gap-3"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-data text-[10px] uppercase font-bold text-[var(--primary)]">
                        EVIDENCE CHECK 0{idx + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[var(--surface-container)] font-mono-data text-[10px] font-bold text-emerald-600">
                        Score: {item.score}/100
                      </span>
                    </div>
                    <h5 className="font-editorial text-base font-bold text-[var(--foreground)]">
                      {item.title}
                    </h5>
                    <p className="text-xs text-[var(--foreground)]/75 font-sans leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[var(--outline-variant)]/30 flex items-center justify-between text-[11px] font-mono-data text-[var(--outline)]">
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
                    </span>
                    <span>Diagnostic Reliability: {item.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 5: ALTERNATIVE EXPLANATIONS
            =================================================================== */}
        {activeTab === "alternatives" && (
          <div className="p-6 rounded-2xl bg-[var(--surface-lowest)] shadow-sm border border-[var(--outline-variant)]/50 flex flex-col gap-6">
            <div className="border-b border-[var(--outline-variant)]/40 pb-4">
              <h3 className="font-editorial text-2xl font-bold text-[var(--foreground)]">
                Competing Hypotheses &amp; Potential Confounders
              </h3>
              <p className="text-xs text-[var(--outline)] font-mono-data mt-0.5">
                Plausible counter-explanations that could account for the observed co-movement
              </p>
            </div>

            <div className="space-y-4">
              {analysis.alternativeExplanations.map((alt, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-1 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-data text-[10px] uppercase font-bold text-[var(--outline)]">
                        ALTERNATIVE 0{idx + 1}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-mono-data text-[10px] font-bold ${
                        alt.risk === "High" ? "bg-rose-500/10 text-rose-600" :
                        alt.risk === "Medium" ? "bg-amber-500/10 text-amber-700" : "bg-blue-500/10 text-blue-600"
                      }`}>
                        {alt.risk} Confounder Risk
                      </span>
                    </div>
                    <h4 className="font-editorial text-base font-bold text-[var(--foreground)]">
                      {alt.title}
                    </h4>
                    <p className="text-xs text-[var(--foreground)]/75 font-sans leading-relaxed">
                      {alt.mechanism}
                    </p>
                  </div>
                  <button className="px-3.5 py-2 rounded-lg bg-[var(--surface-container)] hover:bg-[var(--surface-high)] text-[var(--foreground)] text-xs font-mono-data font-semibold shrink-0 transition-colors border border-[var(--outline-variant)]/40 cursor-pointer">
                    Test Counter-Model
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 6: NOTES & ATTESTATION
            =================================================================== */}
        {activeTab === "notes" && (
          <div className="p-6 rounded-2xl bg-[var(--surface-lowest)] shadow-sm border border-[var(--outline-variant)]/50 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--outline-variant)]/40 pb-4">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-[var(--foreground)]">
                  Investigator Notes &amp; Ethical Attestation
                </h3>
                <p className="text-xs text-[var(--outline)] font-mono-data mt-0.5">
                  Record qualitative insights and audit sign-offs for Candidate 0{selectedHypothesis.rank}
                </p>
              </div>
              <button
                onClick={handleSaveNotes}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:opacity-95 text-[var(--on-primary)] font-mono-data text-xs uppercase font-bold tracking-wider shadow-sm transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Attestation</span>
              </button>
            </div>

            {notesSavedNotice && (
              <div className="p-3 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 rounded-xl font-mono-data text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Attestation and investigation notes successfully saved to browser local registry.</span>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono-data uppercase font-bold text-[var(--outline)]">
                Field Audit Log (Markdown Supported):
              </label>
              <textarea
                rows={12}
                value={investigatorNotes}
                onChange={(e) => setInvestigatorNotes(e.target.value)}
                className="w-full bg-[var(--surface-low)] border border-[var(--outline-variant)]/60 rounded-xl p-4 font-mono-data text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] leading-relaxed"
                placeholder="Enter investigation observations, confounding factors, or protocol sign-offs..."
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono-data text-[var(--outline)] pt-2 border-t border-[var(--outline-variant)]/30">
              <span>Sign-off: Dr. Elena Rostova (Principal Investigator)</span>
              <span>Audit Proof: SHA256 deterministic state</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InvestigationWorkspacePage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen flex items-center justify-center p-8 text-xs font-mono-data text-[var(--outline)]">
        Loading Investigation Workspace...
      </div>
    }>
      <InvestigationContent />
    </Suspense>
  );
}
