import { Link } from "react-router-dom";
import TourCard from "./TourCard";
import { tours } from "../../data/homeData";

function PopularTours() {
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

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour) => (
          <TourCard key={tour.title} tour={tour} />
        ))}
      </div>
    </section>
  );
}

export default PopularTours;