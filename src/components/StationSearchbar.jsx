import { useDispatch, useSelector } from "react-redux";
import { applyLocalFilter } from "../store/slices/subwaystationSlice.js";
import "./StationSearchbar.css";

export default function StationSearch() {
  const dispatch = useDispatch();
  const searchValue = useSelector((s) => s.subwaystation.searchStationNm || "");

  const onChange = (e) => {
    const v = e.target.value.replace(/\s+/g, " ").trimStart(); // 공백 정리
    dispatch(applyLocalFilter(v)); // 역명만 필터 
  };

  return (
    <input
      className="subway-search__input"
      type="text"
      placeholder="역명으로 검색 (1~9호선)"
      value={searchValue}
      onChange={onChange}
    />
  );
}
