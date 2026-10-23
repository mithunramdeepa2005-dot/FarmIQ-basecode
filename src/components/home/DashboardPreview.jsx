import {
  CloudSun,
  Sprout,
  TrendingUp,
  Bell,
  Bot,
} from "lucide-react";

function DashboardPreview() {
  return (
    <section className="py-24 bg-gray-50">

      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center">

          <h2 className="text-5xl font-bold text-green-700">
            See AgriVerse in Action
          </h2>

          <p className="mt-4 text-gray-600 text-lg">
            Your farming dashboard at a glance.
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-16">

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <div className="flex items-center gap-4">
              <CloudSun className="text-yellow-500" size={40}/>
              <div>
                <h3 className="font-bold text-xl">
                  Weather
                </h3>

                <p className="text-gray-500">
                  29°C • Sunny
                </p>
              </div>
            </div>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <div className="flex items-center gap-4">
              <Sprout className="text-green-600" size={40}/>
              <div>

                <h3 className="font-bold text-xl">
                  Current Crop
                </h3>

                <p className="text-gray-500">
                  Paddy
                </p>

              </div>
            </div>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <div className="flex items-center gap-4">
              <TrendingUp className="text-blue-600" size={40}/>
              <div>

                <h3 className="font-bold text-xl">
                  Market Price
                </h3>

                <p className="text-gray-500">
                  ₹2450 / Quintal
                </p>

              </div>
            </div>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <div className="flex items-center gap-4">
              <Bell className="text-red-500" size={40}/>
              <div>

                <h3 className="font-bold text-xl">
                  Reminder
                </h3>

                <p className="text-gray-500">
                  Irrigation Today
                </p>

              </div>
            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

          <div className="flex items-center gap-4">
            <Bot className="text-purple-600" size={45}/>

            <div>

              <h3 className="font-bold text-xl">
                AI Assistant
              </h3>

              <p className="text-gray-500">
                Your crop is healthy.
                No diseases detected.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default DashboardPreview;