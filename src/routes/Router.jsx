import { createBrowserRouter,RouterProvider } from "react-router-dom";
import App from "../App";
import Main from "../components/Main.jsx";
import StationList from "../components/StationList.jsx";
import StationDetail from "../components/StationDetail.jsx";
import MapPage from '../components/MapPage.jsx';
import StationSearchbar from "../components/StationSearchbar.jsx"; // 추가


const router = createBrowserRouter([
    {
        element:<App/>,
        children : [
            {
                path: '/',
                element: <Main/>
            },
            {
                path: '/stationlist',
                element: <StationList/>
            },
            {
                path: '/stationsearchbar',
                element: <StationSearchbar />
            },
            {
                path: '/stationdetail/:stationId',
                element: <StationDetail/>
            },
            {
                path: '/stations/:stationId',
                element: <StationDetail/>
            },
            {
                path: '/mappage',
                element: <MapPage/>
            }
           
        ]
        
    }
]);
function Router(){
     return <RouterProvider router={router}/>
}
export default Router;