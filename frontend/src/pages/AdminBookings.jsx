import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Loader2,
  Search,
  Users,
} from "lucide-react";

import {
  completeAdminBooking,
  getAdminBookings,
} from "../services/api";
import ApiErrorState from "../components/ApiErrorState";

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("vi-VN");
}

function formatCurrency(value) {
  const amount = Number(value);

  return Number.isNaN(amount)
    ? "—"
    : `${amount.toLocaleString("vi-VN")} ₫`;
}

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    payment_status: "",
    search: "",
  });

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminBookings(filters);
      setBookings(data);
    } catch (err) {
      setError(
        err.message || "Unable to load admin bookings."
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  async function handleComplete(bookingId) {
    setCompletingId(bookingId);
    setError("");

    try {
      await completeAdminBooking(bookingId);
      await loadBookings();
    } catch (err) {
      setError(
        err.message || "Unable to complete this booking."
      );
    } finally {
      setCompletingId(null);
    }
  }

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#df6951]">
            Administration
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Booking Management
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
            Review customer bookings and complete tours after they have ended.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 md:grid-cols-[1fr_180px_180px]">
          <label className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 text-zinc-400">
            <Search size={17} />
            <input
              value={filters.search}
              onChange={(event) =>
                updateFilter("search", event.target.value)
              }
              placeholder="Booking ID or customer"
              className="w-full py-3 text-sm text-zinc-800 outline-none"
            />
          </label>

          <select
            value={filters.status}
            onChange={(event) =>
              updateFilter("status", event.target.value)
            }
            className="rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-700 outline-none"
          >
            <option value="">All booking statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="EXPIRED">Expired</option>
          </select>

          <select
            value={filters.payment_status}
            onChange={(event) =>
              updateFilter("payment_status", event.target.value)
            }
            className="rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-700 outline-none"
          >
            <option value="">All payment statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
            <option value="EXPIRED">Expired</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {error && (
          <div className="mt-6">
            <ApiErrorState message={error} onRetry={loadBookings} />
          </div>
        )}

        {loading ? (
          <div className="mt-6 grid gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-2xl border border-zinc-200 bg-white"
              />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center text-sm text-zinc-500">
            No bookings match the selected filters.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {bookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                      Booking #{booking.id} · {booking.status}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-zinc-900">
                      {booking.tour_title}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                      {booking.customer_name} · {booking.customer_email}
                    </p>
                  </div>

                  {booking.status === "CONFIRMED" && (
                    <button
                      type="button"
                      onClick={() => handleComplete(booking.id)}
                      disabled={completingId === booking.id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#df6951] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#cf5d47] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {completingId === booking.id ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          Complete tour
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="mt-5 grid gap-4 rounded-xl bg-zinc-50 p-4 text-sm sm:grid-cols-4">
                  <div>
                    <p className="text-zinc-400">Departure</p>
                    <p className="mt-1 font-semibold text-zinc-800">
                      {formatDate(booking.departure_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-400">Guests</p>
                    <p className="mt-1 flex items-center gap-1.5 font-semibold text-zinc-800">
                      <Users size={15} className="text-[#df6951]" />
                      {booking.number_of_guests}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-400">Payment</p>
                    <p className="mt-1 font-semibold text-zinc-800">
                      {booking.payment_status || "No payment"}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-400">Total</p>
                    <p className="mt-1 font-semibold text-zinc-800">
                      {formatCurrency(booking.total_amount)}
                    </p>
                  </div>
                </div>

                {booking.payment_txn_ref && (
                  <p className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
                    <Clock3 size={14} />
                    Payment reference: {booking.payment_txn_ref}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminBookings;
