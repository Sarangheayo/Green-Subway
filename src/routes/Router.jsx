
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import App from "../App.jsx"
// import BusStopList from "../components/BusStopList.jsx";
import Main from "../components/Main.jsx"
import Map from "../components/Map.jsx"
// import BusList from "../components/BusList.jsx"
// import BusListDetail from "../components/BusListDetail.jsx";
import AddressLookup from "../components/AddressLookup.jsx";
import SubwayPosition from "../components/SubwayPosition.jsx";

const router = createBrowserRouter([
    {
        element: <App/>,
        children : [
            {
                path: '/',
                element:<Main/>
            },
            {
                path: '/map',
                element:<Map/>
            },
            {
                path: 'subway',
                element:<SubwayPosition/>
            },
            {
                path: "/tools/address",
                element: <AddressLookup />
            },
            {
                path: "*",
                element: <Main />
            },

        ]
    }
]);

function Router(){
    return <RouterProvider router={router}/>
}

export default Router;