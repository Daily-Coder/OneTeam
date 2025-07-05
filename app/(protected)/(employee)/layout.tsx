'use client'
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function EmployeeLayout({children}:{children:ReactNode}){


    const {userDetails}=useUser()
    const [loading,setLoading]=useState<boolean>(false)
    const router=useRouter()

    useEffect(()=>{
        if(userDetails && userDetails.role=='admin'){
            router.replace("/admin-dashboard");
        }
        else{
            setLoading(false)
        }
    },[userDetails])
    return(
        loading ? <main className="w-full h-screen flex items-center justify-center">Loading...</main> :
        <>
            {children}
        </>
    )
}