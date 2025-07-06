'use client';
import { useAuth } from "@/context/authContext";
// import { useRouter } from "next/navigation";
import { Clock, Users, User, LogOut, CalendarDays, Ticket } from "lucide-react";

interface Props {
  active: string;
  setActive: (value: string) => void;
}

export default function EmployeeSidebar({ active, setActive }: Props) {
  const { signOut } = useAuth();
  // const router = useRouter();

  return (
    <aside className="w-64 min-h-screen bg-white border-r p-4 flex flex-col justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-800 mb-6 px-2">Employee Panel</h1>
        <nav className="space-y-2">
          <button onClick={() => setActive("checkin")} className={`w-full text-left px-4 py-2 rounded-md hover:bg-blue-100 flex items-center gap-3 ${active === "checkin" && "bg-blue-100"}`}>
            <Clock className="w-5 h-5" />
            Check-In/Out
          </button>
          <button onClick={() => setActive("teams")} className={`w-full text-left px-4 py-2 rounded-md hover:bg-blue-100 flex items-center gap-3 ${active === "teams" && "bg-blue-100 "}`}>
            <Users className="w-5 h-5" />
            Teams
          </button>
          <button onClick={() => setActive("profile")} className={`w-full text-left px-4 py-2 rounded-md hover:bg-blue-100 flex items-center gap-3 ${active === "profile" && "bg-blue-100"}`}>
            <User className="w-5 h-5" />
            Profile
          </button>
          <button onClick={() => setActive("leave")} className={`w-full text-left px-4 py-2 rounded-md hover:bg-blue-100 flex items-center gap-3 ${active === "leave" && "bg-blue-100 "}`}>
            <CalendarDays className="w-5 h-5" />
            Leave
          </button>
          <button onClick={() => setActive("tickets")} className={`w-full text-left px-4 py-2 rounded-md hover:bg-blue-100 flex items-center gap-3 ${active === "tickets" && "bg-blue-100"}`}>
            <Ticket className="w-5 h-5" />
            Tickets
          </button>
        </nav>
      </div>

      <div className="border-t-[1px] border-[#ebebeb] cursor-pointer" onClick={() => signOut()}>
        <div className="flex items-center gap-3 px-2 py-3 hover:bg-red-50 rounded-md">
          <LogOut className="w-5 h-5 text-red-600" />
          <p className="font-medium text-[18px] text-red-600">SignOut</p>
        </div>
      </div>
    </aside>
  );
}