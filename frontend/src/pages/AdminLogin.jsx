
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { getMe, login, logout } from "../services/api";

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    let loginSucceeded = false;

    try {
      setLoading(true);

      await login({
        email: email.trim(),
        password,
      });

      loginSucceeded = true;

      const currentUser = await getMe();

      if (currentUser.role !== "admin") {
        logout();
        setError(
          "This account does not have administrator access."
        );
        return;
      }

      const requestedPath = location.state?.from?.pathname;
      const redirectPath =
        requestedPath?.startsWith("/admin/") &&
        requestedPath !== "/admin/login"
          ? requestedPath
          : "/admin/tours";

      const redirectSearch =
        requestedPath && redirectPath === requestedPath
          ? location.state?.from?.search || ""
          : "";

      navigate(`${redirectPath}${redirectSearch}`, {
        replace: true,
      });
    } catch (err) {
      if (loginSucceeded) {
        logout();
      }

      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] px-5 py-12 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
        <div className="w-full">
          <div className="mb-8 text-center">
            <Link
              to="/"
              className="text-lg font-bold tracking-tight text-zinc-900 transition hover:text-[#df6951]"
            >
              Vietinerary
            </Link>

            <p className="mt-8 text-xs font-bold tracking-[0.25em] text-[#df6951]">
              ADMINISTRATION
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900">
              Admin sign in
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Sign in with an administrator account to manage
              tours and bookings.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
          >
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-600"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="admin-email"
                className="text-sm font-medium text-zinc-700"
              >
                Email
              </label>

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="username"
                required
                disabled={loading}
                className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#df6951] focus:ring-2 focus:ring-[#df6951]/10 disabled:bg-zinc-50"
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="admin-password"
                className="text-sm font-medium text-zinc-700"
              >
                Password
              </label>

              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                disabled={loading}
                className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#df6951] focus:ring-2 focus:ring-[#df6951]/10 disabled:bg-zinc-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-[#df6951] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#cf5d47] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying access..." : "Sign in"}
            </button>

            <p className="mt-6 text-center text-sm text-zinc-500">
              <Link
                to="/"
                className="font-semibold text-[#df6951] hover:underline"
              >
                Back to website
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

export default AdminLogin;
