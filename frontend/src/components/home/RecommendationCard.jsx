import { Link } from "react-router-dom";

function RecommendationCard({ destination, index }) {
  return (
    <Link
      to="/recommendations"
      className="group flex min-h-[210px] flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#df6951]/30 hover:shadow-xl hover:shadow-zinc-200/50"
    >
      <span className="text-xs font-bold tracking-widest text-[#df6951]">
        0{index + 1}
      </span>

      <div>
        <p className="text-xs text-zinc-400">{destination.region}</p>

        <h3 className="mt-2 text-2xl font-semibold transition group-hover:text-[#df6951]">
          {destination.name}
        </h3>

        <p className="mt-3 text-sm leading-6 text-zinc-500">
          {destination.description}
        </p>
      </div>
    </Link>
  );
}

export default RecommendationCard;