// src/store/slices/subwaySlice.js
import { createSlice } from "@reduxjs/toolkit";
import { 
   subwayFetchStations,
   subwayFetchRealtime,
   subwayFetchLineWithCoords,
} from "../thunks/subwayThunk";

// 검색 필드 추가
const initial = {
  line: "02호선",
  list: [],
  realtime: [],
  loading: false,
  error: null,

  searchQuery: "",
  searchList: [],
  searchTotal: 0,
  searchLoading: false,
  searchError: null,
};

const subwaySlice = createSlice({
  name: "subway",
  initialState: initial,
  reducers: {
    setLine(state, action) { state.line = action.payload; },

    // 🔽 선택: 검색 쿼리 관리
    setSearchQuery(state, action) { state.searchQuery = action.payload ?? ""; },
    clearSearch(state) {
      state.searchQuery = "";
      state.searchList = [];
      state.searchTotal = 0;
      state.searchLoading = false;
      state.searchError = null;
    },
  },
  
  extraReducers: (b) => {
    // 역 리스트
    b.addCase(subwayFetchStations.pending, (s) => {
      s.loading = true; s.error = null;
    });
    b.addCase(subwayFetchStations.fulfilled, (s, a) => {
      s.loading = false;
      s.list = a.payload?.list || [];
      // 선택: 라인 동기화
      if (a.payload?.lineName) s.line = a.payload.lineName;
    });
    b.addCase(subwayFetchStations.rejected, (s, a) => {
      s.loading = false; s.error = a.payload || "fetchStations failed";
    });

    // 실시간
    b.addCase(subwayFetchRealtime.pending, (s) => {
      s.error = null;
    });
    b.addCase(subwayFetchRealtime.fulfilled, (s, a) => {
      s.realtime = a.payload?.realtime || [];
    });
    b.addCase(subwayFetchRealtime.rejected, (s, a) => {
      s.error = a.payload || "fetchRealtime failed";
    });

    // line+coords 한 번에 (쓰는 곳에서만 필요)
    b.addCase(subwayFetchLineWithCoords.pending, (s) => {
      s.loading = true; s.error = null;
    });
    b.addCase(subwayFetchLineWithCoords.fulfilled, (s, a) => {
      s.loading = false;
      s.list = a.payload?.list || [];
      if (a.payload?.lineName) s.line = a.payload.lineName;
    });
    b.addCase(subwayFetchLineWithCoords.rejected, (s, a) => {
      s.loading = false; s.error = a.payload || "fetchLineWithCoords failed";
    });
  },
});

export const { setLine, setSearchQuery, clearSearch } = subwaySlice.actions;

// 검색 셀렉터(빌드 에러 해결)
export const selectSearchQuery  = (s) => s.subway.searchQuery;
export const selectSearchList   = (s) => s.subway.searchList;
export const selectSearchTotal  = (s) => s.subway.searchTotal;
export const selectSearchLoading= (s) => s.subway.searchLoading;
export const selectSearchError  = (s) => s.subway.searchError;

export default subwaySlice.reducer;