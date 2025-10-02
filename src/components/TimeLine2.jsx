
import "./TimeLine2.css";
import Header from "./Header.jsx";
import { useNavigate } from "react-router-dom";


function TimeLine2(){
    const navigate = useNavigate();
    return(
        <>  
        <Header/>
        <div className='timeline2-nav'>
            <div className='timeline2-item' onClick={()=>{navigate('/subwaydetail1')}}>
                <div className='timeline2-contentwrap'>
                    <div className='timeline2-imgBbox'>
                    <img src="/realtime.png" alt="실시간이미지" />
                    </div>
                    <p>실시간정보</p>
                </div>
                <div className='timeline2-whiteline '></div>
            </div>
             <div className='timeline2-item' onClick={()=>{navigate('/timeline')}}>
                <div className='timeline2-contentwrap'>
                    <div className='timeline2-imgBbox'>
                    <img src="/timelist.png" alt="실시간이미지" />
                    </div>
                    <p>공식시간표</p>
                </div>
                <div className='timeline2-whiteline check'></div>
            </div>
             <div className='timeline2-item' onClick={()=>{navigate('/startend')}}>
                <div className='timeline2-contentwrap' >
                    <div className='timeline2-imgBbox'>
                    <img src="/startstage.png" alt="실시간이미지" />
                    </div>
                    <p>첫차,막차</p>
                </div>
                <div className='timeline2-whiteline'></div>
            </div>
        {/* 네비끝 */}

        </div>
        <div className='timeline2-titlebox'>
            <div className='timeline2-colorname'></div>
                <h1>을지로4가</h1>
            <div className='timeline2-colorname'></div>
            
        </div>
        {/* 타이틀 끝 */}
        <div className='timeline2-numbersbox'>
                <div className='timeline2-item'  onClick={()=>{navigate('/timeline')}}>
                    <img src="/circle2.png" alt="원이미지" />
                    <div className="timeline-underline  "></div>
                </div>
                <div className='timeline2-item'>
                    <img src="/circle5.png" alt="원이미지" />
                    <div className="timeline2-underline greencheck"></div>
                </div>
                
        </div>
        {/* 원 이미지 끝 리스트 시작 */}
        <div className="timeline2-textwrap">
            <div className="timeline2-timetext">
                <p >13pm</p>
                <p className="timeline2-widthp">14pm</p>
                <p className="timeline2-widthp">15pm</p>
            </div>
            <div className="timeline2-subwaystoplist">
                <p>21방화</p>
                <p>27방화</p>
                <p>34방화</p>
                <p>40방화</p>
                <p>47방화</p>
                <p>53방화</p>
                <p>21방화</p>
                <p>27방화</p>
                <p>34방화</p>
                <p >40방화</p>
                <p>47방화</p>
                <p>53방화</p>
                <p>21방화</p>
                <p>27방화</p>
                <p className="timeline2-now">34방화</p>
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
export default TimeLine2;