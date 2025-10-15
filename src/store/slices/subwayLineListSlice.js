import { createSlice } from "@reduxjs/toolkit";
import { listPresentAndNameListIndex } from "../thunks/subwayLineListThunk.js";
import { listSubwayGeom1to9Index } from "../thunks/subwayLineListThunk.js";
 
const initialState = {
  loading: false,
  error: null,
  listPresent: [],  // 원본 row
  nameList: [],     // {name, line}만
  query: "",        // 마지막 검색어(옵션)
};

const subwayLineListSlice = createSlice({
  name: "subwayLine",
  initialState,
  reducers: {
    setQuery(state, action) {
      state.query = action.payload ?? "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listPresentAndNameListIndex.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.query = action.meta?.arg ? String(action.meta.arg) : "";
      })
      .addCase(listPresentAndNameListIndex.fulfilled, (state, action) => {
        state.loading = false;
        state.listPresent = action.payload.listPresent;
        state.nameList = action.payload.nameList;
      })
      .addCase(listPresentAndNameListIndex.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? "요청 실패";
      });
  },
});

export const { setQuery } = subwayLineListSlice.actions;
export default subwayLineListSlice.reducer;


const geomInitialState = {
  loading: false,
  error: null,
  items: [], // [{outStnNum, stnKrNm, lineNm, convX, convY}]
};

export const subwayGeomSlice = createSlice({
  name: "subwayGeom",
  initialState: geomInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listSubwayGeom1to9Index.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listSubwayGeom1to9Index.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(listSubwayGeom1to9Index.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? "좌표 불러오기 실패";
      });
  },
});

// ⚠️ default로 내보내지 않고 named export로 내보냄
export const subwayGeomReducer = subwayGeomSlice.reducer;