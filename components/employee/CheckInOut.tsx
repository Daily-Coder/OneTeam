'use client';

import { useState } from "react";

export default function CheckInOut() {
  const [status, setStatus] = useState("Not Checked In");

  const handleCheckIn = () => setStatus("Checked In");
  const handleCheckOut = () => setStatus("Checked Out");

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-blue-700">Check-In / Check-Out</h2>
      <p className="mb-4">Current Status: <span className="font-semibold">{status}</span></p>

      <div className="flex gap-4">
        <button onClick={handleCheckIn} className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600">
          Check In
        </button>
        <button onClick={handleCheckOut} className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600">
          Check Out
        </button>
      </div>
    </div>
  );
}