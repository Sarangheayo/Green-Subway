// src/components/SubwayLineOnMap.jsx
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Map from "./Map.jsx";
import "./SubwayLineOnMap.css";
import { LINE_OPTIONS } from "../utils/subwayLineUtil";
import { setLine } from "../store/slices/subwaySlice";
import { subwayFetchLineWithCoords } from "../store/thunks/subwayThunk";

export default function SubwayLineOnMap() {
  const dispatch = useDispatch();
  const { line, list, total, loading, error } = useSelector((s) => s.subway);
  const mapApiRef = useRef(null);

  // ✅ line이 바뀔 때마다 자동 조회
  useEffect(() => {
     dispatch(subwayFetchLineWithCoords({ lineName: line }));
  }, [dispatch, line]);

  // 지도 마커 반영
  useEffect(() => {
    if (!mapApiRef.current) return;
    const { clearMarkers, addMarker, setStatus } = mapApiRef.current;

    clearMarkers?.();
    if (!list?.length) return;

    list.forEach((p) => {
      const name = p.STATION_NM || p.stationNm;
      const lineText = p.LINE_NUM || p.lineNum;
      addMarker?.({
        lat: p.y,
        lng: p.x,
        html: `<div style="padding:6px 8px;max-width:220px;">
          <div style="font-weight:700">${name} (${lineText})</div>
          <div style="font-size:12px;color:#555">${p.address || ""}</div>
          <div style="font-size:12px;color:#888">역번호: ${p.FR_CODE || p.frCode || "-"}</div>
        </div>`,
      });
    });

    setStatus?.(`${line} 표시 완료: ${list.length}/${total}건`);
  }, [list, total, line]);

  function onChangeLine(e) {
    const v = e.target.value;
    dispatch(setLine(v)); // 상태 갱신
    // thunk는 위 useEffect가 자동으로 호출
  }

  return (
    <section className="subway-line-on-map">
      <form className="mapSearch" onSubmit={(e) => e.preventDefault()}>
        <div className="mapSearch__field">
          <span className="mapSearch__icon">🚇</span>
          <select className="mapSearch__input" value={line} onChange={onChangeLine}>
            {LINE_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <button className="mapSearch__clear" disabled>
            {loading ? "로딩..." : "노선 표시"}
          </button>
        </div>
      </form>

      {error && <p className="mapPage__status" style={{ color: "#c33" }}>오류: {error}</p>}

      <Map
        defaultQuery="지하철역"
        aroundRadius={3000}
        onReady={(_map, _kakao, helpers) => { mapApiRef.current = helpers; }}
      />
    </section>
  );
}
