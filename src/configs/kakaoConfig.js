
import axios from "axios";
import { VITE_KAKAO_BASE_URL, VITE_KAKAO_REST_KEY } from "../utils/env.js";

export const kakaoAxios = axios.create({
  baseURL: (VITE_KAKAO_BASE_URL || "").trim(), // https://dapi.kakao.com
  timeout: 8000,
});

kakaoAxios.interceptors.request.use(cfg => {
  const key = (VITE_KAKAO_REST_KEY || "").trim();
  cfg.headers = { ...(cfg.headers || {}), Authorization: `KakaoAK ${key}` };
  return cfg;
});

// 키워드 → 1건 좌표(보강용)
export async function geocodeStationQuick(keyword) {
  const q = (keyword ?? "").trim();
  if (!q) return null;
  const { data } = await kakaoAxios.get("/v2/local/search/keyword.json", {
    params: { query: q, size: 1 },
  });
  const doc = data?.documents?.[0];
  return doc
    ? { x: Number(doc.x), y: Number(doc.y), name: doc.place_name, addr: doc.road_address_name || doc.address_name || "" }
    : null;
}

export default kakaoAxios;
