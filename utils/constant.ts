import axios from "axios";

export const backendInstance = axios.create({
  baseURL: "https://ka-calc-backend.vercel.app",
});
