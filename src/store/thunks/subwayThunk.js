// src/store/thunks/subwayThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRealtimePosition } from "../../configs/seoulSubway";

export const fetchRealtimePosition = createAsyncThunk(
  "subway/fetchRealtimePosition",
  async ({ subwayNm, start = 0, end = 10 }, thunkAPI) => {
    try {
      const { data } = await getRealtimePosition({ subwayNm, start, end });
      if (data?.realtimePositionList) return data.realtimePositionList;
      const msg = data?.RESULT?.MESSAGE || "데이터 없음";
      return thunkAPI.rejectWithValue(msg);
    } catch (e) {
      return thunkAPI.rejectWithValue(e?.response?.data || e.message);
    }
  }
);
