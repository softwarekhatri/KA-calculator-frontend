import axios from "axios";

export const backendInstance = axios.create({
  baseURL: "https://ka-calc-backend.vercel.app",
  // baseURL: "http://localhost:3001",
});

export function roundToNearestThousand(value) {
  return Math.round(value / 1000) * 1000;
}
