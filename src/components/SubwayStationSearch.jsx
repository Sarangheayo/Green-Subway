import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./SubwayStationSearch.css";
import { 
  applyLocalFilter, 
  clearLocalFilter 
} from "../store/slices/subwaystationSlice.js";

function SubwayStationSearch() {
  const dispatch = useDispatch();
  const qLocal = useSelector((s) => s.subwaystation?.qLocal ?? "");
  const [q, setQ] = useState(qLocal);

  useEffect(() => { setQ(qLocal); }, [qLocal]);

  const onChange = (e) => {
    const v = e.target.value.replace(/\s+/g, " ");
    setQ(v);
    dispatch(applyLocalFilter(v));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (q !== qLocal) dispatch(applyLocalFilter(q));
    // 인풋은 비우지 않음(UX: 검색어 유지)
  };

  // TO DD : onClear 추가해줘야함
  const onClear = () => {
    setQ("");
    dispatch(clearLocalFilter());
  };

  return (
    <form className="subwaystationlist-searchbar" onSubmit={onSubmit}>
      <input
        className="subwaystationlist-searchbar__input"
        type="text"
        placeholder="리스트에서 검색… (역명/노선/코드)"
        value={q}
        onChange={onChange}
      />
    </form>
  );
}

export default SubwayStationSearch;
