import { createAsyncThunk } from "@reduxjs/toolkit";
import { kakaoAxios } from "../../configs/kakaoConfig";

/** 주소 → 좌표 */
export const fetchAddressSearch = createAsyncThunk(
  "kakao/addressSearch",
  async (query, thunkAPI) => {
    try {
      const q = (query ?? "").trim();
      if (!q) return []; // 빈값이면 호출 막기
      const { data } = await kakaoAxios.get("/v2/local/search/address.json", {
        params: { query: q, analyze_type: "similar" },
      });
      return data?.documents ?? [];
    } catch (e) {
      return thunkAPI.rejectWithValue(e?.response?.data || e.message);
    }
  }
);

/** 좌표 → 행정구역 코드 */
export const fetchCoord2Region = createAsyncThunk(
  "kakao/coord2region",
  async ({ x, y, input_coord = "WGS84" }, thunkAPI) => {
    try {
      const { data } = await kakaoAxios.get("/v2/local/geo/coord2regioncode.json", {
        params: { x, y, input_coord },
      });
      return data?.documents ?? [];
    } catch (e) {
      return thunkAPI.rejectWithValue(e?.response?.data || e.message);
    }
  }
);

/** 좌표 → 주소 */
export const fetchCoord2Address = createAsyncThunk(
  "kakao/coord2address",
  async ({ x, y, input_coord = "WGS84" }, thunkAPI) => {
    try {
      const { data } = await kakaoAxios.get("/v2/local/geo/coord2address.json", {
        params: { x, y, input_coord },
      });
      return data?.documents ?? [];
    } catch (e) {
      return thunkAPI.rejectWithValue(e?.response?.data || e.message);
    }
  }
);

/** 좌표계 변환 */
export const fetchTransCoord = createAsyncThunk(
  "kakao/transcoord",
  async ({ x, y, input_coord = "WGS84", output_coord = "WGS84" }, thunkAPI) => {
    try {
      const { data } = await kakaoAxios.get("/v2/local/geo/transcoord.json", {
        params: { x, y, input_coord, output_coord },
      });
      return data?.documents ?? [];
    } catch (e) {
      return thunkAPI.rejectWithValue(e?.response?.data || e.message);
    }
  }
);

/** 키워드로 장소 검색 */
export const fetchKeywordSearch = createAsyncThunk(
  "kakao/keywordSearch",
  async (params, thunkAPI) => {
    try {
      const query = (params?.query ?? "").trim();
      if (!query) return [];
      const { data } = await kakaoAxios.get("/v2/local/search/keyword.json", {
        params: { ...params, query },
      });
      return data?.documents ?? [];
    } catch (e) {
      return thunkAPI.rejectWithValue(e?.response?.data || e.message);
    }
  }
);

/** 카테고리로 장소 검색 */
export const fetchCategorySearch = createAsyncThunk(
  "kakao/categorySearch",
  async (params, thunkAPI) => {
    try {
      const { data } = await kakaoAxios.get("/v2/local/search/category.json", {
        params,
      });
      return data?.documents ?? [];
    } catch (e) {
      return thunkAPI.rejectWithValue(e?.response?.data || e.message);
    }
  }
);
