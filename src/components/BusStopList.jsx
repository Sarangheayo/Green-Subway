import "./BusStopList.css";
import { bs } from "../configs/bs.js";

function BusStopList() {
  return (
    <>
      {bs.length > 0 &&
        bs.map((item) => {
          return (
            <div className="busstop-contentBox" key={item.bsId}>
              <div className="busstop-leftbox">
                <p>정류장</p>
              </div>
              <div className="busstop-textwrap">
                <p className="busstop-title">{item.bsNm}</p>
                <p className="busstop-number">{item.wincId}</p>
              </div>
            </div>
          );
        })}
    </>
  );
}

export default BusStopList;
