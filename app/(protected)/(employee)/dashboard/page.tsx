'use client';

import EmployeeSidebar from "@/components/employee/EmployeeSidebar";
import CheckInOut from "@/components/employee/CheckInOut";
import TeamOverview from "@/components/employee/TeamOverview";
import ProfileSection from "@/components/employee/ProfileSection";
import LeaveSection from "@/components/employee/LeaveSection"
import { useState } from "react";
import TicketsSection from "@/components/employee/TicketsSection";

export default function EmployeeDashboard() {
  const [activeSection, setActiveSection] = useState("checkin");

  return (
    <div className="flex min-h-screen bg-muted">
      <EmployeeSidebar active={activeSection} setActive={setActiveSection} />

      <main className="flex-1 p-6">
        {activeSection === "checkin" && <CheckInOut />}
        {activeSection === "teams" && <TeamOverview />}
        {activeSection === "profile" && <ProfileSection />}
        {activeSection === "leave" && <LeaveSection/>}
        {activeSection === "tickets" && <TicketsSection/>}
      </main>
    </div>
  );
}