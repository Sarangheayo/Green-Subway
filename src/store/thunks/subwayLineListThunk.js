// src/store/thunks/subwayStationListThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { listPresentAndNameList } from "../utils/subwaySearchUtils.js"; // 경로는 네 프로젝트에 맞게

export const listPresentAndNameListIndex = createAsyncThunk(
  "listPresentAndNameList/listPresentAndNameListIndex",
  async (s = "") => {
    const url = `${import.meta.env.VITE_OPEN_API_BASE_URL}${import.meta.env.VITE_OPEN_API_KEY}${import.meta.env.VITE_OPEN_API_TYPE}${import.meta.env.VITE_OPEN_API_SERVICE_ADDRESS_AND_TEL}/0/271`;
    // const url=`http://openAPI.seoul.go.kr:8088/566b5141456d7975313875516b6752/json/SearchInfoBySubwayNameService/1/799`
    console.log("stationIndex URL =>", url);

    const { data } = await axios.get(url);
    const rows = data?.SearchInfoBySubwayNameService?.row ?? [];

    // 유틸에 전부 위임 (정규화/필터/토큰 매칭)
    return listPresentAndNameList(rows, String(s ?? "").trim());
  }
);


