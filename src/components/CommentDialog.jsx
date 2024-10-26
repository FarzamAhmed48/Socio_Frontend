import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";
import store from "@/redux/store";

const CommentDialog = ({ open, setOpen }) => {
    const dispatch=useDispatch()
    const [text, setText] = useState("");
    const {posts}=useSelector(store=>store.post)
    const { selectedPost } = useSelector((store) => store.post);
    const [postComment,setPostComment]=useState([])
    useEffect(()=>{
        if(selectedPost){
            setPostComment(selectedPost.comments)
        }
    },[selectedPost])
  const changeEventHandler = (e) => {
    const inpText = e.target.value;
    if (inpText.trim()) {
      setText(inpText);
    } else {
      setText("");
    }
  };

  

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const commentsOnPost = [...postComment, res.data.comment];
        setPostComment(commentsOnPost);
        const updatedComments = posts.map((p) =>
          p._id === selectedPost._id ? { ...p, comments: commentsOnPost } : p
        );

        dispatch(setPosts(updatedComments));
        setText("");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      className="flex justify-center items-center gap-3 px-10 flex-row sm:flex-col"
    >
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-3xl "
      >
        <div className="max-w-5xl flex gap-3">
          <div className="w-1/2">
            <img
              src={selectedPost?.image}
              alt=""
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex  flex-col">
                  <Link className="font-semibold">
                    {selectedPost?.author?.username}
                  </Link>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild className="z-[1000] ">
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col text-sm text-center  items-center">
                  <div className="cursor-pointer text-[#ED4956] w-full">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full">Add to Favourites</div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 ml-5 mt-5">
              {postComment.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={text}
                  onChange={changeEventHandler}
                  className="w-full outline-none border text-sm border-gray-300 p-2 rounded"
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  variant="outline"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
