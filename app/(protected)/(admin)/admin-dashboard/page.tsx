'use client';

import Sidebar from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Briefcase, Calendar, Ticket } from "lucide-react";

const stats = [
  { icon: Users, label: "Employees", value: "125" },
  { icon: Briefcase, label: "Teams", value: "10" },
  { icon: Calendar, label: "Leaves Pending", value: "18" },
  { icon: Ticket, label: "Open Tickets", value: "5" },
];

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-muted p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, label, value }) => (
            <Card key={label} className="shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-xl font-bold">{value}</p>
                </div>
                <Icon className="h-6 w-6 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )}
