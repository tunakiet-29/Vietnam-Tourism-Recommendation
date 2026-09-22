import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import RecommendationCard from "./RecommendationCard";
import { recommendations } from "../../data/homeData";

function RecommendationSection() {
  return (
    <section className="mx-auto w-[calc(100%-40px)] max-w-7xl py-24 lg:w-[calc(100%-80px)] lg:py-32">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold tracking-[0.25em] text-[#df6951]">
            PERSONALIZED FOR YOU
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Recommended for You
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500 sm:text-base">
            Destinations selected from your travel history using our
            personalized recommendation system.
          </p>
        </div>

        <Link
          to="/recommendations"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-[#df6951]"
        >
          View all
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {recommendations.map((destination, index) => (
          <RecommendationCard
            key={destination.name}
            destination={destination}
            index={index}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
        <span className="rounded-full bg-[#df6951]/10 px-3 py-1.5 font-medium text-[#df6951]">
          FP-Growth Recommendation
        </span>

        <span>Personalized from your travel history</span>
      </div>
    </section>
  );
}

export default RecommendationSection;