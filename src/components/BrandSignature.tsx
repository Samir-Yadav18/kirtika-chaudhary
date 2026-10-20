import React from "react";

interface BrandSignatureProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  withMark?: boolean;
  forceLight?: boolean;
}

export default function BrandSignature({
  className = "",
  size = "md",
  withMark = false,
  forceLight = false,
}: BrandSignatureProps) {
  const sizeClasses = {
    sm: "text-lg sm:text-xl",
    md: "text-xl sm:text-[23px]",
    lg: "text-2xl sm:text-3xl",
  };

  return (
    <div
      className={`brand-signature font-signature select-none relative group ${sizeClasses[size]} ${forceLight ? "!text-[#2b4ec8]" : ""} ${className}`}
      style={{
        transform: "rotate(-3.5deg)",
      }}
      aria-label="Better Questions. Bigger Discoveries."
    >
      <div className="flex items-start gap-1.5">
        <div className="flex flex-col tracking-tight font-bold leading-[1.12]">
          <span className="whitespace-nowrap">Better Questions.</span>
          <span className="whitespace-nowrap relative">
            Bigger Discoveries.
            {/* Subtle organic hand-drawn curved swoosh / underline matching reference image */}
            <svg
              className="absolute -bottom-2 right-0 w-[115px] sm:w-[135px] h-2.5 pointer-events-none text-current opacity-90"
              viewBox="0 0 135 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M 3 6.2 C 38 10.2, 88 10.6, 131 4.5"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        {withMark && (
          <span className="inline-block text-amber-500/80 -mt-0.5 animate-pulse" aria-hidden="true">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}
