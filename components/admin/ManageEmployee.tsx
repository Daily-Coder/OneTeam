'use client';

import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarCheck,
  BarChart2,
  Ticket,
  Activity,
  LucideIcon,
} from "lucide-react";
import { useUser } from "@/context/userContext";
import { collection, DocumentData, getDocs, query, where } from "firebase/firestore";
import { firestoreConfig } from "@/config/firestoreConfig";
import AddNewEmployee from "./manageEmployee/AddNewEmployee";

// Types
type Stat = {
  icon: LucideIcon;
  label: string;
  value: string;
};

type ActivityLog = {
  title: string;
  description: string;
  date: string;
};

type EmployeeProfile = {
  name: string;
  stats: Stat[];
  activities: ActivityLog[];
};

const employeeData: Record<string, EmployeeProfile> = {
  EMP001: {
    name: "Gourav",
    stats: [
      { icon: CalendarCheck, label: "Leaves Taken", value: "8 / 24" },
      { icon: BarChart2, label: "Performance Score", value: "92%" },
      { icon: Ticket, label: "Tickets Raised", value: "3" },
    ],
    activities: [
      {
        title: "Leave Approved",
        description: "Your leave request from July 3–5 was approved.",
        date: "July 1, 2025",
      },
      {
        title: "Ticket Resolved",
        description: "Laptop issue resolved by IT support.",
        date: "June 29, 2025",
      },
    ],
  },
  EMP002: {
    name: "Aarav",
    stats: [
      { icon: CalendarCheck, label: "Leaves Taken", value: "12 / 24" },
      { icon: BarChart2, label: "Performance Score", value: "88%" },
      { icon: Ticket, label: "Tickets Raised", value: "1" },
    ],
    activities: [
      {
        title: "Performance Updated",
        description: "Q2 review completed by manager.",
        date: "June 28, 2025",
      },
    ],
  },
};

export default function EmployeeDashboard() {
  const [searchId, setSearchId] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("EMP001");
  const {userDetails}=useUser();
  const [employees,setEmployees]=useState<DocumentData[]>([])
  const [employeesFetched,setEmployeesFetched]=useState<boolean>(false)
  const {user}=useAuth();

  useEffect(()=>{
    (async()=>{
      const instance=firestoreConfig.getInstance()
      try{
        const docSnap=await getDocs(query(collection(instance.getDb(),'Users'),where('organization_name','==',userDetails?.organization_name)))
        const temp:DocumentData[]=[]
        docSnap.docs.map(doc=>{
          if(doc.id!=user?.uid){
            temp.push({id:doc.id,...doc.data()})
          }
        })
        setEmployees(temp)
        setEmployeesFetched(true)
      }
      catch(err){
        alert("something went wrong")
      }
    })()
  },[])

  return (
    <main className="min-h-screen w-full bg-muted p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome {userDetails?.name.split(" ")[0]} 👋
        </h1>
      </div>

      {/* <div className="flex gap-4 items-center mb-8">
        <Input
          type="text"
          placeholder="Enter Employee ID (e.g., EMP001)"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="max-w-sm"
        />
        <Button
          onClick={() => setSelectedId(searchId.toUpperCase())}
          disabled={!searchId}
        >
          Search
        </Button>
      </div> */}

      <div className="w-full flex justify-end">
        <AddNewEmployee/>
      </div>
    </main>
  );
}
