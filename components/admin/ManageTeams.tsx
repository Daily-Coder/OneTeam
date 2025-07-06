'use client';

import { useState } from 'react';
import AddNewTeam from './manageTeams/AddNewTeam';

type Team = {
  id: number;
  name: string;
  description: string;
};

export default function ManageTeams() {
  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: 'Frontend Team', description: 'Handles UI/UX development' },
    { id: 2, name: 'Backend Team', description: 'Manages server and APIs' },
  ]);

  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const handleAddOrUpdate = () => {
    if (editingTeam) {
      // Update existing team
      setTeams((prev) =>
        prev.map((team) =>
          team.id === editingTeam.id ? { ...team, ...form } : team
        )
      );
    } else {
      // Add new team
      const newTeam: Team = {
        id: Date.now(),
        name: form.name,
        description: form.description,
      };
      setTeams((prev) => [...prev, newTeam]);
    }

    // Reset state
    setForm({ name: '', description: '' });
    setEditingTeam(null);
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setForm({ name: team.name, description: team.description });
  };

  const handleDelete = (id: number) => {
    setTeams((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <main className="min-h-screen w-full bg-muted p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Manage Teams</h1>
        <AddNewTeam/>
      </div>

      {/* Teams List */}
      {teams.length === 0 ? (
        <div className="text-center mt-20 text-muted-foreground text-lg">
          No teams created yet. Click "Add New Team" to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
        </div>
      )}
    </main>
  );
}
