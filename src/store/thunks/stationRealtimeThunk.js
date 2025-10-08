import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const etaFromSeconds = (sec) => {
  const n = Number(sec);
  if (!Number.isFinite(n)) return "";
  if (n <= 30) return "곧 도착";
  return `${Math.floor(n / 60)}분 후`;
};

const arrivalMessage = (barvlDt, trainLineNm) => {
  const eta = etaFromSeconds(barvlDt);
  const line = trainLineNm ? String(trainLineNm) : "";
  return [line, eta].filter(Boolean).join(" ");
};

export const stationRealtimeIndex = createAsyncThunk(
  "stationDetail/stationRealtimeIndex",
  async (stationName = "서울") => {
    const base = import.meta.env.VITE_SWOPEN_API_BASE_URL;
    const key  = import.meta.env.VITE_OPEN_API_KEY;
    const type = import.meta.env.VITE_OPEN_API_TYPE;
    const svc  = import.meta.env.VITE_SWOPEN_API_SERVICE_REALTIME;
    const url = `${base}${key}${type}${svc}/0/20/${encodeURIComponent(stationName)}`;
    console.log(url);
    const response = await axios.get(url);
    return (
      response?.data?.realtimeArrivalList ||
      response?.data?.realtimeStationArrival?.row ||
      []
    );
  }
);

export { etaFromSeconds, arrivalMessage };
