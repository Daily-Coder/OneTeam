'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FilePlus, CheckCircle, ListChecks } from "lucide-react";

export default function ManageApplications() {
  return (
    <main className="min-h-screen w-full bg-muted p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Manage Applications</h1>
      </div>

      {/* Applications Summary */}
      <div className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
        <FilePlus className="h-5 w-5" />
        Applications Summary
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Applications</p>
            <p className="text-xl font-bold text-foreground">42</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending Applications</p>
            <p className="text-xl font-bold text-yellow-500">6</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Resolved Applications</p>
            <p className="text-xl font-bold text-green-600">36</p>
          </CardContent>
        </Card>
      </div>

      {/* Resolved Applications */}
      <div className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        Resolved Applications
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          { id: "APP-1201", type: "WFH Approval", date: "July 2, 2025" },
          { id: "APP-1187", type: "Leave Request", date: "June 28, 2025" },
          { id: "APP-1165", type: "Access Request", date: "June 20, 2025" },
        ].map((app) => (
          <Card key={app.id} className="shadow-sm">
            <CardContent className="p-4 space-y-1">
              <p className="text-md font-semibold text-foreground">
                {app.type} ({app.id})
              </p>
              <p className="text-sm text-muted-foreground">Resolved on: {app.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resolved Updates */}
      <div className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
        <ListChecks className="h-5 w-5" />
        Resolved Updates
      </div>

      <div className="space-y-4">
        {[
          {
            title: "Access Granted for GitHub Enterprise",
            description: "Admin has approved and provisioned access.",
            date: "June 20, 2025",
          },
          {
            title: "Leave Request Approved",
            description: "Your leave from June 25–27 is approved.",
            date: "June 24, 2025",
          },
          {
            title: "Work From Home Setup Complete",
            description: "WFH request for July 2 confirmed by IT.",
            date: "July 1, 2025",
          },
        ].map((update, idx) => (
          <Card key={idx} className="shadow-sm">
            <CardContent className="p-4 space-y-1">
              <p className="text-md font-medium text-foreground">{update.title}</p>
              <p className="text-sm text-muted-foreground">{update.description}</p>
              <p className="text-xs text-muted-foreground">{update.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
