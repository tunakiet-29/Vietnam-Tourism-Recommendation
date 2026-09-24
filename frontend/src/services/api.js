const API_BASE_URL = "http://127.0.0.1:8000";

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;

    try {
      const errorData = await response.json();

      if (errorData?.detail) {
        errorMessage = errorData.detail;
      }
    } catch {
      // Ignore JSON parsing errors for error responses.
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

export async function getDestinations() {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/destinations`,
  );

  const data = await handleResponse(response);

  return data.destinations;
}

export async function recommend(history, topK = 5) {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/recommendations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        history,
        top_k: topK,
      }),
    },
  );

  return handleResponse(response);
}