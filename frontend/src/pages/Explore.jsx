import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Compass, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import TourCard from "../components/home/TourCard";
import { getTours } from "../services/api";
import { destinationImages } from "../data/destinationImages";

function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();

  const destinationFilter = searchParams.get("destination") || "";

  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTours() {
      try {
        setLoading(true);
        setError("");

        const data = await getTours();

        const toursWithImages = data.map((tour) => ({
          ...tour,
          image:
            tour.image ||
            destinationImages[tour.destination_id] ||
            "",
        }));

        setTours(toursWithImages);
      } catch (err) {
        setError(
          err.message ||
            "Unable to load tours. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTours();
  }, []);

  const filteredTours = useMemo(() => {
    if (!destinationFilter) {
      return tours;
    }

    const normalizedFilter =
      destinationFilter.trim().toLowerCase();

    return tours.filter(
      (tour) =>
        tour.destination_name?.trim().toLowerCase() ===
        normalizedFilter
    );
  }, [tours, destinationFilter]);

  function clearDestinationFilter() {
    setSearchParams({});
  }

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      {/* HEADER */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
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

          <div className="mt-10 max-w-3xl">
            <div className="flex items-center gap-2 text-[#df6951]">
              <Compass size={18} />

              <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                Discover Vietnam
              </p>
            </div>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              {destinationFilter
                ? `Explore ${destinationFilter}`
                : "Explore your next journey"}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
              {destinationFilter
                ? `Discover available tours in ${destinationFilter} and plan your next trip.`
                : "Discover curated tours across Vietnam and find the destination that matches your next adventure."}
            </p>
          </div>
        </div>
      </section>

      {/* TOUR LIST */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        {/* SECTION HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#df6951]">
              {destinationFilter
                ? "Recommended destination"
                : "Available tours"}
            </p>

            <h2 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
              {destinationFilter
                ? `${destinationFilter} tours`
                : "Find a trip for you"}
            </h2>
          </div>

          {!loading && !error && (
            <div className="flex items-center gap-3">
              <p className="text-sm text-zinc-400">
                {filteredTours.length}{" "}
                {filteredTours.length === 1
                  ? "tour"
                  : "tours"}{" "}
                available
              </p>

              {destinationFilter && (
                <button
                  type="button"
                  onClick={clearDestinationFilter}
                  className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-[#df6951]/40 hover:text-[#df6951]"
                >
                  <X size={13} />
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-medium text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Try again
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
              >
                <div className="h-56 animate-pulse bg-zinc-100" />

                <div className="space-y-4 p-5">
                  <div className="h-3 w-24 animate-pulse rounded bg-zinc-100" />

                  <div className="h-6 w-3/4 animate-pulse rounded bg-zinc-100" />

                  <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />

                  <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100" />

                  <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          filteredTours.length === 0 && (
            <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#df6951]/10 text-[#df6951]">
                <Compass size={24} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-zinc-900">
                {destinationFilter
                  ? `No tours found in ${destinationFilter}`
                  : "No tours available"}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                {destinationFilter
                  ? "There are currently no available tours for this destination."
                  : "There are currently no tours available. Please check again later."}
              </p>

              {destinationFilter ? (
                <button
                  type="button"
                  onClick={clearDestinationFilter}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#df6951] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#cd5b45]"
                >
                  <Compass size={16} />
                  View all tours
                </button>
              ) : (
                <Link
                  to="/"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#df6951] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#cd5b45]"
                >
                  <ArrowLeft
                    size={18}
                    strokeWidth={2}
                  />
                  Back to Home
                </Link>
              )}
            </div>
          )}

        {/* TOURS */}
        {!loading &&
          !error &&
          filteredTours.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTours.map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                />
              ))}
            </div>
          )}
      </section>
    </main>
  );
}

export default Explore;