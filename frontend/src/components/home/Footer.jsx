import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-[#faf9f6]">
      <div className="mx-auto flex w-[calc(100%-40px)] max-w-7xl flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between lg:w-[calc(100%-80px)]">
        <Link
          to="/"
          className="font-serif text-2xl font-bold tracking-tight"
        >
          Travel<span className="text-[#df6951]">.</span>
        </Link>

        <p className="text-xs text-zinc-400">
          © 2026 Vietnam Tourism Recommendation System
        </p>

        <div className="flex gap-5 text-xs text-zinc-500">
          <Link to="/explore" className="hover:text-zinc-900">
            Explore
          </Link>

          <Link
            to="/recommendations"
            className="hover:text-zinc-900"
          >
            Recommendations
          </Link>

          <Link to="/login" className="hover:text-zinc-900">
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;