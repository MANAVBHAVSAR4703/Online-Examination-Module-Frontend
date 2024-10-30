const backend_url = "http://localhost:8080";

const api = {
  Login: backend_url + "/api/auth/login",
  UserFetch: backend_url + "/api/auth/me",
};

export default api;
