import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataUrl } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { setPosts } from "@/redux/postSlice";

const CreatePost = ({ open, setOpen }) => {
  const [file, setFile] = useState("");
  const dispatch=useDispatch();
  const {posts}=useSelector(store=> store.post)
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const imageRef = useRef();
  const {user}=useSelector(store=>store.auth)
  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataurl = await readFileAsDataUrl(file);
      setImagePreview(dataurl);
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caption", caption);

    if (imagePreview) formData.append("image", file);
    try {
      setLoading(true)
      const res = await axios.post(
        "http://localhost:8000/api/v1/post/addPost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res?.data?.success) {
        console.log(`Before dispatching data ${res.data.post}`)
        dispatch(setPosts([res.data.post,...posts]))
        console.log(`After dispatching the data ${posts}`)
        toast.success(res.data.message);
        setCaption("")
        setImagePreview("")
        setOpen(false)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <Dialog open={open} >
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-semibold">
          Create New Post
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user.profilePicture} alt="" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xs font-semibold">{user.username}</h1>
            <span className="text-gray-600 text-xs font-semibold">{user.bio}</span>
          </div>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a caption..."
        />
        {imagePreview && (
          <div className="w-full h-64 flex items-center justify-center">
            <img
              src={imagePreview}
              alt="preview-img"
              className="object-cover w-ful h-full rounded-md"
            />
          </div>
        )}
        <input
          type="file"
          className="hidden"
          ref={imageRef}
          onChange={fileChangeHandler}
        />
        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-[#0095f6] hover:bg-[#1687d2]"
        >
          Select from Computer
        </Button>
        {imagePreview &&
          (loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 animate-spin w-4" />
              Please Wait
            </Button>
          ) : (
            <Button type="submit" className="w-full" onClick={submitHandler}>
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
