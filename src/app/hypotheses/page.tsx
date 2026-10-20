"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  GitBranch, 
  Search, 
  Filter, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  Sliders, 
  Layers, 
  Clock, 
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { HYPOTHESES_DATA, Hypothesis, DATASET_COMBINATIONS } from "@/data/hypothesesData";
import HypothesisCard from "@/components/HypothesisCard";

export default function HypothesesPage() {
  const [selectedVerdict, setSelectedVerdict] = useState<string>("ALL");
  const [selectedCombination, setSelectedCombination] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [hypothesesList, setHypothesesList] = useState<Hypothesis[]>(HYPOTHESES_DATA);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoverySuccessNotice, setDiscoverySuccessNotice] = useState<string | null>(null);

  const verdicts = ["ALL", "Worth Investigating", "Moderate Evidence", "Inconclusive"];

  const filteredHypotheses = hypothesesList.filter((h) => {
    const matchesVerdict = selectedVerdict === "ALL" || h.verdict === selectedVerdict;
    const matchesCombination = selectedCombination === "ALL" || h.combinationName === selectedCombination;
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      !searchQuery ||
      h.title.toLowerCase().includes(q) ||
      h.technicalStatement.toLowerCase().includes(q) ||
      h.domain.toLowerCase().includes(q) ||
      h.combinationName.toLowerCase().includes(q) ||
      h.datasets.some(ds => ds.toLowerCase().includes(q));
    return matchesVerdict && matchesCombination && matchesQuery;
  });

  const handleDiscoverNew = () => {
    setIsDiscovering(true);
    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * hypothesesList.length);
      const randomLead = hypothesesList[randomIdx];
      setIsDiscovering(false);
      setDiscoverySuccessNotice(`Pattern Screened: ${randomLead.id} — ${randomLead.title}`);
      setTimeout(() => setDiscoverySuccessNotice(null), 5000);
    }, 900);
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* 1. TOP HEADER & FILTER BAR */}
      <section className="w-full bg-[var(--surface-lowest)] border-b border-[var(--outline-variant)]/60 px-4 sm:px-6 py-8">
        <div className="max-w-[1536px] mx-auto flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono-data text-[var(--outline)]">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-[var(--primary)] uppercase font-semibold">
                NEXUS
              </Link>
              <span>/</span>
              <span className="text-[var(--foreground)] uppercase font-bold">
                RELATIONSHIP DISCOVERY // 100 RESEARCH LEADS
              </span>
            </div>
            <span>TOTAL INDEXED: <strong className="text-[var(--primary)]">{hypothesesList.length} FORMULATIONS</strong></span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-editorial text-3xl sm:text-5xl font-semibold text-[var(--foreground)] tracking-tight">
                AI Research Leads & Empirical Hypotheses
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[var(--foreground)]/75 mt-1 max-w-3xl leading-relaxed">
                Autonomous screening scans multi-source public registries across 20 cross-domain combinations, flagging statistically improbable multi-variable correlations for rigorous empirical investigation.
              </p>
            </div>

            <button
              onClick={handleDiscoverNew}
              disabled={isDiscovering}
              className="px-6 py-3 bg-[var(--primary)] hover:opacity-95 text-[var(--on-primary)] font-mono-data text-xs uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-[var(--primary)]/20 shrink-0 rounded-xl"
            >
              {isDiscovering ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[var(--secondary)]" />
                  <span>DISCOVERING PATTERNS...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>DISCOVER PATTERNS</span>
                </>
              )}
            </button>
          </div>

          {/* Success Banner */}
          {discoverySuccessNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 font-mono-data text-xs flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{discoverySuccessNotice}</span>
              </div>
              <button
                onClick={() => setDiscoverySuccessNotice(null)}
                className="font-bold uppercase text-[10px] hover:underline"
              >
                DISMISS
              </button>
            </div>
          )}

          {/* Filter Bar & Search */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-4 border-t border-[var(--outline-variant)]/40">
            {/* Left Filters: Status Pills & Combination Select */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono-data">
              <div className="flex items-center gap-1.5 p-1 bg-[var(--surface-low)] rounded-xl border border-[var(--outline-variant)]/40">
                {verdicts.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVerdict(v)}
                    className={`px-3 py-1.5 text-[11px] font-semibold transition-all rounded-lg ${
                      selectedVerdict === v
                        ? "bg-[var(--surface-lowest)] text-[var(--foreground)] font-bold shadow-xs border border-[var(--outline-variant)]/40"
                        : "text-[var(--foreground)]/70 hover:text-[var(--foreground)]"
                    }`}
                  >
                    {v === "ALL" ? "All Statuses" : v}
                  </button>
                ))}
              </div>

              {/* Combination Dropdown */}
              <div className="relative">
                <select
                  value={selectedCombination}
                  onChange={(e) => setSelectedCombination(e.target.value)}
                  className="appearance-none bg-[var(--surface-low)] border border-[var(--outline-variant)]/60 text-[var(--foreground)] font-mono-data text-[11px] font-semibold py-2 pl-3 pr-8 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All 20 Combinations</option>
                  {DATASET_COMBINATIONS.map((combo) => (
                    <option key={combo} value={combo}>
                      {combo}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--outline)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2 bg-[var(--surface-low)] border border-[var(--outline-variant)]/60 px-3.5 py-2 rounded-xl text-xs sm:w-80">
              <Search className="w-4 h-4 text-[var(--outline)] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH LEADS, DATASETS, DOMAINS..."
                className="bg-transparent font-mono-data text-xs focus:outline-none w-full text-[var(--foreground)] uppercase"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[var(--outline)] hover:text-[var(--foreground)] text-[10px] font-mono-data shrink-0"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. HYPOTHESES MATRIX CARDS */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 py-8">
        <div className="flex items-center justify-between pb-4 font-mono-data text-xs text-[var(--outline)]">
          <span>Showing <strong className="text-[var(--foreground)]">{filteredHypotheses.length}</strong> of 100 AI Research Leads</span>
          {(selectedVerdict !== "ALL" || selectedCombination !== "ALL" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedVerdict("ALL");
                setSelectedCombination("ALL");
                setSearchQuery("");
              }}
              className="text-[var(--primary)] hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredHypotheses.length === 0 ? (
          <div className="text-center py-20 bg-[var(--surface-lowest)] rounded-2xl border border-[var(--outline-variant)]/60">
            <div className="font-editorial text-2xl font-bold text-[var(--foreground)]">
              No Research Leads Match Criteria
            </div>
            <p className="text-xs font-mono-data text-[var(--outline)] mt-2 max-w-md mx-auto">
              Try clearing your search terms or selecting &ldquo;All 20 Combinations&rdquo; above.
            </p>
            <button
              onClick={() => {
                setSelectedVerdict("ALL");
                setSelectedCombination("ALL");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 bg-[var(--primary)] text-[var(--on-primary)] font-mono-data text-xs uppercase font-bold rounded-xl"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredHypotheses.map((hyp) => (
              <HypothesisCard key={hyp.id} hypothesis={hyp} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
