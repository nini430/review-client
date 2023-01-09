import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import {
  AdminContent,
  Admins,
  DeletedUsers,
  NavBar,
  Requests,
  Reviews,
  SideBar,
  TagCloudComponent,
  Users,
} from "./components";
import {
  Profile,
  Auth,
  CreateReview,
  Home,
  ReviewDetails,
  Settings,
  PasswordReset,
  SearchResults,
  AdminPage,
  TwoFactorAuth,
} from "./pages";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { getSocket } from "./redux/slices/socket";
import { useQuery } from "@tanstack/react-query";
import { axiosFetch } from "./axios";
import { getRequests } from "./redux/slices/requests";

const Layout = () => {
 
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

const AdminLayout = () => {
  return (
    <div className="admin d-flex gap-4">
      <SideBar />
      <Outlet />
    </div>
  );
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Auth isRegister />,
      },
      {
        path: "/login",
        element: <Auth />,
      },
      {
        path: "/write",
        element: <CreateReview />,
      },
      {
        path: "/update/:id",
        element: <CreateReview update />,
      },
      {
        path: "/profile/:userId",
        element: <Profile />,
      },
      {
        path: "/review/:id",
        element: <ReviewDetails />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/passwordReset/:resetToken",
        element: <PasswordReset />,
      },
      {
        path:"/twofactor/",
        element:<TwoFactorAuth/>

      },
      {
        path: "/search",
        element: <SearchResults />,
      },
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            path: "/admin/*",
            element: <Users />,
            index: true,
          },
          {
            path: "/admin/reviews",
            element: <Reviews />,
          },
          {
            path: "/admin/admins",
            element: <Admins />,
          },
          {
            path: "/admin/requests",
            element: <Requests />,
          },
          {
            path: "/admin/deleted",
            element: <DeletedUsers />,
          },
        ],
      },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();
  const { isLight } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.auth);
  useEffect(() => {
    if (currentUser) {
      dispatch(
        getSocket(
          io("ws://localhost:8000", { query: { id: currentUser.uuid } })
        )
      );
    }
  }, [currentUser?.uuid, dispatch, currentUser]);
  return (
    <div className={`bg-${isLight ? "light" : "dark"}`}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
