import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Alerts from "../pages/Alerts";
import Settings from "../pages/Settings";
import AppLayout from "../components/layout/AppLayout";
import withAuth from "../hocs/withAuth";

const ProtectedLayout = withAuth(AppLayout);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "alerts",
        element: <Alerts />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);
