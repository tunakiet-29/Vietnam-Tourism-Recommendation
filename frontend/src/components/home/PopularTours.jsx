import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

import TourCard from "./TourCard";
import { getTours } from "../../services/api";
import { destinationImages } from "../../data/destinationImages";
import ApiErrorState from "../ApiErrorState";
function PopularTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTours = useCallback(async () => {
  try {
    setLoading(true);
    setError("");

    const data = await getTours();

    // Keep the same 3 destinations shown in the current homepage.
    const popularDestinationIds = [
      "da-nang",
      "phu-quoc",
      "da-lat",
    ];

    const selectedTours = popularDestinationIds
      .map((destinationId) =>
        data.find(
          (tour) =>
            tour.destination_id === destinationId,
        ),
      )
      .filter(Boolean)
      .map((tour) => ({
        ...tour,
        image:
          destinationImages[tour.destination_id] || "",
      }));

    setTours(selectedTours);
  } catch (err) {
    setError(
      err.message ||
        "Unable to load popular tours. Please try again.",
    );
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  fetchTours();
}, [fetchTours]);

  return (
    <section className="mx-auto w-[calc(100%-40px)] max-w-7xl py-24 lg:w-[calc(100%-80px)] lg:py-32">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold tracking-[0.25em] text-[#df6951]">
            DISCOVER YOUR TRIP
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Popular Tours
          </h2>

          <p className="mt-4 text-sm text-zinc-500 sm:text-base">
            Carefully selected experiences across Vietnam.
          </p>
        </div>

        <Link
          to="/explore"
          className="text-sm font-semibold text-[#df6951]"
        >
          View all →
        </Link>
      </div>

      {loading && (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-[560px] animate-pulse rounded-2xl bg-zinc-100"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="mt-10">
          <ApiErrorState
            title="Unable to load popular tours"
            message={error}
              onRetry={fetchTours}
          />
        </div>
      )}

      {!loading && !error && (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <TourCard
              key={tour.id}
              tour={tour}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default PopularTours;