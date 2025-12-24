import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3000/api", // tu backend
});


http.interceptors.request.use((config) => {
  // Asegurar headers (a veces viene undefined)
  config.headers = config.headers ?? {};

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const userId = user?.id ?? user?.user_id ?? user?.userId;

  if (userId) config.headers["x-user-id"] = String(userId);

  return config;
});

export default http;
