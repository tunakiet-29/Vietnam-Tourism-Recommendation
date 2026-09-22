import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="relative z-20 mx-auto flex w-[calc(100%-40px)] max-w-7xl items-center justify-between py-7 lg:w-[calc(100%-80px)]">
      <Link
        to="/"
        className="font-serif text-3xl font-bold tracking-tight text-white"
      >
        Travel<span className="text-[#df6951]">.</span>
      </Link>

      <div className="hidden items-center gap-8 md:flex">
        <Link
          to="/"
          className="relative text-sm font-medium text-white after:absolute after:-bottom-3 after:left-1/2 after:h-[3px] after:w-7 after:-translate-x-1/2 after:rounded-full after:bg-[#df6951]"
        >
          Home
        </Link>

        <Link
          to="/explore"
          className="text-sm text-white/80 transition hover:text-white"
        >
          Explore
        </Link>

        <Link
          to="/recommendations"
          className="text-sm text-white/80 transition hover:text-white"
        >
          Recommendations
        </Link>

        <Link
          to="/bookings"
          className="text-sm text-white/80 transition hover:text-white"
        >
          My Bookings
        </Link>
      </div>

      <div className="flex items-center gap-5">
        <Link
          to="/login"
          className="hidden text-sm font-medium text-white sm:block"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="rounded-lg bg-[#df6951] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#df6951]/20 transition hover:bg-[#d85d45]"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;