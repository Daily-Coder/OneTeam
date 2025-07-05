'use client'
import Loading from "@/components/basic/loading";
import { useAuth } from "@/context/authContext";
import { UserProvider } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";



export default function ProtectedLayout({children}:{children:ReactNode}){
    const {user}=useAuth();
    const router=useRouter();
    const [loading,setLoading]=useState<boolean>(true)
    useEffect(()=>{
        if(!user){
            router.replace("/signin")
        }
        else{
            setLoading(false)
        }
    },[user])


    return(
        loading ? <Loading/> :
        <>
        <UserProvider>
            {children}
        </UserProvider>
        </>
    )
}