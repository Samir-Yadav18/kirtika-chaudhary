"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  User, 
  Database, 
  Activity, 
  GitBranch, 
  ShieldCheck, 
  Sliders,
  Bell,
  ChevronDown,
  Compass
} from "lucide-react";
import { REPOSITORIES } from "@/data/nexusData";

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);

  const navLinks = [
    { label: "Research", href: "/", icon: Activity },
    { label: "Datasets", href: "/datasets", icon: Database },
    { label: "Discover", href: "/discover", icon: GitBranch },
    { label: "Investigations", href: "/investigations", icon: Sliders },
    { label: "Evidence", href: "/evidence", icon: ShieldCheck },
    { label: "Methods", href: "/methods", icon: Compass },
  ];

  const searchResults = searchQuery.trim() === "" ? [] : REPOSITORIES.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.institution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--surface)]/90 backdrop-blur-xl border-b border-[var(--outline-variant)]/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-colors">
        <div className="h-16 w-full max-w-[1536px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-[var(--primary)]/10 p-0.5 border border-[var(--primary)]/20 shadow-sm">
                <Image
                  src="/nexus_logo.svg"
                  alt="NEXUS Scientific Emblem"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-editorial text-xl font-bold tracking-tight text-[var(--foreground)] leading-none group-hover:text-[var(--primary)] transition-colors">
                  NEXUS
                </span>
                <span className="font-mono-data text-[9px] uppercase tracking-widest text-[var(--outline)] font-semibold mt-0.5">
                  Research Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1 px-1.5 py-1 bg-[var(--surface-low)] rounded-xl border border-[var(--outline-variant)]/40">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-normal transition-all ${
                      isActive
                        ? "bg-[var(--surface-lowest)] text-[var(--foreground)] font-semibold shadow-sm"
                        : "text-[var(--foreground)]/70 hover:text-[var(--foreground)] hover:bg-[var(--surface-container)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Tools & Telemetry */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Search Bar */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[var(--surface-low)] hover:bg-[var(--surface-container)] rounded-lg text-[var(--foreground)]/70 text-xs border border-[var(--outline-variant)]/50 transition-colors shadow-inner"
              title="Search hypotheses, datasets... (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-[var(--outline)]" />
              <span className="text-xs text-[var(--foreground)]/60 pr-2">Search hypotheses, datasets...</span>
              <kbd className="px-1.5 py-0.5 font-mono-data text-[10px] bg-[var(--surface-lowest)] text-[var(--outline)] rounded shadow-sm border border-[var(--outline-variant)]/50">
                ⌘K
              </kbd>
            </button>

            {/* Live Indexed Repositories Pill */}
            <div className="hidden 2xl:flex items-center gap-2 px-3 py-1 bg-[var(--surface-low)] rounded-full border border-[var(--outline-variant)]/50 text-xs font-medium text-[var(--foreground)]/80">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse"></span>
              <span className="font-mono-data text-[11px]">247 Repositories Indexed</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[var(--foreground)]/70 hover:text-[var(--foreground)] hover:bg-[var(--surface-container)] transition-colors border border-[var(--outline-variant)]/50"
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'light' ? 'Obsidian Dark' : 'Editorial Light'} mode`}
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-amber-300" />
              )}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                aria-label="Notifications"
                className="relative p-2 rounded-lg text-[var(--foreground)]/70 hover:text-[var(--foreground)] hover:bg-[var(--surface-container)] transition-colors border border-[var(--outline-variant)]/50"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--primary-container)] ring-2 ring-[var(--surface)]"></span>
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[var(--surface-lowest)] border border-[var(--outline-variant)] shadow-xl rounded-xl p-3 z-50 text-xs">
                  <div className="font-bold text-[var(--foreground)] mb-2 flex items-center justify-between">
                    <span>Recent Synthesis Alerts</span>
                    <span className="text-[10px] text-[var(--secondary)] font-mono-data">3 New</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 bg-[var(--surface-low)] rounded text-[11px]">
                      <span className="font-bold text-[var(--primary)]">HYP-2025-0841</span> updated with 12 new Eurostat NUTS-3 covariance points.
                    </div>
                    <div className="p-2 bg-[var(--surface-low)] rounded text-[11px]">
                      <span className="font-bold text-emerald-600">NOAA Stream</span> 100% verified against SHA256 cryptographic proof.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-[var(--outline-variant)]/50">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[var(--outline-variant)]/60 shadow-sm shrink-0">
                <Image
                  src="/avatars/kirtika.jpg"
                  alt="Kirtika Chaudhary"
                  width={64}
                  height={64}
                  unoptimized
                  className="w-full h-full object-cover rounded-full"
                  priority
                />
              </div>
              <div className="hidden lg:flex flex-col text-left leading-none">
                <span className="text-xs font-semibold text-[var(--foreground)]">
                  Kirtika Chaudhary
                </span>
                <span className="text-[10px] text-[var(--outline)] font-mono-data mt-0.5">
                  Research Fellow
                </span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-[var(--foreground)] hover:bg-[var(--surface-container)] rounded-lg border border-[var(--outline-variant)]/50"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[var(--surface-lowest)] border-b border-[var(--outline-variant)] px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg ${
                    isActive
                      ? "bg-[var(--primary)] text-[var(--on-primary)] font-semibold"
                      : "text-[var(--foreground)]/80 hover:bg-[var(--surface-container)]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-[var(--outline-variant)]/50 flex items-center justify-between text-xs font-mono-data text-[var(--outline)]">
              <span>Kirtika Chaudhary</span>
              <span>247 Repositories Indexed</span>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-[var(--surface-lowest)] border border-[var(--outline-variant)] w-full max-w-2xl shadow-2xl rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[var(--outline-variant)] pb-3">
              <div className="flex items-center gap-2.5 flex-1">
                <Search className="w-4 h-4 text-[var(--outline)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH HYPOTHESES, DATASETS, COVARIANCE VECTORS..."
                  className="bg-transparent font-mono-data text-xs w-full focus:outline-none uppercase text-[var(--foreground)]"
                  autoFocus
                />
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="text-[var(--outline)] hover:text-[var(--foreground)] text-xs font-mono-data px-2 py-1"
              >
                ESC
              </button>
            </div>

            {/* Live Search Suggestions */}
            <div className="max-h-80 overflow-y-auto space-y-2 py-1">
              {searchQuery.trim() === "" ? (
                <div className="text-center py-8 text-xs font-mono-data text-[var(--outline)]">
                  TYPE TO QUERY ACROSS 247 SYNCHRONIZED PUBLIC REGISTRIES
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-6 text-xs font-mono-data text-[var(--outline)]">
                  NO MATCHING EMPIRICAL REGISTRIES FOUND FOR &quot;{searchQuery}&quot;
                </div>
              ) : (
                searchResults.map((result) => (
                  <Link
                    key={result.id}
                    href={`/datasets?q=${encodeURIComponent(result.identifier)}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex flex-col p-3 bg-[var(--surface-low)] hover:bg-[var(--surface-container)] border border-[var(--outline-variant)]/40 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono-data font-bold text-[var(--primary)]">{result.identifier}</span>
                      <span className="font-mono-data text-[10px] text-[var(--secondary)]">{result.frequency}</span>
                    </div>
                    <div className="font-sans text-xs text-[var(--foreground)] mt-0.5 font-medium">{result.title}</div>
                    <div className="font-mono-data text-[10px] text-[var(--outline)] mt-1">{result.institution} • {result.format}</div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
