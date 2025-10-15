import { useEffect, useMemo, useRef, useState } from "react";
import {
  Map,
  MapMarker,
  CustomOverlayMap,
  MarkerClusterer,
  useKakaoLoader,
} from "react-kakao-maps-sdk";
import { useNavigate } from "react-router-dom";
import "./SubwayLinePath.css";
import { useDispatch, useSelector } from "react-redux"; 
import { normalizeBigdataToStations, findStationByName } from "../../utils/listSubwayGeom1to9Util.js";
import { listPresentAndNameListIndex, listSubwayGeom1to9Index } from "../../store/thunks/subwayLineListThunk.js";
import listGeom from "../../data/listGeom.js";

// 로컬 전용 토글
const USE_LOCAL = String(import.meta.env.VITE_USE_LOCAL_GEOM || "").toLowerCase() === "true";

// 로컬 listGeom → [{id,name,line,lat,lng}]로 정규화
const normalizeLocal = (arr = []) =>
  (arr ?? [])
    .map((x, i) => ({
      id: String(x.outStnNum ?? x.OUT_STN_NUM ?? i),
      name: String(x.stnKrNm ?? x.STN_KR_NM ?? "").trim(),
      line: String(x.lineNm ?? x.LINE_NM ?? "").replace(/\(.*?\)/g, "").trim(),
      lat: Number(x.convY ?? x.CONV_Y),
      lng: Number(x.convX ?? x.CONV_X),
    }))
    .filter((r) => r.name && r.line && !Number.isNaN(r.lat) && !Number.isNaN(r.lng))
    .filter((r) => /^[1-9]호선$/.test(r.line)); // 1~9호선만

// 로컬 listGeom → 검색용 목록 [{name,line}] (중복 역명은 1개만)
const makeLocalNameList = (arr = []) => {
  const seen = new Set();
  const rows = [];
  for (const g of arr ?? []) {
    const name = String(g.stnKrNm ?? g.STN_KR_NM ?? "").trim();
    const line = String(g.lineNm ?? g.LINE_NM ?? "").replace(/\(.*?\)/g, "").trim();
    if (!name || !/^[1-9]호선$/.test(line)) continue;
    const key = `${name}__${line}`;
    if (!seen.has(key)) {
      seen.add(key);
      rows.push({ name, line });
    }
  }
  return rows;
};

export default function SubwayLinePath({
  level = 5,
  useCluster = true,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();  

  //index.html 쪽 헤더에 스크립트 카카오 앱 키 넣어주는거보다  useKakaoLoader 이거 쓰는게 더 안전 
  const appkey = import.meta.env.VITE_KAKAO_APP_KEY;
  useKakaoLoader({ appkey, libraries: ["services", "clusterer"] });


// Redux state
  const { nameList, loading: listLoading } = useSelector((s) => s.subwayLine || {});
  const { items: geomItems } = useSelector((s) => s.subwayGeom || {});

  // 검색어
  const [q, setQ] = useState("");

  // 초기 로드: 로컬이면 디스패치 생략, 원격이면 기존대로
  useEffect(() => {
    if (!USE_LOCAL) {
      if (!geomItems?.length) dispatch(listSubwayGeom1to9Index());
      dispatch(listPresentAndNameListIndex(q));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 원격 모드일 때만 디바운스 검색
  useEffect(() => {
    if (USE_LOCAL) return;
    const t = setTimeout(() => {
      dispatch(listPresentAndNameListIndex(q));
    }, 250);
    return () => clearTimeout(t);
  }, [q, dispatch]);

  // 좌표 정규화 (토글에 따라 소스 분기)
  const stations = useMemo(
    () => (USE_LOCAL ? normalizeLocal(listGeom) : normalizeBigdataToStations(geomItems)),
    [geomItems]
  );

// 이름 검색: "이름으로 필터해서 1건만" (정확일치 > 포함일치)
const localNameList = useMemo(() => {
  if (!USE_LOCAL) return [];
  const base = makeLocalNameList(Array.isArray(listGeom) ? listGeom : []);

  const keywordRaw = String(q ?? "").trim();
  if (!keywordRaw) return []; // 입력 없으면 빈 리스트
  const keyword = keywordRaw.toLowerCase();

  // 포함 매칭 전부
  const hits = base.filter((x) =>
    String(x?.name ?? "").toLowerCase().includes(keyword)
  );

  // 정확일치 우선 정렬 (그다음은 가나다) “서울” → 서울역, 서울대입구, 서울숲 등 모두 표시
  hits.sort((a, b) => {
    const an = String(a.name).toLowerCase();
    const bn = String(b.name).toLowerCase();
    const aExact = an === keyword;
    const bExact = bn === keyword;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    return an.localeCompare(bn, "ko");
  });

  return hits;
}, [q]);

  const displayList = USE_LOCAL ? localNameList : nameList;

  const mapRef = useRef(null);
  const [searchMarker, setSearchMarker] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const lastAlertedRef = useRef("");

  // 기본 중심점 (서울역 있으면 그 좌표)
  const initialCenter = useMemo(() => {
    const s = findStationByName(stations, "서울역");
    return s ? { lat: s.lat, lng: s.lng } : { lat: 37.554648, lng: 126.970607 };
  }, [stations]);

  // 리스트 클릭 → 지도 이동
  const focusStation = (name, line) => {
    const kakao = window.kakao;
    if (!kakao || !mapRef.current) return;

    const hit = findStationByName(stations, name);
    if (hit) {
      const pos = { lat: hit.lat, lng: hit.lng };
      mapRef.current.setCenter(new kakao.maps.LatLng(pos.lat, pos.lng));
      mapRef.current.setLevel(4);
      setSearchMarker({ pos, title: hit.name, line: hit.line || line || "" });
      setInfoOpen(true);
      lastAlertedRef.current = "";
      return;
    }
    setInfoOpen(false);
    setSearchMarker(null);
    if (lastAlertedRef.current !== name) {
      lastAlertedRef.current = name;
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
              if (!USE_LOCAL && e.key === "Enter") dispatch(listPresentAndNameListIndex(q));
            }}
          />
          <button onClick={() => (!USE_LOCAL ? dispatch(listPresentAndNameListIndex(q)) : null)}>검색</button>
        </div>

        <div className="subway-results">
          {!USE_LOCAL && listLoading && <div className="subway-empty">불러오는 중…</div>}
          {(!displayList || displayList.length === 0) &&
          <div className="subway-empty">`"예) "서울" → 서울역, 서울대입구"`</div>}
          {displayList?.map((it, idx) => (
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
          // 모바일에서도 보이도록 높이 자동: 240~640px 사이에서 뷰포트에 맞춰
          style={{ width: "100%", height: "clamp(260px, 48vh, 640px)" }}
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
                  <div className="subway-overlay"></div>
                    <div
                      className="subway-overlay clickable"
                      onClick={() =>
                        navigate(
                          `/line-list?name=${encodeURIComponent(searchMarker.title || "")}` +
                          `&line=${encodeURIComponent(searchMarker.address || "")}`
                        )
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          navigate(
                            `/line-list?name=${encodeURIComponent(searchMarker.title || "")}` +
                            `&line=${encodeURIComponent(searchMarker.address || "")}`
                          );           
                        }
                      }}
                    >
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