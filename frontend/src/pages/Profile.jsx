import { useEffect, useState, useCallback } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  User,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  getMe,
  getMyBookings
} from "../services/api";
import ApiErrorState from "../components/ApiErrorState";
function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
  try {
    setLoading(true);
    setError("");

    const [userData, bookingData] = await Promise.all([
      getMe(),
      getMyBookings(),
    ]);

    setUser(userData);
    setBookings(bookingData);
  } catch (err) {
    setError(
      err.message ||
        "Unable to load your profile. Please try again."
    );
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  loadProfile();
}, [loadProfile]);

  const completedBookings = bookings.filter(
    (booking) => booking.status?.toUpperCase() === "COMPLETED"
  );

  const activeBookings = bookings.filter((booking) => {
    const status = booking.status?.toUpperCase();

    return status === "PENDING" || status === "CONFIRMED";
  });

  const cancelledBookings = bookings.filter(
    (booking) => booking.status?.toUpperCase() === "CANCELLED"
  );

  const userInitial =
    user?.full_name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f7]">
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />

            <div className="mt-4 h-12 w-64 animate-pulse rounded bg-zinc-100" />

            <div className="mt-4 h-5 w-96 max-w-full animate-pulse rounded bg-zinc-100" />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-72 animate-pulse rounded-3xl bg-white ring-1 ring-zinc-200" />

            <div className="lg:col-span-2 grid gap-6 sm:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-32 animate-pulse rounded-2xl bg-white ring-1 ring-zinc-200"
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
  return (
    <main className="min-h-screen bg-[#faf9f7] px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-[#df6951]"
        >
          <ArrowLeft
            size={20}
            strokeWidth={2}
            className="shrink-0"
          />

          <span>Back to Home</span>
        </Link>

        <div className="mt-10">
          <ApiErrorState
            title="Unable to load your profile"
            message={error}
            onRetry={loadProfile}
          />
        </div>
      </div>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      {/* HEADER */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-[#df6951]"
          >
            <ArrowLeft
              size={20}
              strokeWidth={2}
              className="shrink-0"
            />
            <span>Back to Home</span>
          </Link>

          <div className="mt-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#df6951]">
              Account
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              My Profile
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
              Manage your account information and keep track of
              your travel activity.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* PROFILE CARD */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#df6951] text-3xl font-bold text-white shadow-lg shadow-[#df6951]/20">
                {userInitial}
              </div>

              <h2 className="mt-5 text-2xl font-bold text-zinc-900">
                {user?.full_name || "User"}
              </h2>

              <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500">
                <Mail size={15} />
                {user?.email}
              </div>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                <CheckCircle2 size={14} />
                Active account
              </div>
            </div>

            <div className="mt-8 space-y-3 border-t border-zinc-100 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">
                  Account ID
                </span>

                <span className="text-sm font-semibold text-zinc-800">
                  #{user?.id}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">
                  Account type
                </span>

                <span className="text-sm font-semibold text-zinc-800">
                  User
                </span>
              </div>
            </div>
          </div>

          {/* STATISTICS */}
          <div className="lg:col-span-2">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">
                      Total bookings
                    </p>

                    <p className="mt-2 text-3xl font-bold text-zinc-900">
                      {bookings.length}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#df6951]/10 text-[#df6951]">
                    <CalendarDays size={21} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">
                      Completed trips
                    </p>

                    <p className="mt-2 text-3xl font-bold text-zinc-900">
                      {completedBookings.length}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={21} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">
                      Active bookings
                    </p>

                    <p className="mt-2 text-3xl font-bold text-zinc-900">
                      {activeBookings.length}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Clock3 size={21} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">
                      Cancelled bookings
                    </p>

                    <p className="mt-2 text-3xl font-bold text-zinc-900">
                      {cancelledBookings.length}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                    <XCircle size={21} />
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
                  <User size={18} />
                </div>

                <div>
                  <h3 className="font-semibold text-zinc-900">
                    Manage your travel
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    View your bookings or discover your personalized
                    recommendations.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/bookings"
                  className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-center text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                >
                  View my bookings
                </Link>

                <Link
                  to="/recommendations"
                  className="flex-1 rounded-xl bg-[#df6951] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#cd5b45]"
                >
                  Discover recommendations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Profile;