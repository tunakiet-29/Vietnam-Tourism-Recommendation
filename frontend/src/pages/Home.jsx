import HeroSection from "../components/home/HeroSection";
import RecommendationSection from "../components/home/RecommendationSection";
import PopularDestinations from "../components/home/PopularDestinations";
import PopularTours from "../components/home/PopularTours";
import CTASection from "../components/home/CTASection";
import Footer from "../components/home/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-zinc-900">
      <HeroSection />
      <RecommendationSection />
      <PopularDestinations />
      <PopularTours />
      <CTASection />
      <Footer />
    </div>
  );
}

export default Home;