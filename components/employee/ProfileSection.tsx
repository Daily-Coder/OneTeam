'use client';

import { useUser } from "@/context/userContext";

export default function ProfileSection() {
  const { userDetails } = useUser();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 border-b pb-2">Profile Information</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700">
        <ProfileRow label="Name" value={userDetails?.name} />
        <ProfileRow label="Role" value={userDetails?.current_role || userDetails?.role} />
        <ProfileRow label="Email" value={userDetails?.employee_id || userDetails?.personal_email} />
        <ProfileRow label="Team" value={userDetails?.team || '—'} />
        <ProfileRow label="Department" value={userDetails?.department || '—'} />
        <ProfileRow label="Status" value={userDetails?.current_status || '—'} />
        <ProfileRow label="Organization" value={userDetails?.organization_name} />
        <ProfileRow
          label="Joining Date"
          value={
            userDetails?.joining_date
              ? userDetails.joining_date.toDate().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : '—'
          }
        />
        <ProfileRow label="Yearly Leaves" value={userDetails?.yearly_leaves?.toString() || '—'} />
      </div>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div>
      <p className="text-gray-500 font-medium">{label}</p>
      <p className="text-gray-800">{value || '—'}</p>
    </div>
  );
}
