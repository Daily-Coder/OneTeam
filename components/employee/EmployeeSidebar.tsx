'use client';
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

interface Props {
  active: string;
  setActive: (value: string) => void;
}

export default function EmployeeSidebar({ active, setActive }: Props) {
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <aside className="w-64 min-h-screen bg-white border-r p-4 flex flex-col justify-between">
      <nav className="space-y-2">
        <button onClick={() => setActive("checkin")} className={`w-full text-left px-4 py-2 rounded-md hover:bg-blue-100 ${active === "checkin" && "bg-blue-100 font-bold"}`}>
          Check-In/Out
        </button>
        <button onClick={() => setActive("teams")} className={`w-full text-left px-4 py-2 rounded-md hover:bg-blue-100 ${active === "teams" && "bg-blue-100 font-bold"}`}>
          Teams
        </button>
        <button onClick={() => setActive("profile")} className={`w-full text-left px-4 py-2 rounded-md hover:bg-blue-100 ${active === "profile" && "bg-blue-100 font-bold"}`}>
          Profile
        </button>
      </nav>

      <div className="border-t-[1px] border-[#ebebeb] cursor-pointer" onClick={() => signOut()}>
        <p className="font-medium text-[18px] text-center py-3">SignOut</p>
      </div>
    </aside>
  );
}