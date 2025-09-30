import { useNavigate, Link } from "react-router-dom";
import "./Header.css";
import { useState } from "react";

function Header() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  return (
    <header>
      <div className="ham-imgbox" onClick={() => setVisible(true)}>
        <img src="/ham.png" alt="햄버거네비이미지" />
      </div>
      <p>Green Subway</p>
      <div className="home-imgbox" onClick={() => { navigate("/"); }}>
        <img src="/home.png" alt="홈으로 돌아가기 이미지" />
      </div>
      <div className={`nav ${visible ? "show" : ""}`}>
        <div className="navbox">
          <div className="navLogoImgBox" onClick={() => { navigate("/"); setVisible(false); }}>
            <img src="/bus.png" alt="로고이미지" />
          </div>
          <div className="navTextWrap">
            <p onClick={() => { navigate("/map"); setVisible(false); }}>지하철 역 찾기</p>
            <p onClick={() => { navigate("/busstop"); setVisible(false); }}></p>
            <p onClick={() => { navigate("/bus"); setVisible(false); }}>버스</p>
            <p onClick={() => { navigate("/tools/address"); setVisible(false); }}>주소 검색</p>
          </div>
        </div>
        <div className="backbox" onClick={() => setVisible(false)}></div>
      </div>
    </header>
  );
}

export default Header;
