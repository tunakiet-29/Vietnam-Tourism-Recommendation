import { ArrowLeft, Compass, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-center px-5 py-16 sm:px-8 lg:px-10">
          <div className="w-full max-w-2xl text-center">
            {/* ICON */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#df6951]/10 text-[#df6951]">
              <SearchX size={36} strokeWidth={1.8} />
            </div>

            {/* 404 */}
            <p className="mt-8 text-7xl font-bold tracking-tight text-[#df6951] sm:text-8xl">
              404
            </p>

            {/* TITLE */}
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Page not found
            </h1>

            {/* DESCRIPTION */}
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-zinc-500 sm:text-base">
              The page you&apos;re looking for doesn&apos;t exist
              or may have been moved to another destination.
            </p>

            {/* ACTIONS */}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#df6951] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#cd5b45]"
              >
                <ArrowLeft
                  size={17}
                  strokeWidth={2}
                />
                Back to Home
              </Link>

              <Link
                to="/explore"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                <Compass size={17} />
                Explore Tours
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default NotFound;