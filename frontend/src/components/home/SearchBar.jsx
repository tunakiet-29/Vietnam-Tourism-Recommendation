import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

function SearchBar() {
  return (
    <div className="mt-10 flex max-w-4xl flex-col gap-2 rounded-2xl border border-white/20 bg-white/15 p-3 shadow-2xl backdrop-blur-xl lg:flex-row lg:items-center">
      <div className="flex min-w-0 flex-1 cursor-pointer items-center justify-between px-4 py-3">
        <div className="flex flex-col">
          <span className="text-xs text-white/50">Where to?</span>
          <span className="mt-1 text-sm font-medium text-white">
            Vietnam
          </span>
        </div>

        <ChevronDown size={17} className="text-white/60" />
      </div>

      <div className="hidden h-12 w-px bg-white/20 lg:block" />

      <div className="flex min-w-0 flex-1 cursor-pointer items-center justify-between px-4 py-3">
        <div className="flex flex-col">
          <span className="text-xs text-white/50">Travel Type</span>
          <span className="mt-1 text-sm font-medium text-white">
            Any type
          </span>
        </div>

        <ChevronDown size={17} className="text-white/60" />
      </div>

      <div className="hidden h-12 w-px bg-white/20 lg:block" />

      <div className="flex min-w-0 flex-1 cursor-pointer items-center justify-between px-4 py-3">
        <div className="flex flex-col">
          <span className="text-xs text-white/50">Duration</span>
          <span className="mt-1 text-sm font-medium text-white">
            Any duration
          </span>
        </div>

        <ChevronDown size={17} className="text-white/60" />
      </div>

      <Link
        to="/explore"
        className="rounded-xl bg-[#df6951] px-8 py-4 text-center text-sm font-semibold text-white transition hover:bg-[#d85d45]"
      >
        Explore
      </Link>
    </div>
  );
}

export default SearchBar;