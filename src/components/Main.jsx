import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "./Main.css";
import AddressLookup from "./AddressLookup.jsx";
import SubwayPosition from "./SubwayPosition.jsx";

function Main() {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className="container">
        <div className="mainButton" onClick={() => { navigate("/map"); }}>
          <h1 className="mainTitle">길찾기</h1>
          <div className="road-imgbox">
            <img src="/road.png" alt="길 이미지" />
          </div>
        </div>
        <div className="mainButton" onClick={() => { navigate("/busstop"); }}>
          <h1 className="mainTitle">정류장</h1>
          <div className="busstop-imgbox">
            <img src="/busstop.png" alt="정류장 이미지" />
          </div>
        </div>
        <div className="mainButton" onClick={() => { navigate("/bus"); }}>
          <h1 className="mainTitle">버스</h1>
          <div className="bus-imgbox">
            <img src="/main-bus.png" alt="버스 이미지" />
          </div>
        </div>
        <div className="mainButton" onClick={() => { navigate("/bus"); }}>
          <h1 className="mainTitle">즐겨찾기</h1>
          <div className="bus-imgbox">
            <img src="/hamster.png" alt="버스 이미지" />
          </div>
        </div>
      </div>
      <AddressLookup />
      <SubwayPosition/>
    </>
  );
}

export default Main;
