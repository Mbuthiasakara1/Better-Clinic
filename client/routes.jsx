import { createBrowserRouter } from "react-router-dom";
import App from "./src/App";
import Questions from "./src/Questions/Questions";
import Register from "./src/Register/Register";
import Payment from "./src/Payment/Payment";

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
      path:"/register",
      element:<Register />
    },
    {
        path:"/payment",
        element:<Payment />
    },

    {
        path: "*",
        element: <h1>Page not found</h1>  
    }
])

export default routes;