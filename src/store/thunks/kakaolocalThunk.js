import { createAsyncThunk } from "@reduxjs/toolkit";
import { KakaoGet } from "../../configs/kakaoConfig";

/** 주소 → 좌표 */
export const fetchAddressSearch = createAsyncThunk(
  "kakao/addressSearch",
  async (query, thunkAPI) => {
    try {
      const { data } = await KakaoGet("/v2/local/search/address.json", { query });
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
      const { data } = await KakaoGet("/v2/local/geo/coord2regioncode.json", {
        x, y, input_coord,
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
      const { data } = await KakaoGet("/v2/local/geo/coord2address.json", {
        x, y, input_coord,
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
      const { data } = await KakaoGet("/v2/local/geo/transcoord.json", {
        x, y, input_coord, output_coord,
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
    // params: { query, x?, y?, radius?, page?, size?, category_group_code? ... }
    try {
      const { data } = await KakaoGet("/v2/local/search/keyword.json", params);
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
    // params: { category_group_code, x?, y?, radius?, rect?, page?, size? ... }
    try {
      const { data } = await KakaoGet("/v2/local/search/category.json", params);
      return data?.documents ?? [];
    } catch (e) {
      return thunkAPI.rejectWithValue(e?.response?.data || e.message);
    }
  }
);
