// src/components/lineInfo/SubwayLineList.jsx
import "./SubwayLineList.css";
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// 목록 thunk
import { stationIndex } from "../../store/thunks/subwayStationListThunk.js";
// 주소/전화 thunk
import { listPresentAndNameListIndex } from "../../store/thunks/subwayLineListThunk.js";

/* ---------- 헬퍼(유실됐던 부분 복구) ---------- */
const pick = (o, ks) => ks.map(k => o?.[k]).find(v => v != null);
const getNameFromRow = (r) =>
  pick(r, ["STATION_NM", "stationNm", "stationName", "STATN_NM", "name"]) ?? "";
const getLineFromRow = (r) =>
  pick(r, ["LINE_NUM", "subwayNm", "line"]) ?? "";
const normalizeLine = (v) => {
  const m = String(v ?? "").match(/(\d+)/);
  return m ? `${Number(m[1])}호선` : String(v ?? "");
};
const getOrderFromRow = (r) => {
  const cand = pick(r, ["FR_CODE", "frCode", "STATN_ID", "stationCd", "STATION_CD", "ord", "ORD"]);
  const m = String(cand ?? "").match(/\d+/);
  return m ? Number(m[0]) : Number.MAX_SAFE_INTEGER;
};
/* ------------------------------------------- */

const LINES = Array.from({ length: 9 }, (_, i) => `${i + 1}호선`);

export default function SubwayLineList() {
  const dispatch = useDispatch();
  const nav = useNavigate();

  // slice 키가 'subwayStation' 또는 'subwayStationList' 둘 중 무엇이든 안전하게
  const stationState =
    useSelector((s) => s.subwayStation) ??
    useSelector((s) => s.subwayStationList) ?? { nameList: [], listPresent: [] };
  const { nameList, listPresent } = stationState;

  const { byKey, byName } = useSelector((s) => s.stationAddress ?? { byKey: {}, byName: {} });

  useEffect(() => {
    if (!listPresent?.length) dispatch(stationIndex());
    dispatch(listPresentAndNameListIndex());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 의도적으로 deps 생략

  const [openLines, setOpenLines] = useState(new Set());
  const toggleLine = (line) =>
    setOpenLines((p) => {
      const nx = new Set(p);
      nx.has(line) ? nx.delete(line) : nx.add(line);
      return nx;
    });

  // 호선 → 정렬된 역 배열
  const stationsByLine = useMemo(() => {
    const map = new Map(LINES.map((lineKey) => [lineKey, []]));
    for (const it of nameList) {
      if (!/^[1-9]호선$/.test(it?.line) || !it?.name) continue;
      const row = listPresent.find(
        (r) => normalizeLine(getLineFromRow(r)) === it.line && getNameFromRow(r) === it.name
      );
      map.get(it.line).push({ name: it.name, ord: getOrderFromRow(row ?? {}) });
    }
    // ✅ unused 변수 경고 피하려고 key 미사용, values만 순회
    for (const arr of map.values()) {
      arr.sort((a, b) => a.ord - b.ord || a.name.localeCompare(b.name, "ko"));
    }
    return map;
  }, [nameList, listPresent]);

  return (
    <div className="linelist-root">
      <h1 className="linelist-title">호선별 지하철 리스트</h1>
      <ul className="linelist-ul">
        {LINES.map((line) => {
          const opened = openLines.has(line);
          const stations = stationsByLine.get(line) ?? [];
          return (
            <li key={line} className={`linelist-block ${opened ? "is-open" : ""}`}>
              <div
                className="linelist-item"
                onClick={() => toggleLine(line)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleLine(line)}
                aria-expanded={opened}
              >
                <span className="line-chip">{line}</span>
                <span className="line-name">{line}</span>
                <span className={`caret ${opened ? "down" : "right"}`}>{opened ? "▾" : "▸"}</span>
              </div>

              {opened && (
                <ul className="line-expanded">
                  {stations.map(({ name }) => {
                    const meta = byKey[`${line}|${name}`] || byName[name] || {};
                    return (
                      <li
                        key={`${line}-${name}`}
                        className="station-row"
                        onClick={() =>
                          nav(
                            `/stationdetail/${encodeURIComponent(name)}/${encodeURIComponent(line)}`
                          )
                        }
                      >
                        <div className="station-row__inner">
                          <div className="station-row__name">{name}</div>
                          <div className="station-row__addr">주소: {meta.addr ?? "정보 없음"}</div>
                          <div className="station-row__tel">전화: {meta.tel ?? "N/A"}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
