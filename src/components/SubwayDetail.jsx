import {  useParams } from 'react-router-dom';
import './SubwayDetail.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setSubwayInfo } from '../store/slices/subwayIdSlice.js';

function SubwayDetail(){

    const dispatch = useDispatch();
    const stationCodeParams = useParams();
    const stationInfo = useSelector(state => state.subwayid.subwayInfo);
    const stationList = useSelector(state => state.subwaystation.list);

    useEffect(()=>{
      const item = stationList.find((item) => stationCodeParams.subwayStationId === item.STATION_CD);
      dispatch(setSubwayInfo(item));
    },[]);


    return(
        <>  
       
        <div className='subwaydetail-titlebox'>
            <div className='subwaydetail-colorname'></div>
                <h1>{stationInfo.STATION_NM}</h1>
            <div className='subwaydetail-colorname'></div>
            
        </div>
        {/* 타이틀 끝 */}
        {/* 컨텐츠 사작  */}
        <div className='subwaydetail-contnetswrap'>
            <div className='subwaydetail-linename'>
                1호선
            </div>
            <div className='subwaydetail-linename'>
                2호선
            </div>
            <div className='subwaydetail-linename'>
                3호선
            </div>
            <div className='subwaydetail-linename'>
                4호선
            </div>
        </div>
        {/* 호선 끝 */}
        <div className='subwaydetail-textwrap'>
                <div className='subwaydetail-itemcontents'>
                    <div><h3>상행</h3><p><span>6분 30초 후</span> 도착</p></div>
                    <div><h4>첫차</h4><p>23시 5분</p></div>
                    <div><h4>막차</h4><p>23시 5분</p></div>
                </div>
                <div className='subwaydetail-itemcontents'>
                    <div><h3>하행</h3><p><span>6분 30초 후</span> 도착</p></div>
                    <div><h4>첫차</h4><p>23시 5분</p></div>
                    <div><h4>막차</h4><p>23시 5분</p></div>
                </div>

        </div>
        
        </>
    )
}

export default SubwayDetail;