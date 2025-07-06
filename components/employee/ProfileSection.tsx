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
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 max-w-3xl mx-auto">
      {/* Header with Avatar */}
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-14 w-14">
          <AvatarFallback>
            {userDetails?.name?.[0] || "E"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold text-blue-700">{userDetails?.name || "—"}</h2>
          <p className="text-gray-500">{userDetails?.current_role || userDetails?.role || "—"}</p>
        </div>
      </div>

      {/* Grid Profile Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700">
        <ProfileRow label="Email / Employee ID" value={userDetails?.employee_id || userDetails?.personal_email} copyable />
        <ProfileRow label="Team" value={userDetails?.team} />
        <ProfileRow label="Department" value={userDetails?.department} />
        <ProfileRow label="Status" value={userDetails?.current_status} highlightStatus />
        <ProfileRow label="Organization" value={userDetails?.organization_name} />
        <ProfileRow label="Joining Date" value={formatDate(userDetails?.joining_date)} />
        <ProfileRow label="Yearly Leaves" value={userDetails?.yearly_leaves?.toString()} />
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
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="text-gray-500 font-medium">{label}</p>
        {highlightStatus ? (
          <span
            className={`inline-block mt-1 text-xs px-2 py-1 rounded-full font-semibold ${
              value === "Active"
                ? "bg-green-100 text-green-700"
                : value === "Inactive"
                ? "bg-gray-200 text-gray-600"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {value || "—"}
          </span>
        ) : (
          <p className="text-gray-800">{value || "—"}</p>
        )}
      </div>

      {copyable && value && (
        <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy to clipboard">
          <ClipboardCopy className="h-4 w-4 text-gray-500" />
        </Button>
      )}
    </div>
  );
}