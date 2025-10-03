
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyLocalFilter, clearLocalFilter } from "../store/slices/subwaystationSlice.js";
import "./StationSearchbar.css";

export default function StationSearch() {
  const dispatch = useDispatch();
  const qLocal = useSelector((s) => s.subwaystation?.qLocal ?? "");
  const [q, setQ] = useState(qLocal);

  // 한글 IME 조합 중에는 엔터/변경 처리 피하기용
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => { setQ(qLocal); }, [qLocal]);

  // 입력 즉시 리스트 필터링
  const onChange = (e) => {
    const v = e.target.value.replace(/\s+/g, " ");
    setQ(v);
    // ✅ 타이핑하는 대로 바로 필터 적용
    dispatch(applyLocalFilter(v));
  };

  const onClear = () => {
    setQ("");
    dispatch(clearLocalFilter());
  };

  // 엔터 → 검색 유지 + 자동 클리어
  const handleSearch = () => {
    const v = q.trim();
    if (v && v !== qLocal) {
      dispatch(applyLocalFilter(v));
    }
    onClear();
  };

  const onKeyDown = (e) => {
    if (isComposing) return; // IME 조합 중이면 무시
    if (e.key === "Enter") {
      e.preventDefault?.();
      handleSearch();
    } else if (e.key === "Escape") {
      // ESC로도 빠르게 초기화 가능
      onClear();
    }
  };

  return (
    <input
      className="subway-search__input"
      type="text"
      placeholder="리스트에서 검색… (역명)"
      value={q}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={() => setIsComposing(false)}
    />
  );
}
