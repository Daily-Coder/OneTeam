import { firestoreConfig } from "@/config/firestoreConfig";
import { useAuth } from "@/context/authContext";
import { addDoc, collection, doc, DocumentData, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";

export default function CompleteAdminProfile({setUserDetailsFetched,setUserDetails}:{setUserDetailsFetched:Dispatch<SetStateAction<boolean>>,setUserDetails:Dispatch<SetStateAction<DocumentData|null>>}){

    const {signOut}=useAuth()
    const {user}=useAuth();

    const [userCreds,setUserCreds]=useState({
        name:'',
        organizationName:''
    })
    const [processing,setProcessing]=useState<boolean>(false)
    const [errMesage,setErrorMessage]=useState<string|null>(null)
    async function completeAdminProfile() {
        if(processing) return;
        setProcessing(true)
        const instance=firestoreConfig.getInstance()
        try{
            const docSnap=await getDocs(query(collection(instance.getDb(),'Users'),where('organization_name','==',userCreds.organizationName),where('role','==','admin')))
            if(docSnap.docs.length > 0){
                setErrorMessage('Organization name already taken')
                return;
            }
            const payload={
                employee_id:user?.email,
                name:userCreds.name,
                organization_name:userCreds.organizationName,
                role:'admin',
                yearly_leaves:null,
                created_at:serverTimestamp(),
                joining_date:serverTimestamp(),
                temp:null,
                temp_role:null,
                current_status:null,
                personal_email:null,
                current_role:null,
                contact:null,
                address:null
            }
            await setDoc(doc(collection(instance.getDb(),'Users'),user?.uid),payload)
            const newPayload={
                ...payload,
                created_at:new Date(),
                joining_date:new Date()
            }
            setUserDetails(newPayload)
            setUserDetailsFetched(true)
        }
        catch(err){
            setProcessing(false)
            console.log("error while setting user data",err)
        }
    }

    return(
        <main className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F4F6F8' }}>
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                {/* Organization Image */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F4F6F8' }}>
                        <Image src="/assets/OneTeamlogoFinal.jpeg" alt="logo" width={100} height={100} />
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-bold text-center mb-6" style={{ color: '#0A66C2' }}>
                    Register Organisation
                </h1>

                {/* Full name and Organization Name Input */}
                <div className="mb-6">
                    <label htmlFor="orgName" className="block text-sm font-medium mb-2" style={{ color: '#0A66C2' }}>
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="orgName"
                        name="orgName"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200"
                        style={{ 
                            borderColor: '#F4F6F8',
                            backgroundColor: '#F4F6F8'
                        }}
                        placeholder="John Doe"
                        value={userCreds.name}
                        onChange={(e)=>{
                            setErrorMessage(null)
                            setUserCreds(prev=>({...prev,name:e.target.value}))
                        }}
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="orgName" className="block text-sm font-medium mb-2" style={{ color: '#0A66C2' }}>
                        Organization Name
                    </label>
                    <input
                        type="text"
                        id="orgName"
                        name="orgName"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200"
                        style={{ 
                            borderColor: '#F4F6F8',
                            backgroundColor: '#F4F6F8'
                        }}
                        placeholder="One Team"
                        value={userCreds.organizationName}
                        onChange={(e)=>{
                            setErrorMessage(null)
                            setUserCreds(prev=>({...prev,organizationName:e.target.value}))
                        }}
                    />
                </div>
                {
                    errMesage && <p className="text-right text-[12px] font-medium text-red-500 pb-3 ">{errMesage}</p>
                }

                {/* Register Button */}
                <button 
                    className="w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 mb-4 text-white"
                    style={{ backgroundColor: '#34A853' }}
                    onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#2d8f47'}
                    onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#34A853'}
                    onClick={completeAdminProfile}
                >
                    Register
                </button>

                {/* Switch Account Link */}
                <div className="text-center">
                    <p
                        className="underline transition-colors duration-200 cursor-pointer"
                        style={{ color: '#0A66C2' }}
                        onMouseOver={(e) => (e.target as HTMLElement).style.color = '#084a8f'}
                        onMouseOut={(e) => (e.target as HTMLElement).style.color = '#0A66C2'}
                        onClick={()=>{
                            signOut()
                        }}
                    >
                        Switch Account
                    </p>
                </div>
            </div>
        </main>
    )
}