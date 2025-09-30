// src/store/thunks/subwayThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStationsByLine, fetchRealtimeByLine, normalizeLineName } from "../../configs/seoulApi";
import { geocodeStationQuick } from "../../configs/kakaoConfig";

// 역 리스트 불러오기 + 좌표 보강(카카오)
export const subwayFetchStations = createAsyncThunk(
  "subway/fetchStations",
  async ({ lineName }, thunkAPI) => {
    try {
      const res = await fetchStationsByLine(lineName, 1, 1000);
      // API 스키마에 맞게 꺼내기 (필드명은 실제 응답에 따라 맞춰줘)
      const rows =
        res?.SearchSTNBySubwayLineInfo?.row ||
        res?.SearchSTNBySubwayLineInfo?.RESULT || // 혹시 다른 스키마
        [];

      // 좌표 필드가 없다면 카카오로 보강
      const enriched = [];
      for (const r of rows) {
        const name = r.STATION_NM || r.stationName || r.station_nm || "";
        let x = Number(r.XPOINT_WGS || r.X || r.LON || 0);
        let y = Number(r.YPOINT_WGS || r.Y || r.LAT || 0);

        if (!(x && y)) {
          const g = await geocodeStationQuick(name);
          if (g) { x = g.x; y = g.y; }
        }
        enriched.push({ ...r, name, x, y });
      }

      return { lineName: normalizeLineName(lineName), list: enriched };
    } catch (e) {
      return thunkAPI.rejectWithValue(e?.response?.data || e.message);
    }
  }
);

// 실시간 열차 위치
export const subwayFetchRealtime = createAsyncThunk(
  "subway/fetchRealtime",
  async ({ lineName }, thunkAPI) => {
    try {
      const res = await fetchRealtimeByLine(lineName, 1, 1000);
      const rows =
        res?.realtimePosition?.row ||
        res?.realtimePosition?.RESULT ||
        [];
      return { lineName: normalizeLineName(lineName), realtime: rows };
    } catch (e) {
      return thunkAPI.rejectWithValue(e?.response?.data || e.message);
    }
  }
);

// line + 좌표까지 한 번에 가져오기 
export const subwayFetchLineWithCoords = createAsyncThunk(
  "subway/fetchLineWithCoords",
  async ({ lineName }, thunkAPI) => {
    try {
      const res = await fetchStationsByLine(lineName, 1, 1000);
      const rows = Array.isArray(res?.SearchSTNBySubwayLineInfo?.row)
      ? res.SearchSTNBySubwayLineInfo.row
      : [];
      
      
      const out = [];
      for (const r of rows) {
        let x = Number(r.XPOINT_WGS || 0);
        let y = Number(r.YPOINT_WGS || 0);
        if (!(x && y)) {
          const g = await geocodeStationQuick(r.STATION_NM);
          if (g) { x = g.x; y = g.y; }
        }
        out.push({ ...r, x, y });
      }
      return { lineName, list: out };
    } catch (e) {
      return thunkAPI.rejectWithValue(e?.response?.data || e.message);
    }
  }
);