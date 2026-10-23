import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/dashboard")}
      className="flex items-center gap-2 mb-6 text-green-700 hover:text-green-900 font-semibold transition"
    >
      <ArrowLeft size={20} />
      Back to Dashboard
    </button>
  );
}

export default BackButton;