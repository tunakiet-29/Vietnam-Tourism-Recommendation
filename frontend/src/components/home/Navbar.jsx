
import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ClipboardList,
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
  const [managementOpen, setManagementOpen] = useState(false);
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
      window.removeEventListener(
        "auth-changed",
        handleAuthChanged
      );
    };
  }, []);

  useEffect(() => {
    setProfileOpen(false);
    setManagementOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    logout();
    setUser(null);
    setProfileOpen(false);
    setManagementOpen(false);
    setMobileOpen(false);
    navigate("/");
  }

  function isActive(path) {
    return location.pathname === path;
  }

  function isAdminPage() {
    return (
      location.pathname === "/admin" ||
      location.pathname.startsWith("/admin/")
    );
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

  const navLinkClass = (path) =>
    `relative text-sm transition ${
      isActive(path)
        ? "font-medium text-white after:absolute after:-bottom-3 after:left-1/2 after:h-[3px] after:w-7 after:-translate-x-1/2 after:rounded-full after:bg-[#df6951]"
        : "text-white/75 hover:text-white"
    }`;

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
          <Link to="/" className={navLinkClass("/")}>
            Home
          </Link>

          <Link to="/explore" className={navLinkClass("/explore")}>
            Explore
          </Link>

          <button
            type="button"
            onClick={() =>
              handleProtectedRoute("/recommendations")
            }
            className={navLinkClass("/recommendations")}
          >
            Recommendations
          </button>

          {/* ADMIN MANAGEMENT */}
          {user?.role === "admin" && (
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setManagementOpen((previous) => !previous)
                }
                aria-expanded={managementOpen}
                aria-haspopup="menu"
                className={`flex items-center gap-2 text-sm transition ${
                  isAdminPage()
                    ? "font-medium text-white"
                    : "text-white/75 hover:text-white"
                }`}
              >
                <ClipboardList size={16} />
                Management
                <ChevronDown
                  size={15}
                  className={`transition-transform ${
                    managementOpen ? "rotate-180" : ""
                  }`}
                />
                {isAdminPage() && (
                  <span className="absolute -bottom-3 left-1/2 h-[3px] w-7 -translate-x-1/2 rounded-full bg-[#df6951]" />
                )}
              </button>

              {managementOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-[calc(100%+18px)] w-60 overflow-hidden rounded-xl border border-white/10 bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-xl"
                >
                  <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                    Administration
                  </p>

                  <Link
                    to="/admin/tours"
                    role="menuitem"
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                      isActive("/admin/tours")
                        ? "bg-[#df6951]/15 text-[#df6951]"
                        : "text-white/75 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Compass size={17} />
                    Tour Management
                  </Link>

                  <Link
                    to="/admin/bookings"
                    role="menuitem"
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                      isActive("/admin/bookings")
                        ? "bg-[#df6951]/15 text-[#df6951]"
                        : "text-white/75 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <CalendarDays size={17} />
                    Booking Management
                  </Link>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => handleProtectedRoute("/bookings")}
            className={navLinkClass("/bookings")}
          >
            My Bookings
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {loadingUser ? (
            <div className="hidden h-10 w-28 animate-pulse rounded-lg bg-white/10 sm:block" />
          ) : user ? (
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setProfileOpen((previous) => !previous)}
                className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-2 py-2 backdrop-blur-md transition hover:bg-white/15"
                aria-expanded={profileOpen}
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

                  {user.role === "admin" && (
                    <>
                      <div className="my-2 h-px bg-white/10" />

                      <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                        Management
                      </p>

                      <Link
                        to="/admin/tours"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
                      >
                        <Compass size={16} />
                        Tour Management
                      </Link>

                      <Link
                        to="/admin/bookings"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
                      >
                        <ClipboardList size={16} />
                        Booking Management
                      </Link>
                    </>
                  )}

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
            onClick={() => setMobileOpen((previous) => !previous)}
            className="rounded-lg border border-white/15 bg-white/10 p-2.5 text-white backdrop-blur-md transition hover:bg-white/15 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
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
              onClick={() =>
                handleProtectedRoute("/recommendations")
              }
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
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  <User size={17} />
                  Profile
                </Link>

                {user.role === "admin" && (
                  <>
                    <div className="my-3 h-px bg-white/10" />

                    <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                      Management
                    </p>

                    <Link
                      to="/admin/tours"
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition hover:bg-white/10 hover:text-white ${
                        isActive("/admin/tours")
                          ? "bg-white/10 text-white"
                          : "text-white/80"
                      }`}
                    >
                      <Compass size={17} />
                      Tour Management
                    </Link>

                    <Link
                      to="/admin/bookings"
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition hover:bg-white/10 hover:text-white ${
                        isActive("/admin/bookings")
                          ? "bg-white/10 text-white"
                          : "text-white/80"
                      }`}
                    >
                      <ClipboardList size={17} />
                      Booking Management
                    </Link>
                  </>
                )}

                <div className="my-3 h-px bg-white/10" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-red-400 transition hover:bg-red-400/10"
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
