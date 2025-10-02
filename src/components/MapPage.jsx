import { useNavigate } from 'react-router-dom';
import './MapPage.css';
function MapPage(){
    const navigate = useNavigate();
    return(
        <>
        <div className="MapPage-MapContainer">
            <img src="/subwayroad.jfif" alt="지하철 노선 이미지" onClick={()=>{navigate('/subwaystationlist')}}/>

        </div>
  
        </>
    )
}

export default MapPage;