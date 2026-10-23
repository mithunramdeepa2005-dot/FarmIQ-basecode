import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // If there is browser history, go back.
    // Otherwise return to Home.
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-2 px-4 py-2 mb-6
                 bg-white border border-gray-200 rounded-lg
                 text-gray-700 font-medium
                 hover:text-green-600 hover:border-green-500
                 hover:bg-green-50 transition shadow-sm"
    >
      <ArrowLeft size={18} />
      Back
    </button>
  );
}