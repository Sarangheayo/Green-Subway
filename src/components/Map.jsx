import { useEffect, useRef, useState } from "react";
import "./Map.css";

export default function Map() {
  const mapEl = useRef(null);
  const [status, setStatus] = useState("loading...");

  useEffect(() => {
    const ready = () =>
      typeof window !== "undefined" &&
      window.kakao && window.kakao.maps &&
      typeof window.kakao.maps.load === "function";

    if (ready()) {
      window.kakao.maps.load(init); // ✅ 핵심
      return;
    }
    const id = setInterval(() => {
      if (ready()) {
        clearInterval(id);
        window.kakao.maps.load(init);
      }
    }, 100);
    return () => clearInterval(id);
  }, []);

  function init() {
    const { kakao } = window;
    const center = new kakao.maps.LatLng(37.5665, 126.9780);
    const map = new kakao.maps.Map(mapEl.current, { center, level: 4 });
    setStatus("지도 준비 완료");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = new kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          new kakao.maps.Marker({ map, position: loc });
          new kakao.maps.InfoWindow({
            position: loc,
            content: '<div style="padding:6px 8px;">현재 위치</div>',
          }).open(map);
          map.panTo(loc);
          setStatus(`현재 위치: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
          keywordSearch(map, "버스정류장", loc);
        },
        () => {
          setStatus("현재 위치 접근 거부/실패. 기본 위치로 표시합니다.");
          keywordSearch(map, "버스정류장", center);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setStatus("이 브라우저는 위치정보를 지원하지 않아요.");
      keywordSearch(map, "버스정류장", center);
    }
  }

  function keywordSearch(map, query, around) {
    const { kakao } = window;
    const ps = new kakao.maps.services.Places(map);
    const opt = around ? { location: around, radius: 2000 } : undefined;

    ps.keywordSearch(
      query,
      (data, st) => {
        if (st !== kakao.maps.services.Status.OK) {
          setStatus((s) => `${s} | 검색 실패`);
          return;
        }
        setStatus((s) => `${s} | '${query}' ${data.length}건`);
        data.forEach((p) => {
          const pos = new kakao.maps.LatLng(p.y, p.x);
          const marker = new kakao.maps.Marker({ map, position: pos });
          const iw = new kakao.maps.InfoWindow({
            content: `<div style="padding:6px 8px;max-width:200px;">
              <div style="font-weight:600;">${p.place_name}</div>
              <div style="font-size:12px;color:#555;">${p.road_address_name || p.address_name || ""}</div>
            </div>`,
          });
          kakao.maps.event.addListener(marker, "click", () => iw.open(map, marker));
        });
      },
      opt
    );
  }

  return (
    <main className="mapPage">
      <div className="mapPage__canvas" ref={mapEl} />
      <p className="mapPage__status">{status}</p>
    </main>
  );
}
