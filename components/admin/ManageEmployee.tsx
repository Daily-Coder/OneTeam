'use client';

import { useAuth } from "@/context/authContext";
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarCheck,
  BarChart2,
  Ticket,
  LucideIcon,
  Users,
} from "lucide-react";
import { useUser } from "@/context/userContext";
import { collection, DocumentData, getDocs, query, where } from "firebase/firestore";
import { firestoreConfig } from "@/config/firestoreConfig";
import AddNewEmployee from "./manageEmployee/AddNewEmployee";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

// type DepartmentData = {
//   name: string;
//   count: number;
// };

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

// Colors for the chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

export default function EmployeeDashboard() {
  // const [searchId, setSearchId] = useState<string>("");
  // const [selectedId, setSelectedId] = useState<string>("EMP001");
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
        alert("something went wrong");
        console.log(err);
      }
    })()
  },[])

  // Process employees data to get department statistics
  const departmentData = useMemo(() => {
    const departmentCount: Record<string, number> = {};
    
    employees.forEach(employee => {
      const department = employee.department || 'Unknown Department';
      departmentCount[department] = (departmentCount[department] || 0) + 1;
    });

    return Object.entries(departmentCount).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count); // Sort by count descending
  }, [employees]);

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

      <div className="w-full flex justify-end mb-6">
        <AddNewEmployee/>
      </div>

      {/* Department Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Employees by Department (Bar Chart)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {employeesFetched && departmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value} employees`, 'Count']}
                    labelFormatter={(label: string) => `Department: ${label}`}
                  />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                {employeesFetched ? 'No employees found' : 'Loading employees...'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5" />
              Department Distribution (Pie Chart)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {employeesFetched && departmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value} employees`, 'Count']}
                    labelFormatter={(label: string) => `Department: ${label}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                {employeesFetched ? 'No employees found' : 'Loading employees...'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Department Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {departmentData.map((dept, index) => (
          <Card key={dept.name} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{dept.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{dept.count}</p>
                  <p className="text-xs text-gray-500">employees</p>
                </div>
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: COLORS[index % COLORS.length] + '20' }}
                >
                  <Users 
                    className="w-6 h-6" 
                    style={{ color: COLORS[index % COLORS.length] }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
