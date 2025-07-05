'use client'

import { firebaseConfig } from "@/config/fbConfig"
import { onAuthStateChanged, User } from "firebase/auth"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { FirebaseError } from "firebase/app"


type IAuthContext = {
    user: User | null,
    signinWithEmailPass: (email: string, pass: string) => void,
    signInError:FirebaseError|null,
    signOut:()=>void
}

const AuthContext = createContext<IAuthContext>({
    user: null,
    signinWithEmailPass: () => { throw new Error("function called outside provider") },
    signInError:null,
    signOut:() => { throw new Error("function called outside provider") }
})

export function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(null)
    const [signInError,setSignInError]=useState<FirebaseError|null>(null)
    const [loading,setLoading]=useState<boolean>(true)
    function signinWithEmailPass(email: string, pass: string) {
        const instance=firebaseConfig.getInstance();
        signInWithEmailAndPassword(instance.getAuth(),email,pass)
        .catch(err=>{
            setSignInError(err)
        })
    }
    async function signOut(){
        const instance=firebaseConfig.getInstance()
        await instance.getAuth().signOut()
    }
    useEffect(()=>{
        const instance=firebaseConfig.getInstance();
        onAuthStateChanged(instance.getAuth(),data=>{
            if(data){
                setUser(data)
            }
            else{
                setUser(null)
            }
            setLoading(false)
        })
    },[onAuthStateChanged])

    return (
        loading ? <main className="w-full h-screen flex items-center justify-center">Loading...</main> :
        <AuthContext.Provider value={{ user, signinWithEmailPass,signInError,signOut }}>
            {children}
        </AuthContext.Provider>
    )
}



export function useAuth(){
    return useContext(AuthContext)
}