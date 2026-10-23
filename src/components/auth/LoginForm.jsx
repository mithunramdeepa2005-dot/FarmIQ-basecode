import { Mail, Lock, Eye } from "lucide-react";

function LoginForm() {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">

      <h2 className="text-4xl font-bold text-center text-green-700">
        Welcome Back
      </h2>

      <p className="text-center text-gray-500 mt-2">
        Login to continue to AgriVerse
      </p>

      <form className="mt-10 space-y-6">

        {/* Email */}

        <div>

          <label className="font-medium">
            Email
          </label>

          <div className="flex items-center border rounded-xl mt-2 px-4">

            <Mail className="text-gray-400"/>

            <input
              type="email"
              placeholder="Enter Email"
              className="w-full p-4 outline-none"
            />

          </div>

        </div>

        {/* Password */}

        <div>

          <label className="font-medium">
            Password
          </label>

          <div className="flex items-center border rounded-xl mt-2 px-4">

            <Lock className="text-gray-400"/>

            <input
              type="password"
              placeholder="Enter Password"
              className="w-full p-4 outline-none"
            />

            <Eye
              className="text-gray-400 cursor-pointer"
            />

          </div>

        </div>

        <div className="flex justify-between text-sm">

          <label className="flex items-center gap-2">

            <input type="checkbox"/>

            Remember Me

          </label>

          <a
            href="#"
            className="text-green-700"
          >
            Forgot Password?
          </a>

        </div>

        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold"
        >
          Login
        </button>

        <p className="text-center">

          Don't have an account?

          <span className="text-green-700 cursor-pointer ml-2">
            Register
          </span>

        </p>

      </form>

    </div>
  );
}

export default LoginForm;