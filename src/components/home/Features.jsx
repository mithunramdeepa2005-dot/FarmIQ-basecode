import {
  CloudSun,
  Sprout,
  TrendingUp,
  Bell,
  Bot,
  Users,
} from "lucide-react";

const features = [
  {
    icon: CloudSun,
    title: "Live Weather",
    description: "Real-time weather forecasts for your farms.",
  },
  {
    icon: Sprout,
    title: "Farm Management",
    description: "Manage crops, land records and farming activities.",
  },
  {
    icon: TrendingUp,
    title: "Crop Prices",
    description: "Check today's market prices instantly.",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description: "Receive intelligent farming suggestions.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Never miss irrigation or fertilizer schedules.",
  },
  {
    icon: Users,
    title: "Farmer Community",
    description: "Connect and learn from other farmers.",
  },
];

function Features() {
  return (
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center">

          <h2 className="text-5xl font-bold text-green-700">
            Why Choose AgriVerse?
          </h2>

          <p className="text-gray-500 mt-4 text-lg">
            Everything a farmer needs in one intelligent platform.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">

          {features.map((feature, index) => {

            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="bg-green-50 rounded-2xl p-8 shadow hover:shadow-xl transition hover:-translate-y-2"
              >

                <Icon
                  className="text-green-600"
                  size={42}
                />

                <h3 className="text-2xl font-bold mt-5">
                  {feature.title}
                </h3>

                <p className="text-gray-600 mt-3 leading-7">
                  {feature.description}
                </p>

              </div>
            );

          })}

        </div>

      </div>

    </section>
  );
}

export default Features;