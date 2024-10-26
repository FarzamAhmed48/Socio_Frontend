import { useEffect } from "react";
import "./App.css";
import ChatPage from "./components/ChatPage";
import EditProfile from "./components/EditProfile";
import Home from "./components/Home";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import Signup from "./components/Signup.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocketConnected } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
const browserRouter = createBrowserRouter([
  {
    path: "/",
    element:<ProtectedRoutes><MainLayout /></ProtectedRoutes> ,
    children: [
      { path: "/", element: <ProtectedRoutes><Home /></ProtectedRoutes>  },
      { path: "/:id/profile", element: <ProtectedRoutes><Profile /> </ProtectedRoutes> },
      { path: "/profile/edit", element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>  },
      { path: "/chat", element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>  },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    let socketIo;
    if (user) {
      socketIo = io("http://localhost:8000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });

      // Update connection status in Redux
      dispatch(setSocketConnected(true));

      // Socket event listeners
      socketIo.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
      socketIo.on("notification",(notification)=>{
        dispatch(setLikeNotification(notification))
      })
      // Clean up on component unmount
      return () => {
        socketIo.close();
        dispatch(setSocketConnected(false));
      };
    }

    return () => {
      if (socketIo) {
        socketIo.close();
        dispatch(setSocketConnected(false));
      }
    };
  }, [user, dispatch]);

  return (

    <>
        <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;


