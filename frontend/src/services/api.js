const API_BASE_URL = "http://127.0.0.1:8000/api/v1";
const TOKEN_KEY = "access_token";

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;

    try {
      const errorData = await response.json();

      if (Array.isArray(errorData?.detail)) {
        errorMessage = errorData.detail
          .map((error) => error.msg)
          .filter(Boolean)
          .join(", ");
      } else if (typeof errorData?.detail === "string") {
        errorMessage = errorData.detail;
      }
    } catch {
      // Keep default error message
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getAuthHeaders() {
  const token = getAccessToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

async function apiRequest(
  endpoint,
  {
    method = "GET",
    body,
    authenticated = false,
  } = {}
) {
  const headers = {
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...(authenticated ? getAuthHeaders() : {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse(response);
}

export async function register(userData) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: userData,
  });
}

export async function login(credentials) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: credentials,
  });

  localStorage.setItem(TOKEN_KEY, data.access_token);

  window.dispatchEvent(new Event("auth-changed"));

  return data;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);

  window.dispatchEvent(new Event("auth-changed"));
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}

export async function getMe() {
  return apiRequest("/auth/me", {
    authenticated: true,
  });
}

export async function getDestinations() {
  const data = await apiRequest("/destinations");
  return data.destinations;
}

export async function getTours() {
  return apiRequest("/tours");
}

export async function getTourById(tourId) {
  return apiRequest(`/tours/${tourId}`);
}

export async function getTourSchedules(tourId) {
  return apiRequest(`/tours/${tourId}/schedules`);
}

export async function createBooking(bookingData) {
  return apiRequest("/bookings", {
    method: "POST",
    body: bookingData,
    authenticated: true,
  });
}

export async function getMyBookings() {
  return apiRequest("/bookings/me", {
    authenticated: true,
  });
}

export async function getBookingById(bookingId) {
  return apiRequest(`/bookings/${bookingId}`, {
    authenticated: true,
  });
}

export async function cancelBooking(bookingId) {
  return apiRequest(`/bookings/${bookingId}/cancel`, {
    method: "PATCH",
    authenticated: true,
  });
}

export async function getMyRecommendations() {
  return apiRequest("/recommendations/me", {
    authenticated: true,
  });
}

export async function recommend(history, topK = 5) {
  return apiRequest("/recommendations", {
    method: "POST",
    body: {
      history,
      top_k: topK,
    },
  });
}