import { useEffect, useMemo, useRef, useState } from "react";
import {
  Map,
  MapMarker,
  CustomOverlayMap,
  MarkerClusterer,
  useKakaoLoader,
} from "react-kakao-maps-sdk";
import "./SubwayLinePath.css";
import { useDispatch, useSelector } from "react-redux"; 
import { normalizeBigdataToStations, findStationByName } from "../../utils/listSubwayGeom1to9Util.js";
import { listPresentAndNameListIndex, listSubwayGeom1to9Index } from "../../store/thunks/subwayLineListThunk.js";

export default function SubwayLinePath({
  level = 5,
  useCluster = true,
}) {
  const dispatch = useDispatch();

  //index.html 쪽 헤더에 스크립트 카카오 앱 키 넣어주는거보다  useKakaoLoader 이거 쓰는게 더 안전 
  const appkey = import.meta.env.VITE_KAKAO_APP_KEY;
  useKakaoLoader({ appkey, libraries: ["services", "clusterer"] });


// Redux state
  const { nameList, loading: listLoading } = useSelector(
    (s) => s.subwayLine || {}
  );
  const { items: geomItems } = useSelector((s) => s.subwayGeom || {});

  // 좌표 정규화
  const stations = useMemo(
    () => normalizeBigdataToStations(geomItems),
    [geomItems]
  );

  // 검색어 입력
  const [q, setQ] = useState("");

  const mapRef = useRef(null);
  const [searchMarker, setSearchMarker] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const lastAlertedRef = useRef("");

  // 초기 호출
  useEffect(() => {
    if (!geomItems?.length) dispatch(listSubwayGeom1to9Index());
    dispatch(listPresentAndNameListIndex(q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 디바운스 검색
  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(listPresentAndNameListIndex(q));
    }, 300);
    return () => clearTimeout(t);
  }, [q, dispatch]);

  // 기본 중심점
  const initialCenter = useMemo(() => {
    const s = findStationByName(stations, "서울역");
    return s ? { lat: s.lat, lng: s.lng } : { lat: 37.554648, lng: 126.970607 };
  }, [stations]);

  // 리스트 아이템 클릭 → 지도 이동 + 마커
  const focusStation = (name, line) => {
    const kakao = window.kakao;
    if (!kakao || !mapRef.current) return;

    const hit = findStationByName(stations, name);
    if (hit) {
      const pos = { lat: hit.lat, lng: hit.lng };
      mapRef.current.setCenter(new kakao.maps.LatLng(pos.lat, pos.lng));
      mapRef.current.setLevel(4);
      setSearchMarker({ pos, title: hit.name, address: hit.line || line || "" });
      setInfoOpen(true);
      lastAlertedRef.current = "";
      return;
    }

    // 폴백 제거: 데이터 없으면 알림만
    setInfoOpen(false);
    setSearchMarker(null);
    if (lastAlertedRef.current !== q) {
      lastAlertedRef.current = q;
      window.alert("데이터에 해당 역이 없습니다.");
    }
  };

  return (
    <div className="subway-container">
      {/* ---------- Left: 검색 패널 ---------- */}
      <aside className="subway-left">
        <div className="subway-tabs">
          <button className="subway-tab active">정류장검색</button>
          <button className="subway-tab">뭐넣지?</button>
        </div>

        <div className="subway-search">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="정류장명을 입력해주세요"
            onKeyDown={(e) => {
              if (e.key === "Enter") dispatch(listPresentAndNameListIndex(q));
            }}
          />
          <button onClick={() => dispatch(listPresentAndNameListIndex(q))}>검색</button>
        </div>

        <div className="subway-results">
          {listLoading && <div className="subway-empty">불러오는 중…</div>}
          {!listLoading && (!nameList || nameList.length === 0) && (
            <div className="subway-empty">No data</div>
          )}
          {!listLoading &&
            nameList?.map((it, idx) => (
              <div
                key={`${it.name}-${idx}`}
                className="subway-item"
                onClick={() => focusStation(it.name, it.line)}
                title={`${it.name} • ${it.line}`}
              >
                <div className="subway-item-name">{it.name}</div>
                <div className="subway-item-line">{it.line}</div>
              </div>
            ))}
        </div>
      </aside>

      {/* ---------- Right: 지도 ---------- */}
      <section className="subway-map">
        <Map
          center={searchMarker?.pos || initialCenter}
          level={level}
          style={{ width: "100%", height: "640px" }}
          onCreate={(map) => (mapRef.current = map)}
        >
          {/* 검색 마커 */}
          {searchMarker?.pos && (
            <>
              <MapMarker
                position={searchMarker.pos}
                onClick={() => setInfoOpen((v) => !v)}
                title={searchMarker.title}
              />
              {infoOpen && (
                <CustomOverlayMap position={searchMarker.pos} yAnchor={1.35}>
                  <div className="subway-overlay">
                    <div className="subway-ov-title">{searchMarker.title}</div>
                    {searchMarker.address && (
                      <div className="subway-ov-addr">{searchMarker.address}</div>
                    )}
                  </div>
                </CustomOverlayMap>
              )}
            </>
          )}

          {/* 1~9호선 역 마커 */}
          {stations.length > 0 &&
            (useCluster ? (
              <MarkerClusterer averageCenter minLevel={6}>
                {stations.map((s) => (
                  <MapMarker
                    key={s.id}
                    position={{ lat: s.lat, lng: s.lng }}
                    title={`${s.name} (${s.line})`}
                    onClick={() => focusStation(s.name, s.line)}
                  />
                ))}
              </MarkerClusterer>
            ) : (
              stations.map((s) => (
                <MapMarker
                  key={s.id}
                  position={{ lat: s.lat, lng: s.lng }}
                  title={`${s.name} (${s.line})`}
                />
              ))
            ))}
        </Map>
      </section>
    </div>
  );
}