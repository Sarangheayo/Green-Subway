import { createBrowserRouter,RouterProvider } from "react-router-dom";
import App from "../App";
import MapPage from "../components/MapPage.jsx";
import SubwayStationList from "../components/SubwayStationList.jsx";
import SubwayDetail1 from "../components/SubwayDetail1.jsx";
import SubwayDetail2 from "../components/SubwayDetail2.jsx";
import TimeLine from "../components/TimeLine.jsx";
import StartEnd from "../components/StartEnd.jsx";
import TimeLine2 from "../components/TimeLine2.jsx";
import StartEnd2 from "../components/StartEnd2.jsx";

const router = createBrowserRouter([
    {
        element:<App/>,
        children : [
            {
                path: '/',
                element: <MapPage/>
            },
            {
                path: '/subwaystationlist',
                element: <SubwayStationList/>
            },
            {
                path: '/subwaydetail1/:subwayStationId',
                element: <SubwayDetail1/>
            },
            {
                path: '/subwaydetail2',
                element: <SubwayDetail2/>
            },{
                path: '/timeline',
                element: <TimeLine/>
            },{
                path: '/startend',
                element: <StartEnd/>
            },{
                path: '/startend2',
                element: <StartEnd2/>
                
            },{
                path: '/timeline2',
                element: <TimeLine2/>
            }
        ]
        
    }
]);
function Router(){
     return <RouterProvider router={router}/>
}
export default Router;