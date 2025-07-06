'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Pencil, PlusCircle, Trash, Users, Calendar, RefreshCw, Folder, Crown, Building2, Target, Clock } from 'lucide-react';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'initialization':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'in-progress':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'completed':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getDeadlineStatus = (deadline: any) => {
    if (!deadline) return { status: 'No deadline', color: 'text-gray-500' };
    
    const deadlineDate = deadline.toDate ? deadline.toDate() : new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'Overdue', color: 'text-red-600' };
    } else if (diffDays === 0) {
      return { status: 'Due today', color: 'text-orange-600' };
    } else if (diffDays <= 7) {
      return { status: `${diffDays} days left`, color: 'text-yellow-600' };
    } else {
      return { status: `${diffDays} days left`, color: 'text-green-600' };
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <span className="ml-4 text-lg font-medium text-gray-700">Loading teams...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Teams</h1>
          <AddNewTeam />
        </div>
        <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Teams</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <Button onClick={handleRefresh} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Teams</h1>
          <p className="text-gray-600">Manage and organize your project teams</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleRefresh} variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <AddNewTeam />
        </div>
      </div>

      {/* Teams List */}
      {teams.length === 0 ? (
        <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Folder className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Teams Found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Get started by creating your first team. Teams help organize your projects and collaborate effectively.
              </p>
              <Button onClick={handleRefresh} variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => {
            const deadlineStatus = getDeadlineStatus(team.deadline);
            return (
              <Card key={team.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
                  <div className="absolute top-4 right-4 opacity-20">
                    <Users className="w-12 h-12" />
                  </div>
                  <CardTitle className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    {team.team_name}
                  </CardTitle>
                  <p className="text-blue-100 text-sm">{team.department}</p>
                </div>

                <CardContent className="p-6 space-y-4">
                  {/* Team Lead */}
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-amber-600 font-medium">Team Lead</p>
                      <p className="font-semibold text-gray-800">{team.team_lead}</p>
                    </div>
                  </div>

                  {/* Members Count */}
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 font-medium">Members</p>
                      <p className="font-semibold text-gray-800">{team.team_members.length} people</p>
                    </div>
                  </div>

                  {/* Project Status */}
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-green-600 font-medium">Status</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(team.project_status)}`}>
                        {team.project_status}
                      </span>
                    </div>
                  </div>

                  {/* Deadline */}
                  {team.deadline && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-purple-600 font-medium">Deadline</p>
                        <p className={`font-semibold ${deadlineStatus.color}`}>
                          {team.deadline.toDate ? 
                            team.deadline.toDate().toLocaleDateString() : 
                            new Date(team.deadline).toLocaleDateString()
                          }
                        </p>
                        <p className={`text-xs ${deadlineStatus.color}`}>{deadlineStatus.status}</p>
                      </div>
                    </div>
                  )}

                  {/* Project Description */}
                  {team.project_description && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-600 font-medium mb-1">Description</p>
                      <p className="text-sm text-gray-700 line-clamp-2">{team.project_description}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(team)}
                      className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(team.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Team Dialog */}
      <Dialog open={!!editingTeam} onOpenChange={() => setEditingTeam(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Team</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Team Name</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter team name"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter team description"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTeam(null)} className="border-gray-200 text-gray-600 hover:bg-gray-50">
              Cancel
            </Button>
            <Button onClick={() => {
              // TODO: Implement update functionality with Firebase
              console.log('Update team:', editingTeam?.id, form);
              setEditingTeam(null);
              setForm({ name: '', description: '' });
            }} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
