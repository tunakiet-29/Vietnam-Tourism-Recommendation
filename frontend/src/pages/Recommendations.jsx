import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Compass,
  Heart,
  MapPin,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import {
  getMyRecommendations,
  isAuthenticated,
} from "../services/api";

import { destinationImages } from "../data/destinationImages";

const destinationImageMap = {
  "Nha Trang": destinationImages["nha-trang"],
  "Sa Pa": destinationImages["sa-pa"],
  "Hạ Long": destinationImages["ha-long"],
  "Đà Nẵng": destinationImages["da-nang"],
  "Đà Lạt": destinationImages["da-lat"],
  "Phú Quốc": destinationImages["phu-quoc"],
  "Hội An": destinationImages["hoi-an"],
  "Huế": destinationImages.hue,
};

function getDestinationImage(destination) {
  return destinationImageMap[destination] || "";
}

function Recommendations() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecommendations() {
      if (!isAuthenticated()) {
        navigate("/login", {
          state: {
            from: {
              pathname: "/recommendations",
            },
          },
        });

        return;
      }

      try {
        setLoading(true);
        setError("");

        const result = await getMyRecommendations();

        setData(result);
      } catch (err) {
        setError(
          err.message ||
            "Unable to load your recommendations. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, [navigate]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f7]">
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
            <div className="h-4 w-32 animate-pulse rounded bg-zinc-100" />

            <div className="mt-5 h-12 w-96 max-w-full animate-pulse rounded bg-zinc-100" />

            <div className="mt-4 h-5 w-[520px] max-w-full animate-pulse rounded bg-zinc-100" />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
              >
                <div className="h-56 animate-pulse bg-zinc-100" />

                <div className="space-y-4 p-6">
                  <div className="h-3 w-24 animate-pulse rounded bg-zinc-100" />

                  <div className="h-6 w-2/3 animate-pulse rounded bg-zinc-100" />

                  <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />

                  <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-100" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#faf9f7]">
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
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

            <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
              {error}
            </div>
          </div>
        </section>
      </main>
    );
  }

  const recommendations = data?.recommendations || [];
  const history = data?.history || [];

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

          <div className="mt-10 max-w-3xl">
            <div className="flex items-center gap-2 text-[#df6951]">
              <Sparkles size={18} />

              <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                Personalized for you
              </p>
            </div>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Your travel recommendations
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
              Discover destinations recommended based on your
              previous travel history.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        {/* HISTORY */}
        {history.length > 0 && (
          <div className="mb-10 rounded-2xl border border-zinc-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#df6951]/10 text-[#df6951]">
                <MapPin size={19} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Your travel history
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {history.map((destination) => (
                    <span
                      key={destination}
                      className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700"
                    >
                      {destination}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION HEADER */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#df6951]">
            Recommended destinations
          </p>

          <h2 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
            Places you may love
          </h2>
        </div>

        {/* EMPTY */}
        {recommendations.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#df6951]/10 text-[#df6951]">
              <Compass size={24} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-zinc-900">
              Not enough travel history yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
              Book and complete more tours to help us generate
              personalized destination recommendations for you.
            </p>

            <Link
              to="/explore"
              className="mt-6 inline-flex rounded-xl bg-[#df6951] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#cd5b45]"
            >
              Explore tours
            </Link>
          </div>
        ) : (
          /* RECOMMENDATION LIST */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((recommendation, index) => {
              const destination = recommendation.destination;
              const image = getDestinationImage(destination);

              return (
                <article
                  key={`${destination}-${index}`}
                  className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* IMAGE */}
                  <div className="relative h-56 overflow-hidden bg-zinc-100">
                    {image ? (
                      <img
                        src={image}
                        alt={destination}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                        No image available
                      </div>
                    )}

                    <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-zinc-800 backdrop-blur">
                      <Heart
                        size={14}
                        className="text-[#df6951]"
                        fill="currentColor"
                      />

                      Recommended
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#df6951]">
                      Destination
                    </p>

                    <h3 className="mt-2 text-2xl font-bold text-zinc-900">
                      {destination}
                    </h3>

                    <div className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
                      <TrendingUp size={16} />

                      <span>
                        Recommendation score:{" "}
                        {Number(recommendation.score).toFixed(2)}
                      </span>
                    </div>

                    <Link
                      to={`/explore?destination=${encodeURIComponent(
                        destination
                      )}`}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#df6951] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#cd5b45]"
                    >
                      <Compass size={16} />

                      Explore {destination} tours
                    </Link>
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

export default Recommendations;