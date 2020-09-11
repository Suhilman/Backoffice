export default function setupAxios(axios, store) {
  axios.interceptors.request.use(
    (config) => {
      const {
        auth: { authToken }
      } = store.getState();

      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }

      return config;
    },
    (err) => Promise.reject(err)
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (err) => {
      if (err.response.status === 401 && err.response.data === "Unauthorized") {
        localStorage.clear();
        window.location.replace("/auth/login");
      } else {
        return Promise.reject(err);
      }
    }
  );
}
