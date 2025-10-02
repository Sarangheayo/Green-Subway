import "./SubwayStationList.css";
import Header from "./Header.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { subwaystationIndex } from "../store/thunks/subwaystationThunk.js";
import SubwayStationSearch from "./SubwayStationSearch.jsx";
import { selectLinesById, makeStationKey } from "../store/slices/subwaystaionListDetailSlice.js";
import { formatNameWithLines } from "../utils/subwaystaionListDetailLines.js";

function SubwayStationList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const subwaystation = useSelector((state) => state.subwaystation.list ?? []);
  const linesById = useSelector(selectLinesById);

  useEffect(() => {
    dispatch(subwaystationIndex());
  }, [dispatch]);

  return (
    <>
      <Header />
      <div className="subwaystationlist-title">
        <h1>지하철역 리스트</h1>
      </div>
      <div className="subwaystationlist-searchbar">
        <SubwayStationSearch />
      </div>
      {subwaystation.map((item) => {
        const k = makeStationKey(item);
        return (
          <div
            key={k}
            className="subwaystationlist-item"
            onClick={() => {
              navigate(`/subwaydetail1/${item.STATION_CD || ""}`);
            }}
          >
            <div className="subwaystationlist-listCircle">
              <img src="/mainnavsubway.png" alt="지하철사진" />
            </div>
            <p>
              {formatNameWithLines(
                item.STATION_NM || item.statnNm,
                linesById[k] || [],
                { max: 1, withBracket: false }
              )}
            </p>
          </div>
        );
      })}
    </>
  );
}

export default SubwayStationList;
