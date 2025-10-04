// src/store/slices/subwaystationSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { subwaystationIndex } from "../thunks/subwaystationThunk.js";

const initialState = {
  list: [],          // 화면에 뿌릴 현재 리스트
  listAll: [],       // 검색 기준 원본
  searchStationNm: "", // 로컬 검색어(스토어 저장) — 여기로 통일!
};

const subwaystationSlice = createSlice({
  name: "subwaystation", // ← store 키와 일치하게 간결한 네임스페이스 권장
  initialState,
  reducers: {
    // 로컬 필터 적용 (부분 일치: 역명/노선/코드)
    applyLocalFilter(state, { payload }) {
      const q = String(payload ?? "").trim().toLowerCase();
      state.searchStationNm = q;

      const base = state.listAll;
      state.list = !q
        ? base.slice()
        : base.filter((it) => {
            const name = String(it?.stationNm ?? it?.STATION_NM ?? "").toLowerCase();
            const line = String(it?.lineNum   ?? it?.LINE_NUM   ?? it?.subwayNm ?? "").toLowerCase();
            const fr   = String(it?.frCode    ?? it?.FR_CODE    ?? "").toLowerCase();
            return name.includes(q) || line.includes(q) || fr.includes(q);
          });
    },

    // 로컬 필터 해제
    clearLocalFilter(state) {
      state.searchStationNm = "";
      state.list = state.listAll.slice();
    },
  },

  extraReducers: (builder) => {
    // ✅ 목록 불러오기 성공 시: 원본 저장 후, 현재 검색어 기준으로 화면 리스트 재계산
    builder.addCase(subwaystationIndex.fulfilled, (state, { payload }) => {
      const arr = Array.isArray(payload) ? payload : [];
      state.listAll = arr.slice();

      const q = state.searchStationNm; // 이미 소문자/트림된 값이 들어가 있으니 그대로 사용
      state.list = !q
        ? arr.slice()
        : arr.filter((it) => {
            const name = String(it?.stationNm ?? it?.STATION_NM ?? "").toLowerCase();
            const line = String(it?.lineNum   ?? it?.LINE_NUM   ?? it?.subwayNm ?? "").toLowerCase();
            const fr   = String(it?.frCode    ?? it?.FR_CODE    ?? "").toLowerCase();
            return name.includes(q) || line.includes(q) || fr.includes(q);
          });
    });

    // (선택) 로깅이 필요하면 pending/rejected도 명시적으로
    builder.addCase(subwaystationIndex.pending, (state, action) => {
      // console.log('역 목록 불러오는 중...', action.type);
    });
    builder.addCase(subwaystationIndex.rejected, (state, action) => {
      console.error('역 목록 불러오기 실패:', action.error);
    });
  },
});

export const { applyLocalFilter, clearLocalFilter } = subwaystationSlice.actions;
export default subwaystationSlice.reducer;
