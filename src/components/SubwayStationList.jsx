import './SubwayStationList.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { subwaystationIndex } from '../store/thunks/subwaystationThunk.js';
import StationSearch from './StationSearchbar.jsx';

function SubwayStationList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const subwaystation = useSelector(state => state.subwaystation.list);
 

  useEffect(() => {
    dispatch(subwaystationIndex());
  }, [])

  return (
    <>
      <div className='subwaystationlist-title'><h1>지하철역 리스트</h1></div>
      <div className='subwaystationlist-searchbar'>
          <StationSearch/>
      </div>
      {subwaystation && subwaystation.map(item => {
        return (
          <div className='subwaystationlist-item' onClick={() => { navigate(`/subwaydetail/${item.STATION_CD}`) }}>
            <div className='subwaystationlist-listCircle'>
              <img src="/mainnavsubway.png" alt="지하철사진" />

            </div>
            <p>{item.STATION_NM}</p>
          </div>
        )
      })

      }

    </>
  )
}

export default SubwayStationList;