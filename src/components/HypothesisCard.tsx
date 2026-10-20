"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Database, 
  Sparkles, 
  ShieldAlert, 
  Activity,
  CheckCircle2,
  TrendingUp,
  Bookmark
} from "lucide-react";
import { Hypothesis } from "@/data/hypothesesData";

interface HypothesisCardProps {
  hypothesis: Hypothesis;
  variant?: "default" | "compact" | "trending";
}

export default function HypothesisCard({ hypothesis, variant = "default" }: HypothesisCardProps) {
  const [whyExpanded, setWhyExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const getVerdictBadge = (verdict: Hypothesis["verdict"]) => {
    switch (verdict) {
      case "Worth Investigating":
        return {
          bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
          dot: "bg-emerald-500"
        };
      case "Moderate Evidence":
        return {
          bg: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
          dot: "bg-blue-500"
        };
      case "Inconclusive":
      default:
        return {
          bg: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
          dot: "bg-amber-500"
        };
    }
  };

  const badgeStyle = getVerdictBadge(hypothesis.verdict);

  if (variant === "trending") {
    return (
      <div className="bg-[var(--surface-lowest)] rounded-2xl p-6 shadow-sm border border-[var(--outline-variant)]/50 hover:shadow-md hover:border-[var(--primary)]/50 transition-all flex flex-col justify-between gap-5 group">
        <div className="flex flex-col gap-3">
          {/* Header row: AI Score & Investigation Count */}
          <div className="flex items-center justify-between font-mono-data text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-bold text-[11px] border border-[var(--primary)]/20">
                AI SCORE {hypothesis.aiScore}
              </span>
              <span className="text-[var(--outline)] text-[11px]">•</span>
              <span className="text-[var(--outline)] text-[11px] font-semibold flex items-center gap-1">
                <Activity className="w-3 h-3 text-[var(--secondary)]" />
                {hypothesis.investigationCount.toLocaleString()} investigated
              </span>
            </div>

            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeStyle.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot} animate-pulse`}></span>
              {hypothesis.verdict}
            </span>
          </div>

          {/* Plain English Title */}
          <Link href={`/research/${hypothesis.researchSlug}`}>
            <h3 className="font-editorial text-lg sm:text-xl font-semibold text-[var(--foreground)] leading-snug group-hover:text-[var(--primary)] transition-colors">
              {hypothesis.title}
            </h3>
          </Link>

          {/* Domain & Combination Tag */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="px-2 py-0.5 rounded bg-[var(--surface-low)] text-[10px] font-mono-data text-[var(--foreground)]/80 border border-[var(--outline-variant)]/40">
              {hypothesis.domain}
            </span>
            <span className="px-2 py-0.5 rounded bg-[var(--surface-container)] text-[10px] font-mono-data text-[var(--secondary)] font-medium">
              {hypothesis.combinationName}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-[var(--outline-variant)]/30 flex items-center justify-between">
          <span className="font-mono-data text-[11px] text-[var(--outline)]">
            ID: {hypothesis.id}
          </span>
          <Link
            href={`/research/${hypothesis.researchSlug}`}
            className="inline-flex items-center gap-1.5 text-xs font-mono-data font-bold text-[var(--primary)] hover:underline uppercase tracking-wider group-hover:translate-x-0.5 transition-transform"
          >
            <span>Investigate Research →</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--surface-lowest)] rounded-2xl p-6 border border-[var(--outline-variant)]/60 shadow-[var(--card-shadow)] flex flex-col justify-between gap-5 hover:border-[var(--primary)] transition-all group">
      <div className="flex flex-col gap-4">
        {/* Top Meta Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono-data text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--primary)] text-sm tracking-wider">
              {hypothesis.id}
            </span>
            <span className="text-[var(--outline)]">•</span>
            <span className="px-2 py-0.5 rounded bg-[var(--surface-low)] text-[10px] font-semibold text-[var(--foreground)] border border-[var(--outline-variant)]/40">
              {hypothesis.domain}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeStyle.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot} animate-pulse`}></span>
              {hypothesis.verdict}
            </span>
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="p-1 rounded text-[var(--outline)] hover:text-[var(--primary)] transition-colors"
              title={isSaved ? "Saved" : "Save hypothesis"}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-[var(--primary)] text-[var(--primary)]" : ""}`} />
            </button>
          </div>
        </div>

        {/* 1. Plain English Title (max 12 words) */}
        <div>
          <Link href={`/research/${hypothesis.researchSlug}`}>
            <h3 className="font-editorial text-xl sm:text-2xl font-semibold text-[var(--foreground)] leading-snug group-hover:text-[var(--primary)] transition-colors">
              {hypothesis.title}
            </h3>
          </Link>
          <div className="font-mono-data text-xs text-[var(--outline)] italic mt-1 line-clamp-2">
            &ldquo;{hypothesis.technicalStatement}&rdquo;
          </div>
        </div>

        {/* 2. Why this is interesting (2-3 sentences, impact, no causation) */}
        <div className="p-3.5 rounded-xl bg-[var(--surface-low)]/70 border border-[var(--outline-variant)]/40">
          <div className="flex items-center gap-1.5 text-[10px] font-mono-data uppercase font-bold text-[var(--secondary)] mb-1">
            <Sparkles className="w-3 h-3 text-[var(--secondary)]" />
            <span>Why this is interesting</span>
          </div>
          <p className="font-sans text-xs text-[var(--foreground)]/85 leading-relaxed">
            {hypothesis.whyInteresting}
          </p>
        </div>

        {/* 3. Datasets Used Tags */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono-data uppercase font-bold text-[var(--outline)] tracking-wider">
            Datasets Screened:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {hypothesis.datasets.map((ds, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[10px] font-mono-data px-2.5 py-1 rounded-md bg-[var(--surface-lowest)] text-[var(--foreground)] border border-[var(--outline-variant)]/50 shadow-xs"
              >
                <Database className="w-3 h-3 text-[var(--secondary)] shrink-0" />
                <span>{ds}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 4. Evidence Confidence & 4 Progress Bars */}
        <div className="p-4 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-variant)]/50 flex flex-col gap-3 font-mono-data text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--outline-variant)]/30">
            <span className="font-bold text-[11px] text-[var(--foreground)] uppercase tracking-wider">
              Evidence Confidence
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] text-[var(--outline)]">AI SCORE:</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                {hypothesis.aiScore}
              </span>
              <span className="text-[10px] text-[var(--outline)]">/ 100</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 pt-1 text-[11px]">
            {/* 1. Pattern Detected */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-[var(--outline)]">Pattern Detected</span>
                <span className="font-bold text-[var(--foreground)]">{hypothesis.patternScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--surface-container)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--primary)] rounded-full transition-all duration-500" 
                  style={{ width: `${hypothesis.patternScore}%` }}
                />
              </div>
            </div>

            {/* 2. Statistical Strength */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-[var(--outline)]">Statistical Strength</span>
                <span className="font-bold text-[var(--foreground)]">{hypothesis.statisticalScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--surface-container)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                  style={{ width: `${hypothesis.statisticalScore}%` }}
                />
              </div>
            </div>

            {/* 3. Replication */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-[var(--outline)]">Replication</span>
                <span className="font-bold text-[var(--foreground)]">{hypothesis.replicationScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--surface-container)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                  style={{ width: `${hypothesis.replicationScore}%` }}
                />
              </div>
            </div>

            {/* 4. Causal Evidence (noticeably lower than AI score) */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                  Causal Evidence
                </span>
                <span className="font-bold text-amber-700 dark:text-amber-400">{hypothesis.causalScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--surface-container)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                  style={{ width: `${hypothesis.causalScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 5. "Why did AI think this?" Expandable Panel (CHANGE 5) */}
        <div className="flex flex-col border border-[var(--outline-variant)]/40 rounded-xl overflow-hidden bg-[var(--surface-lowest)]">
          <button
            onClick={() => setWhyExpanded(!whyExpanded)}
            className="w-full px-4 py-2.5 bg-[var(--surface-low)] hover:bg-[var(--surface-container)] transition-colors flex items-center justify-between font-mono-data text-xs text-[var(--foreground)] font-semibold"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Why did AI think this?</span>
            </div>
            {whyExpanded ? (
              <ChevronUp className="w-4 h-4 text-[var(--outline)]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[var(--outline)]" />
            )}
          </button>

          {whyExpanded && (
            <div className="p-4 flex flex-col gap-3 font-sans text-xs border-t border-[var(--outline-variant)]/40 bg-[var(--surface-lowest)]">
              <ul className="space-y-2 text-[var(--foreground)]/85">
                {hypothesis.whyAiThoughtThis.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-1.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-[var(--outline-variant)]/30 font-mono-data text-[10px] text-[var(--outline)] italic">
                &ldquo;This is a statistical pattern, not proof of cause and effect.&rdquo;
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Action Button (CHANGE 1 — Investigate Research →) */}
      <div className="pt-4 border-t border-[var(--outline-variant)]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="font-mono-data text-[11px] text-[var(--outline)]">
          <span>{hypothesis.combinationName}</span>
          <span className="mx-1.5">•</span>
          <span>{hypothesis.investigationCount.toLocaleString()} peer reviews</span>
        </div>

        <Link
          href={`/research/${hypothesis.researchSlug}`}
          id={`investigate-btn-${hypothesis.id}`}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--on-primary)] hover:opacity-95 font-mono-data text-xs uppercase font-bold tracking-wider transition-all shadow-sm group-hover:shadow-md"
        >
          <span>Investigate Research →</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
