import { useState } from "react";

function App() {
  const [history, setHistory] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRecommend = async () => {
    const destinations = history
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (destinations.length === 0) {
      setError("Vui lòng nhập lịch sử điểm đến.");
      return;
    }

    setLoading(true);
    setError("");
    setRecommendations([]);

    try {
      const response = await fetch("http://127.0.0.1:8000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          history: destinations,
          top_k: 5,
        }),
      });

      if (!response.ok) {
        throw new Error("Không thể gọi API recommendation.");
      }

      const data = await response.json();

      setRecommendations(data.recommendations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Vietnam Tourism Recommendation</h1>

      <input
        type="text"
        value={history}
        onChange={(e) => setHistory(e.target.value)}
        placeholder="Ví dụ: Đà Nẵng, TP.HCM, Nha Trang"
      />

      <button onClick={handleRecommend}>
        Recommend
      </button>

      {loading && <p>Đang xử lý...</p>}

      {error && <p>{error}</p>}

      {recommendations.length > 0 && (
        <div>
          <h2>Recommended Destinations</h2>

          {recommendations.map((item, index) => (
            <div key={item.destination}>
              {index + 1}. {item.destination}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;