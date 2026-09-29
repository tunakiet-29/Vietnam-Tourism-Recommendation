import { useEffect, useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import DestinationCard from "./DestinationCard";
import { getDestinations } from "../../services/api";
import ApiErrorState from "../../components/ApiErrorState";
function PopularDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDestinations = useCallback(async () => {
  try {
    setLoading(true);
    setError("");

    const data = await getDestinations();

    setDestinations(data.slice(0, 4));
  } catch (err) {
    setError(
      err.message ||
        "Unable to load destinations. Please try again."
    );
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  loadDestinations();
}, [loadDestinations]);

  return (
    <section className="bg-white">
      <div className="mx-auto w-[calc(100%-40px)] max-w-7xl py-24 lg:w-[calc(100%-80px)] lg:py-32">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-[#df6951]">
              EXPLORE VIETNAM
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Popular Destinations
            </h2>

            <p className="mt-4 text-sm text-zinc-500 sm:text-base">
              Start planning your next adventure.
            </p>
          </div>

          <Link
            to="/explore"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[#df6951]"
          >
            Explore all
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {loading && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[390px] animate-pulse rounded-2xl bg-zinc-200"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mt-10">
            <ApiErrorState
              message={error}
              onRetry={loadDestinations}
            />
          </div>
        )}

        {!loading && !error && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default PopularDestinations;