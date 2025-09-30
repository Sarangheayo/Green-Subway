//  역명 검색

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Map from "./Map.jsx"; // 공용 지도 그대로


import { subwaySearchByName } from "../store/thunks/subwayThunk";
import {
  clearSearch as clearSubwaySearch, // 이름만 맞춰서 가져오기
  selectSearchQuery,
  selectSearchList,
  selectSearchTotal,
  selectSearchLoading,
  selectSearchError,
} from "../store/slices/subwaySlice";

export default function SubwaySearchByName() {
  const dispatch = useDispatch();
  const query = useSelector(selectSearchQuery);
  const list = useSelector(selectSearchList);
  const total = useSelector(selectSearchTotal);
  const loading = useSelector(selectSearchLoading);
  const error = useSelector(selectSearchError);

  const [q, setQ] = useState(query || "");
  const mapApiRef = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    dispatch(subwaySearchByName({ name: q.trim() }));
  };

  const onClear = () => {
    setQ("");
    dispatch(clearSubwaySearch());
    // 지도 마커 정리
    mapApiRef.current?.clearMarkers?.();
    mapApiRef.current?.setStatus?.("검색을 초기화했습니다.");
  };

  // 지도 마커 반영
  useEffect(() => {
    if (!mapApiRef.current) return;
    const { clearMarkers, addMarker, setStatus } = mapApiRef.current;

    clearMarkers?.();
    if (loading) {
      setStatus?.("검색 중…");
      return;
    }
    if (error) {
      setStatus?.(`오류: ${error}`);
      return;
    }
    if (!list?.length) {
      if (query) setStatus?.(`'${query}' 결과 없음 (${total})`);
      return;
    }

    list.forEach((p) => {
      addMarker?.({
        lat: p.y,
        lng: p.x,
        html: `<div style="padding:6px 8px;max-width:220px;">
          <div style="font-weight:700">${p.stationNm} (${p.lineNum})</div>
          <div style="font-size:12px;color:#555">${p.address || ""}</div>
          <div style="font-size:12px;color:#888">역번호: ${p.frCode || "-"}</div>
        </div>`,
      });
    });
    setStatus?.(`'${query}' 결과: ${list.length}/${total}건`);
  }, [list, total, loading, error, query]);

  return (
    <main className="page" style={{ maxWidth: 980, margin: "100px auto", padding: "0 16px" }}>
      <h1>지하철 역명 검색</h1>

      <form onSubmit={onSubmit} className="mapSearch" style={{ marginBottom: 12 }}>
        <div className="mapSearch__field">
          <span className="mapSearch__icon">🔎</span>
          <input
            className="mapSearch__input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="예) 종로3가, 김포공항, 동대문역사문화공원"
          />
          <button className="mapSearch__clear" type="submit" disabled={loading}>
            {loading ? "검색중..." : "검색"}
          </button>
          <button type="button" className="mapSearch__clear" onClick={onClear} style={{ marginLeft: 6 }}>
            초기화
          </button>
        </div>
      </form>

      {error && <p className="mapPage__status" style={{ color: "#c33" }}>오류: {error}</p>}

      <Map
        defaultQuery="지하철역"
        aroundRadius={3000}
        onReady={(_map, _kakao, helpers) => { mapApiRef.current = helpers; }}
      />
    </main>
  );
}
