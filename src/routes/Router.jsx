import { createBrowserRouter,RouterProvider } from "react-router-dom";
import App from "../App";
import Main from "../components/Main.jsx";
import SubwayStationList from "../components/SubwayStationList.jsx";
import SubwayDetail from "../components/SubwayDetail.jsx";
import MapPage from '../components/MapPage.jsx';

const router = createBrowserRouter([
    {
        element:<App/>,
        children : [
            {
                path: '/',
                element: <Main/>
            },
            {
                path: '/subwaystationlist',
                element: <SubwayStationList/>
            },
            {
                path: '/subwaydetail/:subwayStationId',
                element: <SubwayDetail/>
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