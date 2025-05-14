import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./src/App";
import Questions from "./src/Questions/Questions";
import Payment from "./src/Payment/Payment";
import AdminDashboard from "./src/Admin/AdminDashboard";
import Interactive from "./src/Questions/Interactive";
import Results from "./src/Results/Results";
import ProtectedRoute from "./ProtectedRoutes";
const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/home",
    element: <App />,
  },
  {
    path: "/questions",
    element: <Questions />,
  },
  {
    path: "/results",
    element: (
      <ProtectedRoute>
        <Results />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment",
    element: (
      <ProtectedRoute>
        <Payment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/congratulations",
    element: (
      <ProtectedRoute>
        <Interactive />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin",
    element: <AdminDashboard />,
  },

  {
    path: "*",
    element: <h1>Page not found</h1>,
  },
]);

export default routes;