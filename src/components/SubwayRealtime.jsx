import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchRealtimeArrivalByStation } from "../store/thunks/subwayThunk";
import {
  selectRealtimeList,
  selectRealtimeLoading,
  selectRealtimeError,
  selectRealtimeStation,
} from "../store/slices/subwaySlice";
import "./SubwayRealtime.css";

export default function SubwayRealtime() {
  const [station, setStation] = useState("홍대입구"); // 기본 예시
  const dispatch = useDispatch();
  const list = useSelector(selectRealtimeList);
  const loading = useSelector(selectRealtimeLoading);
  const error = useSelector(selectRealtimeError);
  const lastStation = useSelector(selectRealtimeStation);

  useEffect(() => {
    dispatch(fetchRealtimeArrivalByStation({ station, start: 0, end: 50 }));
  }, [dispatch, station]); // 최초 1회

  const onSubmit = (e) => {
    e.preventDefault();
    const q = station.trim();
    if (!q) return;
    dispatch(fetchRealtimeArrivalByStation({ station, start: 0, end: 50 }));
  };

  return (
    <main className="page realtime">
      <h1>지하철 실시간 도착정보</h1>

      <form onSubmit={onSubmit} className="realtime__form">
        <input
          className="realtime__select"
          value={station}
          onChange={(e) => setStation(e.target.value)}
          placeholder="역명 입력 (예: 종로3가, 김포공항, 홍대입구)"
        />
        <button className="realtime__btn" type="submit" disabled={loading}>
          {loading ? "불러오는 중…" : "조회"}
        </button>
        <button
          className="realtime__btn"
          type="button"
          onClick={() => dispatch(fetchRealtimeArrivalByStation({ station: "ALL" }))}
          style={{ marginLeft: 6 }}
        >
          전체(ALL)
        </button>
      </form>

      {error && <p className="realtime__msg realtime__msg--error">에러: {String(error)}</p>}
      {!loading && !error && lastStation && (
        <p className="realtime__msg">‘{lastStation}’ 도착정보 {list?.length ?? 0}건</p>
      )}

      <ul className="realtime__list">
        {list.map((row, i) => (
          <li key={`${row.btrainNo}-${row.statnNm}-${i}`} className="realtime__item">
            <div className="realtime__item-title">
              {row.statnNm} · {row.updnLine} · {row.trainLineNm}
            </div>
            <div className="realtime__item-sub">
              열차번호: {row.btrainNo} | 종착: {row.bstatnNm} | {row.btrainSttus}
            </div>
            <div className="realtime__item-meta">
              {row.arvlMsg2} · {row.arvlMsg3} · ({row.recptnDt})
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
