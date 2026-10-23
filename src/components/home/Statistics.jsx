import {
  Users,
  Map,
  Sprout,
  CloudSun,
} from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10,000+",
    title: "Registered Farmers",
  },
  {
    icon: Map,
    value: "150,000+",
    title: "Acres Managed",
  },
  {
    icon: Sprout,
    value: "500+",
    title: "Crop Types",
  },
  {
    icon: CloudSun,
    value: "24/7",
    title: "Weather Updates",
  },
];

function Statistics() {
  return (
    <section className="py-24 bg-green-700 text-white">

      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center">

          <h2 className="text-5xl font-bold">
            Trusted by Farmers
          </h2>

          <p className="mt-4 text-green-100 text-lg">
            Building the future of smart agriculture.
          </p>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-16">

          {stats.map((item, index) => {

            const Icon = item.icon;

            return (
              <div
                key={index}
                className="text-center bg-green-600 rounded-2xl p-8 hover:bg-green-500 transition"
              >

                <Icon
                  size={45}
                  className="mx-auto mb-5"
                />

                <h3 className="text-4xl font-bold">
                  {item.value}
                </h3>

                <p className="mt-3 text-green-100">
                  {item.title}
                </p>

              </div>
            );

          })}

        </div>

      </div>

    </section>
  );
}

export default Statistics;  