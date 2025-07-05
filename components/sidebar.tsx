'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { href: "/admin-dashboard/dashboard", label: "Dashboard" },
  { href: "/admin-dashboard/employees", label: "Employees" },
  { href: "/admin-dashboard/teams", label: "Teams" },
  { href: "/admin-dashboard/leaves", label: "Leaves" },
  { href: "/admin-dashboard/tickets", label: "Tickets" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
              {sidebarLinks.map(({ href, label }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)}>
                  <Button
                    variant={pathname === href ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    {label}
                  </Button>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="font-semibold text-lg">Admin Panel</div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r p-4 shadow-sm">
        <div className="font-bold text-xl mb-6">Admin Panel</div>
        <nav className="space-y-2">
          {sidebarLinks.map(({ href, label }) => (
            <Link key={href} href={href}>
              <Button
                variant={pathname === href ? "secondary" : "ghost"}
                className={cn("w-full justify-start")}
              >
                {label}
              </Button>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
