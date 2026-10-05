import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Minus,
  Plus,
  Star,
  Users,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  createVnpayPayment,
  createBooking,
  getTourById,
  getTourSchedules,
  isAuthenticated,
} from "../services/api";
import { destinationImages } from "../data/destinationImages";
import ApiErrorState from "../components/ApiErrorState";
function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const tourId = Number(id);

  const [tour, setTour] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [numberOfGuests, setNumberOfGuests] = useState(1);

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  useEffect(() => {
    if (!id || Number.isNaN(tourId)) {
      setError("Invalid tour ID.");
      setLoading(false);
      return;
    }

    async function fetchTourDetail() {
      try {
        setLoading(true);
        setError("");

        const [tourData, scheduleData] = await Promise.all([
          getTourById(tourId),
          getTourSchedules(tourId),
        ]);

        setTour(tourData);
        setSchedules(scheduleData);

        if (scheduleData.length > 0) {
          setSelectedSchedule(scheduleData[0]);
        }
      } catch (err) {
        setError(
          err.message || "Unable to load tour details."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTourDetail();
  }, [id, tourId]);

  useEffect(() => {
    if (!selectedSchedule) {
      return;
    }

    const maxGuests = Math.max(
      1,
      Math.min(
        tour?.max_guests ?? 1,
        selectedSchedule.available_slots
      )
    );

    setNumberOfGuests((current) =>
      Math.min(current, maxGuests)
    );
  }, [selectedSchedule, tour]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-zinc-500">Loading tour...</p>
        </div>
      </main>
    );
  }

  if (error || !tour) {
  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-[#df6951]"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="mt-8">
          <ApiErrorState
            title="Unable to load this tour"
            message={error || "Tour not found."}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    </main>
  );
}

  const tourImage =
    tour.image ||
    destinationImages[tour.destination_id] ||
    "";

  const price = Number(tour.price);

  const maxGuests = selectedSchedule
    ? Math.min(
        tour.max_guests,
        selectedSchedule.available_slots
      )
    : 1;

  const totalAmount = price * numberOfGuests;

  function increaseGuests() {
    setBookingError("");
    setBookingSuccess("");

    setNumberOfGuests((current) =>
      Math.min(current + 1, maxGuests)
    );
  }

  function decreaseGuests() {
    setBookingError("");
    setBookingSuccess("");

    setNumberOfGuests((current) =>
      Math.max(current - 1, 1)
    );
  }

  async function handleBooking() {
    setBookingError("");
    setBookingSuccess("");

    if (!isAuthenticated()) {
      navigate("/login", {
        state: {
          from: {
            pathname: `/tours/${tour.id}`,
          },
        },
      });

      return;
    }

    if (!selectedSchedule) {
      setBookingError("Please select a departure date.");
      return;
    }

    if (selectedSchedule.available_slots <= 0) {
      setBookingError("This departure is fully booked.");
      return;
    }

    if (numberOfGuests > selectedSchedule.available_slots) {
      setBookingError(
        `Only ${selectedSchedule.available_slots} seats are available for this departure.`
      );
      return;
    }

    setBookingLoading(true);
    let createdBooking = null;

    try {
      createdBooking = await createBooking({
        tour_id: tour.id,
        schedule_id: selectedSchedule.id,
        number_of_guests: numberOfGuests,
      });

      const payment = await createVnpayPayment(
        createdBooking.id
      );

      window.location.assign(payment.payment_url);
    } catch (err) {
      if (createdBooking) {
        setBookingSuccess(
          `Booking #${createdBooking.id} was created. Please complete the payment from My Bookings.`
        );

        setTimeout(() => {
          navigate("/bookings", {
            state: {
              bookingCreated: true,
              bookingId: createdBooking.id,
            },
          });
        }, 1000);

        return;
      }

      setBookingError(
        err.message ||
          "Unable to complete your booking. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-[#df6951]"
        >
          <ArrowLeft 
            size={20}
            strokeWidth={2}
            className="shrink-0" />
          Back to Home
        </Link>

        {/* Tour information */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50">
          <div className="grid lg:grid-cols-2">
            {/* IMAGE */}
            <div className="relative min-h-[360px] bg-zinc-100 lg:min-h-[520px]">
              {tourImage ? (
                <img
                  src={tourImage}
                  alt={tour.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[360px] items-center justify-center text-sm text-zinc-400 lg:min-h-[520px]">
                  No image available
                </div>
              )}

              <div className="absolute left-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold text-zinc-800 backdrop-blur">
                <Star
                  size={14}
                  fill="currentColor"
                  className="text-[#df6951]"
                />
                {tour.rating}
              </div>
            </div>

            {/* INFO */}
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#df6951]">
                {tour.destination_name}
              </p>

              <h1 className="mt-4 text-4xl font-bold leading-tight text-zinc-900">
                {tour.title}
              </h1>

              <p className="mt-6 leading-7 text-zinc-500">
                {tour.description}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-zinc-200 bg-white p-4">
                  <p className="text-xs text-zinc-400">
                    Duration
                  </p>

                  <p className="mt-1 font-semibold text-zinc-900">
                    {tour.duration_days} days
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-4">
                  <p className="text-xs text-zinc-400">
                    Max guests
                  </p>

                  <p className="mt-1 font-semibold text-zinc-900">
                    {tour.max_guests}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-4">
                  <p className="text-xs text-zinc-400">
                    Rating
                  </p>

                  <p className="mt-1 font-semibold text-zinc-900">
                    {tour.rating}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-sm text-zinc-400">
                  From
                </p>

                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {price.toLocaleString("vi-VN")}
                  <span className="ml-2 text-base font-medium text-zinc-400">
                    VND
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Schedules */}
        <section className="mt-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#df6951]">
              Departure dates
            </p>

            <h2 className="mt-2 text-3xl font-bold text-zinc-900">
              Choose your schedule
            </h2>

            <p className="mt-3 text-zinc-500">
              Select an available departure date for this tour.
            </p>
          </div>

          {schedules.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-zinc-500">
              No available schedules for this tour.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {schedules.map((schedule) => {
                const isSelected =
                  selectedSchedule?.id === schedule.id;

                return (
                  <button
                    key={schedule.id}
                    type="button"
                    disabled={schedule.available_slots <= 0}
                    onClick={() => {
                      setBookingError("");
                      setBookingSuccess("");
                      setSelectedSchedule(schedule);
                      setNumberOfGuests(1);
                    }}
                    className={`rounded-2xl border p-5 text-left transition ${
                      isSelected
                        ? "border-[#df6951] bg-[#df6951]/5 shadow-sm"
                        : "border-zinc-200 bg-white hover:border-[#df6951]/50"
                    } ${
                      schedule.available_slots <= 0
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CalendarDays
                        size={20}
                        className={
                          isSelected
                            ? "text-[#df6951]"
                            : "text-zinc-400"
                        }
                      />

                      <div>
                        <p className="text-sm font-semibold text-zinc-900">
                          {schedule.departure_date}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          {schedule.available_slots} slots available
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {selectedSchedule && (
            <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                {/* SELECTED DATE */}
                <div>
                  <p className="text-sm text-zinc-400">
                    Selected departure
                  </p>

                  <p className="mt-1 text-lg font-semibold text-zinc-900">
                    {selectedSchedule.departure_date}
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500">
                    <Users size={16} />
                    {selectedSchedule.available_slots} slots available
                  </div>
                </div>

                {/* GUEST SELECTOR */}
                <div>
                  <p className="mb-2 text-sm font-medium text-zinc-700">
                    Guests
                  </p>

                  <div className="flex items-center rounded-xl border border-zinc-200 bg-white">
                    <button
                      type="button"
                      onClick={decreaseGuests}
                      disabled={numberOfGuests <= 1}
                      className="p-3 text-zinc-600 transition hover:text-[#df6951] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="min-w-12 text-center text-sm font-semibold text-zinc-900">
                      {numberOfGuests}
                    </span>

                    <button
                      type="button"
                      onClick={increaseGuests}
                      disabled={numberOfGuests >= maxGuests}
                      className="p-3 text-zinc-600 transition hover:text-[#df6951] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* TOTAL */}
                <div>
                  <p className="text-sm text-zinc-400">
                    Estimated total
                  </p>

                  <p className="mt-1 text-2xl font-bold text-zinc-900">
                    {totalAmount.toLocaleString("vi-VN")}
                    <span className="ml-2 text-sm font-medium text-zinc-400">
                      VND
                    </span>
                  </p>
                </div>

                {/* BOOK */}
                <button
                  type="button"
                  onClick={handleBooking}
                  disabled={
                    bookingLoading ||
                    !selectedSchedule ||
                    selectedSchedule.available_slots <= 0
                  }
                  className="rounded-xl bg-[#df6951] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#cf5d47] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {bookingLoading
                    ? "Booking..."
                    : "Book this tour"}
                </button>
              </div>

              {/* BOOKING ERROR */}
              {bookingError && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {bookingError}
                </div>
              )}

              {/* BOOKING SUCCESS */}
              {bookingSuccess && (
                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                  {bookingSuccess}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default TourDetail;
