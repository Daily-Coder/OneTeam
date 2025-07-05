'use client';

import AdminSidebar from "@/components/admin/AdminSidebar";
import ManageApplications from "@/components/admin/ManageApplications";
import ManageEmployee from "@/components/admin/ManageEmployee";
import ManageTeams from "@/components/admin/ManageTeams";
import ManageTickets from "@/components/admin/ManageTickets";
import PerformanceAnalytics from "@/components/admin/PerformanceAnalytics";
import { useAdminRoute } from "@/context/adminRouteContext";




export default function AdminDashboard() {
  const { activeRoute } = useAdminRoute();

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64">
        <AdminSidebar />
      </div>

      <div className="flex-1 overflow-y-auto bg-[#f5f5f5]">
        {/* scrollable main content */}
        {activeRoute === 'performance-matrix' && <PerformanceAnalytics />}
        {activeRoute === 'manage-employees' && <ManageEmployee />}
        {activeRoute === 'manage-teams' && <ManageTeams />}
        {activeRoute === 'manage-tickets' && <ManageTickets />}
        {activeRoute === 'manage-applications' && <ManageApplications />}
      </div>
    </div>

  )
}
