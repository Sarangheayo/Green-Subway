import { useNavigate } from 'react-router-dom';
import './Main.css'

function Main () {
    const navigate = useNavigate()
    return (
        <>
            <div className="main-logoImgBox">
                <img src="/subwaylogo.png" alt="로고이미지" />
            </div>
            <div className='main-buttonWrap'>
                <div className='main-button' onClick={()=>{navigate(`/subwaystationlist`)}}>
                    <p>지하철역 검색</p>
                </div>
                <div className='main-button' onClick={()=>{navigate(`/mappage`)}}>
                    <p>노선도 보기</p>
                </div>
            </div>
        </>
    )
}

export default Main;