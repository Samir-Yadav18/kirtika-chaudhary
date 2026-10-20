import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, 
  ExternalLink, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  FileText, 
  Layers, 
  ShieldCheck, 
  Activity,
  Sliders,
  Clock,
  MapPin,
  Share2,
  Calendar,
  HelpCircle
} from "lucide-react";
import { 
  HYPOTHESES_DATA, 
  getHypothesisBySlug, 
  getAllHypotheses 
} from "@/data/hypothesesData";
import BrandSignature from "@/components/BrandSignature";

// Pre-render all 100 hypotheses for high performance
export async function generateStaticParams() {
  return getAllHypotheses().map((h) => ({
    slug: h.researchSlug,
  }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ResearchLeadPage({ params }: PageProps) {
  const { slug } = await params;
  const hypothesis = getHypothesisBySlug(slug);

  if (!hypothesis) {
    notFound();
  }

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case "Worth Investigating":
        return {
          badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
          dot: "bg-emerald-500",
          cardBorder: "border-emerald-500/40"
        };
      case "Moderate Evidence":
        return {
          badge: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
          dot: "bg-blue-500",
          cardBorder: "border-blue-500/40"
        };
      case "Inconclusive":
      default:
        return {
          badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
          dot: "bg-amber-500",
          cardBorder: "border-amber-500/40"
        };
    }
  };

  const verdictStyle = getVerdictStyle(hypothesis.verdict);

  // Generate plain English summary under 120 words
  const plainEnglishSummary = `This research lead explores whether ${hypothesis.title.toLowerCase()}. By cross-referencing multi-year observations across ${hypothesis.datasets.join(", ")}, our discovery engine identified a synchronized statistical correlation (Score: ${hypothesis.aiScore}/100). The pattern indicates that changes in the primary indicator correlate with downstream fluctuations after a measurable lag window. This preliminary signal provides a concrete foundation for academic researchers and municipal planners to conduct targeted empirical testing and isolate external confounders without assuming direct cause and effect.`;

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* 1. TOP HEADER & BREADCRUMB */}
      <section className="w-full bg-[var(--surface-lowest)] border-b border-[var(--outline-variant)]/60 px-4 sm:px-8 py-8">
        <div className="max-w-[1536px] mx-auto flex flex-col gap-6">
          {/* Breadcrumb row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono-data text-[var(--outline)]">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-[var(--primary)] uppercase font-semibold">
                NEXUS
              </Link>
              <span>/</span>
              <Link href="/hypotheses" className="hover:text-[var(--primary)] uppercase font-semibold">
                RESEARCH LEADS
              </Link>
              <span>/</span>
              <span className="text-[var(--foreground)] uppercase font-bold">
                {hypothesis.id}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>LEAD IDENTIFIER: <strong className="text-[var(--primary)]">{hypothesis.id}</strong></span>
              <span>•</span>
              <span>DOMAIN: <strong className="text-[var(--secondary)]">{hypothesis.domain}</strong></span>
            </div>
          </div>

          {/* Title & Status Row */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex flex-col gap-3 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono-data text-xs font-bold border ${verdictStyle.badge}`}>
                  <span className={`w-2 h-2 rounded-full ${verdictStyle.dot} animate-pulse`}></span>
                  VERDICT: {hypothesis.verdict.toUpperCase()}
                </span>
                <span className="text-[var(--outline)] font-mono-data text-xs">•</span>
                <span className="font-mono-data text-xs text-[var(--outline)] font-semibold">
                  {hypothesis.combinationName}
                </span>
                <span className="text-[var(--outline)] font-mono-data text-xs">•</span>
                <span className="font-mono-data text-xs text-[var(--secondary)] font-medium">
                  {hypothesis.investigationCount.toLocaleString()} Community Audits
                </span>
              </div>

              <h1 className="font-editorial text-3xl sm:text-5xl font-semibold text-[var(--foreground)] tracking-tight leading-[1.15]">
                {hypothesis.title}
              </h1>

              <div className="font-mono-data text-xs text-[var(--outline)] italic border-l-2 border-[var(--primary)] pl-3 py-0.5">
                Formulation: &ldquo;{hypothesis.technicalStatement}&rdquo;
              </div>
            </div>

            {/* Top Right Actions */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/hypotheses"
                className="px-4 py-2.5 rounded-xl bg-[var(--surface-low)] hover:bg-[var(--surface-container)] text-[var(--foreground)] text-xs font-mono-data font-semibold border border-[var(--outline-variant)]/60 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Research Leads</span>
              </Link>
              <Link
                href="/investigations"
                className="px-5 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--on-primary)] hover:opacity-95 text-xs font-mono-data font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-md shadow-[var(--primary)]/20"
              >
                <Sliders className="w-4 h-4" />
                <span>Open in Investigation Workspace</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-[var(--outline-variant)]/40 font-mono-data text-xs">
            <div className="p-3 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40">
              <div className="text-[10px] text-[var(--outline)] uppercase font-semibold">AI Relevance Score</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{hypothesis.aiScore} / 100</div>
            </div>
            <div className="p-3 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40">
              <div className="text-[10px] text-[var(--outline)] uppercase font-semibold">Pattern Detected</div>
              <div className="text-xl font-bold text-[var(--foreground)] mt-0.5">{hypothesis.patternScore}%</div>
            </div>
            <div className="p-3 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40">
              <div className="text-[10px] text-[var(--outline)] uppercase font-semibold">Statistical Strength</div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">{hypothesis.statisticalScore}%</div>
            </div>
            <div className="p-3 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40">
              <div className="text-[10px] text-[var(--outline)] uppercase font-semibold">Replication Score</div>
              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{hypothesis.replicationScore}%</div>
            </div>
            <div className="p-3 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-amber-700 dark:text-amber-400 uppercase font-semibold">Causal Evidence</div>
              <div className="text-xl font-bold text-amber-700 dark:text-amber-400 mt-0.5">{hypothesis.causalScore}% (Low)</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN REPORT CONTENT */}
      <main className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 py-10 flex flex-col gap-10">
        
        {/* SECTION 1: PLAIN ENGLISH SUMMARY (Under 120 words) */}
        <section className="bg-[var(--surface-lowest)] rounded-2xl p-6 sm:p-8 border border-[var(--outline-variant)]/60 shadow-[var(--card-shadow)] flex flex-col gap-4">
          <div className="flex items-center gap-2.5 border-b border-[var(--outline-variant)]/40 pb-3">
            <BookOpen className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="font-editorial text-2xl font-bold text-[var(--foreground)]">
              1. Plain English Summary
            </h2>
            <span className="ml-auto font-mono-data text-[11px] text-[var(--outline)] uppercase">
              Under 120 words
            </span>
          </div>

          <p className="font-sans text-base sm:text-lg text-[var(--foreground)]/90 leading-relaxed max-w-5xl">
            {plainEnglishSummary}
          </p>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--surface-low)] font-mono-data text-xs text-[var(--secondary)] border border-[var(--outline-variant)]/30">
            <Sparkles className="w-4 h-4 text-[var(--primary)] shrink-0" />
            <span>Real-World Impact: {hypothesis.whyInteresting}</span>
          </div>
        </section>

        {/* SECTION 2: WHY AI SUGGESTED THIS */}
        <section className="bg-[var(--surface-lowest)] rounded-2xl p-6 sm:p-8 border border-[var(--outline-variant)]/60 shadow-[var(--card-shadow)] flex flex-col gap-6">
          <div className="flex items-center gap-2.5 border-b border-[var(--outline-variant)]/40 pb-3">
            <HelpCircle className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="font-editorial text-2xl font-bold text-[var(--foreground)]">
              2. Why AI Suggested This
            </h2>
            <span className="ml-auto font-mono-data text-[11px] text-[var(--outline)] uppercase">
              Multivariate Screening Rationale
            </span>
          </div>

          <p className="font-sans text-sm sm:text-base text-[var(--foreground)]/80 leading-relaxed max-w-4xl">
            During continuous automated screening of open data vectors, the discovery engine flags candidate statistical correlations that exceed significance thresholds (p &lt; 0.01) after adjusting for standard background noise. Here is exactly why this pairing was elevated:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono-data text-xs">
            {/* Matched Datasets */}
            <div className="p-4 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40 flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold text-[var(--outline)] flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[var(--primary)]" />
                Matched Datasets
              </span>
              <ul className="space-y-1.5 pt-1 text-[var(--foreground)]">
                {hypothesis.datasets.map((ds, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[var(--primary)]">•</span>
                    <span className="leading-snug">{ds}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Geographic Overlap */}
            <div className="p-4 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40 flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold text-[var(--outline)] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--secondary)]" />
                Geographic Overlap
              </span>
              <p className="font-sans text-xs text-[var(--foreground)]/90 leading-relaxed pt-1">
                {hypothesis.aiReasoning.geographicOverlap}
              </p>
            </div>

            {/* Temporal Overlap */}
            <div className="p-4 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40 flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold text-[var(--outline)] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--tertiary)]" />
                Temporal Overlap
              </span>
              <p className="font-sans text-xs text-[var(--foreground)]/90 leading-relaxed pt-1">
                {hypothesis.aiReasoning.temporalOverlap}
              </p>
            </div>

            {/* Why it became a research lead */}
            <div className="p-4 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40 flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold text-[var(--outline)] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                Lead Threshold
              </span>
              <p className="font-sans text-xs text-[var(--foreground)]/90 leading-relaxed pt-1">
                {hypothesis.aiReasoning.whyLead}
              </p>
            </div>
          </div>

          {/* Reasoning Bullet Points */}
          <div className="p-4 rounded-xl bg-[var(--surface-container)]/50 border border-[var(--outline-variant)]/40">
            <span className="font-mono-data text-xs uppercase font-bold text-[var(--foreground)] block mb-2">
              Key Empirical Observations:
            </span>
            <ul className="space-y-2 font-sans text-xs sm:text-sm text-[var(--foreground)]/85">
              {hypothesis.whyAiThoughtThis.map((pt, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SECTION 3: SUPPORTING SCIENTIFIC EVIDENCE (2-3 published papers) */}
        <section className="bg-[var(--surface-lowest)] rounded-2xl p-6 sm:p-8 border border-[var(--outline-variant)]/60 shadow-[var(--card-shadow)] flex flex-col gap-6">
          <div className="flex items-center gap-2.5 border-b border-[var(--outline-variant)]/40 pb-3">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h2 className="font-editorial text-2xl font-bold text-[var(--foreground)]">
              3. Supporting Scientific Evidence
            </h2>
            <span className="ml-auto font-mono-data text-[11px] text-emerald-600 uppercase font-semibold">
              Peer-Reviewed Literature
            </span>
          </div>

          <p className="font-sans text-xs sm:text-sm text-[var(--foreground)]/80">
            Real peer-reviewed publications reporting analogous observational correlations or plausible biological / mechanical mechanisms:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hypothesis.scientificEvidence.map((paper, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/50 flex flex-col justify-between gap-4 hover:border-[var(--primary)]/60 transition-all"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between font-mono-data text-[10px] text-[var(--outline)]">
                    <span>PAPER #{idx + 1}</span>
                    <span className="font-semibold text-[var(--foreground)]">{paper.year}</span>
                  </div>

                  <h3 className="font-editorial text-lg font-bold text-[var(--foreground)] leading-snug">
                    {paper.title}
                  </h3>

                  <div className="font-mono-data text-xs text-[var(--secondary)] font-medium">
                    {paper.authors}
                  </div>

                  <p className="font-sans text-xs text-[var(--foreground)]/80 leading-relaxed pt-1 border-t border-[var(--outline-variant)]/30 mt-1">
                    {paper.summary}
                  </p>
                </div>

                <a
                  href={paper.doi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono-data text-[var(--primary)] hover:underline font-bold uppercase tracking-wider pt-2 border-t border-[var(--outline-variant)]/30"
                >
                  <span>Access via DOI / Source Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: CONTRADICTORY EVIDENCE (At least 1 paper that disagrees/alternative explanation) */}
        <section className="bg-[var(--surface-lowest)] rounded-2xl p-6 sm:p-8 border border-amber-500/30 shadow-[var(--card-shadow)] flex flex-col gap-6">
          <div className="flex items-center gap-2.5 border-b border-amber-500/20 pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="font-editorial text-2xl font-bold text-[var(--foreground)]">
              4. Contradictory Evidence & Alternative Explanations
            </h2>
            <span className="ml-auto font-mono-data text-[11px] text-amber-700 dark:text-amber-400 uppercase font-semibold">
              Epistemic Balance
            </span>
          </div>

          <p className="font-sans text-xs sm:text-sm text-[var(--foreground)]/80">
            Scientific rigor requires documenting counter-hypotheses, potential ecological fallacies, and alternative explanations documented in peer review:
          </p>

          <div className="space-y-4">
            {hypothesis.contradictoryEvidence.map((paper, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/30 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="flex flex-col gap-2 max-w-4xl">
                  <div className="flex items-center gap-2 font-mono-data text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase">
                    <span>Counter-Study #{idx + 1}</span>
                    <span>•</span>
                    <span>Published {paper.year}</span>
                  </div>

                  <h3 className="font-editorial text-lg font-bold text-[var(--foreground)] leading-snug">
                    {paper.title}
                  </h3>

                  <div className="font-mono-data text-xs text-[var(--secondary)] font-medium">
                    {paper.authors}
                  </div>

                  <p className="font-sans text-xs text-[var(--foreground)]/85 leading-relaxed pt-1">
                    {paper.summary}
                  </p>
                </div>

                <a
                  href={paper.doi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono-data text-amber-700 dark:text-amber-400 hover:underline font-bold uppercase tracking-wider shrink-0 self-start sm:self-center"
                >
                  <span>Source DOI</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: FINAL VERDICT (Status badge, strictly no causal claim) */}
        <section className={`bg-[var(--surface-lowest)] rounded-2xl p-6 sm:p-8 border ${verdictStyle.cardBorder} shadow-[var(--card-shadow)] flex flex-col gap-6`}>
          <div className="flex items-center justify-between border-b border-[var(--outline-variant)]/40 pb-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[var(--primary)]" />
              <h2 className="font-editorial text-2xl font-bold text-[var(--foreground)]">
                5. Final Verdict
              </h2>
            </div>
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono-data text-xs font-bold border ${verdictStyle.badge}`}>
              <span className={`w-2 h-2 rounded-full ${verdictStyle.dot} animate-pulse`}></span>
              STATUS: {hypothesis.verdict.toUpperCase()}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono-data text-xs">
            <div className="flex flex-col gap-1">
              <span className="font-bold text-[var(--foreground)] uppercase">
                Recommendation for Investigators:
              </span>
              <span className="text-[var(--foreground)]/80 font-sans text-xs">
                {hypothesis.verdict === "Worth Investigating" 
                  ? "Sufficient empirical signal to justify laboratory experiments, instrumental variable regressions, or prospective clinical / sensor monitoring."
                  : hypothesis.verdict === "Moderate Evidence"
                  ? "Plausible correlation observed, but substantial observational confounding requires tighter spatial matching and control groups."
                  : "Statistical association is weak or heavily confounded by ambient covariates; further exploratory screening advised."}
              </span>
            </div>

            <Link
              href="/investigations"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-[var(--on-primary)] hover:opacity-95 text-xs font-mono-data font-bold uppercase tracking-wider transition-all shrink-0"
            >
              <span>Launch Investigation</span>
            </Link>
          </div>

          {/* CRITICAL CAUSATION DISCLAIMER */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-mono-data text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Mandatory Epistemic Protocol — Correlation vs Causation Notice
              </span>
              <p className="font-sans text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed">
                GRAPHICAA evaluates cross-domain observational databases to uncover statistically unexpected co-occurrences. <strong>Under no circumstances does this platform claim or imply direct causation.</strong> All research leads must undergo controlled counterfactual testing, instrumental variable isolation, and experimental peer verification before drawing policy or clinical conclusions.
              </p>
            </div>
          </div>
        </section>

        {/* RESEARCH DOSSIER SIGNATURE STAMP */}
        <div className="pt-6 pb-10 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-[var(--outline-variant)]/40 font-mono-data text-xs text-[var(--outline)]">
          <div className="flex items-center gap-2">
            <span>RESEARCH LEAD DOSSIER #{hypothesis.id}</span>
            <span>•</span>
            <span>GRAPHICAA SYNTHESIS ENGINE</span>
          </div>
          <BrandSignature size="sm" withMark={true} />
        </div>

      </main>
    </div>
  );
}
