import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
function TourCard({ tour }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/40">
      <div className="relative h-64 overflow-hidden">
        <img
          src={tour.image}
          alt={tour.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-zinc-800 backdrop-blur">
          <Star size={13} fill="currentColor" />
          {tour.rating}
        </div>
      </div>

      <div className="p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-[#df6951]">
          {tour.destination}
        </p>

        <h3 className="mt-2 text-xl font-semibold">{tour.title}</h3>

        <p className="mt-3 text-sm text-zinc-500">{tour.duration}</p>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-zinc-400">From</p>

            <p className="mt-1 text-lg font-bold">
              {tour.price}
              <span className="text-sm font-medium text-zinc-400">
                {" "}
                VND
              </span>
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold transition hover:border-[#df6951] hover:text-[#df6951]"
          >
            View tour
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default TourCard;