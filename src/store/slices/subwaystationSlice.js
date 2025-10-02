import { createSlice } from "@reduxjs/toolkit";
import { subwaystationIndex } from "../thunks/subwaystationThunk.js";

const initialState = {
  _raw: [],
  list: [],
  qLocal: "",
  total: 0,
  loading: false,
  error: null,
};

function norm(v) {
  return (v ?? "").toString().replace(/\s+/g, "").toLowerCase();
}
function matches(item, q) {
  if (!q) return true;
  const n = norm(q);
  const cands = [
    item.STATION_NM,
    item.statnNm,
    item.LINE_NUM,
    item.FR_CODE,
    item.subwayNm,
    item.trainLineNm,
    item.subwayList,
    item.subwayId,
    item.STATION_CD,
    item.statnId,
  ];
  return cands.some((f) => norm(f).includes(n));
}
function filterList(raw, q) {
  if (!q) return raw;
  return raw.filter((it) => matches(it, q));
}

const slice = createSlice({
  name: "subwaystationSlice",
  initialState,
  reducers: {
    applyLocalFilter(state, action) {
      const q = (action.payload ?? "").toString().trim();
      state.qLocal = q;
      state.list = filterList(state._raw, q);
    },
    clearLocalFilter(state) {
      state.qLocal = "";
      state.list = state._raw;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subwaystationIndex.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subwaystationIndex.fulfilled, (state, action) => {
        const arr = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.list ?? [];
        state._raw = Array.isArray(arr) ? arr : [];
        state.list = filterList(state._raw, state.qLocal);
        state.total = state._raw.length;
        state.loading = false;
      })
      .addCase(subwaystationIndex.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "fetch failed";
      });
  },
});

export const { applyLocalFilter, clearLocalFilter } = slice.actions;
export default slice.reducer;
