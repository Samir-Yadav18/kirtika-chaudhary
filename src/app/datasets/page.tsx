"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  FileSpreadsheet, 
  ExternalLink, 
  CheckCircle2, 
  Eye, 
  Copy, 
  Check,
  Table,
  Layers,
  ArrowUpDown
} from "lucide-react";
import { REPOSITORIES, RepositoryDataset } from "@/data/nexusData";

export default function DatasetsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewDataset, setPreviewDataset] = useState<RepositoryDataset | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const categories = ["ALL", "Atmospheric", "Defence", "Demographic", "Economic", "Education", "Epidemiological", "Geophysical", "Hydrological"];

  const filteredRepos = REPOSITORIES.filter((r) => {
    const matchesCategory = selectedCategory === "ALL" || r.category === selectedCategory;
    const matchesQuery = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const sampleDataRows = [
    { timestamp: "2026-09-12 01:00:00 UTC", lat: 51.5074, lon: -0.1278, val: 14.82, unit: "μg/m³", flag: "QA_PASS" },
    { timestamp: "2026-09-12 01:01:00 UTC", lat: 48.8566, lon: 2.3522, val: 18.15, unit: "μg/m³", flag: "QA_PASS" },
    { timestamp: "2026-09-12 01:02:00 UTC", lat: 52.5200, lon: 13.4050, val: 12.40, unit: "μg/m³", flag: "QA_PASS" },
    { timestamp: "2026-09-12 01:03:00 UTC", lat: 45.4642, lon: 9.1900, val: 32.10, unit: "μg/m³", flag: "QA_WARN_INV" },
    { timestamp: "2026-09-12 01:04:00 UTC", lat: 40.4168, lon: -3.7038, val: 24.60, unit: "μg/m³", flag: "QA_PASS" },
  ];

  const handleDownload = (repo: RepositoryDataset) => {
    setDownloadNotice(`Generating ${repo.format} export stream for ${repo.identifier}...`);
    setTimeout(() => {
      const dummyContent = `Timestamp,Identifier,Institution,Coverage\n${new Date().toISOString()},${repo.identifier},${repo.institution},${repo.coverage}`;
      const blob = new Blob([dummyContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${repo.identifier.toLowerCase()}-dataset.${repo.format.toLowerCase()}`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloadNotice(`Download initiated: ${repo.identifier}`);
      setTimeout(() => setDownloadNotice(null), 3000);
    }, 800);
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* 1. TOP HEADER & FILTER BAR */}
      <section className="w-full bg-[var(--surface-lowest)] border-b border-[var(--outline-variant)]/60 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono-data text-[var(--outline)]">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-[var(--primary)] uppercase font-semibold">
                NEXUS
              </Link>
              <span>/</span>
              <span className="text-[var(--foreground)] uppercase font-bold">
                DATASET LIBRARY & FEDERATED REGISTRY
              </span>
            </div>
            <span>FEDERATED INTEGRITY: <strong className="text-[var(--secondary)]">ALL FEEDS ONLINE</strong></span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[var(--foreground)] tracking-tight">
                Federated Open Data Repository Archive
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[var(--foreground)]/75 mt-1 max-w-3xl leading-relaxed">
                High-throughput, cryptographically verified scientific datasets synchronized directly from international space agencies, meteorological institutes, and health surveillance observatories.
              </p>
            </div>

            <div className="flex items-center gap-3 font-mono-data text-xs bg-[var(--surface-low)] border border-[var(--outline-variant)]/60 p-3 rounded">
              <Database className="w-5 h-5 text-[var(--primary)] shrink-0" />
              <div>
                <div className="font-bold text-[var(--foreground)]">247 INDICES SYNCHRONIZED</div>
                <div className="text-[10px] text-[var(--outline)]">Total Volume: 14.8 PB Structured Data</div>
              </div>
            </div>
          </div>

          {/* Download Notice Notification */}
          {downloadNotice && (
            <div className="p-3 bg-[var(--secondary-container)] text-[var(--on-secondary-container)] border border-[var(--secondary)] font-mono-data text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{downloadNotice}</span>
              </div>
            </div>
          )}

          {/* Category Filter Pills & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[var(--outline-variant)]/40">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono-data">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-[11px] font-semibold uppercase transition-colors rounded ${
                    selectedCategory === cat
                      ? "bg-[var(--primary)] text-[var(--on-primary)] shadow-sm"
                      : "bg-[var(--surface-low)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--outline-variant)]/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-[var(--surface-low)] border border-[var(--outline-variant)]/60 px-3 py-1.5 text-xs">
              <Search className="w-3.5 h-3.5 text-[var(--outline)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH DATASETS, METADATA, SCHEMAS..."
                className="bg-transparent font-mono-data text-xs focus:outline-none w-64 uppercase text-[var(--foreground)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[var(--outline)] hover:text-[var(--foreground)] text-[10px] font-mono-data"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. DATASETS ARCHIVE CARDS */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRepos.map((repo) => (
            <div
              key={repo.id}
              className="bg-[var(--surface-lowest)] p-6 border border-[var(--outline-variant)]/60 shadow-[var(--card-shadow)] flex flex-col justify-between gap-5 hover:border-[var(--primary)] transition-all group"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between font-mono-data text-xs">
                  <span className="font-bold text-[var(--primary)] text-sm tracking-wider">
                    {repo.identifier}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-[var(--surface-high)] text-[var(--foreground)]">
                    {repo.format}
                  </span>
                </div>

                <h3 className="font-editorial text-xl font-semibold text-[var(--foreground)] leading-snug group-hover:text-[var(--primary)] transition-colors">
                  {repo.title}
                </h3>

                <p className="font-sans text-xs text-[var(--foreground)]/80 leading-relaxed">
                  {repo.description}
                </p>

                {/* Metadata Grid */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-[var(--surface-low)] border border-[var(--outline-variant)]/40 font-mono-data text-xs mt-1">
                  <div>
                    <div className="text-[9px] text-[var(--outline)] uppercase">FREQUENCY</div>
                    <div className="font-semibold text-[var(--foreground)]">{repo.frequency}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-[var(--outline)] uppercase">THROUGHPUT</div>
                    <div className="font-semibold text-[var(--foreground)]">{repo.throughput}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-[var(--outline)] uppercase">LATENCY</div>
                    <div className="font-semibold text-[var(--secondary)]">{repo.latencyMs} ms</div>
                  </div>
                </div>

                <div className="text-[11px] font-mono-data text-[var(--outline)] flex flex-col gap-0.5 pt-1">
                  <div><strong>Institution:</strong> {repo.institution}</div>
                  <div><strong>Spatial Resolution:</strong> {repo.spatialResolution}</div>
                  <div><strong>Coverage:</strong> {repo.coverage} ({repo.recordsCount})</div>
                  <div className="text-[10px] truncate text-[var(--outline)]/80">{repo.checksum}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--outline-variant)]/40 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <a
                    href={repo.researchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[var(--surface-high)] hover:bg-[var(--surface-container)] text-[var(--foreground)] text-xs font-mono-data font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 border border-[var(--outline-variant)]/60 hover:border-[var(--primary)]"
                    id={`view-profile-${repo.id}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>VIEW PROFILE</span>
                  </a>

                  <button
                    onClick={() => setPreviewDataset(repo)}
                    className="px-3 py-1.5 bg-[var(--surface-high)] hover:bg-[var(--surface-container)] text-[var(--foreground)] text-xs font-mono-data font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                    id={`preview-data-${repo.id}`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>PREVIEW DATA</span>
                  </button>
                </div>

                <button
                  onClick={() => handleDownload(repo)}
                  className="px-3.5 py-1.5 bg-[var(--primary)] text-[var(--on-primary)] hover:opacity-90 text-xs font-mono-data font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
                  id={`download-${repo.id}`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD ({repo.format})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Preview Modal */}
      {previewDataset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface-lowest)] border border-[var(--outline-variant)] w-full max-w-3xl shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[var(--outline-variant)] pb-3">
              <div>
                <span className="text-[10px] font-mono-data text-[var(--outline)] uppercase font-semibold">
                  LIVE EMPIRICAL SAMPLE STREAM
                </span>
                <h4 className="font-editorial text-xl font-bold text-[var(--foreground)]">
                  {previewDataset.identifier} — {previewDataset.title}
                </h4>
              </div>
              <button
                onClick={() => setPreviewDataset(null)}
                className="text-xs font-mono-data text-[var(--outline)] hover:text-[var(--foreground)]"
              >
                ESC
              </button>
            </div>

            <div className="overflow-x-auto border border-[var(--outline-variant)]/50">
              <table className="w-full text-left font-mono-data text-xs">
                <thead>
                  <tr className="bg-[var(--surface-low)] text-[var(--outline)] text-[10px] uppercase border-b border-[var(--outline-variant)]/50">
                    <th className="p-2.5">TIMESTAMP (UTC)</th>
                    <th className="p-2.5">LAT</th>
                    <th className="p-2.5">LON</th>
                    <th className="p-2.5">OBSERVED VALUE</th>
                    <th className="p-2.5">UNIT</th>
                    <th className="p-2.5">QA FLAG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--outline-variant)]/30 text-xs">
                  {sampleDataRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[var(--surface-low)] transition-colors">
                      <td className="p-2.5 text-[var(--foreground)]">{row.timestamp}</td>
                      <td className="p-2.5">{row.lat.toFixed(4)}</td>
                      <td className="p-2.5">{row.lon.toFixed(4)}</td>
                      <td className="p-2.5 font-bold text-[var(--primary)]">{row.val.toFixed(2)}</td>
                      <td className="p-2.5 text-[var(--outline)]">{row.unit}</td>
                      <td className="p-2.5">
                        <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                          row.flag === "QA_PASS"
                            ? "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]"
                            : "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200"
                        }`}>
                          {row.flag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-xs font-mono-data text-[var(--outline)] pt-2 border-t border-[var(--outline-variant)]">
              <span>Ingested over websocket stream // 14.8 MB/s</span>
              <button
                onClick={() => setPreviewDataset(null)}
                className="px-4 py-1.5 bg-[var(--primary)] text-[var(--on-primary)] font-semibold"
              >
                CLOSE PREVIEW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
