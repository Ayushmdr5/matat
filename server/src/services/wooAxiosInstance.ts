import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://interview-test.matat.io/wp-json/wc/v3",
  auth: {
    username: process.env.WC_CONSUMER_KEY ?? "",
    password: process.env.WC_CONSUMER_SECRET ?? "",
  },
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default axiosInstance;
