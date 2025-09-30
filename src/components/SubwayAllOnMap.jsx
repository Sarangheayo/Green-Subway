// src/components/SubwayLineOnMap.jsx
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLine } from "../store/slices/subwaySlice";
import { subwayFetchStations, subwayFetchRealtime } from "../store/thunks/subwayThunk";
import { geocodeStationQuick } from "../configs/kakaoConfig"; // 좌표 보강용

export default function SubwayLineOnMap() {
  const dispatch = useDispatch();
  const { line, list, realtime, loading, error } = useSelector(s => s.subway);

  const mapRef = useRef(null);
  const stationMarkersRef = useRef([]);
  const trainMarkersRef = useRef([]);
  const [showRealtime, setShowRealtime] = useState(true);

  // 라인 변경 시 데이터 자동 조회
  useEffect(() => {
    dispatch(subwayFetchStations({ lineName: line }));
    dispatch(subwayFetchRealtime({ lineName: line }));
  }, [dispatch, line]);

  // (선택) 주기 갱신 하고 싶으면 주석 해제
  // useEffect(() => {
  //   const id = setInterval(() => {
  //     dispatch(subwayFetchRealtime({ lineName: line }));
  //   }, 15000);
  //   return () => clearInterval(id);
  // }, [dispatch, line]);

  // 지도 init
  useEffect(() => {
    if (!window.kakao?.maps) return;
    const { kakao } = window;
    const center = new kakao.maps.LatLng(37.5665, 126.9780);
    const map = new kakao.maps.Map(document.getElementById("subway-map"), { center, level: 6 });
    mapRef.current = map;
    return () => { mapRef.current = null; };
  }, []);

  // 공통: 마커 제거
  function clearMarkers(ref) {
    ref.current.forEach(m => m.setMap(null));
    ref.current = [];
  }

  // 역 마커 렌더
  useEffect(() => {
    if (!mapRef.current) return;
    const { kakao } = window;

    clearMarkers(stationMarkersRef);
    if (!Array.isArray(list) || list.length === 0) return;

    const bounds = new kakao.maps.LatLngBounds();
    const pts = list.filter(r => r.x && r.y);

    pts.forEach((r) => {
      const pos = new kakao.maps.LatLng(r.y, r.x);
      const marker = new kakao.maps.Marker({ position: pos }); // 기본 핀 = 역
      marker.setMap(mapRef.current);
      stationMarkersRef.current.push(marker);
      bounds.extend(pos);
    });

    if (!bounds.isEmpty()) mapRef.current.setBounds(bounds);
  }, [list]);

  // 실시간 열차 마커 렌더 (경고 제거: realtime 실제 사용)
  useEffect(() => {
    if (!mapRef.current) return;
    clearMarkers(trainMarkersRef);

    if (!showRealtime) return; // 토글 꺼져 있으면 표시 안 함
    if (!Array.isArray(realtime) || realtime.length === 0) return;

    const { kakao } = window;

    // 열차 아이콘(작은 원형) – 필요시 이미지로 교체
    const trainIcon = new kakao.maps.MarkerImage(
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
           <circle cx="9" cy="9" r="7" fill="#222"/>
         </svg>`
      ),
      new kakao.maps.Size(18, 18),
      { offset: new kakao.maps.Point(9, 9) }
    );

    // 역명 → 좌표 빠른 매핑을 위해 map 구성
    const stationByName = new Map(
      (list || [])
        .filter(r => r?.name && r.x && r.y)
        .map(r => [String(r.name), { x: r.x, y: r.y }])
    );

    // 실시간 행의 좌표를 추출 (API 스키마가 다를 수 있어 후보키 사용)
    const getXY = (row) => {
      const x = Number(row?.XPOINT_WGS ?? row?.X ?? row?.lon ?? row?.longitude ?? 0);
      const y = Number(row?.YPOINT_WGS ?? row?.Y ?? row?.lat ?? row?.latitude ?? 0);
      return { x, y };
    };

    const getStationName = (row) =>
      row?.statnNm ?? row?.STATION_NM ?? row?.stationName ?? row?.station_nm ?? "";

    (async () => {
      for (const r of realtime) {
        let { x, y } = getXY(r);

        // 좌표 없으면: 1) 동일 역명 좌표 사용 2) 카카오 지오코딩 보강
        if (!(x && y)) {
          const nm = getStationName(r);
          if (nm && stationByName.has(nm)) {
            const p = stationByName.get(nm);
            x = p.x; y = p.y;
          } else if (nm) {
            const g = await geocodeStationQuick(nm);
            if (g) { x = g.x; y = g.y; }
          }
        }
        if (!(x && y)) continue;

        const pos = new kakao.maps.LatLng(y, x);
        const marker = new kakao.maps.Marker({
          position: pos,
          image: trainIcon, // 열차용 아이콘
          zIndex: 10,
        });

        const info = new kakao.maps.InfoWindow({
          content: `<div style="padding:6px 8px;font-size:12px;">
                      🚇 실시간 열차<br/>
                      ${getStationName(r) || "알 수 없음"}
                    </div>`,
        });

        kakao.maps.event.addListener(marker, "click", () => {
          info.open(mapRef.current, marker);
        });

        marker.setMap(mapRef.current);
        trainMarkersRef.current.push(marker);
      }
    })();
  }, [realtime, showRealtime, list]);

  return (
    <section style={{ padding: 12 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        {["01호선","02호선","03호선","04호선"].map(ln => (
          <button key={ln} onClick={() => dispatch(setLine(ln))} style={{ padding: "6px 10px" }}>
            {ln}
          </button>
        ))}
        <label style={{ marginLeft: "auto", fontSize: 14 }}>
          <input
            type="checkbox"
            checked={showRealtime}
            onChange={e => setShowRealtime(e.target.checked)}
            style={{ marginRight: 6 }}
          />
          실시간 열차 표시
        </label>
      </div>

      <div id="subway-map" style={{ width: "100%", height: 480, borderRadius: 12, overflow: "hidden" }} />

      <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 12, color: "#555" }}>
        <span>● 역 마커</span>
        <span>●<span style={{ display: "inline-block", width: 6 }}></span> 검은 점: 실시간 열차</span>
      </div>

      {loading && <p>불러오는 중…</p>}
      {error && <p style={{ color: "#c00" }}>에러: {String(error)}</p>}
      {!loading && !error && list?.length === 0 && <p>데이터가 없습니다.</p>}
    </section>
  );
}
