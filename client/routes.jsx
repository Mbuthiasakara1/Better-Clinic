import { createBrowserRouter } from "react-router-dom";
import App from "./src/App";
import Questions from "./src/Questions/Questions";
import Payment from "./src/Payment/Payment";
import AdminDashboard from "./src/Admin/AdminDashboard";
import Interactive from "./src/Questions/Interactive";
import Results from "./src/Results/Results";

const routes = createBrowserRouter([
    {
        path:"/",
        element:<App />
    },
    {
        path:"/questions",
        element:<Questions />
    },
    {
      path:"/results",
      element:<Results />
    },
    {
        path:"/payment",
        element:<Payment />
    },
    {
        path:"/interactive",
        element:<Interactive/>
    },
  
    {
        path:"/admin",
        element:<AdminDashboard />
    },

    {
        path: "*",
        element: <h1>Page not found</h1>  
    }
])

export default routes;