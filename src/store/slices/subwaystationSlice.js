import { createSlice } from "@reduxjs/toolkit";
import { subwaystationIndex } from "../thunks/subwaystationThunk.js";

const initialState = {
  list: [],      // 화면에 뿌릴 현재 리스트
  listAll: [],   // 검색 기준 원본
  qLocal: "",    // 로컬 검색어(스토어 저장)
};

const subwaystationSlice = createSlice({
  name: "subwaystationSlice",
  initialState,
  reducers: {
    // 로컬 필터 적용 (부분 일치: 역명/노선/코드)
    applyLocalFilter(state, { payload }) {
      const q = String(payload ?? "").trim().toLowerCase();
      state.qLocal = q;

      const base = state.listAll; // 이미 불러온 원본만 기준으로 필터
      state.list = !q
        ? base.slice()
        : base.filter((it) => {
            // 대/소문자 키 모두 지원
            const name = String(it?.stationNm ?? it?.STATION_NM ?? "").toLowerCase();
            const line = String(it?.lineNum   ?? it?.LINE_NUM   ?? it?.subwayNm ?? "").toLowerCase();
            const fr   = String(it?.frCode    ?? it?.FR_CODE    ?? "").toLowerCase();
            return name.includes(q) || line.includes(q) || fr.includes(q);
          });
    },

    // 로컬 필터 해제
    clearLocalFilter(state) {
      state.qLocal = "";
      state.list = state.listAll.slice();
    },
  },

  extraReducers: (b) => {
    // API 성공 시: listAll 최신화 + qLocal 유지해서 list 재계산
    b.addCase(subwaystationIndex.fulfilled, (state, { payload }) => {
      const arr = Array.isArray(payload) ? payload : [];
      state.listAll = arr.slice();

      const q = String(state.qLocal || "").trim().toLowerCase();
      state.list = !q
        ? arr.slice()
        : arr.filter((it) => {
            const name = String(it?.stationNm ?? it?.STATION_NM ?? "").toLowerCase();
            const line = String(it?.lineNum   ?? it?.LINE_NUM   ?? it?.subwayNm ?? "").toLowerCase();
            const fr   = String(it?.frCode    ?? it?.FR_CODE    ?? "").toLowerCase();
            return name.includes(q) || line.includes(q) || fr.includes(q);
          });
    });
  },
});

export const { applyLocalFilter, clearLocalFilter } = subwaystationSlice.actions;
export default subwaystationSlice.reducer;
