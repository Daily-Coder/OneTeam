'use client';

import { useEffect, useState } from "react";
import {
  Users,
  Briefcase,
  Calendar,
  Ticket,
} from "lucide-react";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestoreConfig } from "@/config/firestoreConfig";
import { useUser } from "@/context/userContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Type for team object
type Team = {
  id: string;
  team_name: string;
  project_description: string;
  project_status: string;
};

export default function PerformanceAnalytics() {
  const [stats, setStats] = useState([
    { icon: Users, label: "Employees", value: "..." },
    { icon: Briefcase, label: "Teams", value: "..." },
    { icon: Calendar, label: "Leaves Pending", value: "..." },
    { icon: Ticket, label: "Open Tickets", value: "..." },
  ]);

  const [teams, setTeams] = useState<Team[]>([]);
  const { userDetails } = useUser();

  const COLORS = ['#3b82f6', '#facc15', '#10b981']; // blue, yellow, green

  useEffect(() => {
    const fetchStats = async () => {
      if (!userDetails?.organization_name) return;

      const instance = firestoreConfig.getInstance();
      const org = userDetails.organization_name;

      try {
        const [employeeSnap, teamSnap, leaveSnap, ticketSnap] = await Promise.all([
          getDocs(query(collection(instance.getDb(), "Users"), where("organization_name", "==", org))),
          getDocs(query(collection(instance.getDb(), "Teams"), where("organization_name", "==", org))),
          getDocs(query(collection(instance.getDb(), "leaves"), where("organization_name", "==", org))),
          getDocs(query(collection(instance.getDb(), "tickets"), where("organization_name", "==", org))),
        ]);

        const employees = employeeSnap.docs.map(doc => doc.data());
        const teamDocs = teamSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Team[];
        const leaves = leaveSnap.docs.map(doc => doc.data());
        const tickets = ticketSnap.docs.map(doc => doc.data());

        setTeams(teamDocs);

        setStats([
          { icon: Users, label: "Employees", value: employees.length.toString() },
          { icon: Briefcase, label: "Teams", value: teamDocs.length.toString() },
          {
            icon: Calendar,
            label: "Leaves Pending",
            value: leaves.filter(l => l.status === "pending").length.toString(),
          },
          {
            icon: Ticket,
            label: "Open Tickets",
            value: tickets.filter(t => t.status !== "resolved").length.toString(),
          },
        ]);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, [userDetails?.organization_name]);

  const chartData = [
    {
      name: "Initialization",
      value: teams.filter((t) => t.project_status === "initialization").length,
    },
    {
      name: "In-Progress",
      value: teams.filter((t) => t.project_status === "in-progress").length,
    },
    {
      name: "Completed",
      value: teams.filter((t) => t.project_status === "completed").length,
    },
  ];

  return (
    <main className="flex-1 bg-muted p-6">
      <h1 className="text-2xl font-bold mb-6">Performance Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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

      {/* Pie Chart */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Team Status Distribution</h2>
        <div className="w-full h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Teams by Status */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Teams by Status</h2>
        {['initialization', 'in-progress', 'completed'].map((status) => (
          <div key={status} className="mb-6">
            <h3 className="text-md font-semibold mb-2 capitalize">
              {status.replace('-', ' ')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams
                .filter((team) => team.project_status === status)
                .map((team) => (
                  <Card key={team.id} className="shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-md font-semibold">{team.team_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {team.project_description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
