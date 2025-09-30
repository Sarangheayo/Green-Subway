// src/configs/seoulSubway.js
import axios from "axios";

const SEOUL_SUBWAY_KEY = import.meta.env.VITE_SEOUL_SUBWAY_KEY;
if (!SEOUL_SUBWAY_KEY) {
  console.warn("⚠️ VITE_SEOUL_SUBWAY_KEY 가 .env 에 없습니다.");
}

/**
 * 지하철 실시간 열차 위치 조회
 * /api/subway/{KEY}/{TYPE}/{SERVICE}/{START_INDEX}/{END_INDEX}/{subwayNm}
 */
export function getRealtimePosition({
  subwayNm,         // 필수: 지하철 호선명 (예: 2호선, 7호선)
  start = 0,        // 요청 시작 위치
  end = 10,         // 요청 종료 위치
  type = "json",    // 응답 타입 (json/xml)
}) {
  const baseURL = "https://swopenapi.seoul.go.kr";
  const encodedNm = encodeURIComponent(subwayNm);
  const url = `/api/subway/${SEOUL_SUBWAY_KEY}/${type}/realtimePosition/${start}/${end}/${encodedNm}`;
  return axios.get(baseURL + url);
}
