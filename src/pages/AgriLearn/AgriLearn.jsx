import { useMemo, useState } from "react";
import {
  Search,
  Sprout,
  Leaf,
  Bug,
  Droplets,
  FlaskConical,
  Sun,
  ArrowUpRight,
  BookOpen,
  Clock3,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";

const categories = [
  "All topics",
  "Crop growing",
  "Plant diseases",
  "Soil & nutrients",
  "Water & weather",
];

const guides = [
  {
    title: "A beginner's guide to growing healthy crops",
    category: "Crop growing",
    description:
      "Learn the basics of planning a growing season, preparing soil, choosing seeds and checking crop growth.",
    readTime: "5 min read",
    icon: Sprout,
    tone: "bg-green-100 text-green-700",
    tag: "Getting started",
  },
  {
    title: "Recognising common leaf symptoms",
    category: "Plant diseases",
    description:
      "Understand how spots, yellowing, wilting and unusual leaf patterns can signal a plant-health problem.",
    readTime: "6 min read",
    icon: Bug,
    tone: "bg-rose-100 text-rose-700",
    tag: "Crop health",
  },
  {
    title: "Understanding soil nutrients",
    category: "Soil & nutrients",
    description:
      "Explore the role of nitrogen, phosphorus and potassium, and why soil testing matters before applying fertiliser.",
    readTime: "7 min read",
    icon: FlaskConical,
    tone: "bg-amber-100 text-amber-700",
    tag: "Soil health",
  },
  {
    title: "Watering crops more efficiently",
    category: "Water & weather",
    description:
      "Learn how crop type, soil condition and weather affect irrigation needs and water use.",
    readTime: "4 min read",
    icon: Droplets,
    tone: "bg-sky-100 text-sky-700",
    tag: "Water management",
  },
  {
    title: "Seasonal planning for your farm",
    category: "Crop growing",
    description:
      "Use local growing seasons and weather forecasts to help plan planting, field work and harvest activities.",
    readTime: "5 min read",
    icon: Sun,
    tone: "bg-orange-100 text-orange-700",
    tag: "Planning",
  },
  {
    title: "Building a simple crop monitoring routine",
    category: "Plant diseases",
    description:
      "Set up regular field checks and record changes so potential issues can be investigated early.",
    readTime: "4 min read",
    icon: Leaf,
    tone: "bg-emerald-100 text-emerald-700",
    tag: "Field checklist",
  },
];

function AgriLearn() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All topics");

  const filteredGuides = useMemo(() => {
    const query = search.trim().toLowerCase();

    return guides.filter((guide) => {
      const matchesCategory =
        activeCategory === "All topics" || guide.category === activeCategory;
      const searchableText =
        `${guide.title} ${guide.description} ${guide.category} ${guide.tag}`.toLowerCase();
      return matchesCategory && (!query || searchableText.includes(query));
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-[#f6faf6]">
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 text-white">
          <div className="pointer-events-none absolute -right-20 -top-28 h-96 w-96 rounded-full bg-green-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-lime-300/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-green-50">
                <BookOpen size={16} />
                The FarmIQ learning hub
              </span>

              <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Learn today.
                <span className="block text-lime-300">Grow tomorrow.</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-green-50/85 sm:text-lg sm:leading-8">
                Practical learning resources for healthier crops and more
                confident farming decisions—from soil care to crop health.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#learning-library"
                  className="inline-flex items-center gap-2 rounded-xl bg-lime-300 px-5 py-3 font-semibold text-green-950 transition hover:bg-lime-200"
                >
                  Explore learning guides <ArrowUpRight size={18} />
                </a>
                <span className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm text-green-50">
                  <BookOpen size={17} /> Beginner-friendly resources
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-4 rounded-[2rem] bg-lime-300/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-sm">
                <img
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1100&q=85"
                  alt="Sunlight falling over agricultural fields"
                  className="h-64 w-full rounded-2xl object-cover sm:h-80"
                  loading="lazy"
                />
                <div className="flex items-center justify-between gap-4 px-2 pb-1 pt-4">
                  <div>
                    <p className="text-sm text-green-100/75">Learn by topic</p>
                    <p className="mt-1 text-lg font-bold">From soil to harvest</p>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lime-300 text-green-950">
                    <Sprout size={25} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Sprout,
                title: "Crop growing",
                detail: "Planting and field-care basics",
                tone: "bg-green-100 text-green-700",
              },
              {
                icon: Bug,
                title: "Plant diseases",
                detail: "Symptoms and prevention",
                tone: "bg-rose-100 text-rose-700",
              },
              {
                icon: FlaskConical,
                title: "Soil & nutrients",
                detail: "Soil health and fertiliser basics",
                tone: "bg-amber-100 text-amber-700",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.tone}`}
                  >
                    <Icon size={23} />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">{item.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section
          id="learning-library"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-20 sm:px-8 lg:px-10"
        >
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
                Learning library
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Explore farming topics
              </h2>
              <p className="mt-3 max-w-2xl text-slate-600">
                Browse concise guides and find a topic relevant to your farm.
              </p>
            </div>

            <div className="relative w-full md:max-w-sm">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={19}
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search guides..."
                aria-label="Search learning guides"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
            </div>
          </div>

          <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  activeCategory === category
                    ? "bg-green-700 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-green-300 hover:text-green-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGuides.map((guide) => {
              const Icon = guide.icon;
              return (
                <article
                  key={guide.title}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg hover:shadow-green-950/5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${guide.tone}`}
                    >
                      <Icon size={23} />
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {guide.tag}
                    </span>
                  </div>

                  <p className="mt-5 text-xs font-bold uppercase tracking-wide text-green-700">
                    {guide.category}
                  </p>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-slate-900">
                    {guide.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                    {guide.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock3 size={14} /> {guide.readTime}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-700">
                      Guide preview <ArrowUpRight size={16} />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredGuides.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <Search className="mx-auto text-slate-400" size={28} />
              <h3 className="mt-3 font-bold text-slate-900">No guides found</h3>
              <p className="mt-1 text-sm text-slate-500">
                Try a different search term or topic.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All topics");
                }}
                className="mt-4 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
              >
                Clear filters
              </button>
            </div>
          )}

          <p className="mt-8 text-xs leading-5 text-slate-500">
            Educational content only. Crop-specific disease treatment and
            fertiliser choices should be confirmed with local agricultural
            extension services and based on crop, soil-test results and local
            recommendations.
          </p>
        </section>
      </main>
    </div>
  );
}

export default AgriLearn;
