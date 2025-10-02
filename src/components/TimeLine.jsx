
import "./TimeLine.css";
import Header from "./Header.jsx";
import { useNavigate } from "react-router-dom";


function TimeLine(){
    const navigate = useNavigate();
    return(
        <>  
        <Header/>
        <div className='timeline-nav'>
            <div className='timeline-item' onClick={()=>{navigate('/subwaydetail1')}}>
                <div className='timeline-contentwrap'>
                    <div className='timeline-imgBbox'>
                    <img src="/realtime.png" alt="실시간이미지" />
                    </div>
                    <p>실시간정보</p>
                </div>
                <div className='timeline-whiteline '></div>
            </div>
             <div className='timeline-item' onClick={()=>{navigate('/timeline')}}>
                <div className='timeline-contentwrap'>
                    <div className='timeline-imgBbox'>
                    <img src="/timelist.png" alt="실시간이미지" />
                    </div>
                    <p>공식시간표</p>
                </div>
                <div className='timeline-whiteline check'></div>
            </div>
             <div className='timeline-item' onClick={()=>{navigate('/startend')}}>
                <div className='timeline-contentwrap' >
                    <div className='timeline-imgBbox'>
                    <img src="/startstage.png" alt="실시간이미지" />
                    </div>
                    <p>첫차,막차</p>
                </div>
                <div className='timeline-whiteline'></div>
            </div>
        {/* 네비끝 */}

        </div>
        <div className='timeline-titlebox'>
            <div className='timeline-colorname'></div>
                <h1>을지로4가</h1>
            <div className='timeline-colorname'></div>
            
        </div>
        {/* 타이틀 끝 */}
        <div className='timeline-numbersbox'>
                <div className='timeline-item'>
                    <img src="/circle2.png" alt="원이미지" />
                    <div className="timeline-underline greencheck"></div>
                </div>
                <div className='timeline-item' onClick={()=>{navigate('/timeline2')}}>
                    <img src="/circle5.png" alt="원이미지" />
                    <div className="timeline-underline"></div>
                </div>
                
        </div>
        {/* 원 이미지 끝 리스트 시작 */}
        <div className="timeline-textwrap">
            <div className="timeline-timetext">
                <p >13pm</p>
                <p className="timeline-widthp">14pm</p>
                <p className="timeline-widthp">15pm</p>
            </div>
            <div className="timeline-subwaystoplist">
                <p>21방화</p>
                <p>27방화</p>
                <p>34방화</p>
                <p>40방화</p>
                <p>47방화</p>
                <p>53방화</p>
                <p>21방화</p>
                <p >27방화</p>
                <p>34방화</p>
                <p className="timeline-now">40방화</p>
                <p>47방화</p>
                <p>53방화</p>
                <p>21방화</p>
                <p>27방화</p>
                <p>34방화</p>
                <p>40방화</p>
                <p>47방화</p>
                <p>53방화</p>
                <p>21방화</p>
                <p>27방화</p>
                <p>34방화</p>
                <p>40방화</p>
                <p>47방화</p>
                <p>53방화</p>
            </div>
        </div>


        
       
        </>
    )
}
export default TimeLine;