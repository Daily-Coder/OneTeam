'use client';

import { useUser } from "@/context/userContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ClipboardCopy } from "lucide-react";

export default function ProfileSection() {
  const { userDetails } = useUser();

  const formatDate = (date: any) =>
    date?.toDate
      ? date.toDate().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white p-[2px] rounded-3xl shadow-lg max-w-4xl mx-auto mt-10">
      <div className="bg-white rounded-[22px] p-8 sm:p-10">
        {/* Header with Avatar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
          <div className="relative w-20 h-20">
            <Avatar className="w-full h-full ring-4 ring-blue-200 shadow-md">
              <AvatarFallback className="text-lg">
                {userDetails?.name?.[0] || "E"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
              {userDetails?.name || "—"}
            </h2>
            <p className="text-blue-600 font-medium mt-1">
              {userDetails?.current_role || userDetails?.role || "—"}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-200 mb-6" />

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 text-sm text-gray-700">
          <ProfileRow label="Email / Employee ID" value={userDetails?.employee_id || userDetails?.personal_email} copyable />
          <ProfileRow label="Team" value={userDetails?.team} />
          <ProfileRow label="Department" value={userDetails?.department} />
          <ProfileRow label="Status" value={userDetails?.current_status} highlightStatus />
          <ProfileRow label="Organization" value={userDetails?.organization_name} />
          <ProfileRow label="Joining Date" value={formatDate(userDetails?.joining_date)} />
          <ProfileRow label="Yearly Leaves" value={userDetails?.yearly_leaves?.toString()} />
        </div>
      </div>
    </div>
  );
}

function ProfileRow({
  label,
  value,
  copyable = false,
  highlightStatus = false,
}: {
  label: string;
  value: string | undefined;
  copyable?: boolean;
  highlightStatus?: boolean;
}) {
  const handleCopy = () => {
    if (value) navigator.clipboard.writeText(value);
  };

  return (
    <div className="flex items-start justify-between gap-3 group">
      <div>
        <p className="text-gray-500 font-medium mb-1">{label}</p>
        {highlightStatus ? (
          <span
            className={`inline-block text-xs px-2 py-1 rounded-full font-semibold transition ${
              value === "Active"
                ? "bg-green-100 text-green-700"
                : value === "Inactive"
                ? "bg-gray-100 text-gray-600"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {value || "—"}
          </span>
        ) : (
          <p className="text-gray-900 text-sm">{value || "—"}</p>
        )}
      </div>

      {copyable && value && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          title="Copy to clipboard"
          className="opacity-0 group-hover:opacity-100 transition"
        >
          <ClipboardCopy className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        </Button>
      )}
    </div>
  );
}