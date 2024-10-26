import { setMessages } from "@/redux/chatSlice"
import { setPosts } from "@/redux/postSlice"
import store from "@/redux/store"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const useGetAllMessages=()=>{
    const {selectedUser}=useSelector(store=>store.auth)
    const dispatch=useDispatch()
    useEffect(()=>{
        const fetchAllMessages=async ()=>{
            try {
                const res=await axios.get(`http://localhost:8000/api/v1/message/all/${selectedUser?._id}`,{withCredentials:true})
                if(res?.data?.success){
                    dispatch(setMessages(res.data.message))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllMessages()
    },[selectedUser])
}
export default useGetAllMessages;