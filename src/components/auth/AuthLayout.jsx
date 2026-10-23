function AuthLayout({ children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* Left Side */}
      <div className="hidden lg:flex bg-gradient-to-br from-green-700 to-green-900 text-white items-center justify-center p-12">

        <div className="max-w-md">

          <h1 className="text-6xl font-extrabold">
            🌾 AgriVerse
          </h1>

          <p className="mt-6 text-xl leading-9">
            Smart Farming Platform powered by AI and real-time data.
          </p>

          <div className="mt-12 space-y-5">

            <div>✅ Live Weather Forecast</div>

            <div>✅ Farm Management</div>

            <div>✅ Crop Market Prices</div>

            <div>✅ Irrigation Reminders</div>

            <div>✅ AI Crop Suggestions</div>

          </div>

        </div>

      </div>

      {/* Right Side */}

      <div className="bg-gray-100 flex justify-center items-center p-8">

        {children}

      </div>

    </div>
  );
}

export default AuthLayout;