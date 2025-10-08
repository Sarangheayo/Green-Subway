import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../store/slices/stationSlice.js";
import "./StationSearchbar.css";
import { useEffect, useRef } from "react";  // 추가

function StationSearchbar() {
  
  const dispatch = useDispatch();
  const value = useSelector((s) => s.station.searchStationNm || "");

  // 추가 검색시 디바운스 핸들러를 넣어서 api 과부하 방지 120ms 디바운스 마지막 언마운트로 정리 
  const timerRef = useRef(null);           

  const handleChange = (e) => {                
    const v = e.target.value;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      dispatch(setSearch(v));
    }, 120);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

 
  return (
    <input
      className="subway-search__input"
      type="text"
      placeholder="역명으로 검색 (1~9호선)"
      value={value}
      onChange={handleChange}  
    />
  );
}

export default StationSearchbar;
