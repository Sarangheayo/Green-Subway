import { Link, useNavigate } from 'react-router-dom';
import './Header.css' ;

function Header(){
    const navigate = useNavigate();

    function navback(){
        navigate(-1);
    }
    return(
        <>
            <div className="header-container" onClick={navback}>
                <div className='header-back' >
                   <img src="/back.png" alt="뒤로 이미지" />
                </div>
                <Link to ="/subwaystationlist">
                <div className='header-home' >

                  <img src="/home.png" alt="홈이미지" />
                </div>
                </Link>
            </div>
        </>
    )
}

export default Header;