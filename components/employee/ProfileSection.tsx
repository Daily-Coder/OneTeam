'use client';

export default function ProfileSection() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-blue-700 mb-4">Profile Info</h2>
      <div className="space-y-2">
        <p><strong>Name:</strong> Gourav Singla</p>
        <p><strong>Role:</strong> Software Engineer</p>
        <p><strong>Email:</strong> gourav@example.com</p>
        <p><strong>Team:</strong> UI Team</p>
      </div>
    </div>
  );
}