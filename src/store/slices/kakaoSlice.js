import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAddressSearch,
  fetchCoord2Region,
  fetchCoord2Address,
  fetchTransCoord,
  fetchKeywordSearch,
  fetchCategorySearch,
} from "../thunks/kakaolocalThunk";

const initialState = {
  addressResults: [],
  regionResults: [],
  addressByCoordResults: [],
  transcoordResults: [],
  keywordResults: [],
  categoryResults: [],
  loading: false,
  error: null,
};

const kakaoSlice = createSlice({
  name: "kakao",
  initialState,
  reducers: {
    resetKakao(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (b) => {
    const pending = (s) => { s.loading = true; s.error = null; };
    const rejected = (s, a) => { s.loading = false; s.error = a.payload || a.error?.message || "error"; };

    b.addCase(fetchAddressSearch.pending, pending)
     .addCase(fetchAddressSearch.fulfilled, (s, a) => { s.loading = false; s.addressResults = a.payload; })
     .addCase(fetchAddressSearch.rejected, rejected)

     .addCase(fetchCoord2Region.pending, pending)
     .addCase(fetchCoord2Region.fulfilled, (s, a) => { s.loading = false; s.regionResults = a.payload; })
     .addCase(fetchCoord2Region.rejected, rejected)

     .addCase(fetchCoord2Address.pending, pending)
     .addCase(fetchCoord2Address.fulfilled, (s, a) => { s.loading = false; s.addressByCoordResults = a.payload; })
     .addCase(fetchCoord2Address.rejected, rejected)

     .addCase(fetchTransCoord.pending, pending)
     .addCase(fetchTransCoord.fulfilled, (s, a) => { s.loading = false; s.transcoordResults = a.payload; })
     .addCase(fetchTransCoord.rejected, rejected)

     .addCase(fetchKeywordSearch.pending, pending)
     .addCase(fetchKeywordSearch.fulfilled, (s, a) => { s.loading = false; s.keywordResults = a.payload; })
     .addCase(fetchKeywordSearch.rejected, rejected)

     .addCase(fetchCategorySearch.pending, pending)
     .addCase(fetchCategorySearch.fulfilled, (s, a) => { s.loading = false; s.categoryResults = a.payload; })
     .addCase(fetchCategorySearch.rejected, rejected);
  },
});

export const { resetKakao } = kakaoSlice.actions;
export default kakaoSlice.reducer;

// 선택 셀렉터
export const selectKakaoLoading = (s) => s.kakao.loading;
export const selectKakaoError = (s) => s.kakao.error;
export const selectAddressResults = (s) => s.kakao.addressResults;
export const selectKeywordResults = (s) => s.kakao.keywordResults;
