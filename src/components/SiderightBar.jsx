import store from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const SiderightBar = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="my-10  hidden lg:block fixed right-0 border-l-2 h-full px-5">
      <div className="flex items-center gap-2">
        <Link to={`/${user._id}/profile`}>
          <Avatar>
            <AvatarImage
              src={user?.profilePicture}
              className="w-9 h-9 object-contain"
              alt="Post_img"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex flex-col ">
          <h1 className="text-sm font-semibold"><Link to={`/${user._id}/profile`}>{user?.username}</Link></h1>
          <span className="text-gray-600 text-sm">{user?.bio || "Bio Here..."}</span>
        </div>
      </div>
      <SuggestedUsers/>
    </div>
  );
};

export default SiderightBar;
