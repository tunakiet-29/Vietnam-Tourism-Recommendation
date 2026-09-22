import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="px-5 pb-20 lg:px-10 lg:pb-28">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#1f1f1f] px-7 py-16 text-center text-white sm:px-12 lg:py-20">
        <p className="text-xs font-bold tracking-[0.25em] text-[#ff9a83]">
          YOUR NEXT ADVENTURE
        </p>

        <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Let us help you find where to go next.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
          Sign in to discover personalized destinations based on your travel
          history.
        </p>

        <Link
          to="/register"
          className="mt-8 inline-flex rounded-xl bg-[#df6951] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#d85d45]"
        >
          Create your account
        </Link>
      </div>
    </section>
  );
}

export default CTASection;