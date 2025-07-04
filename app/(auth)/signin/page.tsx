'use client'
import { useAuth } from "@/context/authContext"
import { useState } from "react";

export default function SignIn(){

    const { signinWithEmailPass,signInError }=useAuth();
    const [userCreds,setUserCreds]=useState({
        email:'sahayaksharma6@gmail.com',
        pass:'123456'
    })
    return(
        <main>
            <p>{signInError}</p>
            <input type="text" placeholder="Enter your email id" />
            <button onClick={()=>{
                signinWithEmailPass(userCreds.email,userCreds.pass)
            }}>SignIn</button>
        </main>
    )
}