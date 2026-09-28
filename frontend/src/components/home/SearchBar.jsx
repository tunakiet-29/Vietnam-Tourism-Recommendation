import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch(event) {
    event.preventDefault();

    const value = query.trim();

    if (!value) {
      navigate("/explore");
      return;
    }

    navigate(
      `/explore?destination=${encodeURIComponent(value)}`
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className="mt-10 flex w-full max-w-4xl items-center gap-4"
    >
      {/* SEARCH ICON */}
      <Search
        size={25}
        strokeWidth={2}
        className="shrink-0 text-white/70"
      />

      {/* SEARCH INPUT */}
      <div className="flex h-16 flex-1 items-center rounded-2xl border border-white/20 bg-black/25 px-5 shadow-2xl backdrop-blur-xl transition focus-within:border-white/40 focus-within:bg-black/35">
        <input
          type="text"
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="Search destinations..."
          className="w-full bg-transparent text-base font-medium text-white outline-none placeholder:text-white/40"
        />
      </div>
    </form>
  );
}

export default SearchBar;