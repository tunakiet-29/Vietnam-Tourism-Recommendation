import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Compass,
  Heart,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getMe,
  isAuthenticated,
  logout,
} from "../../services/api";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function loadUser() {
    setLoadingUser(true);

    if (!isAuthenticated()) {
      setUser(null);
      setLoadingUser(false);
      return;
    }

    try {
      const currentUser = await getMe();
      setUser(currentUser);
    } catch {
      logout();
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }

  useEffect(() => {
    loadUser();

    const handleAuthChanged = () => {
      loadUser();
    };

    window.addEventListener("auth-changed", handleAuthChanged);

    return () => {
      window.removeEventListener("auth-changed", handleAuthChanged);
    };
  }, []);

  useEffect(() => {
    setProfileOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    logout();
    setUser(null);
    setProfileOpen(false);
    setMobileOpen(false);
    navigate("/");
  }

  function isActive(path) {
    return location.pathname === path;
  }

  function handleProtectedRoute(path) {
    if (!user) {
      navigate("/login", {
        state: {
          from: {
            pathname: path,
          },
        },
      });

      return;
    }

    navigate(path);
  }

  const userInitial =
    user?.full_name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <nav className="relative z-30 mx-auto w-[calc(100%-40px)] max-w-7xl lg:w-[calc(100%-80px)]">
      <div className="flex min-h-[92px] items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="font-serif text-3xl font-bold tracking-tight text-white transition-opacity hover:opacity-90"
        >
          Vietinerary<span className="text-[#df6951]">.</span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className={`relative text-sm font-medium transition ${
              isActive("/")
                ? "text-white after:absolute after:-bottom-3 after:left-1/2 after:h-[3px] after:w-7 after:-translate-x-1/2 after:rounded-full after:bg-[#df6951]"
                : "text-white/75 hover:text-white"
            }`}
          >
            Home
          </Link>

          <Link
            to="/explore"
            className={`relative text-sm transition ${
              isActive("/explore")
                ? "font-medium text-white after:absolute after:-bottom-3 after:left-1/2 after:h-[3px] after:w-7 after:-translate-x-1/2 after:rounded-full after:bg-[#df6951]"
                : "text-white/75 hover:text-white"
            }`}
          >
            Explore
          </Link>

          <button
            type="button"
            onClick={() => handleProtectedRoute("/recommendations")}
            className={`relative text-sm transition ${
              isActive("/recommendations")
                ? "font-medium text-white after:absolute after:-bottom-3 after:left-1/2 after:h-[3px] after:w-7 after:-translate-x-1/2 after:rounded-full after:bg-[#df6951]"
                : "text-white/75 hover:text-white"
            }`}
          >
            Recommendations
          </button>

          <button
            type="button"
            onClick={() => handleProtectedRoute("/bookings")}
            className={`relative text-sm transition ${
              isActive("/bookings")
                ? "font-medium text-white after:absolute after:-bottom-3 after:left-1/2 after:h-[3px] after:w-7 after:-translate-x-1/2 after:rounded-full after:bg-[#df6951]"
                : "text-white/75 hover:text-white"
            }`}
          >
            My Bookings
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {loadingUser ? (
            <div className="hidden h-10 w-28 animate-pulse rounded-lg bg-white/10 sm:block" />
          ) : user ? (
            /* LOGGED IN */
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-2 py-2 backdrop-blur-md transition hover:bg-white/15"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#df6951] text-xs font-bold text-white">
                  {userInitial}
                </span>

                <span className="hidden max-w-24 truncate text-sm font-medium text-white lg:block">
                  {user.full_name || "Account"}
                </span>

                <ChevronDown
                  size={15}
                  className={`text-white/70 transition ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] w-56 overflow-hidden rounded-xl border border-white/10 bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-xl">
                  <div className="border-b border-white/10 px-3 py-3">
                    <p className="truncate text-sm font-semibold text-white">
                      {user.full_name || "User"}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-white/45">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
                  >
                    <User size={16} />
                    Profile
                  </Link>

                  <Link
                    to="/bookings"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
                  >
                    <CalendarDays size={16} />
                    My Bookings
                  </Link>

                  <Link
                    to="/recommendations"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
                  >
                    <Heart size={16} />
                    Recommendations
                  </Link>

                  <div className="my-2 h-px bg-white/10" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-400/10"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* LOGGED OUT */
            <>
              <Link
                to="/login"
                className="hidden text-sm font-medium text-white transition hover:text-white/70 sm:block"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="hidden rounded-lg bg-[#df6951] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#df6951]/20 transition hover:bg-[#d85d45] sm:block"
              >
                Get Started
              </Link>
            </>
          )}

          {/* MOBILE BUTTON */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-lg border border-white/15 bg-white/10 p-2.5 text-white backdrop-blur-md transition hover:bg-white/15 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-black/30 py-4 backdrop-blur-xl md:hidden">
          <div className="space-y-1">
            <Link
              to="/"
              className="block rounded-lg px-4 py-3 text-sm text-white transition hover:bg-white/10"
            >
              Home
            </Link>

            <Link
              to="/explore"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <Compass size={17} />
              Explore
            </Link>

            <button
              type="button"
              onClick={() => handleProtectedRoute("/recommendations")}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <Heart size={17} />
              Recommendations
            </button>

            <button
              type="button"
              onClick={() => handleProtectedRoute("/bookings")}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <CalendarDays size={17} />
              My Bookings
            </button>

            <div className="my-3 h-px bg-white/10" />

            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#df6951] text-xs font-bold text-white">
                    {userInitial}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {user.full_name || "User"}
                    </p>

                    <p className="truncate text-xs text-white/40">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  to="/profile"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <User size={17} />
                  Profile
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-red-400 hover:bg-red-400/10"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-4">
                <Link
                  to="/login"
                  className="rounded-lg border border-white/15 px-4 py-3 text-center text-sm font-medium text-white"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-[#df6951] px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;