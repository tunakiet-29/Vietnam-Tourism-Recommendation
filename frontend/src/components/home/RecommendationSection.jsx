import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import RecommendationCard from "./RecommendationCard";
import { getDestinations, recommend } from "../../services/api";

const DEMO_HISTORY = [
  "Đà Nẵng",
  "TP.HCM",
  "Nha Trang",
];

function RecommendationSection() {
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecommendations() {
      try {
        setLoading(true);
        setError("");

        const [recommendationData, destinationData] =
          await Promise.all([
            recommend(DEMO_HISTORY, 5),
            getDestinations(),
          ]);

        setRecommendationResult(recommendationData);
        setDestinations(destinationData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load recommendations."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, []);

  return (
    <section className="mx-auto w-[calc(100%-40px)] max-w-7xl py-24 lg:w-[calc(100%-80px)] lg:py-32">
      {/* Section heading */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles
              size={16}
              strokeWidth={2}
              className="text-[#df6951]"
            />

            <p className="text-xs font-bold tracking-[0.25em] text-[#df6951]">
              PERSONALIZED FOR YOU
            </p>
          </div>

          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Recommended for You
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500 sm:text-base">
            Destinations recommended based on your travel history using
            our FP-Growth recommendation model.
          </p>
        </div>

        <Link
          to="/recommendations"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-[#df6951]"
        >
          View all

          <ArrowRight
            size={16}
            strokeWidth={2}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Travel history */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-zinc-400">
          Travel history:
        </span>

        {DEMO_HISTORY.map((destination, index) => (
          <span
            key={`${destination}-${index}`}
            className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600"
          >
            {destination}
          </span>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
            >
              <div className="h-44 animate-pulse bg-zinc-200" />

              <div className="space-y-3 p-5">
                <div className="h-3 w-20 animate-pulse rounded bg-zinc-200" />

                <div className="h-6 w-28 animate-pulse rounded bg-zinc-200" />

                <div className="h-10 animate-pulse rounded bg-zinc-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* Recommendation results */}
      {!loading &&
        !error &&
        recommendationResult &&
        recommendationResult.recommendations.length > 0 && (
          <>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {recommendationResult.recommendations.map(
                (recommendation, index) => {
                  const destination = destinations.find(
                    (item) =>
                      item.name === recommendation.destination
                  );

                  return (
                    <RecommendationCard
                      key={recommendation.destination}
                      recommendation={recommendation}
                      destination={destination}
                      index={index}
                    />
                  );
                }
              )}
            </div>

            {/* Model information */}
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              <span className="rounded-full bg-[#df6951]/10 px-3 py-1.5 font-medium text-[#df6951]">
                FP-Growth
              </span>

              <span>
                Pattern used:{" "}
                {recommendationResult.pattern_used.length > 0
                  ? recommendationResult.pattern_used.join(" / ")
                  : "No pattern"}
              </span>

              {recommendationResult.fallback && (
                <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-zinc-500">
                  Backoff applied
                </span>
              )}
            </div>
          </>
        )}

      {/* No recommendation */}
      {!loading &&
        !error &&
        recommendationResult &&
        recommendationResult.recommendations.length === 0 && (
          <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-8">
            <p className="text-sm text-zinc-500">
              No recommendations are available for this travel history.
            </p>
          </div>
        )}
    </section>
  );
}

export default RecommendationSection;