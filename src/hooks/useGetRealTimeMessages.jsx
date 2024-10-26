import { setMessages } from "@/redux/chatSlice";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client"; // Ensure you import socket.io client

const useGetRealTimeMessages = () => {
  const dispatch = useDispatch();
  const { isOnline } = useSelector((store) => store.socketio);
  const { messages } = useSelector((store) => store.chat);
  const socketRef = useRef(null); // Use useRef to persist the socket instance

  useEffect(() => {
    if (isOnline && !socketRef.current) {
      socketRef.current = io("http://localhost:8000", {
        transports: ["websocket"],
      });

      console.log("Socket connected:", socketRef.current);

      const handleNewMessage = (newMessage) => {
        console.log("New message received:", newMessage);
        dispatch(setMessages([...messages, newMessage]));
      };

      socketRef.current.on("newMessage", handleNewMessage);

      return () => {
        socketRef.current.off("newMessage", handleNewMessage);
        socketRef.current.disconnect();
        socketRef.current = null;
      };
    }
  }, [isOnline, dispatch, messages]);

  return null; // This hook does not render anything
};

export default useGetRealTimeMessages;
