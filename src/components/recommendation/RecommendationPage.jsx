import { useState } from "react";
import RecommendationForm from "./RecommendationForm";
import RecommendationResult from "./RecommendationResult";

function RecommendationPage() {
  const [result, setResult] = useState(null);

  return (
    <div className="grid lg:grid-cols-2 gap-8">

      <RecommendationForm
        setResult={setResult}
      />

      <RecommendationResult
        result={result}
      />

    </div>
  );
}

export default RecommendationPage;