// src/components/AddressLookup.jsx
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAddressSearch } from "../store/thunks/kakaolocalThunk";
import {
  selectAddressResults,
  selectKakaoLoading,
  selectKakaoError,
} from "../store/slices/kakaoSlice";

export default function AddressLookup() {
  const [q, setQ] = useState("전북 삼성동 100");
  const dispatch = useDispatch();
  const list = useSelector(selectAddressResults);
  const loading = useSelector(selectKakaoLoading);
  const error = useSelector(selectKakaoError);

  useEffect(() => {
    if (q) dispatch(fetchAddressSearch(q));
  }, [dispatch]);

  const onSearch = (e) => {
    e.preventDefault();
    if (q) dispatch(fetchAddressSearch(q));
  };

  return (
    <main className="page" style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px" }}>
      <h1>주소 → 좌표 검색</h1>
      <form onSubmit={onSearch} style={{ display: "flex", gap: 8, margin: "16px 0" }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="예) 전북 삼성동 100" style={{ flex: 1, padding: "10px" }} />
        <button type="submit">검색</button>
      </form>
      {loading && <p>로딩…</p>}
      {error && <p style={{ color: "tomato" }}>에러: {String(error)}</p>}
      <ul style={{ lineHeight: 1.7 }}>
        {list?.map((d, i) => (
          <li key={i}>{d.address_name} — x:{d.x} / y:{d.y}</li>
        ))}
      </ul>
    </main>
  );
}