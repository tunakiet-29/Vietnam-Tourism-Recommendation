const API_BASE_URL = "http://127.0.0.1:8000";

export async function getDestinations() {
  const response = await fetch(`${API_BASE_URL}/destinations`);

  if (!response.ok) {
    throw new Error("Failed to fetch destinations.");
  }

  const data = await response.json();

  return data.destinations;
}

export async function recommend(history, topK = 5) {
  const response = await fetch(`${API_BASE_URL}/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      history,
      top_k: topK,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch recommendations.");
  }

  return response.json();
}