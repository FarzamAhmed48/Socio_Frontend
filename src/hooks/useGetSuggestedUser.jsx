import { setSuggestedUsers } from "@/redux/authSlice"
import { setPosts } from "@/redux/postSlice"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const useGetSuggestedUsers=()=>{
    const dispatch=useDispatch()
    useEffect(()=>{
        const fetchSuggestedUsers=async ()=>{
            try {
                const res=await axios.get("http://localhost:8000/api/v1/users/suggestedUser",{withCredentials:true})
                if(res?.data?.success){
                    dispatch(setSuggestedUsers(res.data.suggestedUsers))
                    console.log(res.data.suggestedUsers)
                }
            } catch (error) {

                console.log(error)
            }
        }
        fetchSuggestedUsers()
    },[])
}
export default useGetSuggestedUsers;