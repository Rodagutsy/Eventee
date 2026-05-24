"use client";

interface SkeletonProps {
  className?: string;
  lines?: number;
  widths?: string[];
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-[#F1F3F5] rounded-[8px] ${className}`}
    />
  );
}

function SkeletonText({ lines = 4, widths = ["100%", "90%", "80%", "70%"] }: SkeletonProps) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 animate-pulse bg-[#F1F3F5] rounded-[8px]"
          style={{ width: widths[i] || widths[widths.length - 1] }}
        />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonText };
