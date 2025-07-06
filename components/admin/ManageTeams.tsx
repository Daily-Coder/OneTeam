'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Pencil, PlusCircle, Trash, Users, Calendar, RefreshCw, Folder } from 'lucide-react';
import AddNewTeam from './manageTeams/AddNewTeam';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestoreConfig } from '@/config/firestoreConfig';
import { useUser } from '@/context/userContext';

type Team = {
  id: string;
  organization_name: string;
  team_name: string;
  team_lead: string;
  team_members: string[];
  created_at: any;
  project_description: string;
  department: string;
  deadline: any;
  updated_at: any;
  project_status: string;
};

export default function ManageTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  
  const { userDetails } = useUser();

  // Fetch teams from Firebase when component mounts
  useEffect(() => {
    const fetchTeams = async () => {
      if (!userDetails?.organization_name) {
        setError('Organization name not available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const instance = firestoreConfig.getInstance();
        const teamsQuery = query(
          collection(instance.getDb(), 'Teams'),
          where('organization_name', '==', userDetails.organization_name)
        );
        
        const querySnapshot = await getDocs(teamsQuery);
        const teamsData: Team[] = [];
        
        querySnapshot.forEach((doc) => {
          teamsData.push({
            id: doc.id,
            ...doc.data()
          } as Team);
        });
        
        setTeams(teamsData);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch teams');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [userDetails?.organization_name]);

  const handleRefresh = async () => {
    if (!userDetails?.organization_name) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const instance = firestoreConfig.getInstance();
      const teamsQuery = query(
        collection(instance.getDb(), 'Teams'),
        where('organization_name', '==', userDetails.organization_name)
      );
      
      const querySnapshot = await getDocs(teamsQuery);
      const teamsData: Team[] = [];
      
      querySnapshot.forEach((doc) => {
        teamsData.push({
          id: doc.id,
          ...doc.data()
        } as Team);
      });
      
      setTeams(teamsData);
    } catch (err) {
      console.error('Error refreshing teams:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh teams');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setForm({ name: team.team_name, description: team.project_description });
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality with Firebase
    console.log('Delete team with id:', id);
  };

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-muted p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading teams...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen w-full bg-muted p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Manage Teams</h1>
          <AddNewTeam />
        </div>
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-muted p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Manage Teams</h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <AddNewTeam />
        </div>
      </div>

      {/* Teams List */}
      {teams.length === 0 ? (
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="text-center">
              <Folder className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Teams Found</h3>
              <p className="text-gray-600 mb-4">No teams have been created yet. Click "Add New Team" to get started.</p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  {team.team_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Team Lead</p>
                  <p className="font-medium">{team.team_lead}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium">{team.department}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Members</p>
                  <p className="font-medium">{team.team_members.length} members</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    team.project_status === 'initialization' ? 'bg-blue-100 text-blue-800' :
                    team.project_status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    team.project_status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {team.project_status}
                  </span>
                </div>
                
                {team.deadline && (
                  <div>
                    <p className="text-sm text-gray-600">Deadline</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {team.deadline.toDate ? 
                        team.deadline.toDate().toLocaleDateString() : 
                        new Date(team.deadline).toLocaleDateString()
                      }
                    </p>
                  </div>
                )}
                
                {team.project_description && (
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-sm line-clamp-2">{team.project_description}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(team)}
                    className="flex-1"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(team.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Team Dialog */}
      <Dialog open={!!editingTeam} onOpenChange={() => setEditingTeam(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Team Name</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter team name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter team description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTeam(null)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // TODO: Implement update functionality with Firebase
              console.log('Update team:', editingTeam?.id, form);
              setEditingTeam(null);
              setForm({ name: '', description: '' });
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
