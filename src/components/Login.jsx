import React, { useEffect, useState } from 'react'
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import socio from "../assets/socio.io.jpg"
const Login = () => {
    const [input,setInput]=useState({
        email:"",
        password:""
    })
    const [loading,setLoading]=useState(false)
    const {user}=useSelector(store=>store.auth)
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const changeEventHandler=(e)=>{
        setInput({...input,[e.target.name]:e.target.value})
    }

    const signupHandler=async(e)=>{
        e.preventDefault()
        try {
            setLoading(true)
            const res=await axios.post("http://localhost:8000/api/v1/users/login",input,{
                headers:{
                    "Content-Type":"application/json"
                },
                withCredentials:true
            })
            if (res.data.success){
                navigate("/")
                dispatch(setAuthUser(res.data.user))
                console.log(res.data.success)
                toast.success(res.data.message)
                setInput({
                    email:"",
                    password:""
                })
            }

        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message)
        }
        finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        if(user){
            navigate('/')
        }
    },[])
  return (
    <div className='flex items-center justify-center w-screen h-screen ' style={{backgroundImage:`url(${socio})`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat"}}>
      <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8 bg-slate-800/70 text-white'>
        <div className='my-4'>
            <h1 className='text-center font-bold text-xl'> Logo</h1>
            <p className='text-center text-sm'>Login too see phots and videos from your friends</p>
        </div>
        <div>
            <Label>Email</Label>
            <Input type="email" onChange={changeEventHandler} placeholder="Enter your email" name="email" value={input.email} className="focus-visible:ring-transparent my-2 text-black"/>
        </div>
        <div>
            <Label>Password</Label>
            <Input type="password" onChange={changeEventHandler} name="password" placeholder="Enter password" value={input.password} className="focus-visible:ring-transparent my-2 text-black"/>
        </div>
        <Button type="submit">Login</Button>
        <span className='text-center'>Don't have an account? <Link className='text-blue-600' to="/signup">SignUp</Link></span>
      </form>
    </div>
  )
}

export default Login;
