
import axios from "axios";

export const seoulApi = axios.create({
  baseURL: "/seoul",   // vite 프록시: /seoul -> http://openapi.seoul.go.kr:8088
  timeout: 8000,
});

// 이중 슬래시 방지
export function pathJoin(...segs) {
  return segs
    .filter(Boolean)
    .map(s => String(s).replace(/^\/+|\/+$/g, ""))
    .join("/");
}

// "2호선" -> "02호선" (필요 시)
export function normalizeLineName(s) {
  if (!s) return s;
  const m = String(s).match(/^(\d{1,2})호선$/);
  if (m) return m[1].padStart(2, "0") + "호선";
  return s;
}

// 노선별 역 리스트
export async function fetchStationsByLine(lineName, start = 1, end = 1000) {
  const KEY = import.meta.env.VITE_SEOUL_SUBWAY_KEY;
  const line = encodeURIComponent(normalizeLineName(lineName));
  const url = "/" + pathJoin(KEY, "json", "SearchSTNBySubwayLineInfo", start, end, line);
  const { data } = await seoulApi.get(url);
  return data;
}

// 실시간 열차 위치 (서비스명에 맞게 수정)
export async function fetchRealtimeByLine(lineName, start = 1, end = 1000) {
  const KEY = import.meta.env.VITE_SEOUL_SUBWAY_KEY;
  const line = encodeURIComponent(normalizeLineName(lineName));
  const url = "/" + pathJoin(KEY, "json", "realtimePosition", start, end, line);
  const { data } = await seoulApi.get(url);
  return data;
}

  export default seoulApi;
