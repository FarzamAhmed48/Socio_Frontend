import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import "../App.css"
const LeftSidebar = () => {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const [open,setOpen]=useState(false)
    const {user}=useSelector(store=>store.auth)
    const {likeNotification}=useSelector(store=>store.realTimeNotification)
    const sidebarItems = [
        
      {
        icon: <Home />,
        text: "Home",
      },
      {
        icon: <Search />,
        text: "Search",
      },
      {
        icon: <TrendingUp />,
        text: "Explore",
      },
      {
        icon: <MessageCircle />,
        text: "Messages",
      },
      {
        icon: <Heart />,
        text: "Notifications",
      },
      {
        icon: <PlusSquare />,
        text: "Create",
      },
      {
        icon: (
          <Avatar className="rounded-full w-6 h-6 overflow-hidden ">
            <AvatarImage src={user?.profilePicture} className="" alt="@shadcn"/>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ),
        text: "Profile",
      },
      {
        icon:<LogOut/>,
        text:"Logout"
      }
    ];
    const logoutHandler=async ()=>{
        try {
            const res=await axios.get("http://localhost:8000/api/v1/users/logout",{withCredentials:true})
            if(res.data.success){
                dispatch(setAuthUser(null))
                console.log(res.data.success)
                navigate("/login")
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }
    const createPostHandler=()=>{
        setOpen(true)
    }
    const sidebarHandler=(text)=>{
        if(text === "Logout"){
            logoutHandler()
        } 
        else if(text === "Create"){
            createPostHandler()
        }
        else if(text === "Profile"){
          navigate(`${user?._id}/profile`)
        }
        else if(text === "Home"){
          navigate(`/`)
        }
        else if(text === "Messages"){
          navigate("/chat")
        }
    }
    

    return(
        <div className="fixed w-full bottom-0 h-[10vh]  flex justify-center gap-2 px-2 md:border-t-0 md:border-r  border-gray-300 md:block bg-white z-[10] lg:w-[17vw] md:h-screen  md:w-fit md:px-2  md:bg-transparent border-t-2 mt-2">
            <div className=" flex flex-row md:flex-col md:gap-8 md:justify-center h-[100%] my-auto lg:gap-3">
                <h1 className="my-8 pl-3 font-bold lg:block hidden lg:text-start lg:font-extrabold lg:text-4xl dancing_text  ">Socio.io</h1>
                <div className=" flex gap-2 sm:gap-5 md:gap-1 md:flex-col">
                    {
                        sidebarItems.map((item,index)=>{
                            return(
                                <div key={index} onClick={()=>sidebarHandler(item.text)} className="flex items-center  sm:gap-4 relative md:mb-3 lg:mb-1 hover:bg-gray-200 cursor-pointer rounded-lg p-3 shrink-0 lg:bg-white">
                                    {item.icon}
                                    <span className="hidden lg:block">{item.text}</span>
                                    {
                                      item.text === 'Notifications' && likeNotification.length>0 && (
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <div>
                                              <Button size="icon" className="rounded-full w-5 h-5 absolute bottom-6 left-6 bg-red-600 my-2">
                                                  {likeNotification.length}
                                              </Button>
                                            </div>
                                          </PopoverTrigger>
                                          <PopoverContent>
                                            <div>
                                              {
                                                likeNotification.length === 0 ? (<p>No new notifications</p>) : 
                                                (
                                                  likeNotification.map((notifcation,i)=>{
                                                    return(
                                                      <div key={notifcation.userId} className="flex items-center gap-2">
                                                        <Avatar>
                                                          <AvatarImage src={notifcation?.userDetails?.profilePicture}/>
                                                          <AvatarFallback>CN</AvatarFallback>
                                                          <p className="text-sm"> <span className="font-bold">{notifcation?.userDetails?.username}</span>liked your post</p>
                                                        </Avatar>
                                                      </div>
                                                    )
                                                  })
                                                )
                                              }
                                            </div>
                                          </PopoverContent>
                                        </Popover>
                                      )
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen}/>
        </div>
    )
}
 
export default LeftSidebar;
