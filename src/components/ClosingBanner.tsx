import React from "react";
import BrandSignature from "./BrandSignature";

export default function ClosingBanner() {
  return (
    <section className="w-full relative overflow-hidden rounded-2xl bg-[#F0F7FF] border border-[#D8E8FD] shadow-[0_2px_14px_rgba(59,130,246,0.04)] px-5 sm:px-8 py-5 sm:py-6 transition-all">
      {/* Subtle organic warm glow in the top-left corner matching reference image */}
      <div
        className="absolute -left-6 -top-6 w-36 h-36 bg-amber-100/60 rounded-full blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
        {/* Left & Center: Lightbulb + Main Message */}
        <div className="flex items-center sm:items-start md:items-center gap-4 sm:gap-5 max-w-4xl">
          {/* Circular Lightbulb Badge */}
          <div className="relative shrink-0 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#FFF5EB] border border-[#FDE3C8] flex items-center justify-center shadow-sm">
            {/* Custom Lightbulb with radiating discovery rays matching reference */}
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 text-[#EA580C]"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Radiating spark rays */}
              <line x1="8" y1="8" x2="6" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="24" y1="8" x2="26" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="4" y1="14" x2="2" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="28" y1="14" x2="30" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              
              {/* Lightbulb contour */}
              <path
                d="M16 6C11.5817 6 8 9.58172 8 14C8 16.85 9.49 19.35 11.75 20.76C12.45 21.2 13 22 13 23H19C19 22 19.55 21.2 20.25 20.76C22.51 19.35 24 16.85 24 14C24 9.58172 20.4183 6 16 6Z"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Screw base */}
              <line x1="13" y1="26" x2="19" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M14 29H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-1 sm:gap-1.5">
            <h2 className="font-sans text-lg sm:text-[21px] font-bold text-[#0F294D] tracking-tight leading-tight">
              From Data to Discovery
            </h2>
            <p className="font-sans text-xs sm:text-[13.5px] text-[#475A77] leading-relaxed max-w-[700px]">
              Turn your curiosity into a research opportunity. Our AI helps you connect datasets, research, and real-world insights — so you can focus on what matters: the next big question.
            </p>
          </div>
        </div>

        {/* Right: Reusable Brand Signature */}
        <div className="shrink-0 self-end md:self-center pt-2 md:pt-0 pr-1 sm:pr-2">
          <BrandSignature size="md" forceLight={true} />
        </div>
      </div>
    </section>
  );
}
