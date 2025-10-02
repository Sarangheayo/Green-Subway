
import "./SubwayDetail2.css";
import Header from "./Header.jsx";
import { useNavigate } from "react-router-dom";


function SubwayDetail2(){
    const navigate = useNavigate();
    return(
        <>  
        <Header/>
        <div className='subwaydetail2-nav'>
            <div className='subwaydetail2-item'>
                <div className='subwaydetail2-contentwrap'>
                    <div className='subwaydetail2-imgBbox'>
                    <img src="/realtime.png" alt="실시간이미지" />
                    </div>
                    <p>실시간정보</p>
                </div>
                <div className='subwaydetail2-whiteline check'></div>
            </div>
             <div className='subwaydetail2-item' onClick={()=>{navigate('/timeline2')}}>
                <div className='subwaydetail2-contentwrap'>
                    <div className='subwaydetail2-imgBbox'>
                    <img src="/timelist.png" alt="실시간이미지" />
                    </div>
                    <p>공식시간표</p>
                </div>
                <div className='subwaydetail2-whiteline'></div>
            </div>
             <div className='subwaydetail2-item' onClick={()=>{navigate('/startend2')}}>
                <div className='subwaydetail2-contentwrap'>
                    <div className='subwaydetail2-imgBbox'>
                    <img src="/startstage.png" alt="실시간이미지" />
                    </div>
                    <p>첫차,막차</p>
                </div>
                <div className='subwaydetail2-whiteline'></div>
            </div>
        {/* 네비끝 */}

        </div>
        <div className='subwaydetail2-titlebox'>
            <div className='subwaydetail2-colorname'></div>
                <h1>을지로4가</h1>
            <div className='subwaydetail2-colorname'></div>
            
        </div>
        {/* 타이틀 끝 */}
        <div className='subwaydetail2-numbersbox'>
                <div className='subwaydetail2-item' onClick={()=>{navigate('/subwaydetail1')}}>
                    <img src="/circle2.png" alt="원이미지" />
                    <div className="subwaydetail2-underline "></div>
                </div>
                <div className='subwaydetail2-item'>
                    <img src="/circle5.png" alt="원이미지" />
                    <div className="subwaydetail2-underline greencheck"></div>
                </div>
                
        </div>
        {/* 원 이미지 끝 리스트 시작 */}
        <div className='subwaydetail2-listitem' onClick={()=>{navigate('/timeline2')}}>
            <div className='subwrayhdetail2-circleimgbox'>
                <img src="/circle5.png" alt="원이미지" />
            </div>
            
            <div className='subwaydetail2-textwrap'>
                <h2>을지로3가방향</h2>
                <p>{`신당도착(성수행)`}</p>
                <p><span>6분 30초 후</span>{`도착 (4개역)(성수행)`}</p>
            </div>
            <div className='subwaydetail2-array'>
                <img src="/array.png" alt="화살표" />
            </div>
        </div>
        <div className='subwaydetail2-listitem' onClick={()=>{navigate('/timeline2')}}>
            <div className='subwrayhdetail2-circleimgbox'>
                <img src="/circle5.png" alt="원이미지" />
            </div>
            
            <div className='subwaydetail2-textwrap'>
                <h2>을지로3가방향</h2>
                <p>{`신당도착(성수행)`}</p>
                <p><span>6분 30초 후</span>{`도착 (4개역)(성수행)`}</p>
            </div>
            <div className='subwaydetail2-array'>
                <img src="/array.png" alt="화살표" />
            </div>
        </div>
        
       
        </>
    )
}
export default SubwayDetail2;