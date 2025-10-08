import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../store/slices/stationSlice.js";
import "./StationSearchbar.css";

function StationSearchbar() {
  
  const dispatch = useDispatch();
  const value = useSelector((s) => s.station.searchStationNm || "");
 
  return (
    <input
      className="subway-search__input"
      type="text"
      placeholder="역명으로 검색 (1~9호선)"
      value={value}
      onChange={(e) => dispatch(setSearch(e.target.value))}
    />
  );
}

export default StationSearchbar;
