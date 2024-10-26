import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import { FaComment, FaHeart } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";
import { setUserProfile } from "@/redux/authSlice";

const Profile = () => {
  const dispatch=useDispatch()
  const params = useParams();
  const [activeTab,setActiveTab]=useState("posts")
  const userId = params.id;
  useGetUserProfile(userId);
  const { userProfile,user } = useSelector((store) => store.auth);
  const isLoggedInUserProfile =userProfile?._id === user?._id;
  const isFollowing = false;
  const handleTabChange=(tab)=>{
    setActiveTab(tab)
  }
  const displayedPosts= activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks

  const followUnfollowHandler=async()=>{
    try {
      const res=await axios.post(`http://localhost:8000/api/v1/users/followorunfollow/${userProfile._id}`,{withCredentials:true})
      
      if(res.data.success){
        console.log(userProfile)

        toast.success(res.data.message)
        const updatedFollowers = [...userProfile.followers];
        if (userProfile.followers.includes(user._id)) {
          const index = updatedFollowers.indexOf(user._id);
          if (index > -1) {
            updatedFollowers.splice(index, 1);
          }
        } else {
          updatedFollowers.push(user._id);
        }

        dispatch(
          setUserProfile({
            ...userProfile,
            followers: updatedFollowers,
          })
        );
  
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="w-[100vw] relative md:right-36 sm:right-2 md:w-[90vw] lg:w-[75vw] lg:right-16 px-5 grid grid-cols-1 mt-5">
      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-4">
          <section className="flex items-center justify-center ">
            <Avatar className="h-28 w-28">
              <AvatarImage src={userProfile?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section className="">
            <div className="flex flex-col gap-5 ">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/profile/edit">
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-200 h-8"
                      >
                        Edit Profile
                      </Button>
                    </Link>
                    
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      View archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Ad tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button onClick={followUnfollowHandler} variant="secondary" className=" h-8 hover:bg-gray-200">
                      Unfollow
                    </Button>
                    <Button variant="secondary" className=" hover:bg-gray-200 h-8">
                      Message
                    </Button>
                  </>
                ) : (
                  <Button onClick={followUnfollowHandler} className="bg-[#0095f6] hover:bg-[#56b8fa] h-8 text-white">
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p> <span className="font-semibold">{userProfile?.posts.length}</span> Posts</p>
                <p><span className="font-semibold">{userProfile?.followers.length}</span> Followers</p>
                <p><span className="font-semibold">{userProfile?.following.length}</span> Following</p>
              </div>
              <div className="flex  flex-col ">
                <span className="font-semibold">{userProfile?.bio || ""}</span>
                <Badge variant="secondary" className="w-fit"><AtSign/><span className="pl-1">{userProfile?.username}</span></Badge>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-600 w-full">
                <div className="flex items-center justify-center gap-10 text-sm">
                  <span onClick={()=>handleTabChange("posts")} className={`py-3 cursor-pointer ${activeTab === "posts" ? "font-bold" : ""}`}>POSTS</span>
                  <span onClick={()=>handleTabChange("saved")} className={`py-3 cursor-pointer ${activeTab === "saved" ? "font-bold" : ""}`}>SAVED</span>
                  <span className="py-3 cursor-pointer">REELS</span>
                  <span className="py-3 cursor-pointer">TAGS</span>

                </div>
                <div className="grid grid-cols-3 gap-1 bg-red-500 ">
                  {displayedPosts?.map((post)=> {
                    return (
                      <div key={post._id} className="relative group cursor-pointer ">
                        <img src={post?.image} alt="post_image" className="rounded-sm my-2 w-full aspect-square object-cover"  />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0  group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex items-center text-white space-x-4 ">
                              <button className="flex items-center gap-2 hover:text-gray-300">
                                <Heart/>
                                <span>{post?.likes.length}</span>
                              </button>
                              <button className="flex items-center gap-2 hover:text-gray-300">
                                <MessageCircle/>
                                <span>{post?.comments.length}</span>
                              </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
