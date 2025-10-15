/* ===== 검색/정규화 유틸 ===== */

/** "01호선", "3호", "03", "3" → "3호선" (호선 표기 정규화) */
export const lineMinusZero = (v) => {
  const x = String(v ?? "").trim();
  const m = x.match(/^0?([1-9])(?:\s*호)?(?:\s*선)?$/);
  return m ? `${m[1]}호선` : x;
};

/** 토큰 확장: "3","03","3호","3호선" → ["3호선","03호선","3","03"] */
export const expandToken = (t) => {
  const x = String(t ?? "").toLowerCase().trim();
  const m = x.match(/^0?([1-9])(?:호)?(?:선)?$/); // 3, 03, 3호, 3호선
  if (m) {
    const d = m[1];
    return [`${d}호선`, `0${d}호선`, d, `0${d}`];
  }
  return [x];
};

/**
 * 원본 rows + 검색어 s(옵션) ▶︎ { listPresent, nameList }
 * - 1~9호선만 남김
 * - s가 없으면 전체 반환
 * - s가 있으면: 토큰 확장(호선·숫자 변형) 후 일부 포함 매칭
 */
export function listPresentAndNameList(listAll = [], s = "") {
  const S = String(s ?? "").trim().toLowerCase();
  const tokens = S ? S.split(/\s+/).filter(Boolean) : [];
  const tokenBag = tokens.flatMap(expandToken); // 하나라도 포함되면 매칭(OR)

  // 정규화
  const normalized = (listAll ?? [])
    .map((row) => {
      const name = row.STATION_NM ?? row.stationNm ?? "";
      const line = lineMinusZero(row.LINE_NUM ?? row.subwayNm ?? "");
      const hay = `${name} ${line}`.toLowerCase(); // 검색용
      return { raw: row, name, line, hay };
    })
    .filter((st) => /^[1-9]호선$/.test(st.line)); // 1~9호선만

  // 필터링
  const passed = !S
    ? normalized
    : normalized.filter((st) => {
        if (tokenBag.length) return tokenBag.some((tok) => st.hay.includes(tok));
        return st.hay.includes(S);
      });

  // 결과
  return {
    listPresent: passed.map((x) => x.raw),                 // 원본 row 그대로
    nameList: passed.map(({ name, line }) => ({ name, line })), // {name,line}만
  };
}
