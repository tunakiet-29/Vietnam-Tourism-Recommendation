import { Link } from "react-router-dom";
import { destinationImages } from "../../data/destinationImages";

function DestinationCard({ destination }) {
  const image = destinationImages[destination.id];

  return (
    <Link
      to={`/explore?destination=${destination.id}`}
      className="group relative h-[390px] overflow-hidden rounded-2xl"
    >
      <img
        src={image}
        alt={destination.name}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="absolute bottom-6 left-6 text-white">
        <p className="text-xs uppercase tracking-widest text-white/60">
          {destination.region}
        </p>

        <h3 className="mt-2 text-2xl font-semibold">
          {destination.name}
        </h3>
      </div>
    </Link>
  );
}

export default DestinationCard;