import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App.jsx";
import Main from "../components/Main.jsx";
import Map from "../components/Map.jsx";

import SubwayLineOnMap from "../components/SubwayLineOnMap.jsx";
import SubwaySearchByName from "../components/SubwaySearchByName.jsx";
import SubwayRealtime from "../components/SubwayRealtime.jsx";    
import AddressLookup from "../components/AddressLookup.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <Main /> },
      { path: "/map", element: <Map /> },
      { path: "/subway", element: <SubwayRealtime /> },
      { path: "/subway/lines", element: <SubwayLineOnMap /> },
      { path: "/subway/search", element: <SubwaySearchByName /> },
      { path: "/tools/address", element: <AddressLookup /> },
      { path: "*", element: <Main /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
