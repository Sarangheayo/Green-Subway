import { Link, useNavigate } from 'react-router-dom';
import './Header.css' ;

function Header(){
    const navigate = useNavigate();

    function navback(){
        navigate(-1);
    }
    return(
        <>
            <div className="header-container" >
                <div className='header-back'onClick={navback} >
                   <img src="/back.png" alt="뒤로 이미지" />
                </div>
                <Link to ="/">
                {/* <div className='header-home' conClick={()=>{navigate(`/`)}}></div> */}
                <div className='header-home'>
                  <img src="/home.png" alt="홈이미지" />
                </div>
                </Link>
            </div>
        </>
    )
}

export default Header;