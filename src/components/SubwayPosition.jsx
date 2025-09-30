// src/components/SubwayPosition.jsx
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchRealtimePosition } from "../store/thunks/subwayThunk";
import {
  selectSubwayList,
  selectSubwayLoading,
  selectSubwayError,
  selectSubwayLastLine,
} from "../store/slices/subwaySlice";

export default function SubwayPosition() {
  const [line, setLine] = useState("2호선");
  const dispatch = useDispatch();
  const list = useSelector(selectSubwayList);
  const loading = useSelector(selectSubwayLoading);
  const error = useSelector(selectSubwayError);
  const lastLine = useSelector(selectSubwayLastLine);

  useEffect(() => {
    dispatch(fetchRealtimePosition({ subwayNm: line, start: 0, end: 20 }));
  }, [dispatch]); // eslint-disable-line

  const onSubmit = (e) => {
    e.preventDefault();
    if (!line.trim()) return;
    dispatch(fetchRealtimePosition({ subwayNm: line.trim(), start: 0, end: 20 }));
  };

  return (
    <main className="page" style={{ maxWidth: 980, margin: "100px auto", padding: "0 16px" }}>
      <h1>지하철 실시간 열차 위치</h1>

      <form onSubmit={onSubmit} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={line}
          onChange={(e) => setLine(e.target.value)}
          placeholder="호선명 입력 (예: 2호선, 7호선)"
          style={{ flex: 1, padding: "10px", fontSize: 16 }}
        />
        <button type="submit">검색</button>
      </form>

      {loading && <p>불러오는 중…</p>}
      {error && <p style={{ color: "tomato" }}>에러: {String(error)}</p>}
      {!loading && !error && lastLine && (
        <p style={{ marginBottom: 8 }}>
          ‘{lastLine}’ 열차 위치 {list?.length ?? 0}건
        </p>
      )}

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {list.map((row, i) => (
          <li key={i} style={{ 
            background: "#fff", borderRadius: 12, padding: "10px 14px",
            boxShadow: "0 4px 12px rgba(0,0,0,.06)", marginBottom: 10 
          }}>
            <div style={{ fontWeight: 700 }}>
              {row.subwayNm} {row.statnNm} ({row.updnLine === "0" ? "상행" : "하행"})
            </div>
            <div style={{ fontSize: 13, color: "#333", marginTop: 4 }}>
              열차번호: {row.trainNo} | 종착역: {row.statnTnm}
            </div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
              상태: {row.trainSttus} | 급행: {row.directAt} | 막차: {row.lstcarAt}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
