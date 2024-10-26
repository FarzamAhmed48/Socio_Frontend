import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import store from '@/redux/store'
import useGetAllMessages from '@/hooks/useGetAllMessages'
import useGetRealTimeMessages from '@/hooks/useGetRealTimeMessages'

const Messages = ({selectedUser}) => {
  useGetRealTimeMessages()
  useGetAllMessages();
  const {user}=useSelector(store=>store.auth)
  const {messages}=useSelector(store=>store.chat)
  return (
    <div className='overflow-y-auto flex-1 p-4'>
      <div className='flex justify-center'>
        <div className='flex items-center flex-col justify-center'>
            <Avatar className="h-20 w-20 ">
                <AvatarImage src={selectedUser?.profilePicture} alt="Profiel"/>
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span>{selectedUser?.username}</span>
            <Link to={`/${selectedUser?._id}/profile`}>
                <Button className="h-8 my-2 " variant="secondary">View Profile</Button>
            </Link>
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        {
            messages&&messages.map((msg)=>{
                return (
                    <div key={msg._id} className={`flex ${user._id === msg.senderId ? "justify-end " : "justify-start"} `}>
                        <div className='bg-blue-400 w-fit py-1 px-3 rounded-lg'>{msg.message}</div>
                    </div>
                )
            })
        }
      </div>
    </div>
  )
}

export default Messages
