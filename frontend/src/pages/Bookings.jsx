import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  Users,
  XCircle,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  cancelBooking,
  getMyBookings,
  getTourById,
  getTourSchedules,
} from "../services/api";

import { destinationImages } from "../data/destinationImages";

function formatDate(dateString) {
  if (!dateString) {
    return "—";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatCurrency(value) {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "—";
  }

  return `${amount.toLocaleString("vi-VN")} ₫`;
}

function getStatusConfig(status) {
  switch (status?.toUpperCase()) {
    case "CONFIRMED":
      return {
        label: "Confirmed",
        className: "bg-blue-50 text-blue-600",
        icon: CheckCircle2,
      };

    case "COMPLETED":
      return {
        label: "Completed",
        className: "bg-emerald-50 text-emerald-600",
        icon: CheckCircle2,
      };

    case "PENDING":
      return {
        label: "Pending",
        className: "bg-amber-50 text-amber-600",
        icon: Clock3,
      };

    case "CANCELLED":
      return {
        label: "Cancelled",
        className: "bg-red-50 text-red-500",
        icon: XCircle,
      };

    default:
      return {
        label: status || "Unknown",
        className: "bg-zinc-100 text-zinc-500",
        icon: Clock3,
      };
  }
}

function Bookings() {
  const location = useLocation();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [cancellingId, setCancellingId] = useState(null);

  async function loadBookings() {
    setLoading(true);
    setError("");

    try {
      const bookingData = await getMyBookings();

      const enrichedBookings = await Promise.all(
        bookingData.map(async (booking) => {
          try {
            const [tour, schedules] = await Promise.all([
              getTourById(booking.tour_id),
              getTourSchedules(booking.tour_id),
            ]);

            const schedule = schedules.find(
              (item) => item.id === booking.schedule_id
            );

            return {
              ...booking,
              tour,
              schedule: schedule || null,
            };
          } catch {
            return {
              ...booking,
              tour: null,
              schedule: null,
            };
          }
        })
      );

      setBookings(enrichedBookings);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load your bookings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();

    if (location.state?.bookingCreated) {
      setSuccessMessage(
        `Booking #${location.state.bookingId} created successfully.`
      );

      navigate("/bookings", {
        replace: true,
        state: {},
      });
    }
  }, [location.state, navigate]);

  async function handleCancelBooking(bookingId) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    setCancellingId(bookingId);
    setError("");
    setSuccessMessage("");

    try {
      await cancelBooking(bookingId);

      setSuccessMessage(
        `Booking #${bookingId} has been cancelled successfully.`
      );

      await loadBookings();
    } catch (err) {
      setError(
        err.message ||
          "Unable to cancel this booking. Please try again."
      );
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      {/* HEADER */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          {/* BACK TO HOME */}
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
              My travel
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              My Bookings
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
              Manage your trips, review your booking details, and
              keep track of your travel plans.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            <CheckCircle2 size={19} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
              >
                <div className="h-56 animate-pulse bg-zinc-100" />

                <div className="space-y-4 p-6">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-zinc-100" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-100" />
                  <div className="h-20 animate-pulse rounded-xl bg-zinc-100" />
                  <div className="h-11 animate-pulse rounded-xl bg-zinc-100" />
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          /* EMPTY STATE */
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#df6951]/10 text-[#df6951]">
              <CalendarDays size={24} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-zinc-900">
              No bookings yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
              You have not booked any tours yet. Explore Vietnam
              and find your next destination.
            </p>

            <Link
              to="/explore"
              className="mt-6 inline-flex rounded-xl bg-[#df6951] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#cd5b45]"
            >
              Explore tours
            </Link>
          </div>
        ) : (
          /* BOOKING LIST */
          <div className="grid gap-6 lg:grid-cols-2">
            {bookings.map((booking) => {
              const tour = booking.tour;
              const schedule = booking.schedule;

              const status = getStatusConfig(booking.status);
              const StatusIcon = status.icon;

              const tourImage =
                tour?.image ||
                destinationImages[tour?.destination_id] ||
                "";

              return (
                <article
                  key={booking.id}
                  className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {/* IMAGE */}
                  <div className="relative h-56 overflow-hidden bg-zinc-100">
                    {tourImage ? (
                      <img
                        src={tourImage}
                        alt={tour?.title || "Tour"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                        No image available
                      </div>
                    )}

                    {/* STATUS */}
                    <div className="absolute left-4 top-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                      >
                        <StatusIcon size={14} />
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                          Booking #{booking.id}
                        </p>

                        <h2 className="mt-1 truncate text-xl font-bold text-zinc-900">
                          {tour?.title ||
                            `Tour #${booking.tour_id}`}
                        </h2>
                      </div>

                      {tour?.destination_name && (
                        <span className="shrink-0 rounded-lg bg-zinc-100 px-2.5 py-1.5 text-xs font-medium text-zinc-600">
                          {tour.destination_name}
                        </span>
                      )}
                    </div>

                    {/* INFO GRID */}
                    <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-zinc-50 p-4">
                      <div>
                        <p className="text-xs text-zinc-400">
                          Departure
                        </p>

                        <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-zinc-800">
                          <CalendarDays
                            size={16}
                            className="text-[#df6951]"
                          />

                          {formatDate(
                            schedule?.departure_date
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-zinc-400">
                          Guests
                        </p>

                        <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-zinc-800">
                          <Users
                            size={16}
                            className="text-[#df6951]"
                          />

                          {booking.number_of_guests}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-zinc-400">
                          Destination
                        </p>

                        <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-zinc-800">
                          <MapPin
                            size={16}
                            className="text-[#df6951]"
                          />

                          {tour?.destination_name || "—"}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-zinc-400">
                          Total
                        </p>

                        <p className="mt-1 text-sm font-bold text-zinc-900">
                          {formatCurrency(
                            booking.total_amount
                          )}
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-6 flex gap-3">
                      <Link
                        to={`/tours/${booking.tour_id}`}
                        className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-center text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                      >
                        View tour
                      </Link>

                      {booking.status !== "CANCELLED" &&
                        booking.status !== "COMPLETED" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleCancelBooking(booking.id)
                            }
                            disabled={
                              cancellingId === booking.id
                            }
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {cancellingId === booking.id ? (
                              <>
                                <Loader2
                                  size={16}
                                  className="animate-spin"
                                />
                                Cancelling...
                              </>
                            ) : (
                              "Cancel booking"
                            )}
                          </button>
                        )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Bookings;