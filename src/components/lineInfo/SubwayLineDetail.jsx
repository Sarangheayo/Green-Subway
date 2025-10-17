import React from "react";
import "./subwayLineDetail.css";
import {
  normalizeLine as normLine, stripParen,
} from "../../utils/listSubwayGeom1to9Util.js";

/** Design-only Station Detail (Responsive) – header/footer 제거 버전 */
const sampleRow = {
  STATION_ID: "0150",
  STATION_NAME: "서울역(지상)",
  LINE: "09호선(연장)",
  EL: "Y",
  WL: "Y",
  PARKING: "N",
  BICYCLE: "",
  CIM: "N",
  EXCHANGE: "N",
  TRAIN: "Y",
  CULTURE: "N",
  PLACE: "Y",
  FDROOM: "N",
};

const FEATURE_MAP = [
  { key: "EL", label: "엘리베이터", icon: "⤴︎" },
  { key: "WL", label: "휠체어리프트", icon: "🦽" },
  { key: "PARKING", label: "환승주차장", icon: "🅿︎" },
  { key: "BICYCLE", label: "자전거보관소", icon: "🚲" },
  { key: "CIM", label: "무인민원발급기", icon: "🏧" },
  { key: "EXCHANGE", label: "환전키오스크", icon: "💱" },
  { key: "TRAIN", label: "기차예매", icon: "🚆" },
  { key: "CULTURE", label: "문화공간", icon: "🎭" },
  { key: "FDROOM", label: "유아수유실", icon: "🍼" },
  { key: "PLACE", label: "안내센터", icon: "ℹ︎" },
];

const yn = (v) => {
  const s = String(v ?? "").trim().toUpperCase();
  if (!s) return null;
  return s === "Y";
};

export default function SubwayLineDetail({ row = sampleRow }) {
  // 역명/호선 정규화
  const rawName =
    row?.STATION_NAME ??
    row?.STATION_NM ??
    row?.stnKrNm ??
    row?.stationNm ??
    "";
  const stationName = stripParen(rawName) || "역명 미상";

  const rawLine =
    row?.LINE ?? row?.LINE_NUM ?? row?.lineNm ?? row?.subwayNm ?? "";
  const line = normLine(rawLine) || String(rawLine || "");

  const stationId =
    row?.STATION_ID ?? row?.stationId ?? row?.OUT_STN_NUM ?? "-";

  const features = FEATURE_MAP.map((f) => ({
    ...f,
    value: yn(row?.[f.key]),
  }));

  const a11y = {
    elevator: features.find((f) => f.key === "EL")?.value,
    lift: features.find((f) => f.key === "WL")?.value,
    nursery: features.find((f) => f.key === "FDROOM")?.value,
  };

  return (
    <div className="sld">
      {/* 역 정보 */}
      <section className="sld-card sld-station">
        <div className="sld-card__hd">역 정보</div>
        <div className="sld-station__grid">
          <div className="sld-kv">
            <span className="sld-kv__k">선택한 역</span>
            <span className="sld-kv__v">{stationName}</span>
          </div>
          <div className="sld-kv">
            <span className="sld-kv__k">호선</span>
            <span className="sld-kv__v">{line || "-"}</span>
          </div>
          <div className="sld-kv">
            <span className="sld-kv__k">역 코드</span>
            <span className="sld-kv__v">{stationId}</span>
          </div>
        </div>
      </section>

      {/* 시설 정보 */}
      <section className="sld-card">
        <div className="sld-card__hd">시설 정보</div>
        <div className="sld-facGrid">
          {features.map((f) => {
            const cls =
              f.value === true ? "on" : f.value === false ? "off" : "unk";
            const statusText =
              f.value === true ? "제공" : f.value === false ? "없음" : "미확인";
            return (
              <div className={`sld-fac ${cls}`} key={f.key}>
                <div className="sld-fac__ico" aria-hidden>
                  {f.icon}
                </div>
                <div className="sld-fac__label">{f.label}</div>
                <div className="sld-fac__status">{statusText}</div>
              </div>
            );
          })}
        </div>
        <p className="sld-hint">
          *  안낭하세영
        </p>
      </section>

      {/* 교통약자 요약 */}
      <section className="sld-card sld-a11y">
        <div className="sld-card__hd">교통약자 정보</div>
        <div className="sld-a11y__grid">
          <div className={`sld-a11y__item ${a11y.elevator ? "ok" : "no"}`}>
            <div className="sld-a11y__k">엘리베이터</div>
            <div className="sld-a11y__v">
              {a11y.elevator === null ? "미확인" : a11y.elevator ? "있음" : "없음"}
            </div>
          </div>
          <div className={`sld-a11y__item ${a11y.lift ? "ok" : "no"}`}>
            <div className="sld-a11y__k">휠체어 리프트</div>
            <div className="sld-a11y__v">
              {a11y.lift === null ? "미확인" : a11y.lift ? "있음" : "없음"}
            </div>
          </div>
          <div className={`sld-a11y__item ${a11y.nursery ? "ok" : "no"}`}>
            <div className="sld-a11y__k">유아수유실</div>
            <div className="sld-a11y__v">
              {a11y.nursery === null ? "미확인" : a11y.nursery ? "있음" : "없음"}
            </div>
          </div>
        </div>
        <p className="sld-muted">상세 위치/동선은 추후 데이터 연결 시 표기됩니다.</p>
      </section>

      {/* 출구 정보 */}
      <section className="sld-card">
        <div className="sld-card__hd">출구 정보</div>
        <div className="sld-empty">출구 데이터 연동 전입니다.</div>
      </section>

      {/* 주변 정보 */}
      <section className="sld-card">
        <div className="sld-card__hd">주변 정보</div>
        <div className="sld-mapPh">
          <div className="sld-mapPh__map">Map Placeholder</div>
          <div className="sld-mapPh__meta">
            주변 POI / 길찾기 등은 이후 연결 예정입니다.
          </div>
        </div>
      </section>
    </div>
  );
}
