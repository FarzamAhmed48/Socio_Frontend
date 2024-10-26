import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";

const EditProfile = () => {
  const { userProfile, user } = useSelector((store) => store.auth);
  const [loading,setLoading]=useState(false)
  const imageRef = useRef();
  const [input,setInput]=useState({
    profilePicture:user?.profilePicture,
    gender:user?.gender,
    bio:user?.bio
  })
  const navigate=useNavigate()
  const dispatch=useDispatch()

  const fileChangeHandler=(e)=>{
    console.log(e.target.files)
    const file=e.target.files?.[0]
    if (file){
        setInput({...input,profilePicture:file})

    }
  }

  const selectChangeHandler=(value)=>{
    setInput({...input,gender:value})
  }
  const editProfileHandler=async()=>{
    const formData=new FormData()
    formData.append("gender",input.gender)
    formData.append("bio",input.bio)
    if(input.profilePicture){
        formData.append("profilePicture",input.profilePicture)
    }
    try {

        setLoading(true)
        const res=await axios.post("http://localhost:8000/api/v1/users/profile/edit",formData,{
            headers:{
                "Content-Type":"multipart/form-data"
            },
            withCredentials:true
        })
        if(res.data.success){
            const updatedUserData={
                ...user,
                bio:res.data.user?.bio,
                gender: res.data.user?.gender,
                profilePicture: res.data.user?.profilePicture
            }
            dispatch(setAuthUser(updatedUserData))
            navigate(`/${user._id}/profile`)
            toast.success(res.data.message)
        }
    } catch (error) {
        toast.error(error.response.data.message)
        console.log(error)
    }
    finally{
        setLoading(false)
    }
  }
  return (
    <div className="flex mx-auto px-5 max-w-2xl">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={user?.profilePicture}
                className="w-9 h-9 object-contain"
                alt="Post_img"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="flex flex-col ">
              <h1 className="text-sm font-bold ">{user?.username}</h1>
              <span className="text-gray-400 ">
                {user?.bio || "Bio Here..."}
              </span>
            </div>
          </div>
          <input type="file" className="hidden" ref={imageRef} onChange={fileChangeHandler} />
          <Button
            onClick={() => imageRef?.current.click()}
            className="bg-[#0095f6] h-8 hover:bg-[#68c2ff] "
          >
            Change Picture
          </Button>
        </div>
        <div>
          <h1 className="font-bold text-xl">Bio</h1>
          <Textarea value={input.bio} name="bio" onChange={(e)=> setInput({...input,bio:e.target.value})} className="focus-visible:ring-slate-500 focus-visible:border-0 mt-5 border-2 border-gray-300" />
        </div>
        <div>
          <h1 className="font-bold mb-2">Gender</h1>
          <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
            {loading ? (
                <Button className="bg-[#0095f6] w-fit hover:bg-[#68c2ff] ">
                    <Loader2 className="mr-2 w-4 h-4 animate-spin"/>
                    Please Wait
                </Button>
            ): (<Button onClick={editProfileHandler} className="bg-[#0095f6] w-fit hover:bg-[#68c2ff] ">Submit</Button>)}
            
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
