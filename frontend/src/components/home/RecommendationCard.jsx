import { ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

import { destinationImages } from "../../data/destinationImages";

function RecommendationCard({
  recommendation,
  destination,
  index,
}) {
  const image = destination
    ? destinationImages[destination.id]
    : null;

  return (
    <Link
      to={
        destination
          ? `/explore?destination=${destination.id}`
          : "/recommendations"
      }
      className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#df6951]/30 hover:shadow-xl hover:shadow-zinc-200/40"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={recommendation.destination}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-zinc-200" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Ranking */}
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-zinc-800 backdrop-blur">
          #{index + 1}
        </div>

        {/* Score */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
          <TrendingUp size={15} strokeWidth={2} />

          <span className="text-xs font-medium">
            Score {recommendation.score.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs uppercase tracking-widest text-zinc-400">
          {destination?.region ?? "Vietnam"}
        </p>

        <h3 className="mt-2 text-xl font-semibold transition group-hover:text-[#df6951]">
          {recommendation.destination}
        </h3>

        {destination?.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">
            {destination.description}
          </p>
        )}

        <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#df6951]">
          Explore destination

          <ArrowRight
            size={15}
            strokeWidth={2}
            className="transition-transform group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}

export default RecommendationCard;