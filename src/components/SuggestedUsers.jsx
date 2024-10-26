import store from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);
  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm gap-5">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See all</span>
      </div>
      <div>
        {suggestedUsers.map((user) => (
          <div key={user._id} className=" my-10 pr-6">
            <div className="flex  gap-5">
              <Link to={`/${user._id}/profile`}>
                <Avatar>
                  <AvatarImage
                    src={user?.profilePicture}
                    className="w-8 h-8 object-center"
                    alt="Post_img"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>

              <div className="flex flex-col ">
                <h1 className="text-sm font-semibold">
                  <Link to={`/${user._id}/profile`}>{user?.username}</Link>
                </h1>
                <span className="text-gray-600 text-sm">suggested for you</span>
              </div>
              <span className="text-[#2e97d9] font-semibold hover:text-[#65c4ff] cursor-pointer mr-[-30px]">Follow</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
