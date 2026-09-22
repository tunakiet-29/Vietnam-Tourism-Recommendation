import Navbar from "./Navbar";
import SearchBar from "./SearchBar";
import { heroImage } from "../../data/homeData";

function HeroSection() {
  return (
    <section
      className="relative min-h-[760px] overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />

      <Navbar />

      <div className="relative z-10 mx-auto flex min-h-[650px] w-[calc(100%-40px)] max-w-7xl items-center lg:w-[calc(100%-80px)]">
        <div className="max-w-3xl pb-20 pt-20">
          <p className="mb-5 text-xs font-bold tracking-[0.3em] text-[#ff9a83]">
            EXPLORE VIETNAM
          </p>

          <h1 className="max-w-3xl text-5xl font-bold leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-8xl">
            Discover your
            <br />
            next journey.
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
            Explore unforgettable destinations, discover unique tours, and
            find your next trip with recommendations personalized for you.
          </p>

          <SearchBar />
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-white/60 sm:flex">
        <span className="text-xs uppercase tracking-[0.25em]">
          Scroll
        </span>

        <div className="h-10 w-px bg-white/30">
          <div className="h-1/2 w-full bg-[#df6951]" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;