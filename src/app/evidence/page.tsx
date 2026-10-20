"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  FileCheck, 
  Download, 
  Share2, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Lock, 
  UserCheck,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { EVIDENCE_AUDITS, HYPOTHESES } from "@/data/nexusData";
import BrandSignature from "@/components/BrandSignature";

export default function EvidencePage() {
  const audit = EVIDENCE_AUDITS[0]; // Evidence #089
  const hypothesis = HYPOTHESES[0];
  const [copiedHash, setCopiedHash] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(audit.verificationHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownloadDossier = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* 1. TOP EVIDENCE HEADER */}
      <section className="w-full bg-[var(--surface-lowest)] border-b border-[var(--outline-variant)]/60 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono-data text-[var(--outline)]">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-[var(--primary)] uppercase font-semibold">
                NEXUS
              </Link>
              <span>/</span>
              <span className="text-[var(--foreground)] uppercase font-bold">
                EVIDENCE ASSESSMENT REPORT #{audit.hypothesisCode}
              </span>
            </div>
            <span>AUDIT STATUS: <strong className="text-[var(--secondary)]">PEER-VERIFIED LEDGER</strong></span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-[var(--secondary-container)] text-[var(--on-secondary-container)] font-mono-data text-[10px] font-bold rounded">
                  {audit.status}
                </span>
                <span className="font-mono-data text-xs text-[var(--outline)]">
                  {audit.timestamp}
                </span>
              </div>
              <h1 className="font-editorial text-2xl sm:text-4xl font-semibold text-[var(--foreground)] tracking-tight">
                {audit.title}
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[var(--foreground)]/75 mt-1 max-w-4xl leading-relaxed">
                Methodological reproducibility audit, sensitivity bounds, Bayesian factor corroboration, and multi-institutional peer review sign-offs.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyHash}
                className="px-3.5 py-2 bg-[var(--surface-high)] hover:bg-[var(--surface-container)] text-[var(--foreground)] text-xs font-mono-data font-semibold border border-[var(--outline-variant)]/60 transition-colors flex items-center gap-1.5"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5 text-[var(--secondary)]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHash ? "HASH COPIED" : "COPY HASH"}</span>
              </button>
              <button
                onClick={handleDownloadDossier}
                className="px-4 py-2 bg-[var(--primary)] text-[var(--on-primary)] hover:opacity-90 text-xs font-mono-data font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadSuccess ? "DOSSIER GENERATED" : "DOWNLOAD DOSSIER"}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REPORT CONTENT GRID */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* Scorecards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-[var(--surface-lowest)] border border-[var(--outline-variant)]/60 shadow-[var(--card-shadow)] flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono-data text-[var(--outline)] uppercase font-semibold">METHODOLOGY SCORE</div>
              <div className="font-editorial text-4xl font-bold text-[var(--primary)] mt-2">
                {audit.methodologyScore} <span className="text-xl font-normal text-[var(--outline)]">/ 100</span>
              </div>
            </div>
            <p className="text-xs text-[var(--foreground)]/70 mt-3 font-sans">
              Evaluated against GRADE criteria for observational observational epidemiology.
            </p>
          </div>

          <div className="p-6 bg-[var(--surface-lowest)] border border-[var(--outline-variant)]/60 shadow-[var(--card-shadow)] flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono-data text-[var(--outline)] uppercase font-semibold">REPRODUCIBILITY SCORE</div>
              <div className="font-editorial text-4xl font-bold text-[var(--secondary)] mt-2">
                {audit.reproducibilityScore} <span className="text-xl font-normal text-[var(--outline)]">/ 100</span>
              </div>
            </div>
            <p className="text-xs text-[var(--foreground)]/70 mt-3 font-sans">
              100% bitwise parity on independent runs across Docker execution environments.
            </p>
          </div>

          <div className="p-6 bg-[var(--surface-lowest)] border border-[var(--outline-variant)]/60 shadow-[var(--card-shadow)] flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono-data text-[var(--outline)] uppercase font-semibold">BAYES FACTOR (BF₁₀)</div>
              <div className="font-editorial text-4xl font-bold text-[var(--primary)] mt-2">
                {audit.bayesFactor}
              </div>
            </div>
            <p className="text-xs text-[var(--foreground)]/70 mt-3 font-sans">
              Substantial empirical evidence favoring alternate hypothesis over null model.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Assessment Text */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Section: Isolated Confounders */}
            <div className="bg-[var(--surface-lowest)] p-6 border border-[var(--outline-variant)]/60 shadow-[var(--card-shadow)] flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-[var(--outline-variant)]/50 pb-3">
                <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
                <h3 className="font-editorial text-xl font-bold text-[var(--foreground)]">
                  Confounder Control & Robustness Checks
                </h3>
              </div>

              <p className="text-xs text-[var(--foreground)]/80 font-sans leading-relaxed">
                Prior to validation sign-off, four primary orthogonal variables were controlled using generalized additive mixed models (GAMMs) with penalized thin-plate regression splines:
              </p>

              <div className="space-y-2.5">
                {audit.confoundersIsolated.map((conf, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-[var(--surface-low)] border border-[var(--outline-variant)]/40">
                    <CheckCircle2 className="w-4 h-4 text-[var(--secondary)] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-[var(--foreground)] font-mono-data">CONF-0{i+1}: </span>
                      <span className="text-[var(--foreground)]/85">{conf}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Risk of Bias Assessment */}
            <div className="bg-[var(--surface-lowest)] p-6 border border-[var(--outline-variant)]/60 shadow-[var(--card-shadow)] flex flex-col gap-4">
              <h3 className="font-editorial text-xl font-bold text-[var(--foreground)] border-b border-[var(--outline-variant)]/50 pb-3">
                Epidemiological Risk-of-Bias Matrix
              </h3>

              <div className="divide-y divide-[var(--outline-variant)]/40 text-xs font-sans">
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[var(--foreground)]">Selection / Exposure Bias</div>
                    <div className="text-[11px] text-[var(--outline)] font-mono-data">Satellite lidar surface resolution calibrated against 128 ground monitoring stations</div>
                  </div>
                  <span className="px-2 py-0.5 bg-[var(--secondary-container)] text-[var(--on-secondary-container)] font-mono-data text-[10px] font-bold rounded">
                    LOW RISK
                  </span>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[var(--foreground)]">Confounding from Temperature Inversion</div>
                    <div className="text-[11px] text-[var(--outline)] font-mono-data">ERA5 boundary layer depth incorporated as explicit non-linear spline covariate</div>
                  </div>
                  <span className="px-2 py-0.5 bg-[var(--secondary-container)] text-[var(--on-secondary-container)] font-mono-data text-[10px] font-bold rounded">
                    LOW RISK
                  </span>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[var(--foreground)]">Temporal Lag Misspecification</div>
                    <div className="text-[11px] text-[var(--outline)] font-mono-data">Distributed lag non-linear models tested from lag 0h through lag 168h</div>
                  </div>
                  <span className="px-2 py-0.5 bg-[var(--secondary-container)] text-[var(--on-secondary-container)] font-mono-data text-[10px] font-bold rounded">
                    LOW RISK
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Peer Sign-offs & Hashes */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Peer Signoffs */}
            <div className="bg-[var(--surface-lowest)] p-5 border border-[var(--outline-variant)]/60 shadow-[var(--card-shadow)] flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-[var(--outline-variant)]/50 pb-3">
                <UserCheck className="w-4 h-4 text-[var(--primary)]" />
                <h3 className="font-editorial text-base font-bold text-[var(--foreground)]">
                  Independent Peer Sign-Offs
                </h3>
              </div>

              <div className="space-y-3">
                {audit.peerSignoffs.map((peer, idx) => (
                  <div key={idx} className="p-3 bg-[var(--surface-low)] border border-[var(--outline-variant)]/40 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[var(--foreground)]">{peer.name}</span>
                      <span className="text-[9px] font-mono-data font-bold text-[var(--secondary)] bg-[var(--secondary-container)] px-1.5 py-0.5 rounded">
                        {peer.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--outline)] font-sans">{peer.role}</div>
                    <div className="text-[10px] font-mono-data text-[var(--outline)]">{peer.institution} • {peer.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cryptographic Ledger */}
            <div className="bg-[var(--surface-lowest)] p-5 border border-[var(--outline-variant)]/60 shadow-[var(--card-shadow)] flex flex-col gap-3 font-mono-data text-xs">
              <div className="flex items-center gap-2 text-[var(--primary)] font-bold text-xs uppercase border-b border-[var(--outline-variant)]/50 pb-2">
                <Lock className="w-3.5 h-3.5" />
                <span>Deterministic Ledger</span>
              </div>
              <div className="text-[11px] text-[var(--outline)]">Verification Proof:</div>
              <div className="p-2.5 bg-[var(--surface-low)] border border-[var(--outline-variant)] text-[10px] break-all">
                {audit.verificationHash}
              </div>
              <div className="text-[10px] text-[var(--outline)]">
                Reproducible execution image: <code>ghcr.io/nexus-synth/audit:sha256-9d2a</code>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Sign-off Signature */}
        <div className="pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--outline-variant)]/40 font-mono-data text-xs text-[var(--outline)]">
          <div>EVIDENCE LEDGER AUDIT #{audit.hypothesisCode} • PEER-VERIFIED SYNTHESIS</div>
          <BrandSignature size="sm" withMark={true} />
        </div>
      </section>
    </div>
  );
}
