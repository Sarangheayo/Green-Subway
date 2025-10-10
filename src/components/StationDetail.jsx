import { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "./StationDetail.css";

// thunks
import { stationIndex } from "../store/thunks/stationThunk.js";
import stationRealtimeIndex from "../store/thunks/stationRealtimeThunk.js";
import { firstLastByLine } from "../store/thunks/stationFirstLastThunk.js";

// "01호선" → "1호선"
const normalizeLine = (v) => {
  const s = String(v ?? "").trim();
  const m = s.match(/^0?([1-9])호선$/);
  return m ? `${m[1]}호선` : s;
};
// "1호선" → "01호선"(API)
const toApiLine = (v) => {
  const m = String(v ?? "").match(/^([1-9])호선$/);
  return m ? `0${m[1]}호선` : String(v ?? "");
};
// "2호선" 등 라인 토큰 판별
const isLineToken = (t) => /^0?[1-9]호선$/.test(String(t ?? "").trim());

export default function StationDetail() {
  const dispatch = useDispatch();

  // ✅ name/line(신형), stationId(호환) 모두 받기
  const { name, line, stationId } = useParams();

  // 파라미터 디코딩
  let stationName = name ? decodeURIComponent(name) : (stationId ? decodeURIComponent(stationId) : "");
  let initialLine = line ? normalizeLine(decodeURIComponent(line)) : "";

  // ✅ 구형 "/stationdetail/2호선 서울대입구" 처리를 위한 자동 분리
  if (!initialLine && stationName.includes(" ")) {
    const [t1, ...rest] = stationName.split(" ");
    if (isLineToken(t1)) {
      initialLine = normalizeLine(t1);
      stationName = rest.join(" ");
    }
  }

  // 전역 상태
  const nameList = useSelector((s) => s.station?.nameList ?? []);

  // 실시간/첫막차는 각 슬라이스에서 직접
  const realtimeList = useSelector((s) => s.stationRealtime?.list ?? []);
  const { firstUp = [], firstDown = [], dow = 1 } =
    useSelector((s) => s.stationFirstLast ?? {});

  // 선택된 호선 칩
  const [selectedLine, setSelectedLine] = useState("");

  // 새로고침 로딩/시간
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  // 리스트 없으면 한 번 로드(직접 진입 대비)
  useEffect(() => {
    if (!nameList.length) dispatch(stationIndex());
  }, [dispatch, nameList.length]);

  // 현재 역의 호선 칩 만들기(중복 제거 + 숫자순)
  const lineOptions = useMemo(() => {
    return Array.from(
      new Set(
        (nameList || [])
          .filter((i) => String(i.name) === stationName)
          .map((i) => normalizeLine(i.line))
          .filter(Boolean)
      )
    ).sort((a, b) => parseInt(a) - parseInt(b));
  }, [nameList, stationName]);

  // 초기 선택 라인: URL에서 넘어온 값 우선 → 없으면 첫 칩
  useEffect(() => {
    if (!selectedLine) {
      if (initialLine) setSelectedLine(initialLine);
      else if (lineOptions.length) setSelectedLine(lineOptions[0]);
    }
  }, [initialLine, lineOptions, selectedLine]);

  // 실시간: 역명으로 (최초/역 바뀔 때)
  const fetchRealtime = async () => {
    if (!stationName) return;
    try {
      setRefreshing(true);
      await dispatch(stationRealtimeIndex(stationName));
      setLastUpdated(new Date());
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => { fetchRealtime(); }, [stationName]); // 최초 1회 + 역 변경 시

  // 자동 갱신(20초)
  useEffect(() => {
    intervalRef.current = setInterval(fetchRealtime, 20000);
    return () => clearInterval(intervalRef.current);
  }, [stationName]);

  // 첫/막차: 선택 호선으로 (API는 "01호선" 형식)
  useEffect(() => {
    if (selectedLine) {
      dispatch(firstLastByLine({ line: toApiLine(selectedLine), dow }));
    }
  }, [dispatch, selectedLine, dow]);

  // === 화면용 가공 ===
  const realtime = Array.isArray(realtimeList) ? realtimeList : [];

  // 선택 호선 필터: subwayNm("01호선") 또는 subwayId(1001~1009) 둘 다 대응
  const filtered = realtime.filter((r) => {
    if (!selectedLine) return true;
    const lineNm = r?.subwayNm ? normalizeLine(r.subwayNm) : "";
    if (lineNm) return lineNm === selectedLine;
    const idMap = {1001:"1호선",1002:"2호선",1003:"3호선",1004:"4호선",1005:"5호선",1006:"6호선",1007:"7호선",1008:"8호선",1009:"9호선"};
    const fromId = idMap[Number(r?.subwayId)] || "";
    return fromId === selectedLine;
  });

  const realtimeUp = filtered.filter(
    (r) => String(r?.updnLine || "").includes("상행") || String(r?.updnLine || "").includes("내선")
  );
  const realtimeDown = filtered.filter(
    (r) => String(r?.updnLine || "").includes("하행") || String(r?.updnLine || "").includes("외선")
  );

  const etaText = (row) => {
    const n = Number(row?.barvlDt);
    if (Number.isFinite(n)) {
      if (n <= 30) return "곧 도착";
      const m = Math.floor(n / 60);
      const s = n % 60;
      return `${m}분 ${s}초 후`;
    }
    return "-";
  };

  const fmtKTime = (hhmm) => {
    if (!hhmm || hhmm.length < 4) return "-";
    return `${hhmm.slice(0, 2)}시 ${hhmm.slice(2, 4)}분`;
  };

  const upRow   = Array.isArray(firstUp) ? firstUp[0] : null;
  const downRow = Array.isArray(firstDown) ? firstDown[0] : null;

  return (
    <>
      {/* 제목: 모바일은 호선 윗줄 / 역명 아랫줄 */}
      <div className="detail-titlebox">
        <div className="detail-colorname" />
        <div className="detail-titlestack">
          <div className="detail-title-line">
            {selectedLine || (lineOptions[0] ?? "")}
          </div>
          <h1 className="detail-title-name">
            {stationName || "역 불러오는 중..."}
          </h1>
        </div>
        <div className="detail-colorname" />
      </div>

      {/* 라인 칩 + 새로고침 버튼 */}
      <div className="detail-contnetswrap">
        {lineOptions.map((ln) => (
          <button
            key={ln}
            type="button"
            className={`detail-linename ${selectedLine === ln ? "active" : ""}`}
            onClick={() => setSelectedLine(ln)}
          >
            {ln}
          </button>
        ))}

        <button
          type="button"
          className={`detail-refresh ${refreshing ? "loading" : ""}`}
          onClick={fetchRealtime}
          disabled={refreshing}
          aria-live="polite"
        >
          {refreshing ? "갱신중..." : "실시간 새로고침"}
        </button>
      </div>

      {/* 갱신 시각 */}
      <div className="detail-updated">
        {lastUpdated ? `업데이트: ${lastUpdated.toLocaleTimeString()}` : ""}
      </div>

      {/* 상/하행 + 첫막차(유지) */}
      <div className="detail-textwrap">
        <div className="detail-itemcontents">
          <div>
            <h3>상행</h3>
            <p><span>{realtimeUp[0] ? etaText(realtimeUp[0]) : "-"}</span> 도착</p>
          </div>
          <div>
            <h4>첫차</h4>
            <p>{upRow ? fmtKTime(upRow.FSTT_HRM) : "-"}</p>
          </div>
          <div>
            <h4>막차</h4>
            <p>{upRow ? fmtKTime(upRow.LSTTM_HRM) : "-"}</p>
          </div>
        </div>

        <div className="detail-itemcontents">
          <div>
            <h3>하행</h3>
            <p><span>{realtimeDown[0] ? etaText(realtimeDown[0]) : "-"}</span> 도착</p>
          </div>
          <div>
            <h4>첫차</h4>
            <p>{downRow ? fmtKTime(downRow.FSTT_HRM) : "-"}</p>
          </div>
          <div>
            <h4>막차</h4>
            <p>{downRow ? fmtKTime(downRow.LSTTM_HRM) : "-"}</p>
          </div>
        </div>
      </div>
    </>
  );
}