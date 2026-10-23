import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/home/Hero";
import Features from "../../components/home/Features";
import Statistics from "../../components/home/Statistics";
import DashboardPreview from "../../components/home/DashboardPreview";
import Footer from "../../components/layout/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />

      <section id="features" className="scroll-mt-6">
        <Features />
      </section>

      <Statistics />
      <DashboardPreview />
      <Footer />
    </>
  );
}

export default Home;