import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { listPresentAndNameList } from "../../utils/subwaySearchUtils.js"
import { findFirstList } from "../../utils/listSubwayGeom1to9Util.js";
import  listGeom  from "../../data/listGeom.js";

// 🔹 .env 토글: true면 로컬 데이터만 사용
const USE_LOCAL_GEOM = String(import.meta.env.VITE_USE_LOCAL_GEOM).toLowerCase() === "true";

const normalizeLineFromGeom = (v) => {
  // "9호선(연장)" → "9호선" 으로 강제
  const x = String(v ?? "").replace(/\(.*?\)/g, "").replace(/\s+/g, "");
  const m = x.match(/^0?([1-9])(?:호)?(?:선)?$/);
  return m ? `${m[1]}호선` : x;
};


const geomToStationRows = (arr = []) =>
  arr
    .map((g) => ({
      STATION_NM: String(g.stnKrNm ?? g.STN_KR_NM ?? "").trim(),
      LINE_NUM: normalizeLineFromGeom(g.lineNm ?? g.LINE_NM ?? ""),
    }))
    .filter((r) => r.STATION_NM && r.LINE_NUM);

// 기존 역명 api 인덱스(원본 유지) + listGeom 추가 머지

export const listPresentAndNameListIndex = createAsyncThunk(
  "listPresentAndNameList/listPresentAndNameListIndex",
  async (s = "") => {
    const url = `${import.meta.env.VITE_OPEN_API_BASE_URL}${import.meta.env.VITE_OPEN_API_KEY}${import.meta.env.VITE_OPEN_API_TYPE}${import.meta.env.VITE_OPEN_API_SERVICE_ADDRESS_AND_TEL}/1/271`;
    // const url=`http://openAPI.seoul.go.kr:8088/566b5141456d7975313875516b6752/json/SearchInfoBySubwayNameService/1/799`

  let rows = [];
    try {
      const { data } = await axios.get(url);
      // 🔸원본 그대로 두되 확실히 StationAdresTelno 우선
      rows =
        data?.StationAdresTelno?.row ??
        data?.SearchInfoBySubwayNameService?.row ??
        [];
    } catch (_) {
      // 원격 실패해도 무시하고 로컬만으로 진행
    }

    // ✅ 원격 rows + 로컬 listGeom(표준 키로 변환) 합치기
    const merged = [...rows, ...geomToStationRows(listGeom)];
    return listPresentAndNameList(merged, String(s ?? "").trim());
  }
);

// 서울 빅데이터 좌표 (1~9호선만) — 원본 유지 + 로컬 폴백 추가
export const listSubwayGeom1to9Index = createAsyncThunk(
  "listSubwayGeom1to9/listSubwayGeom1to9Index",
  async () => {
    try {
      const url = `${import.meta.env.VITE_BIG_DATA_API_BASE_URL}${import.meta.env.VITE_BIG_DATA_API_TYPE}${import.meta.env.VITE_BIG_DATA_OPEN_API}${import.meta.env.VITE_BIG_DATA_API_SERVICE_XY}/1/4128`;
      // const url=`https://t-data.seoul.go.kr/apig/apiman-gateway/tapi/TaimsKsccDvSubwayStationGeom/1/4128`
  
    const { data } = await axios.get(url);
    const rowsG = data?.TaimsKsccDvSubwayStationGeom?.row ?? [];
    const list = findFirstList(rowsG) || [];

      const fromRemote = list
        .map((x) => ({
          outStnNum: String(x.outStnNum ?? x.OUT_STN_NUM ?? "").trim(),
          stnKrNm: String(x.stnKrNm ?? x.STN_KR_NM ?? "").trim(),
          lineNm: String(x.lineNm ?? x.LINE_NM ?? "").trim(),
          convX: Number(x.convX ?? x.CONV_X),
          convY: Number(x.convY ?? x.CONV_Y),
        }))
        .filter((r) => r.outStnNum && r.stnKrNm && r.lineNm)
        .filter((r) => /^[1-9]호선(?:\(연장\))?$/.test(r.lineNm));

      if (fromRemote.length) return fromRemote;
      // ↓↓↓ 원격이 비었으면 로컬 listGeom 폴백
    } catch (_) {
      // 에러면 로컬 폴백으로 진행
    }

    const fromLocal = (listGeom ?? [])
      .map((x) => ({
        outStnNum: String(x.outStnNum ?? x.OUT_STN_NUM ?? "").trim(),
        stnKrNm: String(x.stnKrNm ?? x.STN_KR_NM ?? "").trim(),
        lineNm: String(x.lineNm ?? x.LINE_NM ?? "").trim(),
        convX: Number(x.convX ?? x.CONV_X),
        convY: Number(x.convY ?? x.CONV_Y),
      }))
      .filter((r) => r.outStnNum && r.stnKrNm && r.lineNm)
      .filter((r) => /^[1-9]호선(?:\(연장\))?$/.test(r.lineNm));

    return fromLocal;
  }
);   