'use client'
import { firestoreConfig } from "@/config/firestoreConfig";
import { collection, doc, DocumentData, getDoc } from "firebase/firestore"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { useAuth } from "./authContext";


type IUserContext={
    userDetails:DocumentData|null,
}


const UserContext=createContext<IUserContext>({
    userDetails:null
})


export function UserProvider({children}:{children:ReactNode}){


    const [userDetails,setUserDetails]=useState<DocumentData|null>(null);
    const [userDetailsFetched,setUserDetailsFetched]=useState<boolean>(false);
    const {user}=useAuth();

    useEffect(()=>{
        (async()=>{
            const instance=firestoreConfig.getInstance()
            try{
                const query=await getDoc(doc(collection(instance.getDb(),'Users'),user?.uid));
                if(query.exists()){
                    setUserDetails(query.data())
                }
            }
            catch(err){
                console.log("error while fetching user details",err)
            }
            finally{
                setUserDetailsFetched(true)
            }
        })()
    },[])

    return(
        !userDetailsFetched ? <main>Fetching User Details...</main> : 
        userDetails==null ? <main>Give your details first</main> :
        <UserContext.Provider value={{userDetails}}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser(){
    return useContext(UserContext)
}