'use client';

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { adminRoutes } from "@/helper/adminHelper";
import { useAdminRoute } from "@/context/adminRouteContext";
import { useAuth } from "@/context/authContext";

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const {activeRoute,setActiveRoute}=useAdminRoute();
  const {signOut}=useAuth();

  return (
    <>
      {/* Mobile Navbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-white shadow-sm">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="font-bold text-lg mb-6">Admin Panel</div>
            <nav className="space-y-2">
              {adminRoutes.map((route, index) => {
                return (
                  <div className="px-5 py-3 rounded-md" onClick={() => setActiveRoute(route.value)}>
                    <route.icon />
                    <p>{route.title}</p>
                  </div>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="font-semibold text-lg">Admin Panel</div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r p-4 shadow-sm">
        <div className="font-bold text-xl mb-6">Admin Panel</div>
        <nav className="space-y-2 h-full flex flex-col justify-between ">
          <div>
            {adminRoutes.map((route, index) => {
            return (
              <div key={index} className="px-5 py-3 rounded-md flex gap-3 items-center" onClick={() => setActiveRoute(route.value)} style={{backgroundColor:activeRoute===route.value ? '#eeeeee':'inherit'}}>
                <route.icon size={24}/>
                <p>{route.title}</p>
              </div>
            )
          })}
          </div>
          <div className="border-t-[1px] border-[#ebebeb] cursor-pointer" onClick={()=>signOut()}>
            <p className="font-medium text-[18px] text-center py-3">SignOut</p>
          </div>
        </nav>
      </aside>


    </>
  );
}
