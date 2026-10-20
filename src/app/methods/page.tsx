"use client";

import React from "react";
import Link from "next/link";
import { 
  Compass, 
  ShieldCheck, 
  Cpu, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Database,
  Layers,
  Activity,
  FileCheck
} from "lucide-react";

export default function MethodsPage() {
  const pipelineStages = [
    {
      step: "01",
      title: "Federated Ingestion & Normalization",
      desc: "Disparate open-data streams (satellite lidar, economic ledgers, hospital records) are ingested, reprojected into standard spatial grids (EPSG:4326), and normalized across time horizons.",
      icon: Database,
    },
    {
      step: "02",
      title: "Autonomous Manifold Discovery",
      desc: "NEXUS DeepSynthesizer executes cross-correlation sweeps across 84,000+ vector pairs, isolating candidate correlations with empirical significance (p < 0.01).",
      icon: Cpu,
    },
    {
      step: "03",
      title: "Epistemic Guardrails & Bias Pruning",
      desc: "Potential associations are screened against Bradford Hill heuristic criteria to flag ecological fallacies, reporting concurrency artifacts, and seasonal oscillations.",
      icon: Filter,
    },
    {
      step: "04",
      title: "Interactive Causal DAG Modeling",
      desc: "Investigator teams calibrate orthogonal confounder weights (e.g. macro GDP, demographic shifts, inflation deflators) to test sensitivity and establish causal plausibility.",
      icon: Layers,
    },
    {
      step: "05",
      title: "Cryptographic Peer Attestation",
      desc: "Validated findings generate deterministic Docker execution images, SHA256 checksums, and multi-institutional peer sign-offs for open reproducibility.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="w-full flex flex-col min-h-screen">
      <section className="w-full bg-[var(--surface-lowest)] border-b border-[var(--outline-variant)]/50 px-4 sm:px-8 py-8">
        <div className="max-w-[1536px] mx-auto flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-mono-data text-[var(--outline)] uppercase">
            <Link href="/" className="hover:text-[var(--primary)] font-semibold">NEXUS</Link>
            <span>/</span>
            <span className="text-[var(--foreground)] font-bold">METHODOLOGY & EPISTEMIC PROTOCOLS</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-5xl font-semibold text-[var(--foreground)] tracking-tight">
            Scientific Discovery & Attestation Architecture
          </h1>
          <p className="font-sans text-sm sm:text-base text-[var(--foreground)]/75 max-w-3xl leading-relaxed">
            NEXUS operates as a decision-support synthesis framework bridging algorithmic exploration with rigorous epidemiological and econometric verification.
          </p>
        </div>
      </section>

      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 py-10 flex flex-col gap-10">
        {/* Core Principles */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)]/50 shadow-sm flex flex-col gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <h3 className="font-editorial text-xl font-bold text-[var(--foreground)]">
              Correlation ≠ Causation
            </h3>
            <p className="text-xs text-[var(--foreground)]/75 font-sans leading-relaxed">
              Every algorithmic discovery signal is explicitly classified as an empirical hypothesis candidate. No claim of causality is substantiated without instrumental variable validation and longitudinal confounder isolation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)]/50 shadow-sm flex flex-col gap-3">
            <ShieldCheck className="w-6 h-6 text-[var(--primary)]" />
            <h3 className="font-editorial text-xl font-bold text-[var(--foreground)]">
              Deterministic Reproducibility
            </h3>
            <p className="text-xs text-[var(--foreground)]/75 font-sans leading-relaxed">
              Analyses run within containerized runtime environments tagged with SHA256 hashes. Independent researchers can download the exact replicated code packs and execute bitwise verification.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)]/50 shadow-sm flex flex-col gap-3">
            <FileCheck className="w-6 h-6 text-emerald-600" />
            <h3 className="font-editorial text-xl font-bold text-[var(--foreground)]">
              Open DOI Provenance
            </h3>
            <p className="text-xs text-[var(--foreground)]/75 font-sans leading-relaxed">
              All raw data feeds are drawn exclusively from authoritative open registries (NOAA, WHO, ECMWF, UNESCO, USGS, SIPRI) with immutable provenance records and citation ledgers.
            </p>
          </div>
        </section>

        {/* 5-Step Pipeline Walkthrough */}
        <section className="flex flex-col gap-6">
          <div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[var(--foreground)]">
              The 5-Stage Synthesis Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-[var(--outline)] font-mono-data mt-1">
              From raw telemetry ingestion to peer-reviewed public dossiers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {pipelineStages.map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className="p-5 rounded-2xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)]/50 shadow-sm flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-data text-xs font-bold text-[var(--primary)]">
                        STAGE {st.step}
                      </span>
                      <Icon className="w-4 h-4 text-[var(--secondary)]" />
                    </div>
                    <h4 className="font-editorial text-base font-bold text-[var(--foreground)] leading-snug">
                      {st.title}
                    </h4>
                    <p className="text-xs text-[var(--foreground)]/75 font-sans leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Action Callout */}
        <section className="p-8 rounded-2xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)]/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[var(--foreground)]">
              Experiment With Live Tri-Vector Synthesis
            </h3>
            <p className="text-xs sm:text-sm text-[var(--foreground)]/70 font-sans mt-1">
              Select any three datasets to test cross-domain statistical separation in real time.
            </p>
          </div>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-[var(--on-primary)] font-mono-data text-xs uppercase font-bold tracking-wider shadow-md hover:opacity-95 transition-all shrink-0"
          >
            <span>Launch Discovery Engine</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
