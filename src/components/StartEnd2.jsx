
import "./StartEnd2.css";
import Header from "./Header.jsx";
import { useNavigate } from "react-router-dom";


function StartEnd2(){
    const navigate = useNavigate();
    return(
        <>  
        <Header/>
        <div className='startend2-nav'>
            <div className='startend2-item'onClick={()=>{navigate('/subwaydetail1')}}>
                <div className='startend2-contentwrap'>
                    <div className='startend2-imgBbox'>
                    <img src="/realtime.png" alt="실시간이미지" />
                    </div>
                    <p>실시간정보</p>
                </div>
                <div className='startend2-whiteline'></div>
            </div>
             <div className='startend2-item' onClick={()=>{navigate('/timeline')}}>
                <div className='startend2-contentwrap'>
                    <div className='startend2-imgBbox'>
                    <img src="/timelist.png" alt="실시간이미지" />
                    </div>
                    <p>공식시간표</p>
                </div>
                <div className='startend2-whiteline'></div>
            </div>
             <div className='startend2-item'onClick={()=>{navigate('/startend')}}>
                <div className='startend2-contentwrap'>
                    <div className='startend2-imgBbox'>
                    <img src="/startstage.png" alt="실시간이미지" />
                    </div>
                    <p>첫차,막차</p>
                </div>
                <div className='startend2-whiteline check'  ></div>
            </div>
        {/* 네비끝 */}

        </div>
        <div className='startend2-titlebox'>
            <div className='startend2-colorname'></div>
                <h1>을지로4가</h1>
            <div className='startend2-colorname'></div>
            
        </div>
        {/* 타이틀 끝 */}
        <div className='startend2-numbersbox'onClick={()=>{navigate('/startend')}}>
                <div className='startend2-item'>
                    <img src="/circle2.png" alt="원이미지" />
                    <div className="startend2-underline "></div>
                </div>
                <div className='startend-item'>
                    <img src="/circle5.png" alt="원이미지" />
                    <div className="startend2-underline greencheck"></div>
                </div>
                
        </div>
        {/* 원 이미지 끝 리스트 시작 */}
        <div className='startend2-listitem' >
            <div className='startend2-circleimgbox'>
                <img src="/circle5.png" alt="원이미지" />
            </div>
            
            <div className='startend2-textwrap'>
                
                <p>{`오늘 첫차(종로3가방향)`}</p>
                <p>{`5시 39분(방화)`}</p>
            </div>
        
        </div>
        <div className='startend2-listitem' >
            <div className='startend2-circleimgbox'>
                <img src="/circle5.png" alt="원이미지" />
            </div>
            
            <div className='startend2-textwrap'>
                
                <p>{`오늘 막차 (종로3가 방향)`}</p>
                <p>{`24시 50분 (애오개)`}</p>
                <p>{`24시 50분 (여의도)`}</p>
                <p>{`24시 50분 (방화)`}</p>
            </div>
        
        </div>
        <div className='startend2-listitem'>
            <div className='startend2-circleimgbox'>
                <img src="/circle5.png" alt="원이미지" />
            </div>
            
            <div className='startend2-textwrap'>
                
                <p>{`내일 첫차(종로3가방향)`}</p>
                <p>{`5시 39분(방화)`}</p>
       
            </div>
        
        </div>
        <div className='startend2-listitem'>
            <div className='startend2-circleimgbox'>
                <img src="/circle5.png" alt="원이미지" />
            </div>
            
            <div className='startend2-textwrap'>
                
                <p>{`내일 막차(종로3가방향)`}</p>
                <p>{`24시 50분(방화)`}</p>
                <p>{`24시 50분 (애오개)`}</p>
                <p>{`24시 50분 (여의도)`}</p>
            </div>
        
        </div>
        
       
        </>
    )
}
export default StartEnd2;