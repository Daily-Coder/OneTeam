'use client';

import Sidebar from "@/components/admin/AdminSidebar";
import ManageApplications from "@/components/admin/ManageApplications";
import ManageEmployee from "@/components/admin/ManageEmployee";
import ManageTeams from "@/components/admin/ManageTeams";
import ManageTickets from "@/components/admin/ManageTickets";
import PerformanceAnalytics from "@/components/admin/PerformanceAnalytics";
import { useAdminRoute } from "@/context/adminRouteContext";




export default function AdminDashboard() {
  const {activeRoute}=useAdminRoute();

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {
        activeRoute==='performance-matrix' && <PerformanceAnalytics/>
      }
      {
        activeRoute==='manage-employees' && <ManageEmployee/>
      }
      {
        activeRoute==='manage-teams' && <ManageTeams/>
      }
      {
        activeRoute==='manage-tickets' && <ManageTickets/>
      }
      {
        activeRoute==='manage-applications' && <ManageApplications/>
      }
    </div>
  )}
