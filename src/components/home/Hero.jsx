import { CloudSun, TrendingUp, Sprout, ArrowRight, Leaf, BrainCircuit } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#f4fbf5]">
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-green-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-lime-100/60 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:min-h-[680px] lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 lg:px-10 lg:py-20">
        <div className="z-10 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-4 py-2 text-sm font-semibold text-green-800 shadow-sm">
            <Sprout size={17} className="text-green-600" />
            Smarter agriculture starts here
          </div>

          <h1 className="mt-7 max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl xl:text-7xl">
            Grow smarter.
            <span className="mt-1 block text-green-700">Farm better.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Make confident farming decisions with AI-powered crop insights,
            weather information, market trends and simple farm management tools.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-green-900/15 transition duration-200 hover:-translate-y-0.5 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200"
            >
              Get started <ArrowRight size={18} />
            </button>
            <button
              type="button"
              onClick={handleLearnMore}
              className="inline-flex items-center justify-center rounded-xl border border-green-200 bg-white px-6 py-3.5 font-semibold text-green-800 transition duration-200 hover:border-green-300 hover:bg-green-50 focus:outline-none focus:ring-4 focus:ring-green-100"
            >
              Explore features
            </button>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-700"><CloudSun size={16} /></span>
              Weather insights
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-700"><TrendingUp size={16} /></span>
              Crop market trends
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-700"><BrainCircuit size={16} /></span>
              AI crop insights
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl lg:ml-auto">
          <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-green-200/70 via-lime-100/50 to-emerald-100/70 blur-xl" />

          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white p-2 shadow-2xl shadow-green-950/10">
            <div className="relative min-h-[350px] overflow-hidden rounded-[1.25rem] sm:min-h-[450px]">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=85"
                alt="Green agricultural fields under a wide open sky"
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-900/5 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-7 sm:left-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                  <Leaf size={14} /> Technology for better farming
                </div>
                <p className="mt-3 max-w-sm text-2xl font-bold leading-tight sm:text-3xl">
                  Better insights. Healthier harvests.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -left-2 top-7 max-w-[195px] rounded-2xl border border-white/80 bg-white/95 p-3.5 shadow-xl shadow-slate-900/10 backdrop-blur sm:-left-8 sm:top-12 sm:p-4">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600"><CloudSun size={20} /></span>
              <div>
                <p className="text-xs font-medium text-slate-500">Weather preview</p>
                <p className="text-sm font-bold">Weather insights</p>
              </div>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">Check conditions for your farm.</p>
          </div>

          <div className="absolute -bottom-5 right-3 w-[205px] rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl shadow-slate-900/10 backdrop-blur sm:-bottom-6 sm:right-7 sm:w-[230px]">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-700"><TrendingUp size={19} /></span>
              <div>
                <p className="text-xs font-medium text-slate-500">Marketplace</p>
                <p className="text-sm font-bold text-slate-900">Crop price trends</p>
              </div>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">Explore prices and historical demo trends.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
