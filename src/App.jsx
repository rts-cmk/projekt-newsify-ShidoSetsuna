import { createBrowserRouter, RouterProvider } from "react-router";

import Login from "./pages/login.jsx";
import Home from "./pages/home.jsx";
import Archive from "./pages/archive.jsx";
import Popular from "./pages/popular.jsx";
import Settings from "./pages/settings.jsx";
import ErrorPage from "./pages/error.jsx";
import Layout from "./layout/Layout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "archive",
        element: <Archive />,
      },
      {
        path: "popular",
        element: <Popular />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
