'use client'

import { useAuth } from "@/context/authContext"

export default function AdminDashboard(){
    const {signOut}=useAuth();

    return(
        <main className="p-10">
            This is admin dashboard
            <button className="bg-blue-600 text-white font-bold px-7 py-3 rounded-md mx-10" onClick={()=>signOut()}>SignOut</button>
        </main>
    )
}