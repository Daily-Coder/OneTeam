import { Skeleton } from "@/components/ui/skeleton";

export default function AddEmployeeLoader(){
    return(
        <div className="w-full">
            <Skeleton className="w-[40%] h-[20px]"/>
        </div>
    )
}