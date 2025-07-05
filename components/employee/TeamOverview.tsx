'use client';

const teams = [
  { id: 1, name: "UI Team", manager: "Raj Mehra", members: 5 },
  { id: 2, name: "API Team", manager: "Sonal Gupta", members: 4 },
];

export default function TeamOverview() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-blue-700 mb-4">Your Teams</h2>
      <ul className="space-y-3">
        {teams.map(team => (
          <li key={team.id} className="border rounded-md p-4 bg-blue-50">
            <h3 className="font-semibold">{team.name}</h3>
            <p className="text-sm">Manager: {team.manager}</p>
            <p className="text-sm">Members: {team.members}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}