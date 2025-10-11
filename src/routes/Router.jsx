import { createBrowserRouter,RouterProvider } from "react-router-dom";
import App from "../App";
import Main from "../components/Main.jsx";
import SubwayStationList from "../components/station/SubwayStationList.jsx";
import SubwayStationDetail from "../components/station/SubwayStationDetail.jsx"
import SubwayLinePath from '../components/SubwayLinePath.jsx';
import StationSearchbar from "../components/station/StationSearchbar.jsx";


const router = createBrowserRouter([
    {
      element:<App/>,
      children : [
        {
          index: true,
          element: <Main/>
        },
        {
          path: 'line-diagrams',
          element: <SubwayLinePath />
        },
        {
          path: 'stationlist',
          element: <SubwayStationList />
        },
        {
          path: 'stationsearchbar',
          element: <StationSearchbar />
        },
        {
          path: 'stationdetail/:name/:line',
          element: <SubwayStationDetail />
        },
        {
          path: 'stations/:stationId',
          element: <SubwayStationDetail />
        },
    ]
  }
]);

function Router(){
     return <RouterProvider router={router}/>
}
export default Router;