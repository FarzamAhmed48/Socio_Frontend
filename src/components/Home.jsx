import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import SiderightBar from './SiderightBar'
import useGetAllPosts from '@/hooks/useGetAllPosts'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUser'
import useGetAllMessages from '@/hooks/useGetAllMessages'

const Home = () => {
  
  useGetAllPosts();
  useGetSuggestedUsers();
  return (
    <div className='flex overflow-x-hidden w-full justify-evenly '>
      <div>
        <Outlet/>
      </div>
      <div className=''>
        <Feed/>
      </div>
      <div>
        <SiderightBar/>
      </div>
    </div>
  )
}

export default Home
