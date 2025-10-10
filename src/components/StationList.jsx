import './StationList.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { stationIndex } from '../store/thunks/stationThunk.js';
import StationSearchbar from "./StationSearchbar.jsx";

function StationList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const stationList = useSelector(state => state.station.nameList);
  const search = useSelector(state => state.station.searchStationNm);

  useEffect(() => { 
    dispatch(stationIndex(search));   //검색어로 조회
  }, [dispatch, search]);

  return (
    <>
      <div className='stationlist-title'><h1>지하철역 리스트</h1></div>

      <div className='stationlist-searchbar'>
        <StationSearchbar />
      </div>

      {(stationList || []).map((item, idx) => {
        const name = item.name;
        const line = String(item.line); 
        const displayLine = /호선$/.test(line) ? line : (line ? `${line}호선` : "");
        
        return (
          <div
            key={`${name}-${line}-${idx}`}         // 중복 key 방지
            className='stationlist-item'
            onClick={() => navigate(`/stationdetail/${encodeURIComponent(name)}/${encodeURIComponent(displayLine)}`)}
          >
            <div className='stationlist-listCircle'>
              <img src="/base/mainnavsubway.png" alt="지하철 아이콘" />
            </div>
            <p>{`${displayLine} ${name}`}</p>   {/* ← N호선 N역 */}
          </div>
        );
      })}

      {(!stationList || stationList.length === 0) && (
        <p className="empty">표시할 역이 없습니다.</p>
      )}
    </>
  );
}

export default StationList;
