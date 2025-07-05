'use client';

import { useAuth } from "@/context/authContext";
import { useState } from "react";
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

// Dummy Employee Data
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
  const { signOut } = useAuth();
  const [searchId, setSearchId] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("EMP001");

  const employee = employeeData[selectedId];

  return (
    <main className="min-h-screen w-full bg-muted p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome{employee ? `, ${employee.name} 👋` : ""}
        </h1>
        <Button
          onClick={signOut}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Sign Out
        </Button>
      </div>

      {/* Search Section */}
      <div className="flex gap-4 items-center mb-8">
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
      </div>

      {/* Conditional Rendering */}
      {employee ? (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {employee.stats.map(({ icon: Icon, label, value }) => (
              <Card key={label} className="shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-xl font-bold text-foreground">{value}</p>
                  </div>
                  <Icon className="h-6 w-6 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Activity Feed */}
          <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Activity className="h-5 w-5" />
            Recent Activity
          </div>

          <div className="space-y-4">
            {employee.activities.map((act, index) => (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-4 space-y-1">
                  <p className="text-md font-medium text-foreground">{act.title}</p>
                  <p className="text-sm text-muted-foreground">{act.description}</p>
                  <p className="text-xs text-muted-foreground">{act.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center text-muted-foreground mt-12 text-lg">
          No data found for <span className="font-semibold">{searchId}</span>
        </div>
      )}
    </main>
  );
}
