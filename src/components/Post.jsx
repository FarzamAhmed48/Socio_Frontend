import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'

import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import store from '@/redux/store'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'


const Post = ({post}) => {
    const [text,setText]=useState("")
    const [open,setOpen]=useState(false)
    const [postComment,setPostComment]=useState(post.comments)
    const { suggestedUsers } = useSelector((store) => store.auth);
    const [commentLength,setCommentLength]=useState(postComment.length)
    const {user}=useSelector(store=>store.auth)
    const {posts}=useSelector(store=>store.post)
    const [liked,setLiked]=useState(post.likes.includes(user?._id) || false)
    const [postLikes,setPostLikes]=useState(post.likes.length)
    const dispatch=useDispatch()
    console.log(post)
    const changeEventHandler=(e)=>{
        const inpText=e.target.value;
        if(inpText.trim()){
            setText(inpText)
        }
        else{
            setText("")
        }
    }
    const deletePostHandler=async()=>{
        try {
            const res=await axios.delete(`http://localhost:8000/api/v1/post/delete/${post?._id}`,{withCredentials:true})
            if(res.data.success){
                const updatedPosts=posts.filter((singlePost)=> singlePost?._id !==post?._id)
                dispatch(setPosts(updatedPosts))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const likeOrDislikeHandler=async()=>{
        try {
          const action= liked  ? "dislike" : "like"
          const res=await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`,{withCredentials:true})
          if(res.data.success){
            setLiked(!liked)
            const update=liked? postLikes-1 : postLikes+1
            setPostLikes(update)
            const updatedLikes=posts.map(p=>
                p._id ===post._id? {
                    ...p,
                    likes:liked ?p.likes.filter(id=>id!==user._id):[...p.likes,user._id]
                }: p)
            dispatch(setPosts(updatedLikes))
            toast.success(res.data.message)
          }
        } catch (error) {
          console.log(error)
        }
      }
      const commentHandler=async ()=>{
        try {
            const res=await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`,{text},{
                headers:{
                    "Content-Type":"application/json"
                },
                withCredentials:true
            })
            if(res.data.success){
                const commentsOnPost=[...postComment,res.data.comment]
                setPostComment(commentsOnPost)
                const updatedComments=posts.map(p=> 
                    p._id=== post._id ? {...p,comments:commentsOnPost}: p )

                dispatch(setPosts(updatedComments))
                setText("")
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
        }
      }

      const bookmarkHandler=async()=>{
        try {
            const res=await axios.get(`http://localhost:8000/api/v1/post/${post._id}/bookmark` , {withCredentials:true})
            if(res.data.success){
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
        }
      }
  return (
    <div className='my-8 w-full max-w-sm mx-auto'>
        <div className='flex justify-between items-center '>
            <div className='flex items-center gap-2'>
                <Avatar>
                    <AvatarImage src={post.author.profilePicture} className='w-6 h-6' alt='Post_img'/>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className='flex items-center gap-3'>
                    <h1>{post.author.username}</h1>
                    {user._id === post.author._id && <Badge variant="secondary">Author</Badge>}
                </div>
            </div>
            <Dialog >
                <DialogTrigger asChild>
                    <MoreHorizontal className='cursor-pointer'/>
                </DialogTrigger>
                <DialogContent  className="flex flex-col items-center text-center text-sm" >
                    {post.author?._id !== user._id && <Button variant="ghost" className="cursor-pointer w-fit " >Unfollow</Button> }
                    
                    <Button variant="ghost" className="cursor-pointer w-fit " >Add to Favourites</Button>
                    {user && user._id === post.author._id &&
                        <Button variant="ghost" onClick={deletePostHandler} className="cursor-pointer w-fit text-red-500 font-semibold" >Delete</Button>
                    }
                    
                </DialogContent>
            </Dialog>
        </div>
        <img className='w-full rounded-sm aspect-square my-2 object-cover' src={post.image} alt="postimage" />
        
        <div className="items-center justify-between flex my-2">
            <div className='flex items-center gap-3'>
                <div onClick={likeOrDislikeHandler}>
                    
                    {!liked ? <FaRegHeart size={'22px'} className='cursor-pointer hover:text-gray-600'/> :<FaHeart size={'22px'} className='cursor-pointer hover:text-red-400 text-red-600'/>  }
                </div>
                <MessageCircle onClick={()=> {
                  dispatch(setSelectedPost(post));
                  setOpen(true)
                } } className='cursor-pointer hover:text-gray-600'/>
                <Send className='cursor-pointer hover:text-gray-600'/>
            </div>
            <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600'/>
        </div>
        <span className='font-medium block mb-2'>{post.likes.length} likes</span>
        <p>
            <span className='font-medium mr-2'>{post.author.username}</span>
            {post.caption}
        </p>

        {commentLength ? <span onClick={()=> {
                  dispatch(setSelectedPost(post));
                  setOpen(true)
                } } className='text-sm text-gray-400 cursor-pointer'>
        View all {commentLength} commments</span> : <span className='text-sm text-gray-400'>No comments on this post</span>}
        
        <CommentDialog open={open} setOpen={setOpen}/>
        <div className='flex items-center justify-between '>
            <input type="text" placeholder='Add a comment...' value={text} onChange={changeEventHandler} className='outline-none text-sm w-full' />
            {text && <span className='text-[#3BADF8] cursor-pointer' onClick={commentHandler}>Post</span>}
            
        </div>
    </div>

  )
}

export default Post
