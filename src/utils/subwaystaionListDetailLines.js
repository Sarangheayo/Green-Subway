export const SUBWAY_LINE_MAP = {
  1001: "1호선",
  1002: "2호선",
  1003: "3호선",
  1004: "4호선",
  1005: "5호선",
  1006: "6호선",
  1007: "7호선",
  1008: "8호선",
  1009: "9호선",
  1063: "경의중앙선",
  1065: "공항철도",
  1067: "경춘선",
  1075: "수인분당선",
  1077: "신분당선",
  1081: "경강선",
  1092: "우이신설선",
  1093: "서해선",
  1094: "김포골드라인",
  1095: "신림선",
  1096: "의정부경전철",
  1097: "용인에버라인",
};

export const SUBWAY_NAMES_CANONICAL = {
  수인선: "수인분당선",
  분당선: "수인분당선",
  경의선: "경의중앙선",
  중앙선: "경의중앙선",
  AREX: "공항철도",
  공항선: "공항철도",
  우이신설: "우이신설선",
  김포골드: "김포골드라인",
  에버라인: "용인에버라인",
  용인에버: "용인에버라인",
};

export const SUBWAY_DISPLAY_ORDER = [
  "1호선",
  "2호선",
  "3호선",
  "4호선",
  "5호선",
  "6호선",
  "7호선",
  "8호선",
  "9호선",
  "수인분당선",
  "경의중앙선",
  "공항철도",
  "경춘선",
  "경강선",
  "신림선",
  "우이신설선",
  "서해선",
  "김포골드라인",
  "의정부경전철",
  "용인에버라인",
  "신분당선",
  "GTX-A",
  "GTX-B",
  "GTX-C",
];

export const SUBWAY_LABEL_REGEX =
  /GTX-[ABC]|\d+호선|[가-힣A-Za-z]+선|공항철도|수인분당선/g;

export function getLines(item = {}) {
  const bag = new Set();

  if (item.LINE_NUM) {
    String(item.LINE_NUM)
      .split(/[,\s/·]+/g)
      .forEach((v) => {
        const t = v && v.trim();
        if (t) bag.add(SUBWAY_NAMES_CANONICAL[t] || t);
      });
  }

  if (item.subwayNm) {
    const t = String(item.subwayNm).trim();
    if (t) bag.add(SUBWAY_NAMES_CANONICAL[t] || t);
  }

  if (item.subwayId && SUBWAY_LINE_MAP[item.subwayId]) {
    bag.add(SUBWAY_LINE_MAP[item.subwayId]);
  }

  if (item.subwayList) {
    String(item.subwayList)
      .split(/[,\s]+/g)
      .forEach((code) => {
        const n = parseInt(code, 10);
        if (SUBWAY_LINE_MAP[n]) bag.add(SUBWAY_LINE_MAP[n]);
      });
  }

  if (item.trainLineNm) {
    const found = String(item.trainLineNm).match(SUBWAY_LABEL_REGEX);
    if (found) found.forEach((t) => bag.add(SUBWAY_NAMES_CANONICAL[t] || t));
  }

  const arr = Array.from(bag);
  const idx = (label) => {
    const i = SUBWAY_DISPLAY_ORDER.indexOf(label);
    if (i !== -1) return i;
    const m = label.match(/^(\d+)호선$/);
    return m ? +m[1] - 1 : 999;
  };
  return arr.sort((a, b) => idx(a) - idx(b));
}

export function formatNameWithLines(name, lines = [], { max = 1, withBracket = false } = {}) {
  const list = lines.slice(0, max).join(" · ");
  if (!list) return name || "";
  const body = `${name ?? ""}, ${list}`;
  return withBracket ? `[${body}]` : body;
}
