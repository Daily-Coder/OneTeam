import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react"


type IAdminRouteContext={
    activeRoute:string,
    setActiveRoute:Dispatch<SetStateAction<string>>
}

const AdminRouteContext=createContext<IAdminRouteContext>({
    activeRoute:'',
    setActiveRoute:()=>{throw new Error("function called outside provider")}
})


export function AdminRouteProvider({children}:{children:ReactNode}){
    const [activeRoute,setActiveRoute]=useState<string>('performance-matrix')
    
    
    return(
        <AdminRouteContext.Provider value={{activeRoute,setActiveRoute}}>
            {children}
        </AdminRouteContext.Provider>
    )
}


export function useAdminRoute(){
    return useContext(AdminRouteContext)
}