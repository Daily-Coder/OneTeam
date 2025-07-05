'use client'
import Loading from "@/components/basic/loading";
import { AdminRouteProvider } from "@/context/adminRouteContext";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {


    const { userDetails } = useUser()
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        if (userDetails && userDetails.role != 'admin') {
            router.replace("/dashboard");
        }
        else {
            setLoading(false)
        }
    }, [userDetails])
    return (
        loading ? <Loading /> :
            <>
                <AdminRouteProvider>
                    {children}
                </AdminRouteProvider>
            </>
    )
}