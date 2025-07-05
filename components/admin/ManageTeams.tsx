'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Pencil, PlusCircle, Trash } from 'lucide-react';

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
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTeam ? 'Edit Team' : 'Add New Team'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Team Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                placeholder="Team Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleAddOrUpdate}>
                {editingTeam ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Teams List */}
      {teams.length === 0 ? (
        <div className="text-center mt-20 text-muted-foreground text-lg">
          No teams created yet. Click "Add New Team" to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{team.name}</h3>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(team)}>
                          <Pencil className="h-4 w-4 text-blue-600" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Team</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            placeholder="Team Name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                          />
                          <Input
                            placeholder="Team Description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                          />
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddOrUpdate}>Update</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(team.id)}
                    >
                      <Trash className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{team.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
