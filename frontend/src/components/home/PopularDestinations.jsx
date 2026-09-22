import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import DestinationCard from "./DestinationCard";
import { destinations } from "../../data/homeData";

function PopularDestinations() {
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

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.name}
              destination={destination}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularDestinations;