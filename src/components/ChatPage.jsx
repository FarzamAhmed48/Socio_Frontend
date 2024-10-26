import store from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const ChatPage = () => {
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const [textMessage, setTextMessage] = useState("");
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/message/send/${selectedUser._id}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
    
  };
  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);
  return (
    <div className="flex ml-[20%] h-screen sm:w-[90vw]  sm:right-28 md:right-56 lg:w-[83vw] relative lg:right-48 px-5 gap-5 md:gap-36 ">
      <section className="w-full md:w-1/2 sm:w-full relative right-24 sm:right-4 md:right lg:w-[30vw] my-8 ">
        <h1 className="font-bold mb-4 px-3 text-xl hidden md:block">{user?.username}</h1>
        <hr className="mb-4 border-gray-600 hidden md:block" />
        <div className="overflow-y-auto h-[80vh]md:w-[40vw] w-[15vw] lg:w-[30vw] ">
          {suggestedUsers.map((suggestedUser) => {;
            const isOnline = onlineUsers.includes(suggestedUser._id);
            return (
              <div key={suggestedUser._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex gap-3 items-center p-3 hover:bg-gray-200 cursor-pointer overflow-x-hidden"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <span className="font-medium">{suggestedUser?.username}</span>
                  <span
                    className={`text-medium font-bold  ml-20 ${
                      isOnline ? "text-green-600 " : "text-red-600"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {selectedUser ? (
        <section className="flex-1 border-l border-l-gray-400 flex flex-col h-full ">
          <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-400 sticky top-0 bg-white z-10">
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <span>{selectedUser?.username}</span>
            </div>
          </div>
          <Messages selectedUser={selectedUser} />
          <div className="flex items-center border-t border-t-gray-400">
            <input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 mr-2"
              placeholder="Messages..."
            />
            <Button onClick={sendMessageHandler}>Send</Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center w-[50vw] text-center relative  right-5 sm:right-28 px-10">
          <MessageCircleCode className="h-32 w-32 my-4 " />
          <h1 className="font-medium text-xl">Your messages</h1>
          <span className="text-center">Send a message to start a chat.</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
