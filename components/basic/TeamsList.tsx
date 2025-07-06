'use client';

import { useTeams } from '@/hooks/useTeams';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users, Calendar, Folder } from 'lucide-react';

export default function TeamsList() {
  const { teams, loading, error, refetch } = useTeams();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading teams...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (teams.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center">
            <Folder className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Teams Found</h3>
            <p className="text-gray-600 mb-4">No teams have been created yet.</p>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Teams ({teams.length})</h2>
        <Button onClick={refetch} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 