// src/components/StationDetail.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "./StationDetail.css";

// thunks
import { stationIndex } from "../store/thunks/stationThunk.js";
import { stationRealtimeIndex } from "../store/thunks/stationRealtimeThunk.js";
import { fetchFirstLastByLine } from "../store/thunks/stationFirstLastThunk.js";

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

export default function StationDetail() {
  const dispatch = useDispatch();
  const { stationId } = useParams();
  const stationName = decodeURIComponent(String(stationId ?? ""));

  // 전역 상태
  const nameList = useSelector((s) => s.station?.nameList ?? []);
  const detail   = useSelector((s) => s.stationDetail ?? {});

  // 선택된 호선 칩
  const [selectedLine, setSelectedLine] = useState("");

  // 리스트 없으면 한 번 로드(직접 진입 대비)
  useEffect(() => {
    if (!nameList.length) dispatch(stationIndex());
  }, [dispatch, nameList.length]);

  // 현재 역의 호선 칩 만들기(중복 제거 + 숫자순)
  const lineOptions = Array.from(
    new Set(
      (nameList || [])
        .filter((i) => String(i.name) === stationName)
        .map((i) => normalizeLine(i.line))
        .filter(Boolean)
    )
  ).sort((a, b) => parseInt(a) - parseInt(b));

  // 기본 선택
  useEffect(() => {
    if (!selectedLine && lineOptions.length) setSelectedLine(lineOptions[0]);
  }, [lineOptions, selectedLine]);

  // 실시간: 역명으로
  useEffect(() => {
    if (stationName) dispatch(stationRealtimeIndex(stationName));
  }, [dispatch, stationName]);

  // 첫/막차: 선택 호선으로
  useEffect(() => {
    if (selectedLine) {
      dispatch(fetchFirstLastByLine({ line: toApiLine(selectedLine), dow: 1 }));
    }
  }, [dispatch, selectedLine]);

  // 실시간 가공(선택 호선만)
  const realtime = Array.isArray(detail.realtime) ? detail.realtime : [];
  const filtered = realtime.filter(
    (r) => !selectedLine || normalizeLine(r.subwayNm) === selectedLine
  );
  const realtimeUp = filtered.filter(
    (r) => String(r.updnLine).includes("상행") || String(r.updnLine).includes("내선")
  );
  const realtimeDown = filtered.filter(
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

  const fmtKTime = (hhmm) => {
    if (!hhmm || hhmm.length < 4) return "-";
    return `${hhmm.slice(0, 2)}시 ${hhmm.slice(2, 4)}분`;
  };

  const upRow   = Array.isArray(detail.firstUp) ? detail.firstUp[0] : null;
  const downRow = Array.isArray(detail.firstDown) ? detail.firstDown[0] : null;

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

      {/* 라인 칩 */}
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
      </div>

      {/* 상/하행 */}
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
