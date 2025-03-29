import type { JSX } from "react";
import { cn } from "~/utils/cn";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onBack: () => void;
  onNext: () => void;
} & JSX.IntrinsicElements["div"];
function Pagination({ currentPage, totalPages, onBack, onNext, className }: PaginationProps) {
  return (
    <div className={cn("flex justify-center items-center gap-2 mt-4", className)}>
      <button
        // onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        onClick={onBack}
        disabled={currentPage === 1}
        className="px-3 py-1 text-xs sm:text-sm rounded-md border border-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span className="text-xs sm:text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <button
        // onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-xs sm:text-sm rounded-md border border-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
