"use client";

import React, { useState } from "react";
import { ShieldCheck, Download, Quote, CheckCircle, Copy } from "lucide-react";

export default function Footer() {
  const [citeModalOpen, setCiteModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const bibtexCitation = `@article{nexus_synthesis_2026,
  title = {NEXUS: Autonomous Cross-Disciplinary Public Data Research Intelligence Platform},
  author = {Rostova, Elena and Lindholm, Magnus and Thorne, Marcus},
  journal = {Journal of Open Empirical Synthesis},
  volume = {4},
  number = {2},
  pages = {142--189},
  year = {2026},
  doi = {10.1038/s41586-026-nexus-089}
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bibtexCitation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <footer className="w-full bg-[var(--surface-lowest)] border-t border-[var(--outline-variant)]/60 shadow-[0_-1px_10px_rgba(0,0,0,0.03)] transition-colors mt-auto">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[var(--outline-variant)]/40">
            {/* Epistemic Integrity Safeguard */}
            <div className="md:col-span-6 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
                <span className="font-mono-data text-xs uppercase tracking-wider text-[var(--foreground)] font-bold">
                  Epistemic Integrity Safeguard
                </span>
              </div>
              <p className="text-xs text-[var(--foreground)]/75 leading-relaxed font-sans max-w-xl">
                All algorithmic hypotheses generated across NEXUS undergo deterministic replication protocols and cross-repository synthesis validation prior to evidence tiering. Machine synthesis outputs are calibrated against indexed peer-reviewed registries.
              </p>
            </div>

            {/* Platform State */}
            <div className="md:col-span-3 flex flex-col gap-1.5 font-mono-data text-xs">
              <span className="text-[10px] uppercase tracking-wider text-[var(--outline)] font-bold">
                Platform State
              </span>
              <div className="flex items-center gap-2 text-[var(--foreground)] font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>Sync Active • Latency 14ms</span>
              </div>
              <span className="text-[11px] text-[var(--outline)]">
                Registry Node: US-East BioCluster 04
              </span>
            </div>

            {/* Actions */}
            <div className="md:col-span-3 flex flex-wrap items-center justify-start md:justify-end gap-2.5">
              <button
                onClick={() => setCiteModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--surface-low)] hover:bg-[var(--surface-container)] text-[var(--foreground)] text-xs font-mono-data border border-[var(--outline-variant)]/50 transition-colors shadow-sm"
              >
                <Quote className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>Quick Citation</span>
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([bibtexCitation], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "nexus-synthesis.bib";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--surface-low)] hover:bg-[var(--surface-container)] text-[var(--foreground)] text-xs font-mono-data border border-[var(--outline-variant)]/50 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-[var(--secondary)]" />
                <span>Export Synthesis</span>
              </button>
            </div>
          </div>

          {/* Bottom Copyright & Governance Links */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-data text-[var(--outline)]">
            <div className="flex flex-wrap items-center gap-4">
              <span>© 2025–2026 NEXUS Discovery Consortium. All rights reserved.</span>
              <a href="#governance" className="hover:text-[var(--foreground)] transition-colors">
                Ethical AI Protocol
              </a>
              <a href="#governance" className="hover:text-[var(--foreground)] transition-colors">
                Data Governance
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-[var(--surface-low)] px-2 py-0.5 rounded border border-[var(--outline-variant)]/40 text-[var(--foreground)]">
                Version 4.12.0-synth
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Citation Modal */}
      {citeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface-lowest)] border border-[var(--outline-variant)] w-full max-w-xl shadow-2xl rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[var(--outline-variant)] pb-3">
              <div className="flex items-center gap-2">
                <Quote className="w-4 h-4 text-[var(--primary)]" />
                <h4 className="font-editorial text-lg font-bold text-[var(--foreground)]">
                  Quick Citation (BibTeX)
                </h4>
              </div>
              <button
                onClick={() => setCiteModalOpen(false)}
                className="text-xs font-mono-data text-[var(--outline)] hover:text-[var(--foreground)]"
              >
                ESC
              </button>
            </div>

            <div className="relative bg-[var(--surface-low)] p-3 border border-[var(--outline-variant)] font-mono-data text-[11px] text-[var(--foreground)] overflow-x-auto rounded-lg">
              <pre>{bibtexCitation}</pre>
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-[var(--surface-lowest)] hover:bg-[var(--surface-container)] border border-[var(--outline-variant)] text-[10px] uppercase font-mono-data rounded transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-3 h-3 text-[var(--secondary)]" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs font-mono-data text-[var(--outline)] pt-2 border-t border-[var(--outline-variant)]">
              <span>DOI: 10.1038/s41586-026-nexus-089</span>
              <button
                onClick={() => setCiteModalOpen(false)}
                className="px-3 py-1 bg-[var(--primary)] text-[var(--on-primary)] font-semibold rounded"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
