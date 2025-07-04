'use client'
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";



export default function AuthLayout({children}:{children:ReactNode}){
    const {user}=useAuth();
    const router=useRouter();
    const [loading,setLoading]=useState<boolean>(true)
    useEffect(()=>{
        if(user){
            router.replace("/dashboard")
        }
        else{
            setLoading(false)
        }
    },[user])


    return(
        loading ? <main className="w-full h-screen flex items-center justify-center">Loading...</main> :
        <>
            {children}
        </>
    )
}