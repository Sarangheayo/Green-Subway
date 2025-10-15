// src/components/lineInfo/SubwayLineList.jsx
import { useSearchParams, useNavigate } from "react-router-dom";
import "./SubwayLineList.css";

export default function SubwayLineList() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const name = params.get("name") || "역 선택됨";
  const line = params.get("line") || "";

  return (
    <div className="lineList-wrap">
      <header className="lineList-header">
        <button className="ll-back" onClick={() => navigate(-1)}>←</button>
        <div className="ll-title">
          <h1>{name}</h1>
          {line && <span className="ll-chip">{line}</span>}
        </div>
      </header>

      <main className="lineList-main">
        <section className="ll-card">
          <h2>역 정보</h2>
          <ul className="ll-ul">
            <li>선택한 역: <strong>{name}</strong></li>
            {line && <li>호선: <strong>{line}</strong></li>}
          </ul>
        </section>

        <section className="ll-card">
          <h2>출구 정보</h2>
          <p className="ll-muted">출구 데이터 연동 전입니다.</p>
        </section>

        <section className="ll-card">
          <h2>주변 정보</h2>
          <p className="ll-muted">주변 POI / 길찾기 등은 이후 연결.</p>
        </section>
      </main>
    </div>
  );
}
