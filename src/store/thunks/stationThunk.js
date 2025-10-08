import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const stationIndex = createAsyncThunk(
  'stationSlice/stationIndex',
   // s: 검색어
  async (s = "") => {
  
    const url = `${import.meta.env.VITE_OPEN_API_BASE_URL}${import.meta.env.VITE_OPEN_API_KEY}${import.meta.env.VITE_OPEN_API_TYPE}${import.meta.env.VITE_OPEN_API_SERVICE_NAME}/1/799`
    // const url=`http://openAPI.seoul.go.kr:8088/424a49475a6d696a363461576f5178/json/SearchInfoBySubwayNameService/1/799`
    console.log(url);
    const response = await axios.get(url);

    const listPresent = response.data.SearchInfoBySubwayNameService.row;
    const S = String(s).trim().toLowerCase();

    // "01호선" → "1호선"
    const lineMinusZero = (zero) => {
      const noZero = String(zero ?? "").trim();
      const m = noZero.match(/^0?([1-9])호선$/);
      return m ? `${m[1]}호선` : noZero;
    };

    const nameList = listPresent
    .map(row => ({
      name: row.STATION_NM ?? row.stationNm ?? "", // 다 없으면 기본값(빈 문자열)
      line: lineMinusZero(row.LINE_NUM ?? row.subwayNm ?? ""), // ← 정규화 적용
      }))
    .filter(station =>  /^[1-9]호선$/.test(station.line)) // 1~9호선만, 정규식, station: .map()에서 만든 “각 역 객체” 한 개
    .filter(station => {
      if (!S) return true;
      return (
        station.name.toLowerCase().includes(S) || // toLowerCase : 역 이름을 모두 소문자로 바꾼 뒤, 검색어 S(소문자 상태)가 그 안에 포함돼 있으면 true 반환”
        station.line.toLowerCase().includes(S)    // 역/ 호선명에 검색어가 포함되어 있으면 true
      ); 
    });

     return {
      listPresent, // 전체 원본 데이터
      nameList, // 1~9호선 정규화 리스트
   };  
  }
);

export { stationIndex };