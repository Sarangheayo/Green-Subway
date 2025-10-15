import "./SubwayLinePath.css";
import { useNavigate } from "react-router-dom";

export default function SubwayLinePath() {
  const navigate = useNavigate();
  const goList = () => navigate("/line-list"); 

  return (
    <div className="subway-line-path">
      {/* 이미지 + 전체 클릭 영역 */}
      <div
        className="line-map"
        onClick={goList}
        role="button"
        tabIndex={0} // 키보드 포커스 가능
        onKeyDown={(e) => (
          e.key === "Enter" || e.key === " ")
          && goList()
        } // 엔터 또는 스페이스바로도 클릭 가능
        aria-label="노선도 클릭 시 호선 리스트로 이동"
      >
        <img
          src="/base/subwayroad.jfif"
          alt="지하철 노선도 이미지"
          className="line-map__img"
        />
      </div>
    </div>
  );
}
