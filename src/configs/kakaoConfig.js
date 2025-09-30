import axios from "axios";
import { 
  VITE_KAKAO_BASE_URL,
  VITE_KAKAO_REST_KEY, // ✅ REST 키 불러오기
} from "../utils/env.js";

export const KakaoGet = (path, params = {}) => {
  return axios.get(`${VITE_KAKAO_BASE_URL}${path}`, {
    params,
    headers: {
      Authorization: `KakaoAK ${VITE_KAKAO_REST_KEY}`, // ✅ REST 키 사용
    },
  });
};

export default KakaoGet;


// 즉, 지도용 JS키와 검색용 REST키는 용도가 다름.

// JavaScript 키 → 브라우저에서 지도 SDK 띄울 때만 사용
// REST API 키 → 로컬 API (주소검색, 키워드검색, 좌표 변환) 요청할 때 사용

