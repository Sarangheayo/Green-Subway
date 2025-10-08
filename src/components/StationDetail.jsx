// StationDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "./StationDetail.css";
import { stationIndex } from "../store/thunks/stationThunk.js";
import { stationRealtimeIndex } from "../store/thunks/stationRealtimeThunk.js";
import { fetchFirstLastByLine } from "../store/thunks/stationFirstLastThunk.js";

// "01호선" / "1호선" 등 라인 라벨을 통일: "1호선"
const lineKey = (v) => {
  const s = String(v ?? "").replace(/\s+/g, "").trim();
  const m = s.match(/^0?([1-9])호선$/);
  return m ? `${m[1]}호선` : s;
};
// API 호출용: "1호선" → "01호선"
const toApiLine = (v) => {
  const m = String(v ?? "").match(/^([1-9])호선$/);
  return m ? `0${m[1]}호선` : String(v ?? "");
};

export default function StationDetail() {
  const dispatch = useDispatch();
  const { stationId } = useParams();

  // ✅ stationInfo 전부 제거하고, slice에서 nameList만 사용
  const nameList = useSelector((s) => s.station?.nameList ?? []);
  const detail = useSelector((s) => s.stationDetail ?? {});

  const decodedName = decodeURIComponent(String(stationId ?? ""));
  const [selectedLine, setSelectedLine] = useState("");

  // 1) 리스트 없으면 먼저 호출 (직접 진입 대비)
  useEffect(() => {
    if (!nameList.length) dispatch(stationIndex());
  }, [dispatch, nameList.length]);

  // 2) 라인 칩 목록 계산 – 같은 역명만 추리고 중복 제거/정렬
  const lineOptions = useMemo(() => {
    if (!decodedName) return [];
    const uniq = Array.from(
      new Set(
        (nameList || [])
          .filter((i) => String(i.name) === decodedName)
          .map((i) => lineKey(i.line))
      )
    ).sort((a, b) => parseInt(a) - parseInt(b));
    return uniq;
  }, [nameList, decodedName]);

  // 3) 기본 선택 라인
  useEffect(() => {
    if (!selectedLine && lineOptions.length) setSelectedLine(lineOptions[0]);
  }, [lineOptions, selectedLine]);

  // 4) 실시간 도착정보 호출 (역명 기준)
  useEffect(() => {
    if (!decodedName) return;
    dispatch(stationRealtimeIndex(decodedName));
  }, [dispatch, decodedName]);

  // 5) 첫/막차 호출 (선택 라인 기준)
  useEffect(() => {
    if (!selectedLine) return;
    dispatch(fetchFirstLastByLine({ line: toApiLine(selectedLine), dow: 1 }));
  }, [dispatch, selectedLine]);

  // 6) 선택 라인의 실시간만 필터
  const filteredRealtime = (Array.isArray(detail.realtime) ? detail.realtime : []).filter(
    (r) => !selectedLine || lineKey(r.subwayNm) === selectedLine
  );
  const realtimeUp = filteredRealtime.filter(
    (r) => String(r.updnLine).includes("상행") || String(r.updnLine).includes("내선")
  );
  const realtimeDown = filteredRealtime.filter(
    (r) => String(r.updnLine).includes("하행") || String(r.updnLine).includes("외선")
  );

  const etaText = (row) => {
    const n = Number(row?.barvlDt);
    if (!Number.isFinite(n)) return "-";
    if (n <= 30) return "곧 도착";
    const m = Math.floor(n / 60);
    const s = n % 60;
    return `${m}분 ${s}초 후`;
  };

  const fmtKTime = (hhmmss) => {
    if (!hhmmss || hhmmss.length < 4) return "-";
    const hh = Number(hhmmss.slice(0, 2));
    const mm = Number(hhmmss.slice(2, 4));
    return `${hh}시 ${mm}분`;
  };

  const upRow = Array.isArray(detail.firstUp) ? detail.firstUp[0] : null;
  const downRow = Array.isArray(detail.firstDown) ? detail.firstDown[0] : null;

  const titleName = decodedName;

  return (
    <>
      <div className="detail-titlebox">
        <div className="detail-colorname" />
        <h1>{titleName || "역 불러오는 중..."}</h1>
        <div className="detail-colorname" />
      </div>

      {/* 라인 칩 */}
      <div className="detail-contnetswrap">
        {lineOptions.map((ln) => (
          <div
            key={ln}
            className={`detail-linename ${selectedLine === ln ? "active" : ""}`}
            onClick={() => setSelectedLine(ln)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelectedLine(ln)}
          >
            {ln}
          </div>
        ))}
      </div>

      {/* 상/하행 섹션 */}
      <div className="detail-textwrap">
        <div className="detail-itemcontents">
          <div>
            <h3>상행</h3>
            <p>
              <span>{realtimeUp[0] ? etaText(realtimeUp[0]) : "-"}</span> 도착
            </p>
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
            <p>
              <span>{realtimeDown[0] ? etaText(realtimeDown[0]) : "-"}</span> 도착
            </p>
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
