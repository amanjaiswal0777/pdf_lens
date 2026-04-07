const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://pdf-lens.onrender.com";

export async function readJsonResponse(res) {
  const text = await res.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Server returned an invalid response.");
  }
}

export default API_BASE_URL;
