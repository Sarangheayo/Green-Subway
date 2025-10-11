import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* ---------- 공용 유틸 ---------- */
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

/* ---------- 내부 헬퍼 ---------- */
const LINE_ID_MAP = {1001:1,1002:2,1003:3,1004:4,1005:5,1006:6,1007:7,1008:8,1009:9};
const isLine1to9 = (id) => Object.prototype.hasOwnProperty.call(LINE_ID_MAP, Number(id));

// URL 세그먼트 안전 조립 (슬래시 중복/누락 방지)
const joinUrl = (...parts) =>
  parts
    .map((p, i) => String(p ?? "").trim().replace(/^\/+|\/+$/g, i === 0 ? "" : ""))
    .filter(Boolean)
    .join("/") + "/";

// 스키마 차이 흡수
const extractRows = (data) => {
  if (!data) return [];
  if (Array.isArray(data.realtimeArrivalList)) return data.realtimeArrivalList;
  const svcKey = Object.keys(data).find((k) => k.toLowerCase().includes("realtimestationarrival"));
  return svcKey && Array.isArray(data[svcKey]?.row) ? data[svcKey].row : [];
};

// 필요한 5개 필드만 유지
const pick5 = (r = {}) => ({
  barvlDt: r.barvlDt ?? "",
  arvlMsg2: r.arvlMsg2 ?? "",
  updnLine: r.updnLine ?? "",
  trainLineNm: r.trainLineNm ?? "",
  subwayId: Number(r.subwayId ?? r.subwayid ?? r.subway_id ?? NaN),
  subwayNm: r.subwayNm, // 있으면 보존
});

const stationRealtimeIndex = createAsyncThunk(
  "stationDetail/stationRealtimeIndex",
  async (stationName = "서울", { rejectWithValue }) => {
    try {
      const base = import.meta.env.VITE_SWOPEN_API_BASE_URL;          // e.g. https://openapi.seoul.go.kr/api/
      const key  = import.meta.env.VITE_OPEN_API_KEY;                 // e.g. YOURKEY or /YOURKEY/
      const type = import.meta.env.VITE_OPEN_API_TYPE;                // e.g. json or json/
      const svc  = import.meta.env.VITE_SWOPEN_API_SERVICE_REALTIME;  // e.g. realtimeStationArrival or realtimeStationArrival/

      // ✅ 슬래시 안전 조립 + 마지막에 / 자동
      const prefix = joinUrl(base, key, type, svc);
      const url = `${prefix}1/50/${encodeURIComponent(stationName)}`;
      // 진단용
     
      console.debug("[realtime:url]", url);

      const { data, status } = await axios.get(url);

      let rows = extractRows(data).map(pick5);

      if (!rows.length) {
        // 응답 상위 키/일부 샘플 찍어서 원인 파악
        const topKeys = Object.keys(data || {});
        console.warn("[realtime:empty]", { status, topKeys, sample: JSON.stringify(data)?.slice(0, 400) });
      }

      // ✅ 1~9호선만: subwayId 없으면 일단 통과(진단 단계)
      rows = rows.filter((r) => (Number.isFinite(r.subwayId) ? isLine1to9(r.subwayId) : true));

      return rows;
    } catch (e) {
      console.error("[realtime:error]", {
        message: e?.message,
        status: e?.response?.status,
        data: e?.response?.data,
      });
      return rejectWithValue(e?.message || "realtime request failed");
    }
  }
);

export { etaFromSeconds, arrivalMessage };
export default stationRealtimeIndex;
